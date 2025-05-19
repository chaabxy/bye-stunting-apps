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
import { Edit, Trash2, Plus, Search, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipe data untuk artikel
interface Article {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  category: string
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [newArticle, setNewArticle] = useState<Omit<Article, "id" | "date">>({
    title: "",
    excerpt: "",
    content: "",
    image: "/placeholder.svg?height=200&width=400",
    category: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // Fungsi untuk mengambil data artikel dari API
  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      let url = "/api/articles"
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
        throw new Error("Gagal mengambil data artikel")
      }

      const data = await response.json()
      setArticles(data)

      // Ekstrak kategori unik
      const uniqueCategories = Array.from(new Set(data.map((article: Article) => article.category)))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching articles:", error)
      setErrorMessage("Gagal mengambil data artikel")
    } finally {
      setIsLoading(false)
    }
  }

  // Ambil data artikel saat komponen dimuat
  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, searchTerm])

  // Fungsi untuk menambah artikel baru
  const handleAddArticle = async () => {
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArticle),
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan artikel")
      }

      const addedArticle = await response.json()
      setArticles([addedArticle, ...articles])
      setNewArticle({
        title: "",
        excerpt: "",
        content: "",
        image: "/placeholder.svg?height=200&width=400",
        category: "",
      })
      setIsAddDialogOpen(false)
      setSuccessMessage("Artikel berhasil ditambahkan")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error adding article:", error)
      setErrorMessage("Gagal menambahkan artikel")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk mengedit artikel
  const handleEditArticle = async () => {
    if (!currentArticle) return

    try {
      const response = await fetch(`/api/articles/${currentArticle.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentArticle.title,
          excerpt: currentArticle.excerpt,
          content: currentArticle.content,
          image: currentArticle.image,
          category: currentArticle.category,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal memperbarui artikel")
      }

      const updatedArticle = await response.json()
      setArticles(articles.map((article) => (article.id === updatedArticle.id ? updatedArticle : article)))
      setIsEditDialogOpen(false)
      setSuccessMessage("Artikel berhasil diperbarui")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating article:", error)
      setErrorMessage("Gagal memperbarui artikel")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk menghapus artikel
  const handleDeleteArticle = async () => {
    if (!currentArticle) return

    try {
      const response = await fetch(`/api/articles/${currentArticle.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus artikel")
      }

      setArticles(articles.filter((article) => article.id !== currentArticle.id))
      setIsDeleteDialogOpen(false)
      setSuccessMessage("Artikel berhasil dihapus")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting article:", error)
      setErrorMessage("Gagal menghapus artikel")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Artikel</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Artikel Baru</DialogTitle>
              <DialogDescription>Isi form berikut untuk menambahkan artikel baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Artikel</Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="Masukkan judul artikel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  placeholder="Masukkan kategori (mis. Nutrisi, Tips Praktis)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="Masukkan ringkasan artikel (maksimal 200 karakter)"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Konten Artikel</Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  placeholder="Masukkan konten artikel lengkap"
                  rows={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL Gambar</Label>
                <Input
                  id="image"
                  value={newArticle.image}
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                  placeholder="Masukkan URL gambar"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddArticle}>Simpan</Button>
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
            placeholder="Cari artikel..."
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>{article.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentArticle?.id === article.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentArticle(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setCurrentArticle(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Artikel</DialogTitle>
                            <DialogDescription>Edit informasi artikel</DialogDescription>
                          </DialogHeader>
                          {currentArticle && (
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Artikel</Label>
                                <Input
                                  id="edit-title"
                                  value={currentArticle.title}
                                  onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Kategori</Label>
                                <Input
                                  id="edit-category"
                                  value={currentArticle.category}
                                  onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-excerpt">Ringkasan</Label>
                                <Textarea
                                  id="edit-excerpt"
                                  value={currentArticle.excerpt}
                                  onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-content">Konten Artikel</Label>
                                <Textarea
                                  id="edit-content"
                                  value={currentArticle.content}
                                  onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                  rows={8}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-image">URL Gambar</Label>
                                <Input
                                  id="edit-image"
                                  value={currentArticle.image}
                                  onChange={(e) => setCurrentArticle({ ...currentArticle, image: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button onClick={handleEditArticle}>Simpan Perubahan</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentArticle?.id === article.id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open)
                          if (!open) setCurrentArticle(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setCurrentArticle(article)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Hapus Artikel</DialogTitle>
                            <DialogDescription>
                              Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteArticle}>
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
                <TableCell colSpan={4} className="text-center py-4">
                  Tidak ada artikel yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
