"use client";

import { useState, useEffect } from "react";
import { ArticleModel, type Article } from "@/model/user/edukasi-model";

export class ArticleDetailPresenter {
  private setArticle: (article: Article | null) => void;
  private setRelatedArticles: (articles: Article[]) => void;
  private setReadingTime: (time: number) => void;
  private setIsLoading: (loading: boolean) => void;

  constructor(
    setArticle: (article: Article | null) => void,
    setRelatedArticles: (articles: Article[]) => void,
    setReadingTime: (time: number) => void,
    setIsLoading: (loading: boolean) => void
  ) {
    this.setArticle = setArticle;
    this.setRelatedArticles = setRelatedArticles;
    this.setReadingTime = setReadingTime;
    this.setIsLoading = setIsLoading;
  }

  loadArticle(id: string): void {
    this.setIsLoading(true);

    const article = ArticleModel.getArticleById(id);

    if (article) {
      this.setArticle(article);

      // Update view count
      ArticleModel.updateArticleViews(id);

      // Get related articles
      const related = ArticleModel.getRelatedArticles(
        article.category,
        article.id,
        3
      );
      this.setRelatedArticles(related);

      // Calculate reading time
      const totalWords = article.content_sections.reduce((total, section) => {
        return total + section.paragraph.split(/\s+/).length;
      }, 0);
      const readingTime = Math.ceil(totalWords / 200);
      this.setReadingTime(readingTime);
    } else {
      this.setArticle(null);
    }

    this.setIsLoading(false);
  }
}

export function useArticleDetailPresenter(articleId: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [readingTime, setReadingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const presenter = new ArticleDetailPresenter(
    setArticle,
    setRelatedArticles,
    setReadingTime,
    setIsLoading
  );

  useEffect(() => {
    presenter.loadArticle(articleId);
  }, [articleId]);

  return {
    article,
    relatedArticles,
    readingTime,
    isLoading,
  };
}
