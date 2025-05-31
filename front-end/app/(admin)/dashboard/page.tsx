"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Database, TrendingUp, Plus } from "lucide-react";
import { ProvinceStatsCard } from "@/components/province-stats-card";
import WHOStatisticsCharts  from "@/components/who-statistics-charts";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
}: StatCardProps) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div
      className={`absolute inset-0 bg-input ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
    />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{description}</p>
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
        const [articlesRes, videosRes, healthDataRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/videos"),
          fetch("/api/health-data"),
        ]);

        const [articles, videos, healthData] = await Promise.all([
          articlesRes.json(),
          videosRes.json(),
          healthDataRes.json(),
        ]);

        setStats({
          articles: Array.isArray(articles) ? articles.length : 0,
          videos: Array.isArray(videos) ? videos.length : 0,
          healthData: Array.isArray(healthData) ? healthData.length : 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <div className="bg-secondary from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-2" />
            <div className="h-4 bg-white/20 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
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
      <div className="bg-secondary from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold mb-2">
              Dashboard Admin ByeStunting 👋
            </h1>
            <p className="text-blue-100 max-sm:text-center text-md md:text-lg">
              Kelola platform pencegahan stunting dengan mudah
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Ringkasan Aktivitas */}
      <Card className="bg-input">
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
            {/* Artikel Terpopuler */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-semibold text-blue-600 mb-1">
                Artikel Terpopuler
              </div>
              <div className="text-sm text-blue-700">
                "Tips Mencegah Stunting"
              </div>
              <div className="text-xs text-blue-600 mt-1">1,234 views</div>
            </div>
            {/* Pesan Baru */}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-semibold text-orange-600 mb-1">
                Pesan Baru
              </div>
              <div className="text-sm text-orange-700">
                5 pesan belum dibaca
              </div>
              <div className="text-xs text-orange-600 mt-1">Hari ini</div>
            </div>
            {/* Data Terbaru */}
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-lg font-semibold text-emerald-600 mb-1">
                Data Terbaru
              </div>
              <div className="text-sm text-emerald-700">
                Pemeriksaan terakhir
              </div>
              <div className="text-xs text-emerald-600 mt-1">2 jam lalu</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Province mengambil 1 kolom */}
        <div>
          <ProvinceStatsCard />
        </div>
      </div>
      <Card>
        <CardHeader className="bg-green-50">
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Statistik Data Stunting</span>
          </CardTitle>
          <CardDescription>
            Statistik Seluruh Data Stunting Berdasarkan standar WHO Chart
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-green-50">
          <WHOStatisticsCharts />
        </CardContent>
      </Card>
    </div>
  );
}
