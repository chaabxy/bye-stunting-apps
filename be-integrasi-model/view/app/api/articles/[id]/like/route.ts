import { type NextRequest, NextResponse } from "next/server";
import { updateArticleLikes } from "@/lib/articles-data";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { increment } = body;

    // Validate increment value
    if (
      typeof increment !== "number" ||
      (increment !== 1 && increment !== -1)
    ) {
      return NextResponse.json(
        { error: "Invalid increment value. Must be 1 or -1." },
        { status: 400 }
      );
    }

    // Update like count
    updateArticleLikes(id, increment);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating article likes:", error);
    return NextResponse.json(
      { error: "Failed to update article likes" },
      { status: 500 }
    );
  }
}
