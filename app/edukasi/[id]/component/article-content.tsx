"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  List,
} from "lucide-react";

interface ArticleContentProps {
  article: any;
  readingTime: number;
  relatedArticles: any[];
}

export function ArticleContent({
  article,
  readingTime,
  relatedArticles,
}: ArticleContentProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeId, setActiveId] = useState("pengertian-stunting");
  const [mobileTableVisible, setMobileTableVisible] = useState(false);

  const sections = [
    { id: "pengertian-stunting", title: "Pengertian Stunting", number: 1 },
    { id: "penyebab-stunting", title: "Penyebab Stunting", number: 2 },
    { id: "dampak-jangka-panjang", title: "Dampak Jangka Panjang", number: 3 },
    { id: "pencegahan-stunting", title: "Pencegahan Stunting", number: 4 },
    { id: "kesimpulan", title: "Kesimpulan", number: 5 },
  ];

  // Split content into sections for better presentation
  const contentParagraphs = article.content.split("\n\n");
  const firstSection = contentParagraphs.slice(
    0,
    Math.ceil(contentParagraphs.length / 3)
  );
  const secondSection = contentParagraphs.slice(
    Math.ceil(contentParagraphs.length / 3),
    Math.ceil((contentParagraphs.length * 2) / 3)
  );
  const thirdSection = contentParagraphs.slice(
    Math.ceil((contentParagraphs.length * 2) / 3)
  );

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
    console.log("Scrolling to:", sectionId); // Debug log
    const element = document.getElementById(sectionId);

    if (element) {
      console.log("Element found:", element); // Debug log
      const offset = 100;
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });

      // Update active state immediately
      setActiveId(sectionId);

      // Update URL hash
      window.history.pushState(null, "", `#${sectionId}`);

      // Close mobile table of contents if it's open
      setMobileTableVisible(false);
    } else {
      console.log("Element not found:", sectionId); // Debug log
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

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Handle initial hash on page load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && sections.some((section) => section.id === hash)) {
      setTimeout(() => {
        handleScrollToSection(hash);
      }, 100);
    }
  }, []);

  // Table of contents component to reuse
  const TableOfContents = ({ className = "" }: { className?: string }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 ${className}`}
    >
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Daftar Isi
      </h2>
      <ul className="space-y-3">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <button
                onClick={() => {
                  console.log("Button clicked for:", section.id); // Debug log
                  handleScrollToSection(section.id);
                }}
                className={`flex items-center w-full text-left transition-all duration-300 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  isActive
                    ? "text-[#317BC4] dark:text-blue-400 bg-[#D7EBFC] dark:bg-blue-900/30 font-semibold shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#317BC4] dark:hover:text-blue-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#317BC4] text-white shadow-md scale-110"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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
        <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg?height=400&width=800"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <Badge className="mb-4 bg-[#317BC4] hover:bg-[#2A6CB0] dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-full">
                {article.category}
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center text-white/80 text-sm gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{readingTime} menit membaca</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8 ">
            <div className="prose prose-blue max-w-none dark:prose-invert">
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-gray-200 dark:border-gray-700 gap-2 transition-all duration-200 ${
                    liked
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : ""
                  }`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${
                      liked ? "fill-red-500 text-red-500" : "text-red-500"
                    }`}
                  />
                  <span>{liked ? "Disukai" : "Suka"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-gray-200 dark:border-gray-700 gap-2 transition-all duration-200 ${
                    bookmarked
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : ""
                  }`}
                  onClick={() => setBookmarked(!bookmarked)}
                >
                  <Bookmark
                    className={`h-4 w-4 transition-all duration-200 ${
                      bookmarked
                        ? "fill-[#317BC4] text-[#317BC4]"
                        : "text-[#317BC4]"
                    }`}
                  />
                  <span>{bookmarked ? "Tersimpan" : "Simpan"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-200 dark:border-gray-700 gap-2"
                  onClick={() => handleScrollToSection("comments")}
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span>Komentar</span>
                </Button>
              </div>

              <p className="font-medium text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Mobile Table of Contents - Only visible on md and below */}
              <div className="lg:hidden mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <List className="h-5 w-5 text-[#317BC4]" />
                      Daftar Isi
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#317BC4] hover:text-[#2A6CB0] p-1 h-auto"
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
                              className={`flex items-center w-full text-left transition-all duration-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                isActive
                                  ? "text-[#317BC4] dark:text-blue-400 bg-[#D7EBFC] dark:bg-blue-900/30 font-semibold"
                                  : "text-gray-700 dark:text-gray-300 hover:text-[#317BC4] dark:hover:text-blue-400"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold transition-all duration-300 ${
                                  isActive
                                    ? "bg-[#317BC4] text-white shadow-md"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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

              {/* First section with pull quote */}
              <div className="mb-8">
                <div id="pengertian-stunting" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white pt-4">
                    Pengertian Stunting
                  </h2>
                  {firstSection.map((paragraph: string, index: number) => (
                    <p
                      key={`first-${index}`}
                      className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-justify"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="my-8 pl-6 border-l-4 border-[#317BC4] italic text-lg text-gray-700 dark:text-gray-300">
                  Pencegahan stunting harus dimulai sejak 1.000 hari pertama
                  kehidupan, yaitu dari masa kehamilan hingga anak berusia 2
                  tahun.
                </div>
              </div>

              {/* Second section with highlight box */}
              <div className="mb-8">
                <div id="penyebab-stunting" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white pt-4">
                    Penyebab Stunting
                  </h2>
                  {secondSection
                    .slice(0, Math.ceil(secondSection.length / 2))
                    .map((paragraph: string, index: number) => (
                      <p
                        key={`second-a-${index}`}
                        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div id="dampak-jangka-panjang" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white pt-4">
                    Dampak Jangka Panjang
                  </h2>
                  {secondSection
                    .slice(Math.ceil(secondSection.length / 2))
                    .map((paragraph: string, index: number) => (
                      <p
                        key={`second-b-${index}`}
                        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div className="my-8 p-6 bg-[#D7EBFC] dark:bg-blue-900/30 rounded-xl">
                  <h4 className="font-bold text-lg mb-2 text-[#317BC4] dark:text-blue-400">
                    Poin Penting
                  </h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Stunting dapat dicegah dengan asupan gizi yang cukup dan
                      seimbang
                    </li>
                    <li>
                      Pemantauan pertumbuhan anak secara rutin sangat penting
                    </li>
                    <li>
                      ASI eksklusif selama 6 bulan pertama membantu mencegah
                      stunting
                    </li>
                    <li>
                      Imunisasi lengkap melindungi anak dari penyakit yang dapat
                      menghambat pertumbuhan
                    </li>
                  </ul>
                </div>
              </div>

              {/* Third section with image */}
              <div className="mb-8">
                <div id="pencegahan-stunting" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white pt-4">
                    Pencegahan Stunting
                  </h2>
                  <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=400&width=800"
                      alt="Ilustrasi artikel"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3">
                      Ilustrasi: Pertumbuhan anak yang optimal membutuhkan gizi
                      seimbang
                    </div>
                  </div>

                  {thirdSection
                    .slice(0, thirdSection.length - 1)
                    .map((paragraph: string, index: number) => (
                      <p
                        key={`third-${index}`}
                        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div id="kesimpulan" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white pt-4">
                    Kesimpulan
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-justify">
                    {thirdSection[thirdSection.length - 1] ||
                      "Dengan mengenali tanda-tanda stunting sejak dini dan melakukan upaya pencegahan yang tepat, kita dapat membantu anak-anak Indonesia tumbuh dan berkembang secara optimal."}
                  </p>
                </div>
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Bagikan artikel ini:
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 dark:border-gray-700 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleShare("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 dark:border-gray-700 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
                      onClick={() => handleShare("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 dark:border-gray-700 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200"
                      onClick={() => handleShare("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Apakah artikel ini bermanfaat?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-full border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                      liked
                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        : ""
                    }`}
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1 transition-all duration-200 ${
                        liked ? "fill-red-500 text-red-500" : "text-red-500"
                      }`}
                    />
                    <span>{liked ? "Ya, Bermanfaat" : "Ya"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Author Box */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#D7EBFC] dark:border-blue-900">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Author"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Tim Konten ByeStunting
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Tim konten ByeStunting terdiri dari ahli gizi, dokter anak, dan
                spesialis kesehatan yang berdedikasi untuk menyediakan informasi
                terpercaya tentang pencegahan stunting.
              </p>
              <Button className="bg-[#317BC4] hover:bg-[#2A6CB0] text-white rounded-full transition-colors duration-200">
                Lihat Semua Artikel
              </Button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div
          id="comments"
          className="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 md:p-8 scroll-mt-24"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
            Komentar (3)
          </h3>

          <div className="space-y-6">
            {/* Comment Form */}
            <div className="flex gap-4 mb-8">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#317BC4] dark:bg-gray-900 dark:text-white transition-all duration-200"
                  placeholder="Tulis komentar Anda..."
                  rows={3}
                ></textarea>
                <Button className="mt-2 bg-[#317BC4] hover:bg-[#2A6CB0] text-white rounded-full transition-colors duration-200">
                  Kirim Komentar
                </Button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Commenter 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Budi Santoso
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2 jam yang lalu
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  Artikel yang sangat informatif! Saya baru tahu bahwa stunting
                  bisa berdampak jangka panjang pada perkembangan kognitif anak.
                </p>
                <button className="text-xs text-[#317BC4] dark:text-blue-400 font-medium hover:underline transition-all duration-200">
                  Balas
                </button>
              </div>
            </div>

            <div className="flex gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Commenter 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Siti Rahayu
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    1 hari yang lalu
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  Sebagai ibu dengan anak usia 1 tahun, artikel ini sangat
                  membantu. Saya akan lebih memperhatikan asupan gizi anak saya.
                </p>
                <button className="text-xs text-[#317BC4] dark:text-blue-400 font-medium hover:underline transition-all duration-200">
                  Balas
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Commenter 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Ahmad Hidayat
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    3 hari yang lalu
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  Saya bekerja di Puskesmas dan artikel ini sangat bagus untuk
                  dibagikan kepada para ibu di daerah kami. Terima kasih
                  ByeStunting!
                </p>
                <button className="text-xs text-[#317BC4] dark:text-blue-400 font-medium hover:underline transition-all duration-200">
                  Balas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-8">
          {/* Table of Contents - Only visible on lg and above */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Daftar Isi
            </h2>
            <ul className="space-y-3">
              {sections.map((section) => {
                const isActive = section.id === activeId;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        console.log("Button clicked for:", section.id); // Debug log
                        handleScrollToSection(section.id);
                      }}
                      className={`flex items-center w-full text-left transition-all duration-300 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        isActive
                          ? "text-[#317BC4] dark:text-blue-400 bg-[#D7EBFC] dark:bg-blue-900/30 font-semibold shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:text-[#317BC4] dark:hover:text-blue-400"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-[#317BC4] text-white shadow-md scale-110"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
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

          {/* Related Articles */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-[#317BC4] dark:text-blue-400">
              <BookOpen className="h-5 w-5" />
              <h2 className="text-lg font-bold">Artikel Terkait</h2>
            </div>
            <div className="space-y-4">
              {relatedArticles.length > 0 ? (
                relatedArticles.map((relatedArticle: any) => (
                  <Link
                    href={`/edukasi/${relatedArticle.id}`}
                    key={relatedArticle.id}
                    className="block group"
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-0 bg-gray-50 dark:bg-gray-900">
                      <div className="flex">
                        <div className="relative h-24 w-24 flex-shrink-0">
                          <Image
                            src={
                              relatedArticle.image ||
                              "/placeholder.svg?height=160&width=320"
                            }
                            alt={relatedArticle.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <CardContent className="p-4 flex-1">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {relatedArticle.category}
                          </Badge>
                          <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-[#317BC4] dark:group-hover:text-blue-400 transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <ChevronRight className="h-3 w-3 text-[#317BC4] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 mr-1" />
                            <span>Baca artikel</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Tidak ada artikel terkait
                </p>
              )}
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-[#317BC4] to-[#64B5F6] dark:from-blue-800 dark:to-blue-900 rounded-3xl shadow-sm p-6 text-white">
            <h3 className="font-bold text-xl mb-3">Cek Risiko Stunting</h3>
            <p className="text-sm text-blue-100 mb-4">
              Masukkan data anak Anda untuk memeriksa risiko stunting dan
              dapatkan rekomendasi yang sesuai.
            </p>
            <Link href="/cek-stunting">
              <Button className="w-full bg-white hover:bg-gray-100 text-[#317BC4] hover:text-[#2A6CB0] border-0 rounded-full transition-colors duration-200">
                Cek Sekarang
              </Button>
            </Link>
          </div>

          {/* Newsletter Box */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
              Dapatkan Update Terbaru
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Berlangganan newsletter kami untuk mendapatkan artikel dan tips
              terbaru tentang pencegahan stunting.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Email Anda"
                className="rounded-full border-gray-200 dark:border-gray-700 focus:ring-[#317BC4] transition-all duration-200"
              />
              <Button className="w-full bg-[#317BC4] hover:bg-[#2A6CB0] text-white rounded-full transition-colors duration-200">
                Berlangganan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
