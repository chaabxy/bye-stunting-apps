import { NextResponse } from "next/server"

// Data video
const videos = [
  {
    id: 1,
    title: "Mengenal Stunting dan Cara Pencegahannya",
    description: "Video penjelasan tentang stunting, penyebab, dan cara pencegahannya oleh ahli gizi.",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    date: "12 Mei 2025",
    category: "Pengetahuan Dasar",
    duration: "10:25",
  },
  {
    id: 2,
    title: "Resep MPASI untuk Mencegah Stunting",
    description: "Tutorial membuat makanan pendamping ASI yang bergizi untuk mencegah stunting pada bayi.",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    date: "8 Mei 2025",
    category: "Resep",
    duration: "15:40",
  },
  {
    id: 3,
    title: "Perkembangan Anak Usia 0-2 Tahun",
    description: "Penjelasan tentang tahapan perkembangan anak usia 0-2 tahun dan cara stimulasinya.",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    date: "3 Mei 2025",
    category: "Perkembangan Anak",
    duration: "12:15",
  },
  {
    id: 4,
    title: "Pentingnya ASI Eksklusif untuk Mencegah Stunting",
    description: "Penjelasan tentang manfaat ASI eksklusif dan perannya dalam mencegah stunting.",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    date: "28 April 2025",
    category: "Nutrisi",
    duration: "08:30",
  },
]

// GET /api/videos - Mendapatkan semua video
export async function GET(request: Request) {
  // Mendapatkan parameter query
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  let filteredVideos = [...videos]

  // Filter berdasarkan kategori jika ada
  if (category && category !== "all") {
    filteredVideos = filteredVideos.filter((video) => video.category === category)
  }

  // Filter berdasarkan pencarian jika ada
  if (search) {
    const searchLower = search.toLowerCase()
    filteredVideos = filteredVideos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchLower) || video.description.toLowerCase().includes(searchLower),
    )
  }

  return NextResponse.json(filteredVideos)
}

// POST /api/videos - Menambahkan video baru
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.description || !body.videoUrl || !body.category || !body.duration) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Buat video baru
    const newVideo = {
      id: videos.length > 0 ? Math.max(...videos.map((video) => video.id)) + 1 : 1,
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || "/placeholder.svg?height=200&width=400",
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      category: body.category,
      duration: body.duration,
    }

    // Tambahkan ke array (dalam implementasi nyata, ini akan disimpan ke database)
    videos.unshift(newVideo)

    return NextResponse.json(newVideo, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
