const axios = require("axios")

// URL model ML eksternal
const ML_MODEL_URL = "https://model-byestunting.vercel.app"

// Daftar kemungkinan endpoint
const possibleEndpoints = [
  "/",
  "/api",
  "/predict",
  "/api/predict",
  "/v1/predict",
  "/model/predict",
  "/stunting/predict",
  "/ml/predict",
]

// Contoh data untuk testing
const testData = {
  umur: 24,
  jenis_kelamin: "Laki-laki",
  berat_badan: 10,
  tinggi_badan: 80,
}

async function detectEndpoints() {
  console.log("🔍 Detecting available endpoints for ML model...")
  console.log("🔗 Base URL:", ML_MODEL_URL)
  console.log("📊 Test data:", testData)
  console.log("\n")

  // Cek GET endpoints
  console.log("Checking GET endpoints:")
  for (const endpoint of possibleEndpoints) {
    const url = `${ML_MODEL_URL}${endpoint}`
    try {
      const response = await axios.get(url, { timeout: 5000 })
      console.log(`✅ ${url} - Status: ${response.status}`)
      console.log(`   Response:`, response.data)
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`)
    }
  }

  console.log("\n")

  // Cek POST endpoints
  console.log("Checking POST endpoints for prediction:")
  for (const endpoint of possibleEndpoints) {
    const url = `${ML_MODEL_URL}${endpoint}`
    try {
      const response = await axios.post(url, testData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      })
      console.log(`✅ ${url} - Status: ${response.status}`)
      console.log(`   Response:`, response.data)
    } catch (error) {
      console.log(`❌ ${url} - Error: ${error.message}`)
    }
  }

  console.log("\n")
  console.log("🔍 Detection completed")
}

detectEndpoints().catch((err) => {
  console.error("❌ Error during endpoint detection:", err)
})
