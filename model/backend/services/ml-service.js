/**
 * Machine Learning Service untuk prediksi stunting
 * Menggunakan model TensorFlow.js yang sudah disediakan
 * HANYA menggunakan model asli - TIDAK ADA FALLBACK
 */

const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-backend-cpu");

const path = require("path");
const fs = require("fs");

// Di bagian atas file, tambahkan import Prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Cache untuk model yang sudah dimuat
let loadedModel = null;

// Nilai scaler dari training (disesuaikan dengan model asli)
const SCALER_PARAMS = {
  mean: [24.5, 0.5, 85.0, 12.5], // [umur, jenis_kelamin, tinggi_badan, berat_badan]
  scale: [15.0, 0.5, 15.0, 3.5], // standard deviation untuk normalisasi
};

// Label mapping sesuai dengan training model
// Berdasarkan model: 0=normal, 1=severely_stunted, 2=stunted
const LABEL_MAPPING = {
  0: "normal",
  1: "stunting berat", // severely stunted
  2: "stunting", // stunted
};

/**
 * Custom IOHandler untuk loading model dari file lokal
 * Dengan perbaikan untuk weight name mapping
 */
class CustomModelIOHandler {
  constructor(modelPath, weightsPath) {
    this.modelPath = modelPath;
    this.weightsPath = weightsPath;
  }

  async load() {
    try {
      console.log("🔄 Loading model dengan Custom IOHandler...");

      // Baca model JSON
      const modelData = JSON.parse(fs.readFileSync(this.modelPath, "utf8"));
      console.log("✅ Model JSON berhasil dibaca");

      // Baca weights binary
      const weightsBuffer = fs.readFileSync(this.weightsPath);
      console.log(
        `✅ Weights binary berhasil dibaca (${weightsBuffer.length} bytes)`
      );

      // Extract model topology
      const modelTopology = JSON.parse(JSON.stringify(modelData.modelTopology));

      // Perbaiki InputLayer configuration
      if (
        modelTopology.model_config &&
        modelTopology.model_config.config &&
        modelTopology.model_config.config.layers
      ) {
        modelTopology.model_config.config.layers.forEach((layer) => {
          if (layer.class_name === "InputLayer" && layer.config) {
            // Konversi batch_shape ke inputShape
            if (layer.config.batch_shape && !layer.config.inputShape) {
              const batchShape = layer.config.batch_shape;
              if (Array.isArray(batchShape) && batchShape.length > 1) {
                layer.config.inputShape = batchShape.slice(1);
                console.log(
                  `✅ Fixed InputLayer: batch_shape ${JSON.stringify(
                    batchShape
                  )} -> inputShape ${JSON.stringify(layer.config.inputShape)}`
                );
              }
            }
          }
        });
      }

      const weightsManifest = modelData.weightsManifest;

      // Perbaiki weight names untuk mencocokkan dengan model topology
      if (weightsManifest && weightsManifest[0] && weightsManifest[0].weights) {
        const weights = weightsManifest[0].weights;

        // Map weight names dari file ke nama yang diharapkan model
        const weightNameMapping = {
          "sequential_5/dense_15/kernel": "dense_15/kernel",
          "sequential_5/dense_15/bias": "dense_15/bias",
          "sequential_5/dense_16/kernel": "dense_16/kernel",
          "sequential_5/dense_16/bias": "dense_16/bias",
          "sequential_5/dense_17/kernel": "dense_17/kernel",
          "sequential_5/dense_17/bias": "dense_17/bias",
        };

        // Update weight names
        weights.forEach((weight) => {
          const originalName = weight.name;
          if (weightNameMapping[originalName]) {
            weight.name = weightNameMapping[originalName];
            console.log(`✅ Mapped weight: ${originalName} -> ${weight.name}`);
          }
        });
      }

      // Convert weights buffer ke ArrayBuffer
      const weightData = weightsBuffer.buffer.slice(
        weightsBuffer.byteOffset,
        weightsBuffer.byteOffset + weightsBuffer.byteLength
      );

      return {
        modelTopology: modelTopology,
        weightSpecs: weightsManifest[0].weights,
        weightData: weightData,
        format: modelData.format,
        generatedBy: modelData.generatedBy,
        convertedBy: modelData.convertedBy,
      };
    } catch (error) {
      console.error("❌ Error in Custom IOHandler:", error);
      throw error;
    }
  }
}

/**
 * Memuat model TensorFlow.js dari file yang sudah ada
 * HANYA menggunakan model asli - TIDAK ADA FALLBACK
 */
async function loadModel() {
  if (loadedModel) {
    return loadedModel;
  }

  try {
    console.log("🔄 Memuat model TensorFlow.js dari file yang disediakan...");

    // Set backend ke CPU
    await tf.setBackend("cpu");
    await tf.ready();
    console.log("✅ TensorFlow.js backend CPU siap");

    const modelPath = path.join(
      __dirname,
      "../model-machine-learning/model.json"
    );
    const weightsPath = path.join(
      __dirname,
      "../model-machine-learning/group1-shard1of1.bin"
    );

    // Cek apakah file model ada
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file tidak ditemukan: ${modelPath}`);
    }

    if (!fs.existsSync(weightsPath)) {
      throw new Error(`Weights file tidak ditemukan: ${weightsPath}`);
    }

    console.log("Model path:", modelPath);
    console.log("Weights path:", weightsPath);

    // Gunakan Custom IOHandler dengan perbaikan weight name mapping
    const ioHandler = new CustomModelIOHandler(modelPath, weightsPath);

    // Load model menggunakan custom handler
    const model = await tf.loadLayersModel(ioHandler);

    console.log("✅ Model berhasil dimuat dari file asli!");

    // Verifikasi model
    console.log("=== INFORMASI MODEL ===");
    console.log("Input shape:", model.inputs[0].shape);
    console.log("Output shape:", model.outputs[0].shape);
    console.log("Total layers:", model.layers.length);

    // Print layer details
    model.layers.forEach((layer, index) => {
      console.log(`Layer ${index}: ${layer.name} (${layer.constructor.name})`);
      if (layer.units) {
        console.log(`  - Units: ${layer.units}`);
      }
      if (layer.activation && layer.activation.name) {
        console.log(`  - Activation: ${layer.activation.name}`);
      }
    });

    // Print summary
    model.summary();

    loadedModel = model;
    return loadedModel;
  } catch (error) {
    console.error("❌ Error loading model:", error);
    // TIDAK ADA FALLBACK - Langsung throw error
    throw new Error(
      "Model tidak dapat dimuat. Prediksi tidak dapat dilakukan."
    );
  }
}

/**
 * Preprocessing data input sesuai dengan format yang diharapkan model
 * Input: [umur, jenis_kelamin, tinggi_badan, berat_badan]
 */
function preprocessInput(input) {
  // Konversi jenis kelamin ke numerik (sesuai dengan training model)
  // 0 = perempuan, 1 = laki-laki
  const jenisKelaminNumeric = input.jenisKelamin === "laki-laki" ? 1 : 0;

  // Buat array input sesuai urutan yang digunakan saat training
  // Urutan: [umur, jenis_kelamin, tinggi_badan, berat_badan]
  const rawInput = [
    input.usia,
    jenisKelaminNumeric,
    input.tinggiBadan,
    input.beratBadan,
  ];

  console.log("Raw input:", rawInput);

  // Normalisasi menggunakan StandardScaler yang sama dengan training
  const normalizedInput = rawInput.map((value, index) => {
    const normalized =
      (value - SCALER_PARAMS.mean[index]) / SCALER_PARAMS.scale[index];
    return normalized;
  });

  console.log("Normalized input:", normalizedInput);

  // Konversi ke tensor dengan shape [1, 4]
  const tensor = tf.tensor2d([normalizedInput], [1, 4]);

  return tensor;
}

/**
 * Melakukan prediksi menggunakan model TensorFlow.js
 * Model menghasilkan 3 output: [normal, stunting_berat, stunting]
 */
async function predictWithModel(input) {
  try {
    // Muat model jika belum dimuat
    const model = await loadModel();

    // Preprocessing input
    const inputTensor = preprocessInput(input);

    console.log("Input tensor shape:", inputTensor.shape);

    // Lakukan prediksi
    const prediction = model.predict(inputTensor);

    // Konversi hasil prediksi ke array
    const predictionArray = await prediction.data();
    const predictionArrayNumbers = Array.from(predictionArray);

    console.log("Raw prediction probabilities:", predictionArrayNumbers);

    // Model menghasilkan 3 output untuk 3 kelas
    // Index 0: normal, Index 1: stunting berat, Index 2: stunting
    const predictedClass = predictionArrayNumbers.indexOf(
      Math.max(...predictionArrayNumbers)
    );
    const confidence = Math.max(...predictionArrayNumbers) * 100;

    console.log(
      "Predicted class:",
      predictedClass,
      "->",
      LABEL_MAPPING[predictedClass]
    );
    console.log("Confidence:", confidence.toFixed(2) + "%");

    // Cleanup tensors
    inputTensor.dispose();
    prediction.dispose();

    return {
      prediction: predictionArrayNumbers,
      predictedClass,
      confidence,
    };
  } catch (error) {
    console.error("❌ Error during prediction:", error);
    throw new Error(
      "Prediksi tidak dapat dilakukan karena model tidak dapat diakses"
    );
  }
}

// Ubah fungsi convertModelOutputToResult untuk mengambil data dari database
async function convertModelOutputToResult(modelOutput, input) {
  const { predictedClass, confidence, prediction } = modelOutput;

  let status, message, score;
  let recommendationType = "normal"; // Default

  // Konversi berdasarkan kelas prediksi dari model ASLI
  // Model output: [normal, stunting_berat, stunting]
  switch (predictedClass) {
    case 0: // Normal
      status = "normal";
      score = Math.max(5, Math.round((1 - confidence / 100) * 50));
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${
        input.nama || "Anda"
      } berada dalam kondisi normal.`;
      recommendationType = "normal";
      break;

    case 1: // Stunting Berat (Severely Stunted)
      status = "stunting berat";
      score = Math.min(95, Math.max(80, Math.round(confidence)));
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${
        input.nama || "Anda"
      } berada dalam kondisi stunting berat. Kami sarankan untuk segera berkonsultasi dengan tenaga kesehatan.`;
      recommendationType = "severly_stunting";
      break;

    case 2: // Stunting
      status = "stunting";
      score = Math.min(85, Math.max(60, Math.round(confidence)));
      message = `Berdasarkan hasil analisis machine learning, anak yang bernama ${
        input.nama || "Anda"
      } berada dalam kondisi stunting dengan tingkat kepercayaan ${confidence.toFixed(
        1
      )}%. Diperlukan perhatian khusus untuk perbaikan gizi.`;
      recommendationType = "stunting";
      break;

    default:
      status = "normal";
      score = 50;
      message = `✅ Status: Normal\n\nHasil prediksi tidak dapat ditentukan dengan pasti (confidence: ${confidence.toFixed(
        1
      )}%). Disarankan untuk konsultasi dengan tenaga kesehatan untuk evaluasi lebih lanjut.`;
      recommendationType = "normal";
  }

  console.log("🔍 DEBUG: Mencari saran tindakan dari database...");
  console.log("🔍 DEBUG: status =", status);

  let suggestions = [];
  let suggestedActionId = null;

  try {
    // Cek koneksi database terlebih dahulu
    console.log("🔍 DEBUG: Testing database connection...");
    await prisma.$connect();
    console.log("✅ DEBUG: Database connected successfully");

    // Query SuggestedAction berdasarkan status
    console.log("🔍 DEBUG: Querying SuggestedAction for status:", status);
    const action = await prisma.suggestedAction.findFirst({
      where: { status: status },
    });

    if (action) {
      suggestions = action.suggestion.split("\n").filter((s) => s.trim());
      suggestedActionId = action.id;
      console.log("✅ DEBUG: Found suggested action:", action.id);
      console.log("✅ DEBUG: Suggestions count:", suggestions.length);
    } else {
      console.log("⚠️ DEBUG: No suggested action found for status:", status);
      // Fallback suggestions jika tidak ada di database
      suggestions = [
        "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut",
        "Lakukan pemeriksaan pertumbuhan secara berkala",
        "Tingkatkan kualitas asupan gizi harian",
      ];
    }
  } catch (dbError) {
    console.error("❌ DEBUG: Database error:", dbError);
    // Fallback suggestions jika error database
    suggestions = [
      "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut",
      "Lakukan pemeriksaan pertumbuhan secara berkala",
      "Tingkatkan kualitas asupan gizi harian",
    ];
  }

  // Query recommended articles - gunakan field name yang benar
  console.log("🔍 DEBUG: Mencari artikel rekomendasi...");
  console.log("🔍 DEBUG: recommendationType =", recommendationType);

  let recommendedArticles = [];

  try {
    // Query artikel rekomendasi dengan field name yang benar
    try {
      recommendedArticles = await prisma.education.findMany({
        where: {
          recommendedEducation: recommendationType, // Gunakan field name yang benar dari schema
          isPublished: true,
        },
        select: {
          id: true,
          title: true,
          category: true,
          slug: true, // Tambahkan slug untuk URL
        },
        take: 5,
        orderBy: {
          viewCount: "desc",
        },
      });
      console.log(
        "✅ DEBUG: Query with recommendedEducation successful:",
        recommendedArticles.length,
        "articles found"
      );
    } catch (err1) {
      console.log(
        "❌ DEBUG: Query with recommendedEducation failed:",
        err1.message
      );

      // Fallback ke query tanpa filter jika field tidak ada
      try {
        recommendedArticles = await prisma.education.findMany({
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            category: true,
            slug: true,
          },
          take: 3,
          orderBy: {
            viewCount: "desc",
          },
        });
        console.log(
          "✅ DEBUG: Fallback query successful:",
          recommendedArticles.length,
          "articles found"
        );
      } catch (err2) {
        console.log("❌ DEBUG: Fallback query failed:", err2.message);
      }
    }
  } catch (dbError) {
    console.error("❌ DEBUG: Database error:", dbError);
  }

  console.log("🔍 DEBUG: Final recommendedArticles:", recommendedArticles);
  console.log("🔍 DEBUG: Final suggestions:", suggestions);

  return {
    status,
    message,
    recommendations: suggestions, // Sekarang dari database
    score,
    suggestedActionId, // Tambahkan ID untuk relasi
    recommendedArticles:
      recommendedArticles.length > 0 ? recommendedArticles : [],
  };
}

// Ubah fungsi predictStunting menjadi async
async function predictStunting(input) {
  try {
    console.log("🔄 Memulai prediksi stunting untuk input:", input);

    // Validasi input
    const validation = validateInput(input);
    if (!validation.isValid) {
      console.error("❌ Validasi input gagal:", validation.errors);
      throw new Error(`Validasi input gagal: ${validation.errors.join(", ")}`);
    }

    console.log("✅ Validasi input berhasil");

    // Lakukan prediksi dengan model Sequential ASLI
    const modelOutput = await predictWithModel(input);

    // Konversi hasil ke format aplikasi
    const result = await convertModelOutputToResult(modelOutput, input);

    console.log("✅ Prediksi berhasil dengan model Sequential asli:", {
      status: result.status,
      score: result.score,
      confidence: modelOutput.confidence.toFixed(1) + "%",
      recommendedArticlesCount: result.recommendedArticles.length,
    });

    return result;
  } catch (error) {
    console.error("❌ Error dalam prediksi stunting:", error);
    throw error;
  }
}

/**
 * Validasi input sebelum prediksi
 */
function validateInput(input) {
  const errors = [];

  // Validasi usia (0-60 bulan)
  if (input.usia < 0 || input.usia > 60) {
    errors.push("Usia harus antara 0-60 bulan");
  }

  // Validasi jenis kelamin
  if (!["laki-laki", "perempuan"].includes(input.jenisKelamin)) {
    errors.push('Jenis kelamin harus "laki-laki" atau "perempuan"');
  }

  // Validasi berat badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.beratBadan < 1.5 || input.beratBadan > 22.07) {
      errors.push(
        "Berat badan untuk anak laki-laki harus antara 1,5 - 22,07 kg"
      );
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.beratBadan < 1.5 || input.beratBadan > 21.42) {
      errors.push(
        "Berat badan untuk anak perempuan harus antara 1,5 - 21,42 kg"
      );
    }
  }

  // Validasi tinggi badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.tinggiBadan < 41.02 || input.tinggiBadan > 127.0) {
      errors.push(
        "Tinggi badan untuk anak laki-laki harus antara 41,02 - 127,0 cm"
      );
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.tinggiBadan < 40.01 || input.tinggiBadan > 128.0) {
      errors.push(
        "Tinggi badan untuk anak perempuan harus antara 40,01 - 128,0 cm"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  predictStunting,
  loadModel,
  validateInput,
};
