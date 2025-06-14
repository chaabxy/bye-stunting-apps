import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const userId = cookies().get("user_id")?.value || request.ip || "anonymous";

    // Connect to backend API to check if user has liked this article
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const response = await fetch(
      `${backendUrl}/api/educations/${id}/like-status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check like status");
    }

    const result = await response.json();

    return NextResponse.json({
      hasLiked: result.data.hasLiked,
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json({ hasLiked: false }, { status: 500 });
  }
}
