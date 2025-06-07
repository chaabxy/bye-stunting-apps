"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArticleContent } from "@/components/article-content";
import { useArticleDetailPresenter } from "@/presenter/user/article-detail-presenter";

interface ArticleDetailViewProps {
  articleId: string;
}

export default function ArticleDetailView({
  articleId,
}: ArticleDetailViewProps) {
  const { article, relatedArticles, readingTime, isLoading } =
    useArticleDetailPresenter(articleId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-secondary" />
      </div>
    );
  }

  if (!article) {
    notFound();
  }

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
