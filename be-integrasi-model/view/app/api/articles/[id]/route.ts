import { type NextRequest, NextResponse } from "next/server";
import { ArticleModel } from "@/model/user/edukasi-model";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = ArticleModel.getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "like") {
      ArticleModel.updateArticleLikes(id, 1);
    } else if (action === "unlike") {
      ArticleModel.updateArticleLikes(id, -1);
    }

    const article = ArticleModel.getArticleById(id);
    return NextResponse.json({
      success: true,
      like_count: article?.like_count || 0,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}
