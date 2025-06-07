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

  constructor(
    setArticles: (articles: EducationWithDetails[]) => void,
    setFilteredArticles: (articles: EducationWithDetails[]) => void,
    setIsLoading: (loading: boolean) => void,
    setCategories: (categories: string[]) => void
  ) {
    this.setArticles = setArticles;
    this.setFilteredArticles = setFilteredArticles;
    this.setIsLoading = setIsLoading;
    this.setCategories = setCategories;
  }

  async loadArticles(): Promise<void> {
    this.setIsLoading(true);
    try {
      const articles = await ArticleModel.getAllArticles();
      this.setArticles(articles);
      this.setFilteredArticles(articles);

      const categories = ArticleModel.getAllCategories();
      this.setCategories(categories);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      this.setIsLoading(false);
    }
  }

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
          article.excerpt.toLowerCase().includes(term)
      );
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory
      );
    }

    this.setFilteredArticles(filtered);
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

  const presenter = new EdukasiPresenter(
    setArticles,
    setFilteredArticles,
    setIsLoading,
    setCategories
  );

  useEffect(() => {
    presenter.loadArticles();
  }, []);

  useEffect(() => {
    presenter.filterArticles(articles, searchTerm, activeCategory);
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
  };
}
