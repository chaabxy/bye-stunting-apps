import { NextResponse } from "next/server"

// Data kesehatan (sama dengan yang di route.ts)
let healthData = [
  {
    id: 1,
    title: "Data Stunting Nasional 2025",
    source: "Kementerian Kesehatan RI",
    description: "Data prevalensi stunting di Indonesia berdasarkan provinsi tahun 2025",
    url: "https://api.kesehatan.go.id/stunting/nasional",
    lastUpdated: "2025-05-10",
    category: "Statistik Nasional",
    accessLevel: "public",
  },
  {
    id: 2,
    title: "Panduan Gizi Seimbang untuk Anak",
    source: "Direktorat Gizi Masyarakat",
    description: "Panduan resmi tentang gizi seimbang untuk anak usia 0-5 tahun",
    url: "https://api.kesehatan.go.id/gizi/panduan",
    lastUpdated: "2025-04-15",
    category: "Panduan",
    accessLevel: "public",
  },
  {
    id: 3,
    title: "Standar Antropometri WHO",
    source: "WHO Indonesia",
    description: "Standar antropometri WHO untuk pemantauan pertumbuhan anak",
    url: "https://api.who.int/anthropometry/standards",
    lastUpdated: "2025-03-22",
    category: "Standar",
    accessLevel: "public",
  },
  {
    id: 4,
    title: "Data Stunting per Kabupaten/Kota",
    source: "Kementerian Kesehatan RI",
    description: "Data prevalensi stunting per kabupaten/kota di Indonesia",
    url: "https://api.kesehatan.go.id/stunting/kabupaten",
    lastUpdated: "2025-05-05",
    category: "Statistik Daerah",
    accessLevel: "restricted",
  },
  {
    id: 5,
    title: "Indikator Pemantauan Pertumbuhan Anak",
    source: "Ikatan Dokter Anak Indonesia",
    description: "Indikator resmi untuk pemantauan pertumbuhan anak Indonesia",
    url: "https://api.idai.or.id/pertumbuhan/indikator",
    lastUpdated: "2025-02-18",
    category: "Panduan",
    accessLevel: "restricted",
  },
  {
    id: 6,
    title: "Peta Sebaran Stunting Indonesia",
    source: "Badan Penelitian dan Pengembangan Kesehatan",
    description: "Data geospasial sebaran stunting di Indonesia",
    url: "https://api.litbangkes.go.id/stunting/peta",
    lastUpdated: "2025-04-30",
    category: "Peta",
    accessLevel: "restricted",
  },
]

// GET /api/health-data/[id] - Mendapatkan data kesehatan berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari data kesehatan berdasarkan ID
  const data = healthData.find((item) => item.id === id)

  if (!data) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(data)
}

// PUT /api/health-data/[id] - Memperbarui data kesehatan berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.source || !body.description || !body.url || !body.category || !body.accessLevel) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Cari indeks data kesehatan
    const index = healthData.findIndex((item) => item.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }

    // Perbarui data kesehatan
    const updatedData = {
      ...healthData[index],
      title: body.title,
      source: body.source,
      description: body.description,
      url: body.url,
      category: body.category,
      accessLevel: body.accessLevel,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    healthData[index] = updatedData

    return NextResponse.json(updatedData)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}

// DELETE /api/health-data/[id] - Menghapus data kesehatan berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari indeks data kesehatan
  const index = healthData.findIndex((item) => item.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
  }

  // Hapus data kesehatan
  const deletedData = healthData[index]
  healthData = healthData.filter((item) => item.id !== id)

  return NextResponse.json(deletedData)
}
