import { NextResponse } from "next/server"

// Tipe data untuk input prediksi
interface PredictionInput {
  usia: number
  jenisKelamin: string
  beratBadan: number
  tinggiBadan: number
}

// Tipe data untuk hasil prediksi
interface PredictionResult {
  status: "normal" | "berisiko" | "stunting"
  message: string
  recommendations: string[]
  score: number
  recommendedArticles: {
    id: number
    title: string
    category: string
  }[]
}

// Fungsi untuk melakukan prediksi stunting (simulasi model ML)
function predictStunting(input: PredictionInput): PredictionResult {
  const { usia, beratBadan, tinggiBadan, jenisKelamin } = input

  // Hitung Z-score berdasarkan standar WHO (simulasi sederhana)
  // Dalam implementasi nyata, ini akan menggunakan model ML yang lebih kompleks

  // Hitung Height-for-Age Z-score (HAZ) - simulasi sederhana
  let expectedHeight = 0
  let heightSD = 0

  if (jenisKelamin === "laki-laki") {
    // Rumus sederhana untuk laki-laki (simulasi)
    expectedHeight = 45 + usia * 0.5
    heightSD = 2.5
  } else {
    // Rumus sederhana untuk perempuan (simulasi)
    expectedHeight = 44 + usia * 0.5
    heightSD = 2.3
  }

  const HAZ = (tinggiBadan - expectedHeight) / heightSD

  // Tentukan status berdasarkan HAZ
  let status: "normal" | "berisiko" | "stunting"
  let message = ""
  let recommendations: string[] = []
  let score = 0
  let recommendedArticles = []

  if (HAZ < -3) {
    status = "stunting"
    score = 85
    message = "Anak Anda terdeteksi mengalami stunting berat."
    recommendations = [
      "Konsultasikan dengan dokter anak atau ahli gizi segera",
      "Berikan makanan tinggi protein dan kalsium",
      "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
      "Lakukan pemeriksaan kesehatan secara rutin",
      "Ikuti program intervensi gizi dari puskesmas setempat",
    ]
    recommendedArticles = [
      { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
    ]
  } else if (HAZ < -2) {
    status = "stunting"
    score = 70
    message = "Anak Anda terdeteksi mengalami stunting."
    recommendations = [
      "Konsultasikan dengan dokter anak atau ahli gizi",
      "Berikan makanan tinggi protein dan kalsium",
      "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
      "Lakukan pemeriksaan kesehatan secara rutin",
    ]
    recommendedArticles = [
      { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
    ]
  } else if (HAZ < -1) {
    status = "berisiko"
    score = 50
    message = "Anak Anda berisiko mengalami stunting."
    recommendations = [
      "Tingkatkan asupan gizi seimbang",
      "Berikan makanan kaya protein dan kalsium",
      "Pantau pertumbuhan secara berkala",
      "Konsultasikan dengan ahli gizi untuk penyusunan menu seimbang",
    ]
    recommendedArticles = [
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
    ]
  } else {
    status = "normal"
    score = 15
    message = "Pertumbuhan anak Anda normal."
    recommendations = [
      "Pertahankan pola makan sehat dan seimbang",
      "Lakukan pemeriksaan rutin setiap bulan",
      "Berikan stimulasi yang cukup untuk perkembangan anak",
      "Pastikan anak mendapatkan imunisasi lengkap",
    ]
    recommendedArticles = [{ id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" }]
  }

  return {
    status,
    message,
    recommendations,
    score,
    recommendedArticles,
  }
}

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

    // Lakukan prediksi
    const result = predictStunting(input)

    // Catat hasil prediksi (dalam implementasi nyata, ini akan disimpan ke database)
    console.log("Prediction result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error predicting stunting:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
