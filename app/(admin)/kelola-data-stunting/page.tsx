"use client";

import { Plus, Search, Edit, Trash2, Film, Play, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Video = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  date: string;
};

const categories = ["Nutrisi", "Tips Praktis", "Resep Sehat", "Gaya Hidup"];

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<Video, "id" | "date">>({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    duration: "",
    category: "Nutrisi",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      const mockVideos: Video[] = [
        {
          id: "1",
          title: "Manfaat Sarapan Sehat",
          description: "Pelajari mengapa sarapan penting untuk kesehatan Anda.",
          videoUrl: "https://www.youtube.com/watch?v=example1",
          thumbnailUrl: "https://via.placeholder.com/150",
          duration: "5:30",
          category: "Nutrisi",
          date: "2024-01-20",
        },
        {
          id: "2",
          title: "Tips Memulai Gaya Hidup Aktif",
          description:
            "Panduan langkah demi langkah untuk menjadi lebih aktif.",
          videoUrl: "https://www.youtube.com/watch?v=example2",
          thumbnailUrl: "https://via.placeholder.com/150",
          duration: "8:45",
          category: "Tips Praktis",
          date: "2024-01-15",
        },
        {
          id: "3",
          title: "Resep Smoothie Hijau Segar",
          description: "Nikmati smoothie lezat dan sehat dengan resep ini.",
          videoUrl: "https://www.youtube.com/watch?v=example3",
          thumbnailUrl: "https://via.placeholder.com/150",
          duration: "4:12",
          category: "Resep Sehat",
          date: "2024-01-10",
        },
      ];
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddVideo = () => {
    // Simulate adding a new video
    const newId = Math.random().toString(36).substring(7);
    const newVideoWithId: Video = {
      id: newId,
      date: new Date().toISOString().slice(0, 10),
      ...newVideo,
    };
    setVideos([...videos, newVideoWithId]);
    setNewVideo({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      duration: "",
      category: "Nutrisi",
    });
    setIsAddDialogOpen(false);
    setSuccessMessage("Video berhasil ditambahkan!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEditVideo = () => {
    if (!currentVideo) return;

    // Simulate updating the video
    const updatedVideos = videos.map((video) =>
      video.id === currentVideo.id ? currentVideo : video
    );
    setVideos(updatedVideos);
    setIsEditDialogOpen(false);
    setCurrentVideo(null);
    setSuccessMessage("Video berhasil diperbarui!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteVideo = () => {
    if (!currentVideo) return;

    // Simulate deleting the video
    setVideos(videos.filter((video) => video.id !== currentVideo.id));
    setIsDeleteDialogOpen(false);
    setCurrentVideo(null);
    setSuccessMessage("Video berhasil dihapus!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredVideos = videos.filter((video) => {
    const searchTermMatch = video.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch =
      selectedCategory === "all" || video.category === selectedCategory;
    return searchTermMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kelola Video
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan atur konten video edukasi
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" /> Tambah Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Tambah Video Baru
              </DialogTitle>
              <DialogDescription>
                Isi form berikut untuk menambahkan video baru ke platform
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Judul Video
                  </Label>
                  <Input
                    id="title"
                    value={newVideo.title}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, title: e.target.value })
                    }
                    placeholder="Masukkan judul video"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Kategori
                  </Label>
                  <Input
                    id="category"
                    value={newVideo.category}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, category: e.target.value })
                    }
                    placeholder="Masukkan kategori (mis. Nutrisi, Tips Praktis)"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  value={newVideo.description}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, description: e.target.value })
                  }
                  placeholder="Masukkan deskripsi video"
                  rows={3}
                  className="focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-sm font-medium">
                    URL Video
                  </Label>
                  <Input
                    id="videoUrl"
                    value={newVideo.videoUrl}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, videoUrl: e.target.value })
                    }
                    placeholder="Masukkan URL video (mis. YouTube)"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Durasi
                  </Label>
                  <Input
                    id="duration"
                    value={newVideo.duration}
                    onChange={(e) =>
                      setNewVideo({ ...newVideo, duration: e.target.value })
                    }
                    placeholder="Masukkan durasi video (mis. 10:30)"
                    className="focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-sm font-medium">
                  URL Thumbnail
                </Label>
                <Input
                  id="thumbnailUrl"
                  value={newVideo.thumbnailUrl}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })
                  }
                  placeholder="Masukkan URL thumbnail"
                  className="focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleAddVideo}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Simpan Video
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900 shadow-sm">
          <AlertTitle className="text-green-800 dark:text-green-200">
            Berhasil
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="shadow-sm">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filters Section */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari video..."
                className="pl-10 focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-48 focus:ring-2 focus:ring-purple-500">
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
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                <TableHead className="font-semibold">Judul</TableHead>
                <TableHead className="font-semibold">Kategori</TableHead>
                <TableHead className="font-semibold">Durasi</TableHead>
                <TableHead className="font-semibold">Tanggal</TableHead>
                <TableHead className="text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      <span className="text-gray-500 dark:text-gray-400">
                        Memuat data video...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Play className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {video.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                      >
                        {video.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {video.duration}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {video.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Dialog */}
                        <Dialog
                          open={
                            isEditDialogOpen && currentVideo?.id === video.id
                          }
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setCurrentVideo(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentVideo(video)}
                              className="hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 dark:hover:bg-purple-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold">
                                Edit Video
                              </DialogTitle>
                              <DialogDescription>
                                Edit informasi video yang sudah ada
                              </DialogDescription>
                            </DialogHeader>
                            {currentVideo && (
                              <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-title"
                                      className="text-sm font-medium"
                                    >
                                      Judul Video
                                    </Label>
                                    <Input
                                      id="edit-title"
                                      value={currentVideo.title}
                                      onChange={(e) =>
                                        setCurrentVideo({
                                          ...currentVideo,
                                          title: e.target.value,
                                        })
                                      }
                                      className="focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-category"
                                      className="text-sm font-medium"
                                    >
                                      Kategori
                                    </Label>
                                    <Input
                                      id="edit-category"
                                      value={currentVideo.category}
                                      onChange={(e) =>
                                        setCurrentVideo({
                                          ...currentVideo,
                                          category: e.target.value,
                                        })
                                      }
                                      className="focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-description"
                                    className="text-sm font-medium"
                                  >
                                    Deskripsi
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    value={currentVideo.description}
                                    onChange={(e) =>
                                      setCurrentVideo({
                                        ...currentVideo,
                                        description: e.target.value,
                                      })
                                    }
                                    rows={3}
                                    className="focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-videoUrl"
                                      className="text-sm font-medium"
                                    >
                                      URL Video
                                    </Label>
                                    <Input
                                      id="edit-videoUrl"
                                      value={currentVideo.videoUrl}
                                      onChange={(e) =>
                                        setCurrentVideo({
                                          ...currentVideo,
                                          videoUrl: e.target.value,
                                        })
                                      }
                                      className="focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="edit-duration"
                                      className="text-sm font-medium"
                                    >
                                      Durasi
                                    </Label>
                                    <Input
                                      id="edit-duration"
                                      value={currentVideo.duration}
                                      onChange={(e) =>
                                        setCurrentVideo({
                                          ...currentVideo,
                                          duration: e.target.value,
                                        })
                                      }
                                      className="focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-thumbnailUrl"
                                    className="text-sm font-medium"
                                  >
                                    URL Thumbnail
                                  </Label>
                                  <Input
                                    id="edit-thumbnailUrl"
                                    value={currentVideo.thumbnailUrl}
                                    onChange={(e) =>
                                      setCurrentVideo({
                                        ...currentVideo,
                                        thumbnailUrl: e.target.value,
                                      })
                                    }
                                    className="focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter className="gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Batal
                              </Button>
                              <Button
                                onClick={handleEditVideo}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                              >
                                Simpan Perubahan
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <Dialog
                          open={
                            isDeleteDialogOpen && currentVideo?.id === video.id
                          }
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setCurrentVideo(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20"
                              onClick={() => setCurrentVideo(video)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold">
                                Hapus Video
                              </DialogTitle>
                              <DialogDescription>
                                Apakah Anda yakin ingin menghapus video "
                                {video.title}"? Tindakan ini tidak dapat
                                dibatalkan.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Batal
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteVideo}
                              >
                                Hapus Video
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
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Film className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          Tidak ada video yang ditemukan
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Mulai dengan menambahkan video pertama Anda
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
