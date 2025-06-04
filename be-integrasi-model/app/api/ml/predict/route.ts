import { NextResponse } from "next/server"
import { predictWithModel, convertModelOutputToResult, validateInput, type ModelInput } from "@/lib/tensorflow-model"

// Tipe data untuk input prediksi
interface PredictionInput {
  usia: number
  jenisKelamin: string
  beratBadan: number
  tinggiBadan: number
  nama?: string // Tambahkan properti nama (opsional)
}

// Tipe data untuk hasil prediksi
interface PredictionResult {
  status: "normal" | "stunting" | "stunting berat"
  message: string
  recommendations: string[]
  score: number
  recommendedArticles: {
    id: number
    title: string
    category: string
  }[]
}

// Fungsi fallback jika model ML gagal
function fallbackPrediction(input: PredictionInput): PredictionResult {
  const { usia, beratBadan, tinggiBadan } = input

  console.log("Menggunakan fallback prediction karena model ML tidak tersedia")

  // Logika sederhana berdasarkan Z-score WHO
  let expectedHeight = 0
  let expectedWeight = 0

  if (input.jenisKelamin === "laki-laki") {
    expectedHeight = 45 + usia * 0.5 // Rumus sederhana untuk laki-laki
    expectedWeight = 3 + usia * 0.2
  } else {
    expectedHeight = 44 + usia * 0.5 // Rumus sederhana untuk perempuan
    expectedWeight = 3 + usia * 0.19
  }

  const heightDeficit = ((expectedHeight - tinggiBadan) / expectedHeight) * 100
  const weightDeficit = ((expectedWeight - beratBadan) / expectedWeight) * 100

  if (heightDeficit > 20 || weightDeficit > 25) {
    return {
      status: "stunting berat",
      message: `Berdasarkan hasil analisis, anak yang bernama ${input.nama} berada dalam kondisi stunting berat. Kami sarankan untuk segera berkonsultasi dengan tenaga kesehatan.\n\nKeterangan: Menggunakan analisis cadangan karena model ML sedang tidak tersedia.`,
      score: 80,
      recommendations: [
        "Segera konsultasikan dengan dokter anak atau ahli gizi untuk mendapatkan penanganan yang tepat.",
        "Lakukan evaluasi medis menyeluruh untuk menentukan rencana intervensi yang sesuai.",
        "Pantau perkembangan dan kualitas asupan nutrisi secara berkala bersama tenaga profesional.",
      ],
      recommendedArticles: [
        { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
      ],
    }
  } else if (heightDeficit > 10 || weightDeficit > 15) {
    return {
      status: "stunting",
      message: `Berdasarkan hasil analisis, anak yang bernama ${input.nama} berada dalam kondisi stunting. Diperlukan perhatian khusus untuk perbaikan gizi.\n\nKeterangan: Menggunakan analisis cadangan karena model ML sedang tidak tersedia.`,
      score: 60,
      recommendations: [
        "Konsultasikan dengan tenaga medis atau ahli gizi untuk mendapatkan saran yang tepat.",
        "Perbaiki asupan gizi dengan menambahkan makanan bergizi tinggi protein dan vitamin.",
        "Lakukan pemeriksaan pertumbuhan secara berkala untuk memantau perkembangan.",
      ],
      recommendedArticles: [
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
        { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
      ],
    }
  } else {
    return {
      status: "normal",
      message: `Berdasarkan hasil analisis, anak yang bernama ${input.nama} berada dalam kondisi normal.\n\nKeterangan: Menggunakan analisis cadangan karena model ML sedang tidak tersedia.`,
      score: 15,
      recommendations: [
        "Pertahankan pola makan sehat dan seimbang untuk mendukung pertumbuhan optimal.",
        "Lakukan pemeriksaan kesehatan rutin agar kondisi anak selalu terpantau.",
        "Berikan stimulasi yang cukup untuk perkembangan anak.",
      ],
      recommendedArticles: [{ id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" }],
    }
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
      nama: body.nama, // Ambil nama dari body (jika ada)
    }

    console.log("=== PREDIKSI STUNTING DIMULAI ===")
    console.log("Input data:", input)

    // Validasi input terlebih dahulu
    const modelInput: ModelInput = {
      usia: input.usia,
      jenisKelamin: input.jenisKelamin,
      beratBadan: input.beratBadan,
      tinggiBadan: input.tinggiBadan,
    }

    const validation = validateInput(modelInput)
    if (!validation.isValid) {
      console.log("Input validation failed:", validation.errors)
      return NextResponse.json(
        {
          error: "Data input tidak valid",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    try {
      // Coba gunakan model TensorFlow.js dengan penanganan error yang lebih baik
      console.log("Menggunakan model TensorFlow.js...")

      // Tambahkan timeout untuk mencegah hanging jika model loading terlalu lama
      const modelPromise = predictWithModel(modelInput)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Model loading timeout")), 15000),
      )

      // Race antara model loading dan timeout
      const modelOutput = (await Promise.race([modelPromise, timeoutPromise])) as any

      console.log("Model output:", modelOutput)

      const result = convertModelOutputToResult(modelOutput, modelInput)
      console.log("Final result:", result)

      console.log("=== PREDIKSI BERHASIL MENGGUNAKAN MODEL ML ===")

      return NextResponse.json({
        ...result,
        modelUsed: "tensorflow",
        timestamp: new Date().toISOString(),
      })
    } catch (modelError) {
      console.error("Error with TensorFlow.js model:", modelError)
      console.log("Switching to fallback prediction...")

      // Tambahkan informasi diagnostik tentang error
      let errorInfo = "Unknown error"
      if (modelError instanceof Error) {
        errorInfo = `${modelError.name}: ${modelError.message}`
        if (modelError.stack) {
          console.error("Error stack:", modelError.stack)
        }
      }

      // Gunakan fallback prediction jika model gagal
      const fallbackResult = fallbackPrediction(input)

      console.log("=== PREDIKSI MENGGUNAKAN FALLBACK ===")

      return NextResponse.json({
        ...fallbackResult,
        message:
          fallbackResult.message +
          `\n\n⚠️ Catatan: Menggunakan analisis cadangan karena model ML tidak tersedia. Error: ${errorInfo}. Untuk hasil yang lebih akurat, silakan coba lagi nanti.`,
        modelUsed: "fallback",
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error predicting stunting:", error)

    // Tambahkan informasi diagnostik lebih detail
    let errorDetails = "Unknown error"
    if (error instanceof Error) {
      errorDetails = `${error.name}: ${error.message}`
      if (error.stack) {
        console.error("Error stack:", error.stack)
      }
    }

    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat memproses permintaan",
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}
