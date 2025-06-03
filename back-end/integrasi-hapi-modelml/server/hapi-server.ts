const Hapi = require("@hapi/hapi")
const axios = require("axios")

// Konfigurasi
const ML_MODEL_URL = process.env.ML_MODEL_URL || "https://model-byestunting.vercel.app"
const PORT = process.env.HAPI_PORT || 3001

console.log("🚀 Starting Hapi.js server...")
console.log("🔗 ML Model URL:", ML_MODEL_URL)
console.log("🔌 Server Port:", PORT)

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type", "Authorization"],
        additionalHeaders: ["X-Requested-With"],
      },
    },
  })

  // Endpoint untuk prediksi stunting
  server.route({
    method: "POST",
    path: "/api/ml/predict",
    options: {
      cors: true,
    },
    handler: async (request, h) => {
      try {
        const payload = request.payload
        console.log("📥 Received prediction request:", payload)

        // Validasi input wajib
        const requiredFields = ["usia", "jenisKelamin", "beratBadan", "tinggiBadan"]
        const missingFields = requiredFields.filter((field) => !payload[field])

        if (missingFields.length > 0) {
          console.log("❌ Missing required fields:", missingFields)
          return h
            .response({
              error: "Data tidak lengkap",
              missingFields,
            })
            .code(400)
        }

        // Konversi dan validasi data untuk model ML
        const modelData = {
          umur: Number.parseInt(payload.usia), // Usia dalam bulan
          jenis_kelamin: mapGender(payload.jenisKelamin),
          berat_badan: Number.parseFloat(payload.beratBadan), // Berat dalam kg
          tinggi_badan: Number.parseFloat(payload.tinggiBadan), // Tinggi dalam cm
        }

        // Validasi rentang data
        if (modelData.umur < 0 || modelData.umur > 60) {
          return h.response({ error: "Usia harus antara 0-60 bulan" }).code(400)
        }

        if (modelData.berat_badan < 1 || modelData.berat_badan > 50) {
          return h.response({ error: "Berat badan harus antara 1-50 kg" }).code(400)
        }

        if (modelData.tinggi_badan < 30 || modelData.tinggi_badan > 150) {
          return h.response({ error: "Tinggi badan harus antara 30-150 cm" }).code(400)
        }

        console.log("📤 Sending to ML model:", modelData)

        try {
          // Kirim permintaan ke model ML eksternal
          const mlResponse = await axios.post(`${ML_MODEL_URL}/predict`, modelData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 15000, // 15 detik timeout
          })

          console.log("📨 ML model response:", mlResponse.data)

          // Transformasi respons dari model ke format frontend
          const transformedResult = transformMLResponse(mlResponse.data, modelData)
          console.log("✅ Transformed result:", transformedResult)

          return transformedResult
        } catch (mlError) {
          console.error("❌ ML Model Error:", mlError.message)

          // Jika model ML error, gunakan fallback
          const fallbackResult = generateFallbackPrediction(payload)
          console.log("🔄 Using fallback prediction:", fallbackResult)

          return fallbackResult
        }
      } catch (error) {
        console.error("❌ Server Error:", error.message)

        // Fallback prediction
        const fallbackResult = generateFallbackPrediction(request.payload)
        console.log("🔄 Using fallback prediction due to server error:", fallbackResult)

        return fallbackResult
      }
    },
  })

  // Endpoint untuk rekomendasi artikel
  server.route({
    method: "POST",
    path: "/api/ml/recommend",
    options: {
      cors: true,
    },
    handler: async (request, h) => {
      try {
        const { status, usia, jenisKelamin } = request.payload
        console.log("📥 Received recommendation request:", { status, usia, jenisKelamin })

        const recommendations = getRecommendedArticles(status, usia, jenisKelamin)
        console.log("📋 Generated recommendations:", recommendations.length, "articles")

        return recommendations
      } catch (error) {
        console.error("❌ Error getting recommendations:", error)
        return h.response({ error: "Terjadi kesalahan saat memproses rekomendasi" }).code(500)
      }
    },
  })

  // Health check endpoint
  server.route({
    method: "GET",
    path: "/health",
    handler: async (request, h) => {
      try {
        // Test koneksi ke model ML
        const testResponse = await axios.get(`${ML_MODEL_URL}`, { timeout: 5000 })
        return {
          status: "healthy",
          timestamp: new Date().toISOString(),
          server: {
            port: PORT,
            status: "running",
          },
          mlModel: {
            url: ML_MODEL_URL,
            status: "connected",
            response: testResponse.status,
          },
        }
      } catch (error) {
        return {
          status: "degraded",
          timestamp: new Date().toISOString(),
          server: {
            port: PORT,
            status: "running",
          },
          mlModel: {
            url: ML_MODEL_URL,
            status: "disconnected",
            error: error.message,
          },
        }
      }
    },
  })

  await server.start()
  console.log("✅ Hapi.js server running on %s", server.info.uri)
  console.log("🤖 ML Model URL: %s", ML_MODEL_URL)
  console.log("🔍 Health check: %s/health", server.info.uri)
}

// Helper Functions

/**
 * Mapping jenis kelamin ke format yang diharapkan model ML
 */
function mapGender(jenisKelamin) {
  const genderMap = {
    "laki-laki": "Laki-laki",
    perempuan: "Perempuan",
    "Laki-laki": "Laki-laki",
    Perempuan: "Perempuan",
    L: "Laki-laki",
    P: "Perempuan",
  }

  return genderMap[jenisKelamin] || jenisKelamin
}

/**
 * Transformasi respons dari model ML ke format yang diharapkan frontend
 */
function transformMLResponse(mlResponse, inputData) {
  let status = "normal"
  let score = 15
  let message = "Pertumbuhan anak normal"

  // Analisis respons dari model ML
  if (mlResponse.prediction) {
    const prediction = mlResponse.prediction.toLowerCase()

    if (prediction.includes("stunting") || prediction.includes("sangat pendek")) {
      status = "stunting"
      score = 85
      message = "Anak terdeteksi mengalami stunting"
    } else if (prediction.includes("pendek") || prediction.includes("berisiko")) {
      status = "berisiko"
      score = 65
      message = "Anak berisiko mengalami stunting"
    } else {
      status = "normal"
      score = 15
      message = "Pertumbuhan anak normal"
    }
  }

  // Jika ada confidence score dari model
  if (mlResponse.confidence) {
    score = Math.round(mlResponse.confidence * 100)
  }

  // Jika ada message dari model
  if (mlResponse.message) {
    message = mlResponse.message
  }

  return {
    status,
    message,
    score,
    recommendations: getRecommendations(status),
    recommendedArticles: getRecommendedArticles(status, inputData.umur, inputData.jenis_kelamin),
    mlModelResponse: mlResponse, // Untuk debugging
  }
}

/**
 * Generate fallback prediction jika model ML tidak tersedia
 */
function generateFallbackPrediction(inputData) {
  const { usia, beratBadan, tinggiBadan, jenisKelamin } = inputData

  // Analisis sederhana berdasarkan WHO growth standards
  let status = "normal"
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
    message: `${getMessage(status)} (Menggunakan analisis fallback)`,
    score,
    recommendations: getRecommendations(status),
    recommendedArticles: getRecommendedArticles(status, usia, jenisKelamin),
    fallback: true,
  }
}

/**
 * Mendapatkan rekomendasi berdasarkan status
 */
function getRecommendations(status) {
  const recommendations = {
    stunting: [
      "Konsultasikan dengan dokter anak atau ahli gizi segera",
      "Berikan makanan tinggi protein dan kalsium",
      "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
      "Lakukan pemeriksaan kesehatan secara rutin",
      "Ikuti program intervensi gizi dari puskesmas setempat",
    ],
    berisiko: [
      "Tingkatkan asupan gizi seimbang",
      "Berikan makanan kaya protein dan kalsium",
      "Pantau pertumbuhan secara berkala",
      "Konsultasikan dengan ahli gizi untuk penyusunan menu seimbang",
      "Pastikan anak mendapatkan ASI eksklusif (jika masih menyusui)",
    ],
    normal: [
      "Pertahankan pola makan sehat dan seimbang",
      "Lakukan pemeriksaan rutin setiap bulan",
      "Berikan stimulasi yang cukup untuk perkembangan anak",
      "Pastikan anak mendapatkan imunisasi lengkap",
      "Jaga kebersihan lingkungan dan makanan",
    ],
  }

  return recommendations[status] || recommendations.normal
}

/**
 * Mendapatkan artikel rekomendasi berdasarkan status, usia, dan jenis kelamin
 */
function getRecommendedArticles(status, usia = 0, jenisKelamin = "") {
  const baseArticles = {
    stunting: [
      { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
      { id: 9, title: "Peran ASI dalam Mencegah Stunting", category: "Nutrisi" },
      { id: 10, title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?", category: "Nutrisi" },
    ],
    berisiko: [
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
      { id: 8, title: "Mengatasi Anak Susah Makan", category: "Tips Praktis" },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
      { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
    ],
    normal: [
      { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
      { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
    ],
  }

  const articles = baseArticles[status] || baseArticles.normal

  // Tambahkan artikel spesifik berdasarkan usia
  if (usia < 6) {
    articles.unshift({ id: 11, title: "Nutrisi untuk Bayi 0-6 Bulan", category: "Nutrisi" })
  } else if (usia < 24) {
    articles.unshift({ id: 12, title: "MPASI untuk Bayi 6-24 Bulan", category: "Nutrisi" })
  }

  return articles.slice(0, 5) // Batasi maksimal 5 artikel
}

/**
 * Mendapatkan pesan berdasarkan status
 */
function getMessage(status) {
  const messages = {
    stunting: "Anak terdeteksi mengalami stunting. Segera konsultasikan dengan dokter anak.",
    berisiko: "Anak berisiko mengalami stunting. Perhatikan asupan gizi dan pantau pertumbuhan.",
    normal: "Pertumbuhan anak normal. Tetap jaga pola makan sehat dan lakukan pemeriksaan rutin.",
  }

  return messages[status] || messages.normal
}

// Error handling
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err)
  process.exit(1)
})

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err)
  process.exit(1)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...")
  process.exit(0)
})

init().catch((err) => {
  console.error("❌ Failed to start server:", err)
  process.exit(1)
})

// File TypeScript untuk development - tidak digunakan dalam production
// Gunakan server/start-hapi.js untuk menjalankan server

export {}
