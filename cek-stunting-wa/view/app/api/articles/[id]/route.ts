import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // perubahan Ihsan: Forward request ke backend API untuk single article
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    const response = await fetch(`${backendUrl}/api/articles/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      // perubahan Ihsan: Cache for 1 minute untuk performance
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ isError: true, message: "Artikel tidak ditemukan" }, { status: 404 })
      }
      throw new Error("Failed to fetch article")
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ isError: true, message: "Gagal mengambil artikel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // perubahan Ihsan: Forward update request ke backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    const response = await fetch(`${backendUrl}/api/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update article")
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating article:", error)
    // perubahan Ihsan: Detailed error message untuk admin debugging
    return NextResponse.json({ isError: true, message: "Gagal memperbarui artikel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // perubahan Ihsan: Forward delete request ke backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    const response = await fetch(`${backendUrl}/api/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete article")
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting article:", error)
    // perubahan Ihsan: Consistent error handling untuk delete operations
    return NextResponse.json({ isError: true, message: "Gagal menghapus artikel" }, { status: 500 })
  }
}
