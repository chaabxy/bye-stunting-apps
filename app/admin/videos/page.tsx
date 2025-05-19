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
import { Edit, Trash2, Plus, Search, Play, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Tipe data untuk video
interface Video {
  id: number
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  date: string
  category: string
  duration: string
}

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [newVideo, setNewVideo] = useState<Omit<Video, "id" | "date">>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "/placeholder.svg?height=200&width=400",
    category: "",
    duration: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // Fungsi untuk mengambil data video dari API
  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      let url = "/api/videos"
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
        throw new Error("Gagal mengambil data video")
      }

      const data = await response.json()
      setVideos(data)

      // Ekstrak kategori unik
      const uniqueCategories = Array.from(new Set(data.map((video: Video) => video.category)))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching videos:", error)
      setErrorMessage("Gagal mengambil data video")
    } finally {
      setIsLoading(false)
    }
  }

  // Ambil data video saat komponen dimuat
  useEffect(() => {
    fetchVideos()
  }, [selectedCategory, searchTerm])

  // Fungsi untuk menambah video baru
  const handleAddVideo = async () => {
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVideo),
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan video")
      }

      const addedVideo = await response.json()
      setVideos([addedVideo, ...videos])
      setNewVideo({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "/placeholder.svg?height=200&width=400",
        category: "",
        duration: "",
      })
      setIsAddDialogOpen(false)
      setSuccessMessage("Video berhasil ditambahkan")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error adding video:", error)
      setErrorMessage("Gagal menambahkan video")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk mengedit video
  const handleEditVideo = async () => {
    if (!currentVideo) return

    try {
      const response = await fetch(`/api/videos/${currentVideo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentVideo.title,
          description: currentVideo.description,
          videoUrl: currentVideo.videoUrl,
          thumbnailUrl: currentVideo.thumbnailUrl,
          category: currentVideo.category,
          duration: currentVideo.duration,
        }),
      })

      if (!response.ok) {
        throw new Error("Gagal memperbarui video")
      }

      const updatedVideo = await response.json()
      setVideos(videos.map((video) => (video.id === updatedVideo.id ? updatedVideo : video)))
      setIsEditDialogOpen(false)
      setSuccessMessage("Video berhasil diperbarui")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating video:", error)
      setErrorMessage("Gagal memperbarui video")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Fungsi untuk menghapus video
  const handleDeleteVideo = async () => {
    if (!currentVideo) return

    try {
      const response = await fetch(`/api/videos/${currentVideo.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Gagal menghapus video")
      }

      setVideos(videos.filter((video) => video.id !== currentVideo.id))
      setIsDeleteDialogOpen(false)
      setSuccessMessage("Video berhasil dihapus")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error deleting video:", error)
      setErrorMessage("Gagal menghapus video")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Video</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Video Baru</DialogTitle>
              <DialogDescription>Isi form berikut untuk menambahkan video baru</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Video</Label>
                <Input
                  id="title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Masukkan judul video"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                  placeholder="Masukkan kategori (mis. Nutrisi, Tips Praktis)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Masukkan deskripsi video"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">URL Video</Label>
                <Input
                  id="videoUrl"
                  value={newVideo.videoUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                  placeholder="Masukkan URL video (mis. YouTube)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">URL Thumbnail</Label>
                <Input
                  id="thumbnailUrl"
                  value={newVideo.thumbnailUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })}
                  placeholder="Masukkan URL thumbnail"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi</Label>
                <Input
                  id="duration"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                  placeholder="Masukkan durasi video (mis. 10:30)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddVideo}>Simpan</Button>
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
            placeholder="Cari video..."
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
              <TableHead>Durasi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Memuat data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-blue-600" />
                      {video.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{video.category}</Badge>
                  </TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>{video.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentVideo?.id === video.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setCurrentVideo(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setCurrentVideo(video)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Video</DialogTitle>
                            <DialogDescription>Edit informasi video</DialogDescription>
                          </DialogHeader>
                          {currentVideo && (
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Judul Video</Label>
                                <Input
                                  id="edit-title"
                                  value={currentVideo.title}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-category">Kategori</Label>
                                <Input
                                  id="edit-category"
                                  value={currentVideo.category}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, category: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Deskripsi</Label>
                                <Textarea
                                  id="edit-description"
                                  value={currentVideo.description}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-videoUrl">URL Video</Label>
                                <Input
                                  id="edit-videoUrl"
                                  value={currentVideo.videoUrl}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, videoUrl: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-thumbnailUrl">URL Thumbnail</Label>
                                <Input
                                  id="edit-thumbnailUrl"
                                  value={currentVideo.thumbnailUrl}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, thumbnailUrl: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-duration">Durasi</Label>
                                <Input
                                  id="edit-duration"
                                  value={currentVideo.duration}
                                  onChange={(e) => setCurrentVideo({ ...currentVideo, duration: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button onClick={handleEditVideo}>Simpan Perubahan</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen && currentVideo?.id === video.id}
                        onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open)
                          if (!open) setCurrentVideo(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setCurrentVideo(video)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Hapus Video</DialogTitle>
                            <DialogDescription>
                              Apakah Anda yakin ingin menghapus video ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteVideo}>
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
                <TableCell colSpan={5} className="text-center py-4">
                  Tidak ada video yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
