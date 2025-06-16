"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useArticleDetailPresenter } from "@/presenter/user/article-detail-presenter";
import { ArticleContent } from "@/components/article-content";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { id } = use(params);
  const {
    article,
    relatedArticles,
    isLoading,
    error,
    readingTime,
    likeArticle,
  } = useArticleDetailPresenter(id);

  // perubahan Ihsan: Enhanced loading state dengan skeleton yang lebih baik
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // perubahan Ihsan: Enhanced error state dengan design yang konsisten
  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <Eye className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Artikel Tidak Ditemukan
              </h1>
              <p className="text-gray-600 mb-6">
                {error ||
                  "Artikel yang Anda cari tidak tersedia atau telah dihapus."}
              </p>
              <Link href="/edukasi">
                <Button className="bg-secondary hover:bg-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Edukasi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/edukasi">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Edukasi
            </Button>
          </Link>
        </motion.div>

        {/* perubahan Ihsan: Menggunakan ArticleContent component yang sudah ada sebelumnya */}
        <ArticleContent
          article={article}
          readingTime={readingTime}
          relatedArticles={relatedArticles}
        />
      </div>
    </div>
  );
}
