import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import {
  getArticleById,
  getRelatedArticles,
  updateArticleViews,
} from "@/lib/articles-data";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  // Update view count
  updateArticleViews(id);

  const relatedArticles = getRelatedArticles(article.category, article.id, 3);

  // Estimate reading time (200 words per minute)
  const totalWords = article.content_sections.reduce((total, section) => {
    return total + section.paragraph.split(/\s+/).length;
  }, 0);
  const readingTime = Math.ceil(totalWords / 200);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/edukasi">
            <Button
              variant="ghost"
              className="group flex items-center gap-2 px-4 py-2 text-gray-700 bg-white hover:bg-gray-50 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
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

// Generate static params untuk artikel yang tersedia
export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}
