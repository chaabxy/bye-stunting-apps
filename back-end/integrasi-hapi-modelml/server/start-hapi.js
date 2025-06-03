const Hapi = require("@hapi/hapi")
const axios = require("axios")

// Konfigurasi
const ML_MODEL_URL = "https://model-byestunting.vercel.app"
const PORT = process.env.HAPI_PORT || 3001

console.log("🚀 Starting Hapi.js server...")
console.log("🔗 ML Model URL:", ML_MODEL_URL)
console.log("🔌 Server Port:", PORT)

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: "0.0.0.0", // Menerima koneksi dari semua IP
    routes: {
      cors: {
        origin: ["*"], // Izinkan semua origin
        headers: ["Accept", "Content-Type", "Authorization", "X-Requested-With"],
        additionalHeaders: ["cache-control", "x-requested-with"],
        credentials: true,
      },
    },
  })

  // Endpoint untuk prediksi stunting
  server.route({
    method: "POST",
    path: "/api/ml/predict",
    options: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type", "Authorization", "X-Requested-With"],
        additionalHeaders: ["cache-control", "x-requested-with"],
        credentials: true,
      },
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
            .header("Access-Control-Allow-Origin", "*")
        }

        // Konversi jenis kelamin ke format numerik (1=laki-laki, 0=perempuan)
        const jenisKelaminNumeric = convertGenderToNumeric(payload.jenisKelamin)

        // PENTING: Format data sesuai dengan yang diharapkan model ML
        // Berdasarkan dokumentasi API: Array [umur_bulan, berat_badan, tinggi_badan, jenis_kelamin(1=laki-laki, 0=perempuan)]
        const modelData = {
          data: [Number(payload.usia), Number(payload.beratBadan), Number(payload.tinggiBadan), jenisKelaminNumeric],
        }

        console.log("📤 Sending to ML model:", modelData)

        try {
          // Kirim permintaan ke model ML eksternal dengan endpoint yang benar
          const mlResponse = await axios.post(`${ML_MODEL_URL}/api/predict`, modelData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            timeout: 15000, // 15 detik timeout
          })

          console.log("📨 ML model response:", mlResponse.data)

          // Transformasi respons dari model ke format frontend
          const transformedResult = transformMLResponse(mlResponse.data, payload)
          console.log("✅ Transformed result:", transformedResult)

          return h.response(transformedResult).header("Access-Control-Allow-Origin", "*")
        } catch (mlError) {
          console.error("❌ ML Model Error:", mlError.message)
          console.error("Error details:", mlError.response?.data || "No response data")

          // Jika model ML error, gunakan fallback
          const fallbackResult = generateFallbackPrediction(payload)
          console.log("🔄 Using fallback prediction:", fallbackResult)

          return h.response(fallbackResult).header("Access-Control-Allow-Origin", "*")
        }
      } catch (error) {
        console.error("❌ Server Error:", error.message)

        // Fallback prediction
        const fallbackResult = generateFallbackPrediction(request.payload)
        console.log("🔄 Using fallback prediction due to server error:", fallbackResult)

        return h.response(fallbackResult).header("Access-Control-Allow-Origin", "*")
      }
    },
  })

  // Endpoint untuk rekomendasi artikel
  server.route({
    method: "POST",
    path: "/api/ml/recommend",
    options: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type", "Authorization", "X-Requested-With"],
        additionalHeaders: ["cache-control", "x-requested-with"],
        credentials: true,
      },
    },
    handler: async (request, h) => {
      try {
        const { status, usia, jenisKelamin } = request.payload
        console.log("📥 Received recommendation request:", { status, usia, jenisKelamin })

        const recommendations = getRecommendedArticles(status, usia, jenisKelamin)
        console.log("📋 Generated recommendations:", recommendations.length, "articles")

        return h.response(recommendations).header("Access-Control-Allow-Origin", "*")
      } catch (error) {
        console.error("❌ Error getting recommendations:", error)
        return h
          .response({ error: "Terjadi kesalahan saat memproses rekomendasi" })
          .code(500)
          .header("Access-Control-Allow-Origin", "*")
      }
    },
  })

  // Health check endpoint
  server.route({
    method: "GET",
    path: "/health",
    options: {
      cors: {
        origin: ["*"],
        headers: ["Accept", "Content-Type", "Authorization", "X-Requested-With"],
        additionalHeaders: ["cache-control", "x-requested-with"],
        credentials: true,
      },
    },
    handler: async (request, h) => {
      try {
        // Test koneksi ke model ML
        const testResponse = await axios.get(`${ML_MODEL_URL}/api`, { timeout: 5000 })

        // Cek apakah respons valid
        const isValid = testResponse.data && testResponse.data.endpoints && testResponse.data.endpoints.predict

        const healthData = {
          status: isValid ? "healthy" : "degraded",
          timestamp: new Date().toISOString(),
          server: {
            port: PORT,
            status: "running",
          },
          mlModel: {
            url: ML_MODEL_URL,
            status: isValid ? "connected" : "invalid-response",
            endpoints: testResponse.data?.endpoints || {},
            version: testResponse.data?.version || "unknown",
          },
        }
        return h.response(healthData).header("Access-Control-Allow-Origin", "*")
      } catch (error) {
        const healthData = {
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
        return h.response(healthData).header("Access-Control-Allow-Origin", "*")
      }
    },
  })

  // OPTIONS handler untuk preflight requests
  server.route({
    method: "OPTIONS",
    path: "/{any*}",
    handler: (request, h) => {
      return h
        .response()
        .code(200)
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    },
  })

  await server.start()
  console.log("✅ Hapi.js server running on %s", server.info.uri)
  console.log("🔗 Connected to ML Model: %s", ML_MODEL_URL)
  console.log("🔍 Health check: %s/health", server.info.uri)
}

// Helper Functions

/**
 * Konversi jenis kelamin ke format numerik yang diharapkan model ML
 * 1 = laki-laki, 0 = perempuan
 */
function convertGenderToNumeric(jenisKelamin) {
  const maleTerms = ["laki-laki", "laki", "l", "male", "m", "1", 1]
  const femaleTerms = ["perempuan", "p", "female", "f", "0", 0]

  const normalizedGender = String(jenisKelamin).toLowerCase().trim()

  if (maleTerms.includes(normalizedGender)) {
    return 1
  } else if (femaleTerms.includes(normalizedGender)) {
    return 0
  }

  // Default jika tidak dikenali
  console.warn("⚠️ Unrecognized gender format:", jenisKelamin, "defaulting to male (1)")
  return 1
}

/**
 * Transformasi respons dari model ML ke format yang diharapkan frontend
 * PERBAIKAN: Menangani semua tipe data dengan benar
 */
function transformMLResponse(mlResponse, inputData) {
  try {
    // Jika model ML mengembalikan error
    if (!mlResponse.success) {
      console.error("❌ ML model returned error:", mlResponse)
      return generateFallbackPrediction(inputData)
    }

    // Ekstrak data dari respons model ML dengan penanganan tipe data yang robust
    const { prediction, confidence, z_score, probabilities, interpretation, recommendation } = mlResponse

    // Konversi confidence ke number jika berupa string
    const confidenceNum = typeof confidence === "string" ? Number.parseFloat(confidence) : confidence

    // Konversi z_score ke number jika berupa string
    const zScoreNum = typeof z_score === "string" ? Number.parseFloat(z_score) : z_score

    // Tentukan status berdasarkan prediksi
    let status = "normal"
    let score = Math.round(confidenceNum * 100)

    const predictionLower = String(prediction).toLowerCase()

    if (predictionLower.includes("severely stunted")) {
      status = "stunting"
      score = Math.max(score, 85) // Minimal 85 untuk severely stunted
    } else if (predictionLower.includes("stunted")) {
      status = "berisiko"
      score = Math.max(score, 65) // Minimal 65 untuk stunted
    } else if (predictionLower.includes("normal")) {
      status = "normal"
      score = Math.min(score, 30) // Maksimal 30 untuk normal
    }

    // Buat pesan berdasarkan interpretasi dari model ML atau status
    let message = interpretation || getMessage(status)

    // Tambahkan Z-Score jika tersedia
    if (!isNaN(zScoreNum)) {
      message += ` (Z-Score: ${zScoreNum.toFixed(2)})`
    }

    // Ekstrak rekomendasi dari model ML atau gunakan default
    let recommendations = []
    if (recommendation && typeof recommendation === "string") {
      // Split rekomendasi berdasarkan titik atau koma
      recommendations = recommendation
        .split(/[.;,]/)
        .map((r) => r.trim())
        .filter((r) => r.length > 0)
        .slice(0, 5) // Maksimal 5 rekomendasi
    }

    // Jika tidak ada rekomendasi dari model, gunakan default
    if (recommendations.length === 0) {
      recommendations = getRecommendations(status)
    }

    const result = {
      status,
      message,
      score,
      recommendations,
      recommendedArticles: getRecommendedArticles(status, inputData.usia, inputData.jenisKelamin),
      mlModelResponse: {
        prediction,
        confidence: confidenceNum,
        z_score: zScoreNum,
        probabilities,
        interpretation,
        recommendation,
        timestamp: mlResponse.timestamp,
      },
    }

    console.log("✅ Successfully transformed ML response")
    return result
  } catch (transformError) {
    console.error("❌ Error transforming ML response:", transformError.message)
    console.error("Original ML response:", mlResponse)

    // Jika ada error dalam transformasi, gunakan fallback
    return generateFallbackPrediction(inputData)
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
