/**
 * Modul integrasi machine learning untuk prediksi stunting
 *
 * Modul ini berisi fungsi-fungsi untuk mengintegrasikan model machine learning
 * untuk prediksi stunting dan memberikan rekomendasi edukasi berdasarkan hasil prediksi.
 */

// Tipe data untuk input prediksi
export interface PredictionInput {
  nama: string
  usia: number
  jenisKelamin: string
  beratBadan: number
  tinggiBadan: number
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
}

/**
 * Fungsi untuk melakukan prediksi stunting menggunakan API
 *
 * @param input Data input untuk prediksi
 * @returns Hasil prediksi stunting
 */
export async function predictStunting(input: PredictionInput): Promise<PredictionResult> {
  try {
    // Panggil API prediksi
    const response = await fetch("/api/ml/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usia: input.usia,
        jenisKelamin: input.jenisKelamin,
        beratBadan: input.beratBadan,
        tinggiBadan: input.tinggiBadan,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("API Error:", result)

      // Jika error validasi, tampilkan pesan error yang spesifik
      if (result.details && Array.isArray(result.details)) {
        throw new Error(`Validasi gagal: ${result.details.join(", ")}`)
      }

      throw new Error(result.error || "Failed to predict stunting")
    }

    return result
  } catch (error) {
    console.error("Error predicting stunting:", error)

    // Fallback ke prediksi lokal jika API gagal
    console.log("Menggunakan fallback prediction...")
    return fallbackPrediction(input)
  }
}

/**
 * Fungsi untuk mendapatkan rekomendasi artikel berdasarkan hasil prediksi
 *
 * @param status Status stunting (normal, berisiko, stunting)
 * @param usia Usia anak dalam bulan
 * @param jenisKelamin Jenis kelamin anak
 * @returns Daftar artikel yang direkomendasikan
 */
export async function getRecommendedArticles(
  status: "normal" | "berisiko" | "stunting",
  usia: number,
  jenisKelamin: string,
): Promise<any[]> {
  try {
    // Panggil API rekomendasi
    const response = await fetch("/api/ml/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        usia,
        jenisKelamin,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get recommendations")
    }

    const recommendations = await response.json()
    return recommendations
  } catch (error) {
    console.error("Error getting recommendations:", error)

    // Fallback ke rekomendasi default jika API gagal
    return fallbackRecommendations(status)
  }
}

/**
 * Fungsi prediksi fallback jika API gagal
 *
 * @param input Data input untuk prediksi
 * @returns Hasil prediksi stunting
 */
function fallbackPrediction(input: PredictionInput): PredictionResult {
  const { usia, beratBadan, tinggiBadan } = input

  // Logika sederhana untuk demo
  if (usia <= 24) {
    // Anak di bawah 2 tahun
    if (tinggiBadan < 80 && beratBadan < 9) {
      return {
        status: "stunting",
        message: "Anak Anda terdeteksi mengalami stunting.",
        score: 85,
        recommendations: [
          "Konsultasikan dengan dokter anak atau ahli gizi segera",
          "Berikan makanan tinggi protein dan kalsium",
          "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
        ],
        recommendedArticles: [
          { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
          { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
          { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
        ],
      }
    } else if (tinggiBadan < 85 && beratBadan < 10) {
      return {
        status: "berisiko",
        message: "Anak Anda berisiko mengalami stunting.",
        score: 65,
        recommendations: [
          "Tingkatkan asupan gizi seimbang",
          "Berikan makanan kaya protein dan kalsium",
          "Pantau pertumbuhan secara berkala",
        ],
        recommendedArticles: [
          { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
          { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
        ],
      }
    } else {
      return {
        status: "normal",
        message: "Pertumbuhan anak Anda normal.",
        score: 15,
        recommendations: [
          "Pertahankan pola makan sehat dan seimbang",
          "Lakukan pemeriksaan rutin setiap bulan",
          "Berikan stimulasi yang cukup untuk perkembangan anak",
        ],
        recommendedArticles: [
          { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
        ],
      }
    }
  } else {
    // Anak di atas 2 tahun
    if (tinggiBadan < 95 && beratBadan < 12) {
      return {
        status: "stunting",
        message: "Anak Anda terdeteksi mengalami stunting.",
        score: 80,
        recommendations: [
          "Konsultasikan dengan dokter anak atau ahli gizi segera",
          "Berikan makanan tinggi protein dan kalsium",
          "Pastikan anak mendapatkan asupan vitamin A dan D yang cukup",
        ],
        recommendedArticles: [
          { id: 1, title: "Mengenal Stunting dan Dampaknya pada Anak", category: "Pengetahuan Dasar" },
          { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi" },
          { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep" },
        ],
      }
    } else if (tinggiBadan < 100 && beratBadan < 14) {
      return {
        status: "berisiko",
        message: "Anak Anda berisiko mengalami stunting.",
        score: 60,
        recommendations: [
          "Tingkatkan asupan gizi seimbang",
          "Berikan makanan kaya protein dan kalsium",
          "Pantau pertumbuhan secara berkala",
        ],
        recommendedArticles: [
          { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi" },
          { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis" },
        ],
      }
    } else {
      return {
        status: "normal",
        message: "Pertumbuhan anak Anda normal.",
        score: 10,
        recommendations: [
          "Pertahankan pola makan sehat dan seimbang",
          "Lakukan pemeriksaan rutin setiap bulan",
          "Berikan stimulasi yang cukup untuk perkembangan anak",
        ],
        recommendedArticles: [
          { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar" },
        ],
      }
    }
  }
}

/**
 * Fungsi rekomendasi fallback jika API gagal
 *
 * @param status Status stunting (normal, berisiko, stunting)
 * @returns Daftar artikel yang direkomendasikan
 */
function fallbackRecommendations(status: "normal" | "berisiko" | "stunting"): any[] {
  if (status === "stunting") {
    return [
      {
        id: 1,
        title: "Mengenal Stunting dan Dampaknya pada Anak",
        category: "Pengetahuan Dasar",
        relevanceScore: 0.95,
      },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi", relevanceScore: 0.9 },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep", relevanceScore: 0.7 },
      { id: 9, title: "Peran ASI dalam Mencegah Stunting", category: "Nutrisi", relevanceScore: 0.55 },
      { id: 10, title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?", category: "Nutrisi", relevanceScore: 0.5 },
    ]
  } else if (status === "berisiko") {
    return [
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi", relevanceScore: 0.85 },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis", relevanceScore: 0.75 },
      { id: 8, title: "Mengatasi Anak Susah Makan", category: "Tips Praktis", relevanceScore: 0.6 },
      { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi", relevanceScore: 0.9 },
      { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak", relevanceScore: 0.65 },
    ]
  } else {
    return [
      { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar", relevanceScore: 0.8 },
      { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak", relevanceScore: 0.65 },
      { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi", relevanceScore: 0.85 },
      { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis", relevanceScore: 0.75 },
      { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep", relevanceScore: 0.7 },
    ]
  }
}
