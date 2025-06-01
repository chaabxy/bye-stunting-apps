import { NextResponse } from "next/server";
import { getPopularArticles } from "@/lib/articles-data";

// Simulasi data artikel edukasi populer
// Dalam implementasi nyata, ini akan mengambil data dari database
export async function GET() {
  try {
    const popularArticles = await getPopularArticles();
    return NextResponse.json(popularArticles);
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular articles" },
      { status: 500 }
    );
  }
}
