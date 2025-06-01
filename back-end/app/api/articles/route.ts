import { type NextRequest, NextResponse } from "next/server";
import { articlesData } from "@/lib/articles-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const exclude = searchParams.get("exclude");
    const limit = searchParams.get("limit");

    let filteredArticles = articlesData;

    // Filter by category
    if (category) {
      filteredArticles = filteredArticles.filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Exclude specific article
    if (exclude) {
      filteredArticles = filteredArticles.filter(
        (article) => article.slug !== exclude
      );
    }

    // Limit results
    if (limit) {
      filteredArticles = filteredArticles.slice(0, Number.parseInt(limit));
    }

    return NextResponse.json(filteredArticles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
