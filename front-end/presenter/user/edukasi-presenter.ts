"use client";

import { useState, useEffect } from "react";
import {
  ArticleModel,
  type EducationWithDetails,
} from "@/model/user/edukasi-model";

export class EdukasiPresenter {
  private setArticles: (articles: EducationWithDetails[]) => void;
  private setFilteredArticles: (articles: EducationWithDetails[]) => void;
  private setIsLoading: (loading: boolean) => void;
  private setCategories: (categories: string[]) => void;
  private setError: (error: string | null) => void;

  constructor(
    setArticles: (articles: EducationWithDetails[]) => void,
    setFilteredArticles: (articles: EducationWithDetails[]) => void,
    setIsLoading: (loading: boolean) => void,
    setCategories: (categories: string[]) => void,
    setError: (error: string | null) => void
  ) {
    this.setArticles = setArticles;
    this.setFilteredArticles = setFilteredArticles;
    this.setIsLoading = setIsLoading;
    this.setCategories = setCategories;
    this.setError = setError;
  }

  async loadArticles(): Promise<void> {
    this.setIsLoading(true);
    this.setError(null);

    try {
      // perubahan Ihsan: Enhanced error handling dan retry logic
      const articles = await ArticleModel.getAllArticles();

      if (articles.length === 0) {
        this.setError("Belum ada artikel yang tersedia");
      }

      this.setArticles(articles);
      this.setFilteredArticles(articles);

      const categories = await ArticleModel.getAllCategories();
      this.setCategories(categories);
    } catch (error) {
      console.error("Error loading articles:", error);
      this.setError(
        "Gagal memuat artikel. Pastikan koneksi internet dan backend server berjalan."
      );
      this.setArticles([]);
      this.setFilteredArticles([]);
    } finally {
      this.setIsLoading(false);
    }
  }

  // perubahan Ihsan: Improved filtering dengan debounce effect
  filterArticles(
    articles: EducationWithDetails[],
    searchTerm: string,
    activeCategory: string
  ): void {
    let filtered = [...articles];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.excerpt.toLowerCase().includes(term) ||
          article.category.toLowerCase().includes(term)
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory
      );
    }

    this.setFilteredArticles(filtered);
  }

  // perubahan Ihsan: Method untuk handle search dengan backend API
  async searchArticles(searchTerm: string): Promise<void> {
    if (!searchTerm.trim()) {
      return;
    }

    this.setIsLoading(true);
    try {
      const results = await ArticleModel.searchArticles(searchTerm);
      this.setFilteredArticles(results);
    } catch (error) {
      console.error("Error searching articles:", error);
      this.setError("Gagal melakukan pencarian artikel");
    } finally {
      this.setIsLoading(false);
    }
  }

  // perubahan Ihsan: Method untuk filter by category dengan backend API
  async filterByCategory(category: string): Promise<void> {
    this.setIsLoading(true);
    try {
      const results = await ArticleModel.filterByCategory(category);
      this.setFilteredArticles(results);
    } catch (error) {
      console.error("Error filtering by category:", error);
      this.setError("Gagal memfilter artikel berdasarkan kategori");
    } finally {
      this.setIsLoading(false);
    }
  }

  async loadRecommendedArticles(
    recommendationType: "normal" | "stunting" | "severly_stunting"
  ): Promise<void> {
    this.setIsLoading(true);
    this.setError(null);

    try {
      const articles = await ArticleModel.getRecommendedArticles(
        recommendationType
      );

      if (articles.length === 0) {
        this.setError(`Belum ada artikel untuk kategori ${recommendationType}`);
      }

      this.setArticles(articles);
      this.setFilteredArticles(articles);
    } catch (error) {
      console.error("Error loading recommended articles:", error);
      this.setError("Gagal memuat artikel rekomendasi");
      this.setArticles([]);
      this.setFilteredArticles([]);
    } finally {
      this.setIsLoading(false);
    }
  }
}

export function useEdukasiPresenter() {
  const [articles, setArticles] = useState<EducationWithDetails[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<
    EducationWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const presenter = new EdukasiPresenter(
    setArticles,
    setFilteredArticles,
    setIsLoading,
    setCategories,
    setError
  );

  useEffect(() => {
    presenter.loadArticles();
  }, []);

  // perubahan Ihsan: Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      presenter.filterArticles(articles, searchTerm, activeCategory);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeCategory, articles]);

  return {
    articles,
    filteredArticles,
    isLoading,
    categories,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    error,
    presenter,
    loadRecommendedArticles: (
      type: "normal" | "stunting" | "severly_stunting"
    ) => presenter.loadRecommendedArticles(type),
  };
}
