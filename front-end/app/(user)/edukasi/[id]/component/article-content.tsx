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
    <div className={`bg-white -800 rounded-xl shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-gray-900 ">Daftar Isi</h2>
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
                className={`flex items-center w-full text-left transition-all duration-300 p-3 rounded-lg hover:bg-gray-50 -gray-700 ${
                  isActive
                    ? "text-secondary -400 bg-foreground -900/30 font-semibold shadow-sm"
                    : "text-gray-700 -foreground hover:text-secondary -blue-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-secondary text-white shadow-md scale-110"
                      : "bg-gray-100 -700 text-muted-foreground -400"
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
        <article className="bg-white -800 rounded-2xl shadow-sm overflow-hidden">
          {/* Article Header */}
          <div className="relative w-full h-[24rem] sm:h-[28rem] md:h-[32rem] overflow-hidden">
            <Image
              src={article.image || "/placeholder.svg?height=400&width=800"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-5 md:p-8 w-full">
              <Badge className="mb-3 sm:mb-4 bg-secondary hover:bg-[#2A6CB0] text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                {article.category}
              </Badge>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center text-white/80 text-xs sm:text-sm gap-3 sm:gap-4">
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
            <div className="prose prose-blue max-w-none ">
              <p className="font-medium text-lg mb-6 text-gray-700 -foreground leading-relaxed">
                {article.excerpt}
              </p>

              {/* Mobile Table of Contents - Only visible on md and below */}
              <div className="lg:hidden mb-8">
                <div className="bg-white -800 rounded-xl shadow-sm p-4 border border-gray-100 -700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900  flex items-center gap-2">
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
                              className={`flex items-center w-full text-left transition-all duration-300 p-2 rounded-lg hover:bg-gray-50 -gray-700 ${
                                isActive
                                  ? "text-secondary -400 bg-foreground -900/30 font-semibold"
                                  : "text-gray-700 -foreground hover:text-secondary -blue-400"
                              }`}
                            >
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs font-bold transition-all duration-300 ${
                                  isActive
                                    ? "bg-secondary text-white shadow-md"
                                    : "bg-gray-100 -700 text-muted-foreground -400"
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-900  pt-4">
                    Pengertian Stunting
                  </h2>
                  {firstSection.map((paragraph: string, index: number) => (
                    <p
                      key={`first-${index}`}
                      className="text-gray-700 -foreground mb-4 leading-relaxed text-justify"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="my-8 pl-6 border-l-4 border-secondary italic text-lg text-gray-700 -foreground">
                  Pencegahan stunting harus dimulai sejak 1.000 hari pertama
                  kehidupan, yaitu dari masa kehamilan hingga anak berusia 2
                  tahun.
                </div>
              </div>

              {/* Second section with highlight box */}
              <div className="mb-8">
                <div id="penyebab-stunting" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900  pt-4">
                    Penyebab Stunting
                  </h2>
                  {secondSection
                    .slice(0, Math.ceil(secondSection.length / 2))
                    .map((paragraph: string, index: number) => (
                      <p
                        key={`second-a-${index}`}
                        className="text-gray-700 -foreground mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div id="dampak-jangka-panjang" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900  pt-4">
                    Dampak Jangka Panjang
                  </h2>
                  {secondSection
                    .slice(Math.ceil(secondSection.length / 2))
                    .map((paragraph: string, index: number) => (
                      <p
                        key={`second-b-${index}`}
                        className="text-gray-700 -foreground mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div className="my-8 p-6 bg-foreground -900/30 rounded-xl">
                  <h4 className="font-bold text-lg mb-2 text-secondary -400">
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-900  pt-4">
                    Pencegahan Stunting
                  </h2>
                  <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src="/mengenal stunting.jpg?height=400&width=800"
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
                        className="text-gray-700 -foreground mb-4 leading-relaxed text-justify"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>

                <div id="kesimpulan" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900  pt-4">
                    Kesimpulan
                  </h2>
                  <p className="text-gray-700 -foreground mb-4 leading-relaxed text-justify">
                    {thirdSection[thirdSection.length - 1] ||
                      "Dengan mengenali tanda-tanda stunting sejak dini dan melakukan upaya pencegahan yang tepat, kita dapat membantu anak-anak Indonesia tumbuh dan berkembang secara optimal."}
                  </p>
                </div>
              </div>
            </div>

            {/* Article Footer */}
            <div className="mt-10 pt-6 border-t border-gray-100 -700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900  mb-2">
                    Bagikan artikel ini:
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 -700 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      onClick={() => handleShare("facebook")}
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 -700 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
                      onClick={() => handleShare("twitter")}
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-200 -700 bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-200"
                      onClick={() => handleShare("linkedin")}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 -400">
                    Apakah artikel ini bermanfaat?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`justify-end rounded-full border-gray-200 -700 transition-all duration-200 ${
                      liked ? "bg-red-50 text-text  border-red-200 -800" : ""
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
        <div className="mt-8 bg-white -800 rounded-lg shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-forebg-foreground -900">
              <Image
                src="/caca.jpg?height=200&width=200"
                alt="Author"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-gray-900 ">
                Tim Konten ByeStunting
              </h3>
              <p className="text-muted-foreground -foreground mb-4">
                Tim konten ByeStunting terdiri dari ahli gizi, dokter anak, dan
                spesialis kesehatan yang berdedikasi untuk menyediakan informasi
                terpercaya tentang pencegahan stunting.
              </p>
              <Button className="bg-secondary hover:bg-[#2A6CB0] text-white rounded-full transition-colors duration-200">
                Lihat Semua Artikel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-8">
          {/* Table of Contents - Only visible on lg and above */}
          <div className="hidden lg:block bg-white -800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900 ">
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
                      className={`flex items-center w-full text-left transition-all duration-300 p-3 rounded-xl hover:bg-gray-50 -gray-700 ${
                        isActive
                          ? "text-secondary -400 bg-foreground -900/30 font-semibold shadow-sm"
                          : "text-gray-700 -foreground hover:text-secondary -blue-400"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? "bg-secondary text-white shadow-md scale-110"
                            : "bg-gray-100 -700 text-muted-foreground -400"
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

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-secondary to-[#64B5F6] -800 -900 rounded-lg shadow-sm p-6 text-white">
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
          <div className="bg-white -800 rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-900 ">
              Dapatkan Update Terbaru
            </h3>
            <p className="text-sm text-muted-foreground -foreground mb-4">
              Berlangganan newsletter kami untuk mendapatkan artikel dan tips
              terbaru tentang pencegahan stunting.
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Email Anda"
                className="rounded-lg border-gray-200 -700 focus:ring-secondary transition-all duration-200"
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
