import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Connect to backend API to get like count
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const response = await fetch(
      `${backendUrl}/api/educations/${id}/like-count`
    );

    if (!response.ok) {
      throw new Error("Failed to get like count");
    }

    const result = await response.json();

    return NextResponse.json({
      count: result.data.likeCount,
    });
  } catch (error) {
    console.error("Error getting like count:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
