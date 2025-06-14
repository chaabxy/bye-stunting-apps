import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { increment } = await request.json();

    // Get user identifier from cookies or IP
    const userId = cookies().get("user_id")?.value || request.ip || "anonymous";

    // Forward request to backend API for centralized like handling
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/educations/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": userId,
      },
      body: JSON.stringify({ increment }),
    });

    if (!response.ok) {
      throw new Error("Failed to update like count");
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating like count:", error);
    return NextResponse.json(
      { isError: true, message: "Gagal memperbarui like count" },
      { status: 500 }
    );
  }
}
