"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  List,
  User,
  Eye,
} from "lucide-react";
import type { Article } from "@/model/user/edukasi-model";

interface ArticleContentProps {
  article: Article;
  readingTime: number;
  relatedArticles: Article[];
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

  // perubahan Ihsan: Generate sections dari content_sections + conclusion untuk table of contents
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

  // perubahan Ihsan: Check if article is already liked dari localStorage
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/articles/${article.id}/like-status`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.hasLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
        setLiked(false);
      }
    };

    if (article?.id) {
      checkLikeStatus();
    }
  }, [article?.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newLiked = !liked;
    const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

    // Optimistic update untuk immediate feedback
    setLiked(newLiked);
    setLikeCount(newLikeCount);

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

      // Refresh like count from database after successful update
      const likeResponse = await fetch(
        `/api/articles/${article.id}/like-count`
      );
      if (likeResponse.ok) {
        const likeData = await likeResponse.json();
        setLikeCount(likeData.count);
      }
    } catch (error) {
      console.error("Error updating like:", error);
      // Revert optimistic update jika error
      setLiked(liked);
      setLikeCount(likeCount);
    }
  };

  // perubahan Ihsan: Function untuk handle social sharing
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

  // perubahan Ihsan: Function untuk smooth scroll ke section
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

  // perubahan Ihsan: Scroll spy untuk update active section
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
  }, []); // perubahan Ihsan: Removed sections from dependency array untuk avoid infinite re-render

  // perubahan Ihsan: Handle initial hash pada page load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && sections.some((section) => section.id === hash)) {
      setTimeout(() => {
        handleScrollToSection(hash);
      }, 100);
    }
  }, []);

  // perubahan Ihsan: Table of contents component yang reusable
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
                  className={`min-w-[28px] w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
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
              unoptimized
              onError={(e) => {
                console.error(
                  "Header image failed to load:",
                  article.featured_image
                );
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=400&width=800";
              }}
              onLoad={() => {
                console.log(
                  "Header image loaded successfully:",
                  article.featured_image
                );
              }}
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
                  <span>{readingTime} menit membaca</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.author || "Tim ByeStunting"}</span>
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
                            <div className="w-full">
                              <div className="relative w-full h-64 md:h-[28rem] rounded-xl overflow-hidden">
                                <Image
                                  src={
                                    section.illustration.url ||
                                    "/placeholder.svg" ||
                                    "/placeholder.svg"
                                  }
                                  alt={
                                    section.illustration.caption ||
                                    section.heading
                                  }
                                  fill
                                  className="object-cover"
                                  unoptimized
                                  onError={(e) => {
                                    console.error(
                                      "Image failed to load:",
                                      section.illustration.url
                                    );
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      "/placeholder.svg?height=400&width=600";
                                  }}
                                  onLoad={() => {
                                    console.log(
                                      "Image loaded successfully:",
                                      section.illustration.url
                                    );
                                  }}
                                />
                              </div>
                              {section.illustration.caption && (
                                <p className="text-sm text-gray-600 mt-3 text-center italic">
                                  {section.illustration.caption}
                                </p>
                              )}
                            </div>
                          ) : section.illustration.type === "video" ? (
                            <div className="w-full">
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
                                {section.illustration.url.includes(
                                  "youtube.com"
                                ) ||
                                section.illustration.url.includes(
                                  "youtu.be"
                                ) ? (
                                  <iframe
                                    src={
                                      section.illustration.url.includes(
                                        "watch?v="
                                      )
                                        ? section.illustration.url
                                            .replace("watch?v=", "embed/")
                                            .replace(
                                              "youtube.com",
                                              "youtube.com"
                                            )
                                        : section.illustration.url.includes(
                                            "youtu.be"
                                          )
                                        ? section.illustration.url.replace(
                                            "youtu.be/",
                                            "youtube.com/embed/"
                                          )
                                        : section.illustration.url
                                    }
                                    title={
                                      section.illustration.caption ||
                                      section.heading
                                    }
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    loading="lazy"
                                  />
                                ) : (
                                  <iframe
                                    src={section.illustration.url}
                                    title={
                                      section.illustration.caption ||
                                      section.heading
                                    }
                                    className="w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              {section.illustration.caption && (
                                <p className="text-sm text-gray-600 mt-3 text-center italic">
                                  {section.illustration.caption}
                                </p>
                              )}
                            </div>
                          ) : null}
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

            {/* Source */}
            {article.source && (
              <div className="mt-8 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 italic">
                  <span className="font-medium">Sumber:</span> {article.source}
                </p>
              </div>
            )}

            {/* Article Footer */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row md:justify-end md:items-center gap-4">
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
              </div>
            </div>
          </div>
        </article>

        {/* Author Box */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-center lg:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100">
              <Image
                src="/logo.jpg"
                alt="Author"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900 ml-6">
                {article.author?.name ||
                  article.author ||
                  "Tim Konten ByeStunting"}
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
        </div>
      </div>
    </div>
  );
}
