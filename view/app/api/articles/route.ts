import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = searchParams.get("limit") || "50"
    const offset = searchParams.get("offset") || "0"
    const admin = searchParams.get("admin") || "false"

    // perubahan Ihsan: Forward request ke backend API dengan query parameters yang sama
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    const queryParams = new URLSearchParams({
      ...(category && { category }),
      limit,
      offset,
      admin,
    })

    const response = await fetch(`${backendUrl}/api/articles?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
      },
      // perubahan Ihsan: Cache for 1 minute untuk performance optimization
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch articles")
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching articles:", error)
    // perubahan Ihsan: Consistent error response format
    return NextResponse.json({ isError: true, message: "Gagal mengambil artikel" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // perubahan Ihsan: Forward create request ke backend API
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    const response = await fetch(`${backendUrl}/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create article")
    }

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating article:", error)
    // perubahan Ihsan: Detailed error message untuk debugging
    return NextResponse.json({ isError: true, message: "Gagal membuat artikel" }, { status: 500 })
  }
}
