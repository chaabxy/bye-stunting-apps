"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { ArticleCard } from "@/components/article-card";
import { getAllCategories } from "@/lib/articles-data";
import type { EducationWithDetails } from "@/lib/types/education";

export default function Edukasi() {
  const [articles, setArticles] = useState<EducationWithDetails[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<
    EducationWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
        setFilteredArticles(data);

        // Extract unique categories
        const uniqueCategories = getAllCategories();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Fallback to local data if API fails
        import("@/lib/articles-data").then(({ articlesData }) => {
          setArticles(articlesData);
          setFilteredArticles(articlesData);
          setCategories(getAllCategories());
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    // Filter articles based on search term and active category
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

    setFilteredArticles(filtered);
  }, [searchTerm, activeCategory, articles]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Featured article (first article)
  const featuredArticle = filteredArticles[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-secondary to-[#64B5F6] mb-12 shadow-xl">
          <div className="absolute inset-0 bg-blue-600 opacity-10">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="6,6"
                d="M0,0 L100,100 M100,0 L0,100"
              />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center p-6 md:p-12">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 text-white">
                Edukasi <span className="text-primary">Stunting</span>
              </h1>
              <p className="text-xs md:text-md opacity-90 mb-6 text-white">
                Pelajari informasi penting tentang stunting, nutrisi, dan tips
                praktis untuk mendukung pertumbuhan optimal anak Anda.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {articles.length} Artikel
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Diperbarui Berkala
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative max-sm:-mt-10 w-48 h-48 md:w-64 md:h-64 lg:w-300 lg:h-300">
                <Image
                  src="/edukasi.png?height=500&width=500"
                  alt="Edukasi Stunting"
                  width={500}
                  height={500}
                  className="object-contain w-[500px] h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
          {/* Pencarian */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-3 h-5 w-5 text-secondary" />
            <Input
              placeholder="Cari artikel..."
              className="pl-10 h-12 rounded-full border border-foreground bg-white shadow-sm focus-visible:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tab Kategori (Scroll + BG fix) */}
          <div className="w-full overflow-x-auto lg:w-auto p-1 rounded-full">
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
              className="min-w-max"
            >
              <TabsList className="flex gap-2 bg-foreground justify-evenly">
                <TabsTrigger
                  value="all"
                  className="flex-shrink-0 rounded-full text-black data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                >
                  Semua
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="flex-shrink-0 rounded-full text-black data-[state=active]:bg-white data-[state=active]:text-secondary data-[state=active]:shadow-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-secondary" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 md:mb-12"
              >
                <ArticleCard article={featuredArticle} featured={true} />
              </motion.div>
            )}

            {/* Article Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredArticles.slice(1).map((article) => (
                <motion.div key={article.id} variants={item}>
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground mb-4">
              <Search className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Tidak ada artikel yang ditemukan
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
