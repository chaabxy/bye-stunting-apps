import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArticleContent } from "./component/article-content";

// Fungsi untuk mendapatkan artikel berdasarkan ID
async function getArticleById(id: number) {
  try {
    // Dalam implementasi nyata, ini akan memanggil API atau database
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/articles/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Fungsi untuk mendapatkan artikel terkait
async function getRelatedArticles(category: string, currentId: number) {
  try {
    // Dalam implementasi nyata, ini akan memanggil API atau database
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/articles?category=${category}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related articles");
    }

    const articles = await response.json();
    // Filter artikel saat ini dan batasi hanya 3 artikel terkait
    return articles
      .filter((article: any) => article.id !== currentId)
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const articleId = Number.parseInt(params.id);

  if (isNaN(articleId)) {
    notFound();
  }

  const article = await getArticleById(articleId);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.category, articleId);

  // Estimate reading time (1 word = 0.2 seconds)
  const wordCount = article.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/edukasi">
            <Button
              variant="ghost"
              className="group flex items-center gap-2 px-4 py-2 text-[#317BC4] dark:text-blue-400 hover:bg-[#D7EBFC] dark:hover:bg-blue-900/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
              <span className="font-semibold tracking-wide">
                Kembali ke Edukasi
              </span>
            </Button>
          </Link>
        </div>

        <ArticleContent
          article={article}
          readingTime={readingTime}
          relatedArticles={relatedArticles}
        />
      </div>
    </div>
  );
}
