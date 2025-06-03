import { NextResponse } from "next/server"
import axios from "axios"

// Tipe data untuk input prediksi
interface PredictionInput {
  usia: number
  jenisKelamin: string
  beratBadan: number
  tinggiBadan: number
}

// URL model machine learning
const ML_MODEL_URL = "https://model-byestunting.vercel.app/api/predict"

// POST /api/ml/predict - Endpoint untuk prediksi stunting
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi input
    if (!body.usia || !body.jenisKelamin || !body.beratBadan || !body.tinggiBadan) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Konversi input ke tipe numerik
    const input: PredictionInput = {
      usia: Number(body.usia),
      jenisKelamin: body.jenisKelamin,
      beratBadan: Number(body.beratBadan),
      tinggiBadan: Number(body.tinggiBadan),
    }

    // Konversi jenis kelamin ke format yang diharapkan model
    const genderMapping: Record<string, string> = {
      "laki-laki": "L",
      perempuan: "P",
    }

    // Kirim permintaan ke model ML
    const response = await axios.post(ML_MODEL_URL, {
      umur: input.usia,
      jenis_kelamin: genderMapping[input.jenisKelamin] || input.jenisKelamin,
      berat_badan: input.beratBadan,
      tinggi_badan: input.tinggiBadan,
    })

    // Transformasi respons dari model ke format yang diharapkan frontend
    const modelResponse = response.data

    // Mapping status dari model ke format yang diharapkan frontend
    const statusMapping: Record<string, "normal" | "berisiko" | "stunting"> = {
      normal: "normal",
      pendek: "berisiko",
      sangat_pendek: "stunting",
    }

    // Buat rekomendasi berdasarkan status
    const recommendations = getRecommendations(modelResponse.status)

    // Buat artikel rekomendasi berdasarkan status
    const recommendedArticles = getRecommendedArticles(modelResponse.status)

    // Hitung skor risiko berdasarkan status
    const score = getScoreByStatus(modelResponse.status)

    // Format respons untuk frontend
    const result = {
      status: statusMapping[modelResponse.status] || "berisiko",
      message: modelResponse.message || getMessage(modelResponse.status),
      recommendations,
      score,
      recommendedArticles,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error predicting stunting:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}

// Helper function untuk mendapatkan rekomendasi berdasarkan status
function getRecommendations(status: string): string[] {
  switch (status) {
    case "sangat_pendek":
      return [
        "Konsultasikan dengan dokter anak atau ahli gizi segera",
        "Berikan makanan tinggi protein dan kalsium",
        "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
        "Lakukan pemeriksaan kesehatan secara rutin",
        "Ikuti program intervensi gizi dari puskesmas setempat",
      ]
    case "pendek":
      return [
        "Tingkatkan asupan gizi seimbang",
        "Berikan makanan kaya protein dan kalsium",
        "Pantau pertumbuhan secara berkala",
        "Konsultasikan dengan ahli gizi untuk penyusunan menu seimbang",
      ]
    case "normal":
    default:
      return [
        "Pertahankan pola makan sehat dan seimbang",
        "Lakukan pemeriksaan rutin setiap bulan",
        "Berikan stimulasi yang cukup untuk perkembangan anak",
        "Pastikan anak mendapatkan imunisasi lengkap",
      ]
  }
}

// Helper function untuk mendapatkan artikel rekomendasi berdasarkan status
function getRecommendedArticles(status: string): any[] {
  switch (status) {
    case "sangat_pendek":
      return [
        { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
      ]
    case "pendek":
      return [
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
        { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
      ]
    case "normal":
    default:
      return [{ id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" }]
  }
}

// Helper function untuk mendapatkan skor risiko berdasarkan status
function getScoreByStatus(status: string): number {
  switch (status) {
    case "sangat_pendek":
      return 85
    case "pendek":
      return 65
    case "normal":
    default:
      return 15
  }
}

// Helper function untuk mendapatkan pesan berdasarkan status
function getMessage(status: string): string {
  switch (status) {
    case "sangat_pendek":
      return "Anak Anda terdeteksi mengalami stunting berat."
    case "pendek":
      return "Anak Anda berisiko mengalami stunting."
    case "normal":
    default:
      return "Pertumbuhan anak Anda normal."
  }
}
