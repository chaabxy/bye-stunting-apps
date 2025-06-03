/**
 * Modul integrasi machine learning untuk prediksi stunting
 * Menggunakan server Hapi.js sebagai middleware ke model ML eksternal
 */

import axios from "axios"

// URL server Hapi.js lokal
const HAPI_SERVER_URL = "http://localhost:3001"

// Tipe data untuk input prediksi
export interface PredictionInput {
  nama: string
  usia: number // dalam bulan
  jenisKelamin: string
  beratBadan: number // dalam kg
  tinggiBadan: number // dalam cm
}

// Tipe data untuk hasil prediksi
export interface PredictionResult {
  status: "normal" | "berisiko" | "stunting"
  message: string
  recommendations: string[]
  score: number
  recommendedArticles: {
    id: number
    title: string
    category: string
  }[]
  fallback?: boolean // Menandakan apakah menggunakan fallback
  mlModelResponse?: any // Data mentah dari model ML
}

/**
 * Fungsi untuk melakukan prediksi stunting
 * Data akan dikirim ke server Hapi.js yang kemudian meneruskan ke model ML eksternal
 */
export async function predictStunting(input: PredictionInput): Promise<PredictionResult> {
  try {
    console.log("📤 Sending prediction request to Hapi.js server:", input)

    // Cek apakah server Hapi.js berjalan dengan timeout yang lebih pendek
    try {
      await axios.get(`${HAPI_SERVER_URL}/health`, {
        timeout: 3000,
        validateStatus: (status) => status < 500, // Accept any status < 500
      })
      console.log("✅ Hapi.js server is running")
    } catch (healthError) {
      console.warn("⚠️ Hapi.js server health check failed:", healthError.message)
      console.warn("🔄 Using fallback prediction")
      return getLocalFallbackPrediction(input)
    }

    // Kirim permintaan ke server Hapi.js
    const response = await axios.post(
      `${HAPI_SERVER_URL}/api/ml/predict`,
      {
        usia: input.usia,
        jenisKelamin: input.jenisKelamin,
        beratBadan: input.beratBadan,
        tinggiBadan: input.tinggiBadan,
      },
      {
        timeout: 25000, // 25 detik timeout
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500, // Accept any status < 500
      },
    )

    console.log("📨 Received prediction response:", response.data)

    // Jika response mengandung fallback, tambahkan flag
    if (response.data.fallback) {
      response.data.message += " (Server menggunakan analisis fallback)"
    }

    return response.data
  } catch (error) {
    console.error("❌ Error in predictStunting:", error.message)

    // Jika server Hapi.js tidak tersedia, gunakan fallback lokal
    return getLocalFallbackPrediction(input)
  }
}

/**
 * Fungsi untuk mendapatkan rekomendasi artikel
 */
export async function getRecommendedArticles(
  status: "normal" | "berisiko" | "stunting",
  usia: number,
  jenisKelamin: string,
): Promise<any[]> {
  try {
    console.log("📤 Requesting article recommendations...")

    // Cek apakah server Hapi.js berjalan
    try {
      await axios.get(`${HAPI_SERVER_URL}/health`, {
        timeout: 2000,
        validateStatus: (status) => status < 500,
      })
    } catch (healthError) {
      console.warn("⚠️ Hapi.js server not available for recommendations, using fallback")
      return getLocalFallbackRecommendations(status)
    }

    const response = await axios.post(
      `${HAPI_SERVER_URL}/api/ml/recommend`,
      {
        status,
        usia,
        jenisKelamin,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status < 500,
      },
    )

    console.log("📨 Received recommendations:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error getting recommendations:", error.message)

    // Fallback ke rekomendasi lokal
    return getLocalFallbackRecommendations(status)
  }
}

/**
 * Fallback prediction lokal jika server tidak tersedia
 */
function getLocalFallbackPrediction(input: PredictionInput): PredictionResult {
  console.log("🔄 Using local fallback prediction")

  const { usia, beratBadan, tinggiBadan, jenisKelamin } = input

  // Analisis sederhana berdasarkan WHO growth standards
  let status: "normal" | "berisiko" | "stunting" = "normal"
  let score = 15

  // Estimasi tinggi normal berdasarkan usia (sangat sederhana)
  const expectedHeight = jenisKelamin === "laki-laki" ? 50 + usia * 1.5 : 49 + usia * 1.4
  const heightRatio = tinggiBadan / expectedHeight

  if (heightRatio < 0.85) {
    status = "stunting"
    score = 85
  } else if (heightRatio < 0.95) {
    status = "berisiko"
    score = 65
  }

  return {
    status,
    message: `${getLocalMessage(status)} (Server Hapi.js tidak tersedia - menggunakan analisis lokal)`,
    score,
    recommendations: getLocalRecommendations(status),
    recommendedArticles: getLocalFallbackRecommendations(status),
    fallback: true,
  }
}

/**
 * Helper functions untuk fallback lokal
 */
function getLocalMessage(status: "normal" | "berisiko" | "stunting"): string {
  const messages = {
    stunting: "Anak terdeteksi mengalami stunting. Segera konsultasikan dengan dokter anak.",
    berisiko: "Anak berisiko mengalami stunting. Perhatikan asupan gizi dan pantau pertumbuhan.",
    normal: "Pertumbuhan anak normal. Tetap jaga pola makan sehat dan lakukan pemeriksaan rutin.",
  }
  return messages[status]
}

function getLocalRecommendations(status: "normal" | "berisiko" | "stunting"): string[] {
  const recommendations = {
    stunting: [
      "Konsultasikan dengan dokter anak atau ahli gizi segera",
      "Berikan makanan tinggi protein dan kalsium",
      "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
    ],
    berisiko: [
      "Tingkatkan asupan gizi seimbang",
      "Berikan makanan kaya protein dan kalsium",
      "Pantau pertumbuhan secara berkala",
    ],
    normal: [
      "Pertahankan pola makan sehat dan seimbang",
      "Lakukan pemeriksaan rutin setiap bulan",
      "Berikan stimulasi yang cukup untuk perkembangan anak",
    ],
  }
  return recommendations[status]
}

function getLocalFallbackRecommendations(status: "normal" | "berisiko" | "stunting"): any[] {
  const articles = {
    stunting: [
      { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
    ],
    berisiko: [
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
      { id: 8, title: "Mengatasi Anak Susah Makan", category: "Tips Praktis" },
    ],
    normal: [
      { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
      { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
    ],
  }
  return articles[status] || articles.normal
}
