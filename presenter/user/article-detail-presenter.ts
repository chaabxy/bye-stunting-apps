"use client";

import { useState, useEffect } from "react";
import { ArticleModel, type Article } from "@/model/user/edukasi-model";

export function useArticleDetailPresenter(id: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // perubahan Ihsan: Mengambil reading time dari article data untuk konsistensi
  const readingTime = article ? article.reading_time : 0;

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Coba ambil artikel berdasarkan slug terlebih dahulu, jika gagal coba sebagai ID
        let fetchedArticle: Article | null = null;

        // Jika parameter mengandung huruf atau tanda hubung, anggap sebagai slug
        if (isNaN(Number(id)) || id.includes("-")) {
          fetchedArticle = await ArticleModel.getArticleBySlug(id);
        }

        // Jika gagal atau parameter adalah angka, coba sebagai ID
        if (!fetchedArticle) {
          fetchedArticle = await ArticleModel.getArticleById(id);
        }

        if (!fetchedArticle) {
          setError("Artikel tidak ditemukan");
          return;
        }

        setArticle(fetchedArticle);

        // Fetch related articles berdasarkan kategori yang sama
        const related = await ArticleModel.getRelatedArticles(
          fetchedArticle.category,
          fetchedArticle.id,
          3
        );
        setRelatedArticles(related);

        // Update view count otomatis saat artikel dibuka
        await ArticleModel.updateArticleViews(fetchedArticle.id);
      } catch (err) {
        console.error("Error loading article:", err);
        setError(
          "Gagal memuat artikel. Pastikan koneksi internet dan backend server berjalan."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadArticle();
    }
  }, [id]);

  const likeArticle = async () => {
    if (!article) return;

    try {
      await ArticleModel.updateArticleLikes(article.id, 1);
      // perubahan Ihsan: Update local state untuk immediate feedback
      setArticle((prev) =>
        prev
          ? {
              ...prev,
              like_count: prev.like_count + 1,
            }
          : null
      );
    } catch (error) {
      console.error("Error liking article:", error);
    }
  };

  return {
    article,
    relatedArticles,
    isLoading,
    error,
    readingTime,
    likeArticle,
  };
}
