import { type NextRequest, NextResponse } from "next/server";
import { articlesData } from "@/lib/articles-data";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleIndex = articlesData.findIndex(
      (article) => article.id === params.id
    );

    if (articleIndex === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Increment view count
    articlesData[articleIndex].view_count += 1;

    return NextResponse.json({
      success: true,
      view_count: articlesData[articleIndex].view_count,
    });
  } catch (error) {
    console.error("Error updating view count:", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}
