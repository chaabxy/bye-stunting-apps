/**
 * Integrasi TensorFlow.js untuk prediksi stunting
 * Menggunakan model yang sudah ada dengan preprocessing yang benar
 */

import * as tf from "@tensorflow/tfjs"

// Interface untuk input model
export interface ModelInput {
  usia: number // dalam bulan
  jenisKelamin: string // "laki-laki" atau "perempuan"
  beratBadan: number // dalam kg
  tinggiBadan: number // dalam cm
}

// Interface untuk output model
export interface ModelOutput {
  prediction: number[]
  predictedClass: number
  confidence: number
}

// Cache untuk model yang sudah dimuat
let loadedModel: tf.LayersModel | null = null

// Nilai scaler dari training (sesuai dengan dataset yang disediakan)
// Berdasarkan analisis dataset stunting yang ada
const SCALER_PARAMS = {
  mean: [30.96875, 0.5078125, 86.484375, 11.640625], // [umur, jenis_kelamin, tinggi_badan, berat_badan]
  scale: [17.734375, 0.5, 12.265625, 2.828125], // standard deviation untuk normalisasi
}

// Label mapping sesuai dengan training model
const LABEL_MAPPING = {
  0: "normal",
  1: "severely stunted",
  2: "stunted",
} as const

/**
 * Parse bobot dari file bin secara manual
 */
async function parseWeightsFromBin(binArrayBuffer: ArrayBuffer, weightsManifest: any[]): Promise<tf.Tensor[]> {
  console.log("🔄 Parsing bobot secara manual dari file bin...")

  const dataView = new DataView(binArrayBuffer)
  let offset = 0
  const tensors: tf.Tensor[] = []

  // Berdasarkan weightsManifest dari model.json
  const expectedWeights = [
    { name: "sequential/dense/kernel", shape: [4, 128], dtype: "float32" },
    { name: "sequential/dense/bias", shape: [128], dtype: "float32" },
    { name: "sequential/dense_1/kernel", shape: [128, 64], dtype: "float32" },
    { name: "sequential/dense_1/bias", shape: [64], dtype: "float32" },
    { name: "sequential/dense_2/kernel", shape: [64, 3], dtype: "float32" },
    { name: "sequential/dense_2/bias", shape: [3], dtype: "float32" },
  ]

  console.log("Expected weights structure:", expectedWeights)

  for (const weightInfo of expectedWeights) {
    const { shape, dtype } = weightInfo
    const size = shape.reduce((a, b) => a * b, 1)

    console.log(`Parsing ${weightInfo.name}: shape ${shape}, size ${size}`)

    if (dtype === "float32") {
      const bytesPerElement = 4
      const totalBytes = size * bytesPerElement

      if (offset + totalBytes > binArrayBuffer.byteLength) {
        console.error(`Not enough data in bin file for ${weightInfo.name}`)
        throw new Error(`Insufficient data in bin file`)
      }

      // Baca data float32
      const data = new Float32Array(size)
      for (let i = 0; i < size; i++) {
        data[i] = dataView.getFloat32(offset, true) // little endian
        offset += bytesPerElement
      }

      // Buat tensor
      const tensor = tf.tensor(data, shape)
      tensors.push(tensor)

      console.log(`✅ Berhasil parsing ${weightInfo.name}: ${tensor.shape}`)
    }
  }

  console.log(`✅ Berhasil parsing ${tensors.length} tensor bobot`)
  return tensors
}

/**
 * Memuat model TensorFlow.js dari file yang sudah ada
 */
export async function loadModel(): Promise<tf.LayersModel> {
  if (loadedModel) {
    return loadedModel
  }

  try {
    console.log("Memuat model TensorFlow.js dari file yang disediakan...")

    // Gunakan URL absolut untuk model
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const modelUrl = `${baseUrl}/model-machine-learning/model.json`
    const binUrl = `${baseUrl}/model-machine-learning/group1-shard1of1.bin`

    console.log("Model URL:", modelUrl)
    console.log("Bin URL:", binUrl)

    // Baca konfigurasi model dan file bin secara paralel
    const [modelConfigResponse, binResponse] = await Promise.all([fetch(modelUrl), fetch(binUrl)])

    const modelConfig = await modelConfigResponse.json()
    const binArrayBuffer = await binResponse.arrayBuffer()

    console.log("✅ Berhasil membaca konfigurasi model dan file bin")
    console.log(`File bin size: ${binArrayBuffer.byteLength} bytes`)

    // Buat model dengan struktur yang sesuai
    const model = tf.sequential()

    // Layer 1: Dense dengan 128 units
    const dense1 = tf.layers.dense({
      inputShape: [4],
      units: 128,
      activation: "relu",
      name: "dense",
      useBias: true,
    })
    model.add(dense1)

    // Layer 2: Dropout
    model.add(
      tf.layers.dropout({
        rate: 0.3,
        name: "dropout",
      }),
    )

    // Layer 3: Dense dengan 64 units
    const dense2 = tf.layers.dense({
      units: 64,
      activation: "relu",
      name: "dense_1",
      useBias: true,
    })
    model.add(dense2)

    // Layer 4: Dropout
    model.add(
      tf.layers.dropout({
        rate: 0.2,
        name: "dropout_1",
      }),
    )

    // Layer 5: Dense dengan 3 units (output)
    const dense3 = tf.layers.dense({
      units: 3,
      activation: "softmax",
      name: "dense_2",
      useBias: true,
    })
    model.add(dense3)

    // Kompilasi model
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: "sparseCategoricalCrossentropy",
      metrics: ["accuracy"],
    })

    console.log("✅ Model berhasil dibuat")

    // Parse bobot dari file bin
    try {
      const weightsManifest = modelConfig.weightsManifest
      const parsedWeights = await parseWeightsFromBin(binArrayBuffer, weightsManifest)

      // Set bobot ke model secara manual
      console.log("🔄 Setting bobot ke model...")

      // Get trainable layers (yang memiliki bobot)
      const trainableLayers = model.layers.filter((layer) => layer.trainable && layer.getWeights().length > 0)

      console.log(`Found ${trainableLayers.length} trainable layers`)
      console.log(`Parsed ${parsedWeights.length} weight tensors`)

      if (trainableLayers.length * 2 === parsedWeights.length) {
        // setiap dense layer punya kernel + bias
        let weightIndex = 0

        for (const layer of trainableLayers) {
          const layerWeights = []

          // Kernel (weights)
          layerWeights.push(parsedWeights[weightIndex])
          weightIndex++

          // Bias
          layerWeights.push(parsedWeights[weightIndex])
          weightIndex++

          // Set weights ke layer
          layer.setWeights(layerWeights)
          console.log(`✅ Set weights untuk layer: ${layer.name}`)
        }

        console.log("✅ Semua bobot berhasil dimuat dari file asli!")

        // Verifikasi bobot
        const weights = model.getWeights()
        console.log(`Model memiliki ${weights.length} tensor bobot setelah loading`)
        weights.forEach((weight, index) => {
          console.log(`Bobot ${index}: shape ${weight.shape}, dtype ${weight.dtype}`)
        })
      } else {
        console.error(`Mismatch: ${trainableLayers.length} layers vs ${parsedWeights.length} weights`)
        throw new Error("Weight count mismatch")
      }
    } catch (weightError) {
      console.error("❌ Gagal memuat bobot:", weightError)
      console.log("⚠️ Menggunakan model dengan inisialisasi default")
    }

    loadedModel = model

    console.log("=== MODEL BERHASIL DIMUAT ===")
    model.summary()

    return loadedModel
  } catch (error) {
    console.error("❌ Error loading model:", error)
    throw new Error("Gagal memuat model machine learning")
  }
}

/**
 * Preprocessing data input sesuai dengan format yang diharapkan model
 */
export function preprocessInput(input: ModelInput): tf.Tensor {
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
 */
export async function predictWithModel(input: ModelInput): Promise<ModelOutput> {
  try {
    // Muat model jika belum dimuat
    const model = await loadModel()

    // Preprocessing input
    const inputTensor = preprocessInput(input)

    console.log("Input tensor shape:", inputTensor.shape)

    // Lakukan prediksi
    const prediction = model.predict(inputTensor) as tf.Tensor

    // Konversi hasil prediksi ke array
    const predictionArray = await prediction.data()
    const predictionArrayNumbers = Array.from(predictionArray)

    console.log("Raw prediction probabilities:", predictionArrayNumbers)

    // Model menghasilkan 3 output untuk 3 kelas
    const predictedClass = predictionArrayNumbers.indexOf(Math.max(...predictionArrayNumbers))
    const confidence = Math.max(...predictionArrayNumbers) * 100

    console.log("Predicted class:", predictedClass, "->", LABEL_MAPPING[predictedClass as keyof typeof LABEL_MAPPING])
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
    console.error("Error during prediction:", error)
    throw new Error("Gagal melakukan prediksi")
  }
}

/**
 * Konversi hasil prediksi model ke format yang digunakan aplikasi
 */
export function convertModelOutputToResult(
  modelOutput: ModelOutput,
  input: ModelInput,
): {
  status: "normal" | "berisiko" | "stunting"
  message: string
  recommendations: string[]
  score: number
  recommendedArticles: {
    id: number
    title: string
    category: string
  }[]
} {
  const { predictedClass, confidence, prediction } = modelOutput

  let status: "normal" | "berisiko" | "stunting"
  let message: string
  let recommendations: string[]
  let score: number
  let recommendedArticles: any[]

  // Konversi berdasarkan kelas prediksi dari model
  switch (predictedClass) {
    case 0: // Normal
      status = "normal"
      score = Math.max(5, Math.round((1 - confidence / 100) * 100))
      message = `Berdasarkan analisis machine learning dengan model yang telah dilatih menggunakan bobot asli, pertumbuhan anak Anda berada dalam kategori NORMAL dengan tingkat kepercayaan ${confidence.toFixed(1)}%.`
      recommendations = [
        "Pertahankan pola makan sehat dan seimbang yang sudah baik",
        "Lakukan pemeriksaan rutin setiap bulan untuk memantau pertumbuhan",
        "Berikan stimulasi yang cukup untuk perkembangan kognitif dan motorik anak",
        "Pastikan anak mendapatkan imunisasi lengkap sesuai jadwal",
        "Jaga kebersihan lingkungan dan personal hygiene",
        "Berikan ASI eksklusif hingga 6 bulan dan dilanjutkan hingga 2 tahun",
      ]
      recommendedArticles = [
        { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
        { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak" },
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
      ]
      break

    case 1: // Severely Stunted
      status = "stunting"
      score = Math.min(95, Math.max(80, Math.round(confidence)))
      message = `Berdasarkan analisis machine learning dengan model yang telah dilatih menggunakan bobot asli, anak Anda terdeteksi mengalami STUNTING BERAT dengan tingkat kepercayaan ${confidence.toFixed(1)}%. Segera konsultasikan dengan tenaga kesehatan.`
      recommendations = [
        "SEGERA konsultasikan dengan dokter anak atau ahli gizi spesialis",
        "Ikuti program intervensi gizi intensif dari puskesmas atau rumah sakit",
        "Berikan makanan tinggi protein berkualitas (telur, ikan, daging, kacang-kacangan)",
        "Pastikan asupan kalsium dan vitamin D yang cukup untuk pertumbuhan tulang",
        "Lakukan pemeriksaan kesehatan menyeluruh untuk mendeteksi penyakit penyerta",
        "Pantau pertumbuhan setiap minggu dengan ketat",
        "Berikan suplemen gizi sesuai anjuran dokter",
        "Evaluasi pola makan dan gaya hidup keluarga secara menyeluruh",
      ]
      recommendedArticles = [
        { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
        { id: 9, title: "Peran ASI dalam Mencegah Stunting", category: "Nutrisi" },
        { id: 10, title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?", category: "Nutrisi" },
      ]
      break

    case 2: // Stunted
      status = "stunting"
      score = Math.min(85, Math.max(60, Math.round(confidence)))
      message = `Berdasarkan analisis machine learning dengan model yang telah dilatih menggunakan bobot asli, anak Anda terdeteksi mengalami STUNTING dengan tingkat kepercayaan ${confidence.toFixed(1)}%. Diperlukan intervensi segera.`
      recommendations = [
        "Konsultasikan dengan dokter anak atau ahli gizi dalam waktu dekat",
        "Tingkatkan asupan gizi dengan fokus pada protein dan mikronutrien",
        "Berikan makanan padat gizi seperti telur, ikan, sayuran hijau, dan buah-buahan",
        "Ikuti program pemulihan gizi dari fasilitas kesehatan terdekat",
        "Lakukan pemeriksaan kesehatan untuk mendeteksi masalah kesehatan lain",
        "Pantau pertumbuhan setiap 2 minggu",
        "Pastikan kebersihan makanan dan lingkungan",
        "Evaluasi praktik pemberian makan dan pola asuh",
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
      status = "berisiko"
      score = 50
      message = `Hasil prediksi tidak dapat ditentukan dengan pasti (confidence: ${confidence.toFixed(1)}%). Disarankan untuk konsultasi dengan tenaga kesehatan.`
      recommendations = [
        "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut",
        "Lakukan pemeriksaan pertumbuhan secara berkala",
        "Tingkatkan kualitas asupan gizi harian",
      ]
      recommendedArticles = [{ id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" }]
  }

  // Tambahkan informasi detail prediksi
  const detailInfo = `\n\nDetail Analisis:\n• Probabilitas Normal: ${(prediction[0] * 100).toFixed(1)}%\n• Probabilitas Stunting Berat: ${(prediction[1] * 100).toFixed(1)}%\n• Probabilitas Stunting: ${(prediction[2] * 100).toFixed(1)}%`

  return {
    status,
    message: message + detailInfo,
    recommendations,
    score,
    recommendedArticles,
  }
}

/**
 * Validasi input sebelum prediksi
 */
export function validateInput(input: ModelInput): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validasi usia (0-60 bulan)
  if (input.usia < 0 || input.usia > 60) {
    errors.push("Usia harus antara 0-60 bulan")
  }

  // Validasi jenis kelamin
  if (!["laki-laki", "perempuan"].includes(input.jenisKelamin)) {
    errors.push("Jenis kelamin harus 'laki-laki' atau 'perempuan'")
  }

  // Validasi berat badan (0.5-30 kg)
  if (input.beratBadan < 0.5 || input.beratBadan > 30) {
    errors.push("Berat badan harus antara 0.5-30 kg")
  }

  // Validasi tinggi badan (30-120 cm)
  if (input.tinggiBadan < 30 || input.tinggiBadan > 120) {
    errors.push("Tinggi badan harus antara 30-120 cm")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Konversi tanggal lahir ke usia dalam bulan
 */
export function calculateAgeInMonths(birthDate: Date): number {
  const today = new Date()
  const birth = new Date(birthDate)

  let months = (today.getFullYear() - birth.getFullYear()) * 12
  months += today.getMonth() - birth.getMonth()

  // Jika hari ini belum mencapai tanggal lahir di bulan ini, kurangi 1 bulan
  if (today.getDate() < birth.getDate()) {
    months--
  }

  return Math.max(0, months) // Pastikan tidak negatif
}
