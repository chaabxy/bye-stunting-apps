/**
 * Backend Server untuk Prediksi Stunting
 * Menggunakan Hapi.js dan TensorFlow.js
 */

const Hapi = require("@hapi/hapi")
const { predictStunting } = require("./services/ml-service")

const init = async () => {
  const server = Hapi.server({
    port: 3001,
    host: "0.0.0.0", // Listen on all interfaces
    routes: {
      cors: {
        origin: ["*"], // Use wildcard only
        headers: ["Accept", "Authorization", "Content-Type", "If-None-Match", "Origin", "X-Requested-With"],
        additionalHeaders: [
          "cache-control",
          "x-requested-with",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
          "Access-Control-Allow-Headers",
        ],
        credentials: false,
      },
    },
  })

  // Add CORS headers manually for all responses
  server.ext("onPreResponse", (request, h) => {
    const response = request.response

    if (response.isBoom) {
      response.output.headers["Access-Control-Allow-Origin"] = "*"
      response.output.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
      response.output.headers["Access-Control-Allow-Headers"] =
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      response.output.headers["Access-Control-Allow-Credentials"] = "false"
    } else {
      response.header("Access-Control-Allow-Origin", "*")
      response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
      response.header("Access-Control-Allow-Credentials", "false")
    }

    return h.continue
  })

  // Handle preflight OPTIONS requests
  server.route({
    method: "OPTIONS",
    path: "/{any*}",
    handler: (request, h) => {
      return h
        .response()
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
        .header("Access-Control-Allow-Credentials", "false")
        .code(200)
    },
  })

  // Health check endpoint
  server.route({
    method: "GET",
    path: "/health",
    handler: (request, h) => {
      return {
        status: "OK",
        message: "Backend server is running",
        timestamp: new Date().toISOString(),
        host: request.info.host,
        remoteAddress: request.info.remoteAddress,
      }
    },
  })

  // Prediction endpoint
  server.route({
    method: "POST",
    path: "/api/predict",
    handler: async (request, h) => {
      try {
        const input = request.payload
        console.log("📥 Received prediction request from:", request.info.remoteAddress)
        console.log("📥 Request data:", input)

        // Validasi input payload
        if (
          !input ||
          !input.nama ||
          input.usia === undefined ||
          !input.jenisKelamin ||
          !input.beratBadan ||
          !input.tinggiBadan
        ) {
          console.error("❌ Invalid input payload")
          return h
            .response({
              isError: true,
              message: "Data input tidak lengkap. Pastikan semua field telah diisi.",
            })
            .code(400)
        }

        // Lakukan prediksi
        const result = await predictStunting(input)

        // Check if result is error
        if (result.isError) {
          console.error("❌ Prediction failed:", result.message)
          return h.response(result).code(500)
        }

        console.log("✅ Prediction successful:", {
          status: result.status,
          score: result.score,
        })

        return h.response(result).code(200)
      } catch (error) {
        console.error("❌ Prediction error:", error)

        // Return error sesuai ketentuan - TIDAK ADA FALLBACK
        return h
          .response({
            isError: true,
            message:
              "Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya.",
          })
          .code(500)
      }
    },
  })

  // Recommendation endpoint
  server.route({
    method: "POST",
    path: "/api/recommend",
    handler: async (request, h) => {
      try {
        const { status, usia, jenisKelamin } = request.payload

        // Simple recommendation logic
        const recommendations = []

        if (status === "normal") {
          recommendations.push(
            { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
            { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
          )
        } else if (status === "stunting") {
          recommendations.push(
            { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
            { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
            { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
          )
        }

        return h.response(recommendations).code(200)
      } catch (error) {
        console.error("❌ Recommendation error:", error)
        return h.response([]).code(200) // Return empty array on error
      }
    },
  })

  await server.start()
  console.log("🚀 Server running on %s", server.info.uri)
  console.log("📊 ML Prediction API ready")
  console.log("🔗 CORS enabled for all origins")
  console.log("🌐 Server accessible from:")
  console.log("   - http://localhost:3001")
  console.log("   - http://127.0.0.1:3001")
  console.log("   - http://192.168.56.1:3001")
}

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled rejection:", err)
  process.exit(1)
})

init()
