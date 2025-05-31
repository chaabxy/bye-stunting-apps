"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  List,
  User,
  Eye,
} from "lucide-react";
import type { EducationWithDetails } from "@/lib/types/education";

interface ArticleContentProps {
  article: EducationWithDetails;
  readingTime: number;
  relatedArticles: EducationWithDetails[];
}

export function ArticleContent({
  article,
  readingTime,
  relatedArticles,
}: ArticleContentProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.like_count);
  const [activeId, setActiveId] = useState("");
  const [mobileTableVisible, setMobileTableVisible] = useState(false);

  // Generate sections from content_sections + conclusion
  const sections = [
    ...article.content_sections.map((section, index) => ({
      id: section.slug,
      title: section.heading,
      number: index + 1,
    })),
    {
      id: "kesimpulan",
      title: article.conclusion.heading,
      number: article.content_sections.length + 1,
    },
  ];

  // Check if article is already liked on component mount
  useEffect(() => {
    try {
      const likedArticlesData = localStorage.getItem("likedArticles");
      let likedArticles: string[] = [];

      if (likedArticlesData) {
        const parsed = JSON.parse(likedArticlesData);
        likedArticles = Array.isArray(parsed) ? parsed : [];
      }

      const isLiked = likedArticles.includes(article.id.toString());
      setLiked(isLiked);
    } catch (error) {
      console.error("Error reading liked articles from localStorage:", error);
      // Reset localStorage if corrupted
      localStorage.setItem("likedArticles", "[]");
      setLiked(false);
    }
  }, [article.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

    // Optimistic update
    setLiked(newLiked);
    setLikeCount(newLikeCount);

    // Update localStorage safely
    try {
      const likedArticlesData = localStorage.getItem("likedArticles");
      let likedArticles: string[] = [];

      if (likedArticlesData) {
        const parsed = JSON.parse(likedArticlesData);
        likedArticles = Array.isArray(parsed) ? parsed : [];
      }

      const articleIdStr = article.id.toString();

      if (newLiked) {
        if (!likedArticles.includes(articleIdStr)) {
          likedArticles.push(articleIdStr);
        }
      } else {
        const index = likedArticles.indexOf(articleIdStr);
        if (index > -1) {
          likedArticles.splice(index, 1);
        }
      }

      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    } catch (error) {
      console.error("Error updating localStorage:", error);
      localStorage.setItem("likedArticles", "[]");
    }

    try {
      const response = await fetch(`/api/articles/${article.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          increment: newLiked ? 1 : -1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert optimistic update on error
      setLiked(liked);
      setLikeCount(likeCount);

      // Revert localStorage safely
      try {
        const likedArticlesData = localStorage.getItem("likedArticles");
        let revertedArticles: string[] = [];

        if (likedArticlesData) {
          const parsed = JSON.parse(likedArticlesData);
          revertedArticles = Array.isArray(parsed) ? parsed : [];
        }

        const articleIdStr = article.id.toString();

        if (liked) {
          if (!revertedArticles.includes(articleIdStr)) {
            revertedArticles.push(articleIdStr);
          }
        } else {
          const index = revertedArticles.indexOf(articleIdStr);
          if (index > -1) {
            revertedArticles.splice(index, 1);
          }
        }

        localStorage.setItem("likedArticles", JSON.stringify(revertedArticles));
      } catch (revertError) {
        console.error("Error reverting localStorage:", revertError);
        localStorage.setItem("likedArticles", "[]");
      }
    }
  };

  // Function to handle social sharing
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  // Function to handle smooth scroll to section
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      setActiveId(sectionId);
      window.history.pushState(null, "", `#${sectionId}`);
      setMobileTableVisible(false);
    }
  };

  // Scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Removed sections from dependency array

  // Handle initial hash on page load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && sections.some((section) => section.id === hash)) {
      setTimeout(() => {
        handleScrollToSection(hash);
      }, 100);
    }
  }, []);

  // Table of contents component
  const TableOfContents = ({ className = "" }: { className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-gray-900">Daftar Isi</h2>
      <ul className="space-y-3">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                onClick={() => handleScrollToSection(section.id)}
                className={`flex items-center w-full text-left transition-all duration-300 p-3 rounded-lg hover:bg-gray-50 ${
                  isActive
                    ? "text-secondary bg-blue-50 font-semibold shadow-sm"
                    : "text-gray-700 hover:text-secondary"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-secondary text-white shadow-md scale-110"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {section.number}
                </div>
                <span className="transition-all duration-300 text-sm font-medium">
                  {section.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="relative w-full h-[18rem] sm:h-[28rem] md:h-[28rem] overflow-hidden">
            <Image
              src={
                article.featured_image ||
                "/placeholder.svg?height=400&width=800" ||
                "/placeholder.svg"
              }
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-5 md:p-8 w-full">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <Badge className="bg-secondary hover:bg-[#2A6CB0] text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                  {article.category}
                </Badge>
                {article.status === "edukasi populer" && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                    ⭐ Populer
                  </Badge>
                )}
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center text-white/80 text-xs sm:text-sm gap-3 sm:gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(article.published_at).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{article.reading_time} menit membaca</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author?.name || "Tim ByeStunting"}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{article.view_count} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            <div className="prose prose-blue max-w-none">
              <p className="font-medium text-lg mb-6 text-gray-700 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile Table of Contents */}
              <div className="lg:hidden mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <List className="h-5 w-5 text-secondary" />
                      Daftar Isi
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-secondary hover:text-[#2A6CB0] p-1 h-auto"
                      onClick={() => setMobileTableVisible(!mobileTableVisible)}
                    >
                      {mobileTableVisible ? "Sembunyikan" : "Tampilkan"}
                    </Button>
                  </div>

                  {mobileTableVisible && (
                    <ul className="space-y-2">
                      {sections.map((section) => {
                        const isActive = section.id === activeId;
                        return (
                          <li key={section.id}>
                            <button
                              onClick={() => handleScrollToSection(section.id)}
                              className={`flex items-center w-full text-left transition-all duration-300 p-2 rounded-lg hover:bg-gray-50 ${
                                isActive
                                  ? "text-secondary bg-blue-50 font-semibold"
                                  : "text-gray-700 hover:text-secondary"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold transition-all duration-300 ${
                                  isActive
                                    ? "bg-secondary text-white shadow-md"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {section.number}
                              </div>
                              <span className="transition-all duration-300 text-sm">
                                {section.title}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Content Sections */}
              {article.content_sections
                .sort((a, b) => a.section_order - b.section_order)
                .map((section, index) => (
                  <div key={section.id} className="mb-8">
                    <div id={section.slug} className="scroll-mt-24">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900 pt-4">
                        {section.heading}
                      </h2>
                      <div className="text-gray-700 mb-4 leading-relaxed text-justify whitespace-pre-line">
                        {section.paragraph}
                      </div>

                      {/* Illustration */}
                      {section.illustration && (
                        <div className="my-6">
                          {section.illustration.type === "image" ? (
                            <div className="relative w-full h-64 md:h-[28rem] rounded-xl overflow-hidden">
                              <Image
                                src={
                                  section.illustration.url || "/placeholder.svg"
                                }
                                alt={
                                  section.illustration.caption ||
                                  section.heading
                                }
                                fill
                                className="object-cover"
                              />
                              {section.illustration.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3">
                                  {section.illustration.caption}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                              <iframe
                                src={section.illustration.url}
                                title={
                                  section.illustration.caption ||
                                  section.heading
                                }
                                className="w-full h-full"
                                allowFullScreen
                              />
                              {section.illustration.caption && (
                                <p className="text-sm text-gray-600 mt-2 text-center">
                                  {section.illustration.caption}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {/* Important Points */}
              {article.important_points &&
                article.important_points.length > 0 && (
                  <div className="my-8 p-6 bg-blue-50 rounded-xl">
                    <h4 className="font-bold text-lg mb-2 text-secondary">
                      Poin Penting
                    </h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {article.important_points
                        .sort((a, b) => a.point_order - b.point_order)
                        .map((point) => (
                          <li key={point.id} className="text-gray-700">
                            {point.content}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              {/* Conclusion */}
              <div className="mb-8">
                <div id="kesimpulan" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 pt-4">
                    {article.conclusion.heading}
                  </h2>
                  <div className="text-gray-700 mb-4 leading-relaxed text-justify whitespace-pre-line">
                    {article.conclusion.paragraph}
                  </div>
                </div>
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Bagikan artikel ini:
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleShare("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
                      onClick={() => handleShare("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200"
                      onClick={() => handleShare("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Apakah artikel ini bermanfaat?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`justify-end rounded-full transition-all duration-200 ${
                      liked
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={handleLike}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 transition-all duration-200 ${
                        liked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    />
                    <span
                      className={
                        liked ? "text-red-600 font-medium" : "text-gray-600"
                      }
                    >
                      {likeCount}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author Box */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
              <Image
                src={
                  article.author?.avatar ||
                  "/placeholder.svg?height=200&width=200&text=Author" ||
                  "/placeholder.svg"
                }
                alt="Author"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {article.author?.name || "Tim Konten ByeStunting"}
              </h3>
              <Link href="/edukasi">
                <Button className="mt-3 bg-secondary hover:bg-[#2A6CB0] text-white rounded-full transition-colors duration-200">
                  Lihat Semua Artikel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-8">
          {/* Table of Contents - Desktop */}
          <TableOfContents className="hidden lg:block" />

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-secondary to-[#64B5F6] rounded-lg shadow-sm p-6 text-white">
            <h3 className="font-bold text-xl mb-3">Cek Risiko Stunting</h3>
            <p className="text-sm text-blue-100 mb-4">
              Masukkan data anak Anda untuk memeriksa risiko stunting dan
              dapatkan rekomendasi yang sesuai.
            </p>
            <Link href="/cek-stunting">
              <Button className="w-full bg-white hover:bg-gray-100 text-secondary hover:text-[#2A6CB0] border-0 rounded-xl transition-colors duration-200">
                Cek Sekarang
              </Button>
            </Link>
          </div>

          {/* Newsletter Box */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900">
              Dapatkan Update Terbaru
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Berlangganan newsletter kami untuk mendapatkan artikel dan tips
              terbaru tentang pencegahan stunting.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Email Anda"
                className="rounded-lg border-gray-200 focus:ring-secondary transition-all duration-200"
              />
              <Button className="w-full bg-secondary hover:bg-[#2A6CB0] text-white rounded-xl transition-colors duration-200">
                Berlangganan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
