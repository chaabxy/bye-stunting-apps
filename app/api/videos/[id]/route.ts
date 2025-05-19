import { NextResponse } from "next/server"

// Data video (sama dengan yang di route.ts)
let videos = [
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
  // ... video lainnya
]

// GET /api/videos/[id] - Mendapatkan video berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari video berdasarkan ID
  const video = videos.find((video) => video.id === id)

  if (!video) {
    return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(video)
}

// PUT /api/videos/[id] - Memperbarui video berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.description || !body.videoUrl || !body.category || !body.duration) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Cari indeks video
    const index = videos.findIndex((video) => video.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 })
    }

    // Perbarui video
    const updatedVideo = {
      ...videos[index],
      title: body.title,
      description: body.description,
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || videos[index].thumbnailUrl,
      category: body.category,
      duration: body.duration,
    }

    videos[index] = updatedVideo

    return NextResponse.json(updatedVideo)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}

// DELETE /api/videos/[id] - Menghapus video berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari indeks video
  const index = videos.findIndex((video) => video.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Video tidak ditemukan" }, { status: 404 })
  }

  // Hapus video
  const deletedVideo = videos[index]
  videos = videos.filter((video) => video.id !== id)

  return NextResponse.json(deletedVideo)
}
