"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { EducationWithDetails } from "@/lib/types/education";

interface ArticleCardProps {
  article: EducationWithDetails;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.like_count);

  // Load like status from localStorage on component mount
  useEffect(() => {
    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    if (likedArticles[article.id]) {
      setLiked(true);
    }
  }, [article.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event propagation

    // Toggle like status
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);

    // Update like count optimistically
    const increment = newLikedStatus ? 1 : -1;
    setLikeCount((prev) => prev + increment);

    // Save like status to localStorage
    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    if (newLikedStatus) {
      likedArticles[article.id] = true;
    } else {
      delete likedArticles[article.id];
    }
    localStorage.setItem("likedArticles", JSON.stringify(likedArticles));

    // Send API request to update like count
    try {
      const response = await fetch(`/api/articles/${article.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ increment }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like count");
      }
    } catch (error) {
      console.error("Error updating like count:", error);
      // Revert changes if API call fails
      setLiked(!newLikedStatus);
      setLikeCount((prev) => prev - increment);
    }
  };

  if (featured) {
    return (
      <Link href={`/edukasi/${article.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-56 md:h-auto md:w-1/2">
              <Image
                src={
                  article.featured_image ||
                  "/placeholder.svg?height=600&width=800"
                }
                alt={article.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-secondary hover:bg-[#2A6CB0] text-white px-3 py-1 text-sm rounded-full">
                  Edukasi Pilihan
                </Badge>
              </div>
            </div>
            <div className="p-5 md:p-6 lg:p-8 md:w-1/2 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-foreground text-secondary hover:bg-[#C4E0FA] px-3 py-1 rounded-full">
                  {article.category}
                </Badge>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(article.published_at)}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-gray-900">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <Button className="w-fit bg-secondary hover:bg-[#2A6CB0] text-white rounded-xl group">
                  Baca Selengkapnya
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-xs md:text-sm">
                      {article.view_count}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-500 text-xs md:text-sm">
                    <Heart className="h-4 w-4 mr-1" />
                    {article.like_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/edukasi/${article.id}`} className="block h-full group">
      <Card className="overflow-hidden h-full border-0 bg-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg flex flex-col">
        <div className="relative h-48 sm:h-60 w-full overflow-hidden">
          <Image
            src={
              article.featured_image || "/placeholder.svg?height=400&width=600"
            }
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-secondary hover:bg-[#2A6CB0] text-white px-3 py-1 rounded-full">
              {article.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2 md:mb-3">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(article.published_at)}</span>
            </div>
            <div className="text-xs md:text-sm flex items-center gap-3">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.view_count}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {article.like_count}
              </div>
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900 line-clamp-2 group-hover:text-secondary transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-3 mb-4">
            {article.excerpt}
          </p>
          <Button
            variant="outline"
            className="rounded-xl w-full bg-secondary border-secondary text-white hover:bg-foreground group-hover:bg-foreground group-hover:text-primary transition-colors mt-auto"
          >
            Baca Selengkapnya
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
