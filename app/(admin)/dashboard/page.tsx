"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Film, Database, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

const StatCard = ({ title, value, description, icon: Icon, color }: any) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
    ></div>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    videos: 0,
    healthData: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch("/api/articles");
        const articles = await articlesRes.json();

        // Fetch videos
        const videosRes = await fetch("/api/videos");
        const videos = await videosRes.json();

        // Fetch health data
        const healthDataRes = await fetch("/api/health-data");
        const healthData = await healthDataRes.json();

        setStats({
          articles: articles.length || 0,
          videos: videos.length || 0,
          healthData: healthData.length || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // Keep default values (0) if error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      label: "Kelola Edukasi",
      href: "/kelola-edukasi",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      description: "Artikel & Video",
    },
    {
      label: "Kelola Data Stunting",
      href: "/kelola-data-stunting",
      icon: Database,
      color: "from-green-500 to-green-600",
      description: "Data Kesehatan",
    },
    {
      label: "Pesan User",
      href: "/kelola-pesan-user",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      description: "Komunikasi",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Dashboard Admin ByeStunting 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Kelola platform pencegahan stunting dengan mudah
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Artikel"
          value={stats.articles}
          description="artikel edukasi tersedia"
          icon={FileText}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Video"
          value={stats.videos}
          description="video edukasi tersedia"
          icon={Film}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Data Kesehatan"
          value={stats.healthData}
          description="data stunting tersimpan"
          icon={Database}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Menu Utama</span>
          </CardTitle>
          <CardDescription>Akses fitur pengelolaan platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <div className="group p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div
                        className={`p-4 rounded-lg bg-gradient-to-br ${action.color}`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                          {action.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Ringkasan Aktivitas</span>
          </CardTitle>
          <CardDescription>
            Aktivitas terkini platform ByeStunting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
                Artikel Terpopuler
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                "Tips Mencegah Stunting"
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                1,234 views
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-1">
                Pesan Baru
              </div>
              <div className="text-sm text-orange-700 dark:text-orange-300">
                5 pesan belum dibaca
              </div>
              <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Hari ini
              </div>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                Data Terbaru
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">
                Pemeriksaan terakhir
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                2 jam lalu
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Statistik Mingguan</span>
          </CardTitle>
          <CardDescription>Aktivitas 7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  3
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Artikel Baru
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="p-3 bg-purple-500 rounded-lg">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  1
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Video Baru
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="p-3 bg-green-500 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  12
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Data Stunting
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
