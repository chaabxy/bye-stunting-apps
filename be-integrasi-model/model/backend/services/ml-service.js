/**
 * Machine Learning Service untuk prediksi stunting
 * Menggunakan model TensorFlow.js yang sudah disediakan
 * HANYA menggunakan model asli - TIDAK ADA FALLBACK
 */

const tf = require("@tensorflow/tfjs")
require("@tensorflow/tfjs-backend-cpu")

const path = require("path")
const fs = require("fs")

// Cache untuk model yang sudah dimuat
let loadedModel = null

// Nilai scaler dari training (disesuaikan dengan model asli)
const SCALER_PARAMS = {
  mean: [24.5, 0.5, 85.0, 12.5], // [umur, jenis_kelamin, tinggi_badan, berat_badan]
  scale: [15.0, 0.5, 15.0, 3.5], // standard deviation untuk normalisasi
}

// Label mapping sesuai dengan training model
// Berdasarkan model: 0=normal, 1=severely_stunted, 2=stunted
const LABEL_MAPPING = {
  0: "normal",
  1: "stunting berat", // severely stunted
  2: "stunting", // stunted
}

/**
 * Custom IOHandler untuk loading model dari file lokal
 * Dengan perbaikan untuk weight name mapping
 */
class CustomModelIOHandler {
  constructor(modelPath, weightsPath) {
    this.modelPath = modelPath
    this.weightsPath = weightsPath
  }

  async load() {
    try {
      console.log("🔄 Loading model dengan Custom IOHandler...")

      // Baca model JSON
      const modelData = JSON.parse(fs.readFileSync(this.modelPath, "utf8"))
      console.log("✅ Model JSON berhasil dibaca")

      // Baca weights binary
      const weightsBuffer = fs.readFileSync(this.weightsPath)
      console.log(`✅ Weights binary berhasil dibaca (${weightsBuffer.length} bytes)`)

      // Extract model topology
      const modelTopology = JSON.parse(JSON.stringify(modelData.modelTopology))

      // Perbaiki InputLayer configuration
      if (modelTopology.model_config && modelTopology.model_config.config && modelTopology.model_config.config.layers) {
        modelTopology.model_config.config.layers.forEach((layer) => {
          if (layer.class_name === "InputLayer" && layer.config) {
            // Konversi batch_shape ke inputShape
            if (layer.config.batch_shape && !layer.config.inputShape) {
              const batchShape = layer.config.batch_shape
              if (Array.isArray(batchShape) && batchShape.length > 1) {
                layer.config.inputShape = batchShape.slice(1)
                console.log(
                  `✅ Fixed InputLayer: batch_shape ${JSON.stringify(batchShape)} -> inputShape ${JSON.stringify(layer.config.inputShape)}`,
                )
              }
            }
          }
        })
      }

      const weightsManifest = modelData.weightsManifest

      // Perbaiki weight names untuk mencocokkan dengan model topology
      if (weightsManifest && weightsManifest[0] && weightsManifest[0].weights) {
        const weights = weightsManifest[0].weights

        // Map weight names dari file ke nama yang diharapkan model
        const weightNameMapping = {
          "sequential_5/dense_15/kernel": "dense_15/kernel",
          "sequential_5/dense_15/bias": "dense_15/bias",
          "sequential_5/dense_16/kernel": "dense_16/kernel",
          "sequential_5/dense_16/bias": "dense_16/bias",
          "sequential_5/dense_17/kernel": "dense_17/kernel",
          "sequential_5/dense_17/bias": "dense_17/bias",
        }

        // Update weight names
        weights.forEach((weight) => {
          const originalName = weight.name
          if (weightNameMapping[originalName]) {
            weight.name = weightNameMapping[originalName]
            console.log(`✅ Mapped weight: ${originalName} -> ${weight.name}`)
          }
        })
      }

      // Convert weights buffer ke ArrayBuffer
      const weightData = weightsBuffer.buffer.slice(
        weightsBuffer.byteOffset,
        weightsBuffer.byteOffset + weightsBuffer.byteLength,
      )

      return {
        modelTopology: modelTopology,
        weightSpecs: weightsManifest[0].weights,
        weightData: weightData,
        format: modelData.format,
        generatedBy: modelData.generatedBy,
        convertedBy: modelData.convertedBy,
      }
    } catch (error) {
      console.error("❌ Error in Custom IOHandler:", error)
      throw error
    }
  }
}

/**
 * Memuat model TensorFlow.js dari file yang sudah ada
 * HANYA menggunakan model asli - TIDAK ADA FALLBACK
 */
async function loadModel() {
  if (loadedModel) {
    return loadedModel
  }

  try {
    console.log("🔄 Memuat model TensorFlow.js dari file yang disediakan...")

    // Set backend ke CPU
    await tf.setBackend("cpu")
    await tf.ready()
    console.log("✅ TensorFlow.js backend CPU siap")

    const modelPath = path.join(__dirname, "../model-machine-learning/model.json")
    const weightsPath = path.join(__dirname, "../model-machine-learning/group1-shard1of1.bin")

    // Cek apakah file model ada
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file tidak ditemukan: ${modelPath}`)
    }

    if (!fs.existsSync(weightsPath)) {
      throw new Error(`Weights file tidak ditemukan: ${weightsPath}`)
    }

    console.log("Model path:", modelPath)
    console.log("Weights path:", weightsPath)

    // Gunakan Custom IOHandler dengan perbaikan weight name mapping
    const ioHandler = new CustomModelIOHandler(modelPath, weightsPath)

    // Load model menggunakan custom handler
    const model = await tf.loadLayersModel(ioHandler)

    console.log("✅ Model berhasil dimuat dari file asli!")

    // Verifikasi model
    console.log("=== INFORMASI MODEL ===")
    console.log("Input shape:", model.inputs[0].shape)
    console.log("Output shape:", model.outputs[0].shape)
    console.log("Total layers:", model.layers.length)

    // Print layer details
    model.layers.forEach((layer, index) => {
      console.log(`Layer ${index}: ${layer.name} (${layer.constructor.name})`)
      if (layer.units) {
        console.log(`  - Units: ${layer.units}`)
      }
      if (layer.activation && layer.activation.name) {
        console.log(`  - Activation: ${layer.activation.name}`)
      }
    })

    // Print summary
    model.summary()

    loadedModel = model
    return loadedModel
  } catch (error) {
    console.error("❌ Error loading model:", error)
    // TIDAK ADA FALLBACK - Langsung throw error
    throw new Error("Model tidak dapat dimuat. Prediksi tidak dapat dilakukan.")
  }
}

/**
 * Preprocessing data input sesuai dengan format yang diharapkan model
 * Input: [umur, jenis_kelamin, tinggi_badan, berat_badan]
 */
function preprocessInput(input) {
  // Konversi jenis kelamin ke numerik (sesuai dengan training model)
  // 0 = perempuan, 1 = laki-laki
  const jenisKelaminNumeric = input.jenisKelamin === "laki-laki" ? 1 : 0

  // Buat array input sesuai urutan yang digunakan saat training
  // Urutan: [umur, jenis_kelamin, tinggi_badan, berat_badan]
  const rawInput = [input.usia, jenisKelaminNumeric, input.tinggiBadan, input.beratBadan]

  console.log("Raw input:", rawInput)

  // Normalisasi menggunakan StandardScaler yang sama dengan training
  const normalizedInput = rawInput.map((value, index) => {
    const normalized = (value - SCALER_PARAMS.mean[index]) / SCALER_PARAMS.scale[index]
    return normalized
  })

  console.log("Normalized input:", normalizedInput)

  // Konversi ke tensor dengan shape [1, 4]
  const tensor = tf.tensor2d([normalizedInput], [1, 4])

  return tensor
}

/**
 * Melakukan prediksi menggunakan model TensorFlow.js
 * Model menghasilkan 3 output: [normal, stunting_berat, stunting]
 */
async function predictWithModel(input) {
  try {
    // Muat model jika belum dimuat
    const model = await loadModel()

    // Preprocessing input
    const inputTensor = preprocessInput(input)

    console.log("Input tensor shape:", inputTensor.shape)

    // Lakukan prediksi
    const prediction = model.predict(inputTensor)

    // Konversi hasil prediksi ke array
    const predictionArray = await prediction.data()
    const predictionArrayNumbers = Array.from(predictionArray)

    console.log("Raw prediction probabilities:", predictionArrayNumbers)

    // Model menghasilkan 3 output untuk 3 kelas
    // Index 0: normal, Index 1: stunting berat, Index 2: stunting
    const predictedClass = predictionArrayNumbers.indexOf(Math.max(...predictionArrayNumbers))
    const confidence = Math.max(...predictionArrayNumbers) * 100

    console.log("Predicted class:", predictedClass, "->", LABEL_MAPPING[predictedClass])
    console.log("Confidence:", confidence.toFixed(2) + "%")

    // Cleanup tensors
    inputTensor.dispose()
    prediction.dispose()

    return {
      prediction: predictionArrayNumbers,
      predictedClass,
      confidence,
    }
  } catch (error) {
    console.error("❌ Error during prediction:", error)
    throw new Error("Prediksi tidak dapat dilakukan karena model tidak dapat diakses")
  }
}

/**
 * Konversi hasil prediksi model ke format yang digunakan aplikasi
 * Berdasarkan struktur model: Sequential dengan 3 output classes
 * 0: normal, 1: stunting berat, 2: stunting
 */
function convertModelOutputToResult(modelOutput, input) {
  const { predictedClass, confidence, prediction } = modelOutput

  let status, message, recommendations, score, recommendedArticles

  // Konversi berdasarkan kelas prediksi dari model ASLI
  // Model output: [normal, stunting_berat, stunting]
  switch (predictedClass) {
    case 0: // Normal
      status = "normal"
      score = Math.max(5, Math.round((1 - confidence / 100) * 50))
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${input.nama || "Anda"} berada dalam kondisi normal.`
      recommendations = [
        "Pertahankan pola makan sehat dan seimbang untuk mendukung pertumbuhan optimal.",
        "Lakukan pemeriksaan kesehatan rutin agar kondisi anak selalu terpantau.",
        "Berikan stimulasi yang cukup untuk perkembangan anak.",
        "Pastikan anak mendapatkan imunisasi lengkap sesuai jadwal.",
        "Ciptakan lingkungan yang aman, bersih, dan penuh kasih sayang untuk menunjang tumbuh kembang anak secara optimal.",
      ]
      recommendedArticles = [
        { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
        { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      ]
      break

    case 1: // Stunting Berat (Severely Stunted)
      status = "stunting berat"
      score = Math.min(95, Math.max(80, Math.round(confidence)))
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${input.nama || "Anda"} berada dalam kondisi stunting berat. Kami sarankan untuk segera berkonsultasi dengan tenaga kesehatan.`
      recommendations = [
        "Segera konsultasikan dengan dokter anak atau ahli gizi untuk mendapatkan penanganan yang tepat.",
        "Lakukan evaluasi medis menyeluruh untuk menentukan rencana intervensi yang sesuai.",
        "Pantau pertumbuhan dan perkembangan secara rutin bersama tenaga kesehatan.",
        "Berikan dukungan psikososial untuk anak dan keluarga.",
        "Tingkatkan asupan gizi harian dengan makanan padat gizi dan tinggi protein",
      ]
      recommendedArticles = [
        { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
        { id: 9, title: "Peran ASI dalam Mencegah Stunting", category: "Nutrisi" },
        { id: 10, title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?", category: "Nutrisi" },
      ]
      break

    case 2: // Stunting
      status = "stunting"
      score = Math.min(85, Math.max(60, Math.round(confidence)))
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${input.nama || "Anda"} berada dalam kondisi stunting dengan tingkat kepercayaan ${confidence.toFixed(1)}%. Diperlukan perhatian khusus untuk perbaikan gizi.`
      recommendations = [
        "Konsultasikan dengan tenaga medis atau ahli gizi untuk mendapatkan saran yang tepat.",
        "Tingkatkan kualitas dan variasi asupan gizi, terutama makanan bergizi seimbang.",
        "Lakukan pemeriksaan pertumbuhan secara berkala untuk memantau perkembangan.",
        "Berikan makanan dengan variasi yang cukup sesuai usia anak.",
        "Jaga kebersihan lingkungan dan sanitasi untuk mencegah infeksi yang menghambat pertumbuhan.",
      ]
      recommendedArticles = [
        { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
        { id: 8, title: "Mengatasi Anak Susah Makan", category: "Tips Praktis" },
        { id: 9, title: "Peran ASI dalam Mencegah Stunting", category: "Nutrisi" },
      ]
      break

    default:
      status = "normal"
      score = 50
      message = `✅ Status: Normal\n\nHasil prediksi tidak dapat ditentukan dengan pasti (confidence: ${confidence.toFixed(1)}%). Disarankan untuk konsultasi dengan tenaga kesehatan untuk evaluasi lebih lanjut.`
      recommendations = [
        "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut",
        "Lakukan pemeriksaan pertumbuhan secara berkala",
        "Tingkatkan kualitas asupan gizi harian",
      ]
      recommendedArticles = [{ id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" }]
  }

  // Tambahkan informasi detail prediksi dari model Sequential
  const detailInfo = ``

  return {
    status,
    message: message + detailInfo,
    recommendations,
    score,
    recommendedArticles,
  }
}

/**
 * Fungsi utama untuk melakukan prediksi stunting
 * HANYA menggunakan model Sequential asli
 */
async function predictStunting(input) {
  try {
    console.log("🔄 Memulai prediksi stunting untuk input:", input)

    // Validasi input
    const validation = validateInput(input)
    if (!validation.isValid) {
      console.error("❌ Validasi input gagal:", validation.errors)
      throw new Error(`Validasi input gagal: ${validation.errors.join(", ")}`)
    }

    console.log("✅ Validasi input berhasil")

    // Lakukan prediksi dengan model Sequential ASLI
    const modelOutput = await predictWithModel(input)

    // Konversi hasil ke format aplikasi
    const result = convertModelOutputToResult(modelOutput, input)

    console.log("✅ Prediksi berhasil dengan model Sequential asli:", {
      status: result.status,
      score: result.score,
      confidence: modelOutput.confidence.toFixed(1) + "%",
    })

    return result
  } catch (error) {
    console.error("❌ Error dalam prediksi stunting:", error)
    throw error
  }
}

/**
 * Validasi input sebelum prediksi
 */
function validateInput(input) {
  const errors = []

  // Validasi usia (0-60 bulan)
  if (input.usia < 0 || input.usia > 60) {
    errors.push("Usia harus antara 0-60 bulan")
  }

  // Validasi jenis kelamin
  if (!["laki-laki", "perempuan"].includes(input.jenisKelamin)) {
    errors.push('Jenis kelamin harus "laki-laki" atau "perempuan"')
  }

  // Validasi berat badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.beratBadan < 1.5 || input.beratBadan > 22.07) {
      errors.push("Berat badan untuk anak laki-laki harus antara 1,5 - 22,07 kg")
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.beratBadan < 1.5 || input.beratBadan > 21.42) {
      errors.push("Berat badan untuk anak perempuan harus antara 1,5 - 21,42 kg")
    }
  }

  // Validasi tinggi badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.tinggiBadan < 41.02 || input.tinggiBadan > 127.0) {
      errors.push("Tinggi badan untuk anak laki-laki harus antara 41,02 - 127,0 cm")
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.tinggiBadan < 40.01 || input.tinggiBadan > 128.0) {
      errors.push("Tinggi badan untuk anak perempuan harus antara 40,01 - 128,0 cm")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

module.exports = {
  predictStunting,
  loadModel,
  validateInput,
}
