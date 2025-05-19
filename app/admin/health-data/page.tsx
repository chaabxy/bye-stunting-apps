"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Search, Loader2, LinkIcon, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Tipe data untuk data kesehatan
interface HealthData {
  id: number
  title: string
  source: string
  description: string
  url: string
  lastUpdated: string
  category: string
  accessLevel: string
}

export default function AdminHealthData() {
  const [healthData, setHealthData] = useState<HealthData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentData, setCurrentData] = useState<HealthData | null>(null)
  const [newData, setNewData] = useState<Omit<HealthData, "id" | "lastUpdated">>({
    title: "",
    source: "",
    description: "",
    url: "",
    category: "",
    accessLevel: "public",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // Fungsi untuk mengambil data kesehatan dari API
  const fetchHealthData = async () => {
    setIsLoading(true)
    try {
      let url = "/api/health-data"
      const queryParams = []

      if (selectedCategory !== "all") {
        queryParams.push(`category=${encodeURIComponent(selectedCategory)}`)
      }

      if (searchTerm) {
        queryParams.push(`search=${encodeURIComponent(searchTerm)}`)
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Gagal mengambil data kesehatan")
      }

      const data = await response.json()
      setHealthData(data)

      // Ekstrak kategori unik
      const uniqueCategories = Array.from(new Set(data.map((item: HealthData) => item.category)))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching health data:", error)
      setErrorMessage("Gagal mengambil data kesehatan")
    } finally {
      setIsLoading(false)
    }
  }

  // Ambil data kesehatan saat komponen dimuat
  useEffect(() => {
    fetchHealthData()
  }, [selectedCategory, searchTerm])

  // Fungsi untuk menambah data kesehatan baru
  const handleAddHealthData = async () => {
    try {
      const response = await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan data kesehatan")
      }

      const addedData = await response.json()
      setHealthData([addedData, ...healthData])
      setNewData({
        title: "",
        source: "",
        description: "",
        url: "",
        category: "",
        accessLevel: "public",
      })
      setIsAddDialogOpen(false)
      setSuccessMessage("Data kesehatan berhasil ditambahkan")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error adding health data:", error)
      setErrorMessage("Gagal menambahkan data kesehatan")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk mengedit data kesehatan
  const handleEditHealthData = async () => {
    if (!currentData) return

    try {
      const response = await fetch(`/api/health-data/${currentData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentData.title,
          source: currentData.source,
          description: currentData.description,
          url: currentData.url,
          category: currentData.category,
          accessLevel: currentData.accessLevel,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal memperbarui data kesehatan")
      }

      const updatedData = await response.json()
      setHealthData(healthData.map((item) => (item.id === updatedData.id ? updatedData : item)))
      setIsEditDialogOpen(false)
      setSuccessMessage("Data kesehatan berhasil diperbarui")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating health data:", error)
      setErrorMessage("Gagal memperbarui data kesehatan")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk menghapus data kesehatan
  const handleDeleteHealthData = async () => {
    if (!currentData) return

    try {
      const response = await fetch(`/api/health-data/${currentData.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus data kesehatan")
      }

      setHealthData(healthData.filter((item) => item.id !== currentData.id))
      setIsDeleteDialogOpen(false)
      setSuccessMessage("Data kesehatan berhasil dihapus")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting health data:", error)
      setErrorMessage("Gagal menghapus data kesehatan")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kelola Data Kesehatan</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kelola integrasi API dan data dari Dinas Kesehatan dan lembaga terkait
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Data Kesehatan Baru</DialogTitle>
              <DialogDescription>Isi form berikut untuk menambahkan data kesehatan baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Data</Label>
                <Input
                  id="title"
                  value={newData.title}
                  onChange={(e) => setNewData({ ...newData, title: e.target.value })}
                  placeholder="Masukkan judul data"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Sumber</Label>
                <Input
                  id="source"
                  value={newData.source}
                  onChange={(e) => setNewData({ ...newData, source: e.target.value })}
                  placeholder="Masukkan sumber data (mis. Kementerian Kesehatan)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={newData.category}
                  onChange={(e) => setNewData({ ...newData, category: e.target.value })}
                  placeholder="Masukkan kategori (mis. Statistik, Panduan)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={newData.description}
                  onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                  placeholder="Masukkan deskripsi data"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL API</Label>
                <Input
                  id="url"
                  value={newData.url}
                  onChange={(e) => setNewData({ ...newData, url: e.target.value })}
                  placeholder="Masukkan URL API"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Level Akses</Label>
                <Select
                  value={newData.accessLevel}
                  onValueChange={(value) => setNewData({ ...newData, accessLevel: value })}
                >
                  <SelectTrigger id="accessLevel">
                    <SelectValue placeholder="Pilih level akses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik</SelectItem>
                    <SelectItem value="restricted">Terbatas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddHealthData}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <AlertTitle>Berhasil</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Cari data kesehatan..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Data Kesehatan</CardTitle>
            <CardDescription>Jumlah total data kesehatan yang terintegrasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{healthData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sumber Data</CardTitle>
            <CardDescription>Jumlah sumber data yang terintegrasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {new Set(healthData.map((item) => item.source)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Sumber</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Level Akses</TableHead>
              <TableHead>Terakhir Diperbarui</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : healthData.length > 0 ? (
              healthData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-600" />
                      {item.title}
                    </div>
                  </TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.accessLevel === "public" ? "secondary" : "outline"}
                      className={item.accessLevel === "restricted" ? "border-amber-500 text-amber-500" : ""}
                    >
                      {item.accessLevel === "public" ? "Publik" : "Terbatas"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Dialog
                        open={isEditDialogOpen && currentData?.id === item.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentData(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setCurrentData(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Data Kesehatan</DialogTitle>
                            <DialogDescription>Edit informasi data kesehatan</DialogDescription>
                          </DialogHeader>
                          {currentData && (
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Data</Label>
                                <Input
                                  id="edit-title"
                                  value={currentData.title}
                                  onChange={(e) => setCurrentData({ ...currentData, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-source">Sumber</Label>
                                <Input
                                  id="edit-source"
                                  value={currentData.source}
                                  onChange={(e) => setCurrentData({ ...currentData, source: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Kategori</Label>
                                <Input
                                  id="edit-category"
                                  value={currentData.category}
                                  onChange={(e) => setCurrentData({ ...currentData, category: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <Textarea
                                  id="edit-description"
                                  value={currentData.description}
                                  onChange={(e) => setCurrentData({ ...currentData, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-url">URL API</Label>
                                <Input
                                  id="edit-url"
                                  value={currentData.url}
                                  onChange={(e) => setCurrentData({ ...currentData, url: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-accessLevel">Level Akses</Label>
                                <Select
                                  value={currentData.accessLevel}
                                  onValueChange={(value) => setCurrentData({ ...currentData, accessLevel: value })}
                                >
                                  <SelectTrigger id="edit-accessLevel">
                                    <SelectValue placeholder="Pilih level akses" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="public">Publik</SelectItem>
                                    <SelectItem value="restricted">Terbatas</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button onClick={handleEditHealthData}>Simpan Perubahan</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentData?.id === item.id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open)
                          if (!open) setCurrentData(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setCurrentData(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Hapus Data Kesehatan</DialogTitle>
                            <DialogDescription>
                              Apakah Anda yakin ingin menghapus data kesehatan ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteHealthData}>
                              Hapus
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Tidak ada data kesehatan yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
