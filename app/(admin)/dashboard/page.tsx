"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Film, Users, Activity, Database, TrendingUp, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

// Komponen chart yang lebih menarik
const EnhancedBarChart = ({
  data,
  title,
}: { data: { label: string; value: number; color: string }[]; title: string }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, color }: any) => (
  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}
    ></div>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="flex items-center space-x-2">
        <div className={`flex items-center text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{trendValue}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: 0,
    videos: 0,
    users: 0,
    predictions: 0,
    healthData: 0,
  })

  const [chartData, setChartData] = useState({
    stuntingByAge: [
      { label: "0-12 bulan", value: 22, color: "#3b82f6" },
      { label: "13-24 bulan", value: 28, color: "#8b5cf6" },
      { label: "25-36 bulan", value: 18, color: "#06b6d4" },
      { label: "37-48 bulan", value: 15, color: "#10b981" },
      { label: "49-60 bulan", value: 12, color: "#f59e0b" },
    ],
    stuntingByRegion: [
      { label: "Jawa Barat", value: 27, color: "#ef4444" },
      { label: "Jawa Timur", value: 25, color: "#f97316" },
      { label: "Nusa Tenggara Timur", value: 38, color: "#eab308" },
      { label: "Sulawesi Selatan", value: 30, color: "#22c55e" },
      { label: "Papua", value: 40, color: "#a855f7" },
    ],
  })

  useEffect(() => {
    // Animasi loading untuk stats
    const timer = setTimeout(() => {
      setStats({
        articles: 6,
        videos: 4,
        users: 120,
        predictions: 85,
        healthData: 6,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const quickActions = [
    { label: "Tambah Artikel", href: "/articles", icon: FileText, color: "from-blue-500 to-blue-600" },
    { label: "Tambah Video", href: "/videos", icon: Film, color: "from-purple-500 to-purple-600" },
    { label: "Kelola Data", href: "/admin/health-data", icon: Database, color: "from-green-500 to-green-600" },
  ]

  const recentActivities = [
    { action: "Artikel baru ditambahkan", time: "2 jam yang lalu", type: "article" },
    { action: "Data kesehatan diperbarui", time: "3 jam yang lalu", type: "data" },
    { action: "Video baru diunggah", time: "5 jam yang lalu", type: "video" },
    { action: "10 pengguna baru mendaftar", time: "1 hari yang lalu", type: "user" },
    { action: "25 prediksi stunting dilakukan", time: "2 hari yang lalu", type: "prediction" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang, Admin! 👋</h1>
            <p className="text-blue-100 text-lg">Kelola platform ByeStunting dengan mudah dan efisien</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Artikel"
          value={stats.articles}
          description="artikel edukasi"
          icon={FileText}
          trend="up"
          trendValue="+12%"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Video"
          value={stats.videos}
          description="video edukasi"
          icon={Film}
          trend="up"
          trendValue="+8%"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pengguna"
          value={stats.users}
          description="pengguna terdaftar"
          icon={Users}
          trend="up"
          trendValue="+15%"
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Prediksi"
          value={stats.predictions}
          description="prediksi dilakukan"
          icon={Activity}
          trend="up"
          trendValue="+23%"
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Data Kesehatan"
          value={stats.healthData}
          description="API terintegrasi"
          icon={Database}
          trend="up"
          trendValue="+5%"
          color="from-teal-500 to-teal-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Aksi Cepat</span>
          </CardTitle>
          <CardDescription>Akses fitur utama dengan cepat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <div className="group p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {action.label}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola konten</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Statistik Stunting</CardTitle>
            <CardDescription>Data prevalensi stunting berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EnhancedBarChart data={chartData.stuntingByAge} title="Berdasarkan Usia" />
              <EnhancedBarChart data={chartData.stuntingByRegion} title="Berdasarkan Wilayah" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Aktivitas Terbaru</span>
            </CardTitle>
            <CardDescription>Aktivitas terbaru di platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Status Sistem</span>
          </CardTitle>
          <CardDescription>Status integrasi API dan layanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kementerian Kesehatan</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                  Aktif
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dinas Kesehatan Provinsi</span>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                  Aktif
                </span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">WHO Indonesia</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full">
                  Perlu Update
                </span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
