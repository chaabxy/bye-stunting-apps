"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Film, Users, Activity, Database, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Komponen chart sederhana
const SimpleBarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}

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
      { label: "0-12 bulan", value: 22 },
      { label: "13-24 bulan", value: 28 },
      { label: "25-36 bulan", value: 18 },
      { label: "37-48 bulan", value: 15 },
      { label: "49-60 bulan", value: 12 },
    ],
    stuntingByRegion: [
      { label: "Jawa Barat", value: 27 },
      { label: "Jawa Timur", value: 25 },
      { label: "Nusa Tenggara Timur", value: 38 },
      { label: "Sulawesi Selatan", value: 30 },
      { label: "Papua", value: 40 },
    ],
  })

  useEffect(() => {
    // Simulasi pengambilan data statistik (dalam implementasi nyata, ini akan memanggil API)
    setStats({
      articles: 6,
      videos: 4,
      users: 120,
      predictions: 85,
      healthData: 6,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500 dark:text-gray-400">Selamat datang di panel admin ByeStunting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.articles}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Artikel edukasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Video</CardTitle>
            <Film className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.videos}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Video edukasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pengguna</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total pengguna terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prediksi</CardTitle>
            <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.predictions}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Prediksi stunting dilakukan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Kesehatan</CardTitle>
            <Database className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthData}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">API terintegrasi</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prevalensi Stunting Berdasarkan Usia</CardTitle>
            <CardDescription>Data prevalensi stunting berdasarkan kelompok usia</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData.stuntingByAge} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prevalensi Stunting Berdasarkan Wilayah</CardTitle>
            <CardDescription>Data prevalensi stunting di 5 provinsi tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={chartData.stuntingByRegion} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kelola Konten</CardTitle>
            <CardDescription>Tambah, edit, atau hapus konten edukasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/articles">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <FileText className="mr-2 h-4 w-4" /> Kelola Artikel
              </Button>
            </Link>
            <Link href="/admin/videos">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <Film className="mr-2 h-4 w-4" /> Kelola Video
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Kesehatan</CardTitle>
            <CardDescription>Kelola integrasi API dari Dinas Kesehatan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/health-data">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <Database className="mr-2 h-4 w-4" /> Kelola Data Kesehatan
              </Button>
            </Link>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-sm">Status Integrasi</h4>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Kementerian Kesehatan</span>
                <span className="text-green-600 dark:text-green-400">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Dinas Kesehatan Provinsi</span>
                <span className="text-green-600 dark:text-green-400">Aktif</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">WHO Indonesia</span>
                <span className="text-yellow-600 dark:text-yellow-400">Perlu Update</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            <CardDescription>Aktivitas terbaru di platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2 dark:border-gray-800">
                <p className="text-sm font-medium">Artikel baru ditambahkan</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 jam yang lalu</p>
              </div>
              <div className="border-b pb-2 dark:border-gray-800">
                <p className="text-sm font-medium">Data kesehatan diperbarui</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">3 jam yang lalu</p>
              </div>
              <div className="border-b pb-2 dark:border-gray-800">
                <p className="text-sm font-medium">Video baru diunggah</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 jam yang lalu</p>
              </div>
              <div className="border-b pb-2 dark:border-gray-800">
                <p className="text-sm font-medium">10 pengguna baru mendaftar</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hari yang lalu</p>
              </div>
              <div>
                <p className="text-sm font-medium">25 prediksi stunting dilakukan</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hari yang lalu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
