import { NextResponse } from "next/server"

// POST /api/ml/recommend - Endpoint untuk rekomendasi artikel
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { status, usia, jenisKelamin } = body

    // Dapatkan rekomendasi artikel berdasarkan status
    const recommendations = getRecommendedArticles(
      status === "normal" ? "normal" : status === "berisiko" ? "pendek" : "sangat_pendek",
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}

// Helper function untuk mendapatkan artikel rekomendasi berdasarkan status
function getRecommendedArticles(status: string): any[] {
  switch (status) {
    case "sangat_pendek":
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
    case "pendek":
      return [
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi", relevanceScore: 0.85 },
        { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis", relevanceScore: 0.75 },
        { id: 8, title: "Mengatasi Anak Susah Makan", category: "Tips Praktis", relevanceScore: 0.6 },
        { id: 2, title: "Nutrisi Penting untuk Mencegah Stunting", category: "Nutrisi", relevanceScore: 0.9 },
        { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak", relevanceScore: 0.65 },
      ]
    case "normal":
    default:
      return [
        { id: 4, title: "Pentingnya 1000 Hari Pertama Kehidupan", category: "Pengetahuan Dasar", relevanceScore: 0.8 },
        { id: 7, title: "Stimulasi untuk Perkembangan Otak Anak", category: "Perkembangan Anak", relevanceScore: 0.65 },
        { id: 3, title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun", category: "Nutrisi", relevanceScore: 0.85 },
        { id: 5, title: "Cara Memantau Pertumbuhan Anak dengan Benar", category: "Tips Praktis", relevanceScore: 0.75 },
        { id: 6, title: "Resep Makanan Bergizi untuk Balita", category: "Resep", relevanceScore: 0.7 },
      ]
  }
}
