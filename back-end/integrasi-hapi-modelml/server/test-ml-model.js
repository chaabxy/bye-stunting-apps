const axios = require("axios")

// URL model ML eksternal
const ML_MODEL_URL = "https://model-byestunting.vercel.app"

// Data test untuk model ML
const testData = {
  data: [24, 10, 80, 1], // [umur_bulan, berat_badan, tinggi_badan, jenis_kelamin(1=laki-laki, 0=perempuan)]
}

async function testMLModel() {
  console.log("🧪 Testing ML Model...")
  console.log("🔗 Model URL:", ML_MODEL_URL)
  console.log("📊 Test data:", testData)

  try {
    console.log("\n📤 Sending request to /api/predict...")
    const response = await axios.post(`${ML_MODEL_URL}/api/predict`, testData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    })

    console.log("✅ Success! Response:")
    console.log(JSON.stringify(response.data, null, 2))

    // Analisis respons
    console.log("\n📊 Response Analysis:")
    console.log("- Success:", response.data.success)
    console.log("- Prediction:", response.data.prediction)
    console.log("- Confidence:", response.data.confidence)
    console.log("- Z-Score:", response.data.z_score)

    if (response.data.probabilities) {
      console.log("- Probabilities:")
      Object.entries(response.data.probabilities).forEach(([key, value]) => {
        console.log(`  - ${key}: ${value}`)
      })
    }

    console.log("- Interpretation:", response.data.interpretation)
    console.log("- Recommendation:", response.data.recommendation)

    return true
  } catch (error) {
    console.error("❌ Error testing ML model:", error.message)

    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }

    return false
  }
}

// Jalankan test
testMLModel().then((success) => {
  if (success) {
    console.log("\n✅ ML Model test successful!")
  } else {
    console.log("\n❌ ML Model test failed!")
  }
})
