import { NextResponse } from "next/server"

// Tipe data untuk input rekomendasi
interface RecommendationInput {
  status: "normal" | "berisiko" | "stunting"
  usia: number
  jenisKelamin: string
}

// Tipe data untuk artikel
interface Article {
  id: number
  title: string
  excerpt: string
  category: string
  relevanceScore: number
}

// Database artikel (simulasi)
const articlesDatabase: Article[] = [
  {
    id: 1,
    title: "Mengenal Stunting dan Dampaknya pada Anak",
    excerpt:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Ketahui dampak jangka panjangnya pada perkembangan anak.",
    category: "Pengetahuan Dasar",
    relevanceScore: 0.95,
  },
  {
    id: 2,
    title: "Nutrisi Penting untuk Mencegah Stunting",
    excerpt:
      "Pelajari nutrisi-nutrisi penting yang harus diberikan pada anak untuk mencegah stunting dan mendukung pertumbuhan optimal.",
    category: "Nutrisi",
    relevanceScore: 0.9,
  },
  {
    id: 3,
    title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun",
    excerpt:
      "Panduan lengkap menyusun menu seimbang untuk anak usia 1-3 tahun yang mendukung pertumbuhan dan mencegah stunting.",
    category: "Nutrisi",
    relevanceScore: 0.85,
  },
  {
    id: 4,
    title: "Pentingnya 1000 Hari Pertama Kehidupan",
    excerpt:
      "1000 hari pertama kehidupan adalah periode kritis untuk pertumbuhan dan perkembangan anak. Ketahui mengapa periode ini sangat penting.",
    category: "Pengetahuan Dasar",
    relevanceScore: 0.8,
  },
  {
    id: 5,
    title: "Cara Memantau Pertumbuhan Anak dengan Benar",
    excerpt:
      "Panduan praktis untuk memantau pertumbuhan anak secara berkala dan mengenali tanda-tanda stunting sejak dini.",
    category: "Tips Praktis",
    relevanceScore: 0.75,
  },
  {
    id: 6,
    title: "Resep Makanan Bergizi untuk Balita",
    excerpt:
      "Kumpulan resep makanan bergizi yang mudah dibuat dan disukai anak-anak untuk mendukung pertumbuhan optimal.",
    category: "Resep",
    relevanceScore: 0.7,
  },
  {
    id: 7,
    title: "Stimulasi untuk Perkembangan Otak Anak",
    excerpt: "Berbagai aktivitas stimulasi yang dapat dilakukan untuk mendukung perkembangan otak anak secara optimal.",
    category: "Perkembangan Anak",
    relevanceScore: 0.65,
  },
  {
    id: 8,
    title: "Mengatasi Anak Susah Makan",
    excerpt: "Tips dan trik untuk mengatasi anak yang susah makan agar tetap mendapatkan asupan gizi yang cukup.",
    category: "Tips Praktis",
    relevanceScore: 0.6,
  },
  {
    id: 9,
    title: "Peran ASI dalam Mencegah Stunting",
    excerpt: "Pentingnya ASI eksklusif dan ASI lanjutan dalam mencegah stunting pada anak.",
    category: "Nutrisi",
    relevanceScore: 0.55,
  },
  {
    id: 10,
    title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?",
    excerpt: "Panduan tentang kapan anak membutuhkan suplemen gizi tambahan dan jenis suplemen yang aman.",
    category: "Nutrisi",
    relevanceScore: 0.5,
  },
]

// Fungsi untuk merekomendasikan artikel berdasarkan status stunting
function recommendArticles(input: RecommendationInput): Article[] {
  const { status, usia } = input

  // Filter dan urutkan artikel berdasarkan relevansi dengan status stunting
  let filteredArticles = [...articlesDatabase]

  // Bobot tambahan berdasarkan status
  const statusWeights = {
    normal: { "Pengetahuan Dasar": 0.3, Nutrisi: 0.2, "Tips Praktis": 0.2, "Perkembangan Anak": 0.3, Resep: 0.2 },
    berisiko: { "Pengetahuan Dasar": 0.4, Nutrisi: 0.5, "Tips Praktis": 0.4, "Perkembangan Anak": 0.2, Resep: 0.3 },
    stunting: { "Pengetahuan Dasar": 0.5, Nutrisi: 0.6, "Tips Praktis": 0.4, "Perkembangan Anak": 0.2, Resep: 0.4 },
  }

  // Bobot tambahan berdasarkan usia
  const ageWeights = {
    baby: { "Pengetahuan Dasar": 0.3, Nutrisi: 0.5, "Tips Praktis": 0.3, "Perkembangan Anak": 0.4, Resep: 0.2 },
    toddler: { "Pengetahuan Dasar": 0.2, Nutrisi: 0.4, "Tips Praktis": 0.4, "Perkembangan Anak": 0.3, Resep: 0.4 },
    preschool: { "Pengetahuan Dasar": 0.2, Nutrisi: 0.3, "Tips Praktis": 0.4, "Perkembangan Anak": 0.3, Resep: 0.3 },
  }

  // Tentukan kelompok usia
  let ageGroup: "baby" | "toddler" | "preschool"
  if (usia <= 12) {
    ageGroup = "baby"
  } else if (usia <= 36) {
    ageGroup = "toddler"
  } else {
    ageGroup = "preschool"
  }

  // Hitung skor relevansi akhir
  filteredArticles = filteredArticles.map((article) => {
    const statusWeight = statusWeights[status][article.category as keyof typeof statusWeights.normal] || 0
    const ageWeight = ageWeights[ageGroup][article.category as keyof typeof ageWeights.baby] || 0

    const finalScore = article.relevanceScore + statusWeight + ageWeight

    return {
      ...article,
      relevanceScore: finalScore,
    }
  })

  // Urutkan berdasarkan skor relevansi
  filteredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore)

  // Ambil 5 artikel teratas
  return filteredArticles.slice(0, 5)
}

// POST /api/ml/recommend - Endpoint untuk rekomendasi artikel
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi input
    if (!body.status || !body.usia || !body.jenisKelamin) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Konversi input
    const input: RecommendationInput = {
      status: body.status,
      usia: Number(body.usia),
      jenisKelamin: body.jenisKelamin,
    }

    // Dapatkan rekomendasi artikel
    const recommendedArticles = recommendArticles(input)

    return NextResponse.json(recommendedArticles)
  } catch (error) {
    console.error("Error recommending articles:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
