import { NextResponse } from "next/server"

// Data kesehatan dari Dinas Kesehatan (simulasi)
const healthData = [
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

// GET /api/health-data - Mendapatkan semua data kesehatan
export async function GET(request: Request) {
  // Mendapatkan parameter query
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const accessLevel = searchParams.get("accessLevel")

  let filteredData = [...healthData]

  // Filter berdasarkan kategori jika ada
  if (category && category !== "all") {
    filteredData = filteredData.filter((data) => data.category === category)
  }

  // Filter berdasarkan level akses jika ada
  if (accessLevel) {
    filteredData = filteredData.filter((data) => data.accessLevel === accessLevel)
  }

  // Filter berdasarkan pencarian jika ada
  if (search) {
    const searchLower = search.toLowerCase()
    filteredData = filteredData.filter(
      (data) =>
        data.title.toLowerCase().includes(searchLower) ||
        data.description.toLowerCase().includes(searchLower) ||
        data.source.toLowerCase().includes(searchLower),
    )
  }

  return NextResponse.json(filteredData)
}

// POST /api/health-data - Menambahkan data kesehatan baru
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.source || !body.description || !body.url || !body.category || !body.accessLevel) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Buat data kesehatan baru
    const newData = {
      id: healthData.length > 0 ? Math.max(...healthData.map((data) => data.id)) + 1 : 1,
      title: body.title,
      source: body.source,
      description: body.description,
      url: body.url,
      lastUpdated: new Date().toISOString().split("T")[0],
      category: body.category,
      accessLevel: body.accessLevel,
    }

    // Tambahkan ke array (dalam implementasi nyata, ini akan disimpan ke database)
    healthData.unshift(newData)

    return NextResponse.json(newData, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
