const axios = require("axios")

// Konfigurasi
const HAPI_SERVER_URL = "http://localhost:3001"
const ML_MODEL_URL = "https://model-byestunting.vercel.app"

console.log("🧪 Testing ML Integration...")

async function testHapiServer() {
  try {
    console.log("\n1. Testing Hapi.js server health...")
    const healthResponse = await axios.get(`${HAPI_SERVER_URL}/health`, { timeout: 5000 })
    console.log("✅ Hapi.js server health:", healthResponse.data)
  } catch (error) {
    console.error("❌ Hapi.js server health check failed:", error.message)
    return false
  }
  return true
}

async function testMLModel() {
  try {
    console.log("\n2. Testing direct ML model connection...")
    const testData = {
      umur: 17,
      jenis_kelamin: "Laki-laki",
      berat_badan: 10,
      tinggi_badan: 89,
    }

    const mlResponse = await axios.post(`${ML_MODEL_URL}/predict`, testData, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    })
    console.log("✅ ML model response:", mlResponse.data)
  } catch (error) {
    console.error("❌ ML model test failed:", error.message)
    if (error.response) {
      console.error("Response data:", error.response.data)
    }
    return false
  }
  return true
}

async function testPredictionEndpoint() {
  try {
    console.log("\n3. Testing prediction endpoint...")
    const testData = {
      usia: 17,
      jenisKelamin: "laki-laki",
      beratBadan: 10,
      tinggiBadan: 89,
    }

    const response = await axios.post(`${HAPI_SERVER_URL}/api/ml/predict`, testData, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    })
    console.log("✅ Prediction endpoint response:", response.data)
  } catch (error) {
    console.error("❌ Prediction endpoint test failed:", error.message)
    if (error.response) {
      console.error("Response data:", error.response.data)
    }
    return false
  }
  return true
}

async function runTests() {
  console.log("🚀 Starting integration tests...\n")

  const hapiOk = await testHapiServer()
  if (!hapiOk) {
    console.log("\n❌ Hapi.js server is not running. Please start it with: npm run server")
    return
  }

  const mlOk = await testMLModel()
  const predictionOk = await testPredictionEndpoint()

  console.log("\n📊 Test Results:")
  console.log("- Hapi.js Server:", hapiOk ? "✅ OK" : "❌ FAILED")
  console.log("- ML Model:", mlOk ? "✅ OK" : "❌ FAILED")
  console.log("- Prediction Endpoint:", predictionOk ? "✅ OK" : "❌ FAILED")

  if (hapiOk && predictionOk) {
    console.log("\n🎉 All tests passed! Integration is working correctly.")
  } else {
    console.log("\n⚠️ Some tests failed. Check the logs above for details.")
  }
}

runTests().catch((error) => {
  console.error("❌ Test runner failed:", error)
})

