import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // perubahan caca: Forward request ke backend API educations untuk centralized view tracking
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/educations/${id}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // perubahan caca: Forward user IP untuk tracking
        "X-Forwarded-For": request.ip || "unknown",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update view count");
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating view count:", error);
    // perubahan caca: Consistent error response format dengan backend
    return NextResponse.json(
      { isError: true, message: "Gagal memperbarui view count" },
      { status: 500 }
    );
  }
}
