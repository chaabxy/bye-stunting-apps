"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Loader2,
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export default function Edukasi() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
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
        const uniqueCategories = Array.from(
          new Set(data.map((article: Article) => article.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching articles:", error);
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 px-5">
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                Edukasi <span className="text-primary">Stunting</span>
              </h1>
              <p className="text-base md:text-lg opacity-90 mb-6 text-white">
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
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-300 lg:h-300">
                <Image
                  src="/edukasi.png"
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
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-5 w-5 text-secondary" />
            <Input
              placeholder="Cari artikel..."
              className="pl-10 h-12 rounded-full border-fourbg-foreground dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus-visible:ring-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full md:w-auto overflow-x-auto"
          >
            <TabsList className="flex w-full md:w-auto bg-foreground dark:bg-gray-800 p-1 rounded-full">
              <TabsTrigger
                value="all"
                className="flex-shrink-0 rounded-full text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-secondary dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
              >
                Semua
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="flex-shrink-0 rounded-full text-black dark:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-secondary dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
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
                <Link href={`/edukasi/${featuredArticle.id}`} className="block">
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-56 md:h-auto md:w-1/2">
                        <Image
                          src={
                            featuredArticle.image ||
                            "/placeholder.svg?height=600&width=800"
                          }
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-secondary hover:bg-[#2A6CB0] text-white px-3 py-1 text-sm rounded-full">
                            Artikel Pilihan
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 lg:p-8 md:w-1/2 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <Badge className="bg-foreground text-secondary hover:bg-[#C4E0FA] dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full">
                            {featuredArticle.category}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {featuredArticle.date}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base">
                          {featuredArticle.excerpt}
                        </p>
                        <Button className="w-fit bg-secondary hover:bg-[#2A6CB0] text-white rounded-xl group">
                          Baca Selengkapnya
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
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
                  <Link
                    href={`/edukasi/${article.id}`}
                    className="block h-full group"
                  >
                    <Card className="overflow-hidden h-full border-0 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-lg">
                      <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                        <Image
                          src={
                            article.image ||
                            "/placeholder.svg?height=400&width=600"
                          }
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-secondary hover:bg-[#2A6CB0] dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-3 py-1 rounded-full">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{article.date}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-secondary dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 md:line-clamp-3 mb-4">
                          {article.excerpt}
                        </p>
                        <Button
                          variant="outline"
                          className="rounded-xl w-full bg-secondary border-secondary text-white hover:bg-foreground dark:border-blue-400 dark:text-blue-400 dark:hover:bg-foreground group-hover:bg-foreground group-hover:text-primary transition-colors"
                        >
                          Baca Selengkapnya
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground dark:bg-blue-900 mb-4">
              <Search className="h-8 w-8 text-secondary dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Tidak ada artikel yang ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
