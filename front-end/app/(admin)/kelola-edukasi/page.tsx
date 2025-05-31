"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  X,
  Edit,
  Trash2,
  Calendar,
  Heart,
  Eye,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentSection {
  id: string;
  h2: string;
  paragraph: string;
  illustration?: {
    type: "image" | "video";
    url: string;
    caption: string;
  };
}

interface Edukasi {
  id: number;
  title: string;
  headerImage: string;
  category: string;
  publishDate: string;
  readingTime: number;
  excerpt: string;
  content: ContentSection[];
  conclusion: {
    h2: string;
    paragraph: string;
  };
  importantPoints: string[];
  tableOfContents: string[];
  likes: number;
  views: number;
  isPopular: boolean;
  createdDate: string;
}

const categories = [
  "Pengetahuan Umum",
  "Nutrisi",
  "Tips Praktis",
  "Resep Makanan",
];

export default function KelolaEdukasi() {
  const [edukasiList, setEdukasiList] = useState<Edukasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEdukasi, setEditingEdukasi] = useState<Edukasi | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    headerImage: "",
    category: "",
    publishDate: new Date().toISOString().split("T")[0],
    readingTime: 5,
    excerpt: "",
    content: [
      { id: "1", h2: "", paragraph: "", illustration: undefined },
    ] as ContentSection[],
    conclusion: { h2: "Kesimpulan", paragraph: "" },
    importantPoints: [""],
  });

  useEffect(() => {
    fetchEdukasi();
  }, []);

  const fetchEdukasi = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/articles");
      if (response.ok) {
        const data = await response.json();
        setEdukasiList(data);
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data edukasi",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching edukasi:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEdukasiList = edukasiList.filter((edukasi) => {
    const matchesSearch =
      edukasi.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edukasi.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || edukasi.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "" ||
      (selectedStatus === "popular" && edukasi.isPopular) ||
      (selectedStatus === "regular" && !edukasi.isPopular);

    const matchesDateFrom =
      dateFrom === "" || new Date(edukasi.publishDate) >= new Date(dateFrom);
    const matchesDateTo =
      dateTo === "" || new Date(edukasi.publishDate) <= new Date(dateTo);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesDateFrom &&
      matchesDateTo
    );
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
  };

  const generateTableOfContents = () => {
    const toc = formData.content
      .filter((section) => section.h2.trim() !== "")
      .map((section) => section.h2);

    if (formData.conclusion.paragraph.trim() !== "") {
      toc.push(formData.conclusion.h2);
    }

    return toc;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.headerImage ||
      !formData.category ||
      !formData.excerpt ||
      formData.content.filter(
        (section) => section.h2.trim() !== "" && section.paragraph.trim() !== ""
      ).length === 0 ||
      !formData.conclusion.paragraph
    ) {
      toast({
        title: "Error",
        description:
          "Mohon lengkapi semua field yang wajib diisi termasuk minimal 1 konten dan kesimpulan",
        variant: "destructive",
      });
      return;
    }

    try {
      const tableOfContents = generateTableOfContents();
      const method = editingEdukasi ? "PUT" : "POST";
      const response = await fetch("/api/articles", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: editingEdukasi?.id,
          tableOfContents,
          content: formData.content.filter(
            (section) =>
              section.h2.trim() !== "" && section.paragraph.trim() !== ""
          ),
          importantPoints: formData.importantPoints.filter(
            (point) => point.trim() !== ""
          ),
        }),
      });

      if (response.ok) {
        toast({
          title: "Berhasil",
          description: `Edukasi berhasil ${
            editingEdukasi ? "diperbarui" : "ditambahkan"
          }`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchEdukasi();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Terjadi kesalahan saat menyimpan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan edukasi",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      headerImage: "",
      category: "",
      publishDate: new Date().toISOString().split("T")[0],
      readingTime: 5,
      excerpt: "",
      content: [{ id: "1", h2: "", paragraph: "", illustration: undefined }],
      conclusion: { h2: "Kesimpulan", paragraph: "" },
      importantPoints: [""],
    });
    setEditingEdukasi(null);
  };

  // Content Section Functions
  const addContentSection = () => {
    const newId = Date.now().toString();
    setFormData((prev) => ({
      ...prev,
      content: [
        ...prev.content,
        { id: newId, h2: "", paragraph: "", illustration: undefined },
      ],
    }));
  };

  const removeContentSection = (id: string) => {
    if (formData.content.length > 1) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content.filter((section) => section.id !== id),
      }));
    }
  };

  const updateContentSection = (
    id: string,
    field: keyof ContentSection,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addIllustrationToContent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === id
          ? {
              ...section,
              illustration: { type: "image", url: "", caption: "" },
            }
          : section
      ),
    }));
  };

  const removeIllustrationFromContent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.map((section) =>
        section.id === id ? { ...section, illustration: undefined } : section
      ),
    }));
  };

  // Important Points Functions
  const addImportantPoint = () => {
    setFormData((prev) => ({
      ...prev,
      importantPoints: [...prev.importantPoints, ""],
    }));
  };

  const removeImportantPoint = (index: number) => {
    if (formData.importantPoints.length > 1) {
      setFormData((prev) => ({
        ...prev,
        importantPoints: prev.importantPoints.filter((_, i) => i !== index),
      }));
    }
  };

  const updateImportantPoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      importantPoints: prev.importantPoints.map((point, i) =>
        i === index ? value : point
      ),
    }));
  };

  const handleEdit = (edukasi: Edukasi) => {
    setEditingEdukasi(edukasi);
    setFormData({
      title: edukasi.title,
      headerImage: edukasi.headerImage,
      category: edukasi.category,
      publishDate: edukasi.publishDate,
      readingTime: edukasi.readingTime,
      excerpt: edukasi.excerpt,
      content:
        edukasi.content.length > 0
          ? edukasi.content
          : [{ id: "1", h2: "", paragraph: "", illustration: undefined }],
      conclusion: edukasi.conclusion,
      importantPoints:
        edukasi.importantPoints.length > 0 ? edukasi.importantPoints : [""],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus Edukasi ini?")) {
      try {
        const response = await fetch(`/api/articles/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: "Berhasil",
            description: "Edukasi berhasil dihapus",
          });
          fetchEdukasi();
        } else {
          toast({
            title: "Error",
            description: "Gagal menghapus Edukasi",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat menghapus Edukasi",
          variant: "destructive",
        });
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleImageUpload = (field: string, file?: File) => {
    if (file) {
      // Simulasi upload - dalam implementasi nyata akan upload ke server
      const fakeUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
        file.name
      )}`;
      setFormData((prev) => ({ ...prev, [field]: fakeUrl }));
      toast({
        title: "Berhasil",
        description: "Gambar berhasil diunggah",
      });
    }
  };

  return (
    <div className="container mx-auto px-0">
      <div className="bg-foreground from-blue-50 to-indigo-50   rounded-3xl p-6 mb-6 border border-blue-200 ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold text-text ">
              Kelola Edukasi
            </h1>
            <p className="text-muted-foreground max-sm:text-center text-md md:text-lg mt-2">
              Kelola dan analisis konten edukasi stunting
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-secondary hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Edukasi
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-input max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle>
                    {editingEdukasi ? "Edit" : "Tambah"} Edukasi
                  </DialogTitle>
                  <DialogDescription>
                    Form untuk {editingEdukasi ? "mengedit" : "menambah"} data
                    edukasi.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 bg-white p-5">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Judul Edukasi *</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Masukkan judul Edukasi"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headerImage">Gambar Header *</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <div className="text-center">
                              <Upload className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-2">
                                <label
                                  htmlFor="headerImageFile"
                                  className="cursor-pointer"
                                >
                                  <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Drag & drop gambar atau klik untuk memilih
                                  </span>
                                  <input
                                    id="headerImageFile"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleImageUpload(
                                        "headerImage",
                                        e.target.files?.[0]
                                      )
                                    }
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF hingga 10MB
                              </p>
                            </div>
                            {formData.headerImage && (
                              <div className="mt-2">
                                <img
                                  src={
                                    formData.headerImage || "/placeholder.svg"
                                  }
                                  alt="Preview"
                                  className="max-h-32 mx-auto rounded"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 ">
                            <Label htmlFor="publishDate">
                              Tanggal Publikasi *
                            </Label>
                            <Input
                              id="publishDate"
                              type="date"
                              value={formData.publishDate}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  publishDate: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="readingTime">
                              Waktu Baca (menit) *
                            </Label>
                            <Input
                              id="readingTime"
                              type="number"
                              min="1"
                              value={formData.readingTime}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  readingTime:
                                    Number.parseInt(e.target.value) || 5,
                                }))
                              }
                              placeholder="5"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Ringkasan Singkat *</Label>
                          <Textarea
                            id="excerpt"
                            className="bg-input"
                            value={formData.excerpt}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                excerpt: e.target.value,
                              }))
                            }
                            placeholder="Masukkan ringkasan singkat Edukasi yang akan ditampilkan di halaman utama"
                            rows={3}
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Content Sections */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Konten Edukasi</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {formData.content.map((section, index) => (
                          <div
                            key={section.id}
                            className="border rounded-lg p-4 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-xl">
                                Konten {index + 1}
                              </h4>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addIllustrationToContent(section.id)
                                  }
                                  disabled={!!section.illustration}
                                >
                                  <ImageIcon className="h-4 w-4 mr-1" />
                                  Tambah Ilustrasi
                                </Button>
                                {formData.content.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      removeContentSection(section.id)
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Heading (H2) *</Label>
                              <Input
                                value={section.h2}
                                onChange={(e) =>
                                  updateContentSection(
                                    section.id,
                                    "h2",
                                    e.target.value
                                  )
                                }
                                placeholder="Masukkan judul bagian"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Paragraf *</Label>
                              <Textarea
                                className="bg-input"
                                value={section.paragraph}
                                onChange={(e) =>
                                  updateContentSection(
                                    section.id,
                                    "paragraph",
                                    e.target.value
                                  )
                                }
                                placeholder="Masukkan isi paragraf"
                                rows={4}
                                required
                              />
                            </div>

                            {section.illustration && (
                              <div className="border-t pt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-medium">Ilustrasi</h5>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      removeIllustrationFromContent(section.id)
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Tipe Ilustrasi</Label>
                                    <Select
                                      value={section.illustration.type}
                                      onValueChange={(
                                        value: "image" | "video"
                                      ) =>
                                        updateContentSection(
                                          section.id,
                                          "illustration",
                                          {
                                            ...section.illustration!,
                                            type: value,
                                          }
                                        )
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="image">
                                          Gambar
                                        </SelectItem>
                                        <SelectItem value="video">
                                          Video
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>
                                      URL{" "}
                                      {section.illustration.type === "image"
                                        ? "Gambar"
                                        : "Video"}
                                    </Label>
                                    <Input
                                      value={section.illustration.url}
                                      onChange={(e) =>
                                        updateContentSection(
                                          section.id,
                                          "illustration",
                                          {
                                            ...section.illustration!,
                                            url: e.target.value,
                                          }
                                        )
                                      }
                                      placeholder={
                                        section.illustration.type === "image"
                                          ? "https://example.com/image.jpg"
                                          : "https://www.youtube.com/watch?v=..."
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Caption</Label>
                                  <Input
                                    value={section.illustration.caption}
                                    onChange={(e) =>
                                      updateContentSection(
                                        section.id,
                                        "illustration",
                                        {
                                          ...section.illustration!,
                                          caption: e.target.value,
                                        }
                                      )
                                    }
                                    placeholder="Masukkan caption untuk ilustrasi"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={addContentSection}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Konten
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Important Points */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Poin-Poin Penting</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {formData.importantPoints.map((point, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={point}
                              onChange={(e) =>
                                updateImportantPoint(index, e.target.value)
                              }
                              placeholder={`Poin penting ${index + 1}`}
                            />
                            {formData.importantPoints.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeImportantPoint(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImportantPoint}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Poin Penting
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Conclusion */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Kesimpulan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Heading (H2)</Label>
                          <Input
                            value={formData.conclusion.h2}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                conclusion: {
                                  ...prev.conclusion,
                                  h2: e.target.value,
                                },
                              }))
                            }
                            placeholder="Kesimpulan"
                            disabled
                            className="bg-background"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Paragraf Kesimpulan *</Label>
                          <Textarea
                            className="bg-input"
                            value={formData.conclusion.paragraph}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                conclusion: {
                                  ...prev.conclusion,
                                  paragraph: e.target.value,
                                },
                              }))
                            }
                            placeholder="Masukkan kesimpulan Edukasi"
                            rows={4}
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Table of Contents Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Preview Daftar Isi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">
                            Daftar Isi (Otomatis)
                          </h4>
                          <ul className="space-y-1">
                            {generateTableOfContents().map((item, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {index + 1}. {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDialogClose}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        className="bg-secondary hover:bg-[#2A6CB0]"
                      >
                        {editingEdukasi ? "Update" : "Simpan"} Edukasi
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Add statistics cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-secondary font-medium">
                  Total Edukasi
                </p>
                <p className="mt-3 text-2xl font-bold text-secondary">
                  {edukasiList.length}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-green-700 font-medium">
                  Edukasi Populer
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {edukasiList.filter((item) => item.isPopular).length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-amber-700 font-medium">
                  Total Views
                </p>
                <p className="mt-3 text-2xl font-bold text-amber-900">
                  {edukasiList.reduce((total, item) => total + item.views, 0)}
                </p>
              </div>
              <div className="bg-amber-500 p-3 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md text-purple-700 font-medium">
                  Total Likes
                </p>
                <p className="mt-3 text-2xl font-bold text-purple-900">
                  {edukasiList.reduce((total, item) => total + item.likes, 0)}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 shadow-lg border-0 bg-white ">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <Label
                htmlFor="search"
                className=" ml-2 text-md font-medium text-slate-700 "
              >
                Cari Edukasi
              </Label>
              <Input
                id="search"
                placeholder="Cari berdasarkan judul atau ringkasan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Category Filter */}
            <div>
              <Label className="ml-1 text-md font-medium text-slate-700 ">
                Kategori
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue placeholder="Semua Kategori" />
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

            {/* Status Filter */}
            <div>
              <Label className="text-md ml-1 font-medium text-slate-700 ">
                Status
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="popular">Populer</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="rounded-xl text-sm bg-secondary text-white w-full hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                <X className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-foreground ">
        <CardHeader className="bg-input from-slate-50 to-slate-100   border-b border-slate-200 ">
          <CardTitle className="text-xl font-semibold text-slate-900 ">
            Daftar Edukasi
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 m-5">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500 ">Memuat data...</div>
            </div>
          ) : filteredEdukasiList.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500 ">
                {edukasiList.length === 0
                  ? "Belum ada data edukasi"
                  : "Tidak ada Edukasi yang sesuai dengan filter"}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-0 overflow-x-auto mt-3">
              <Table className="bg-input p-5">
                <TableHeader>
                  <TableRow className="bg-slate-50  hover:bg-slate-100 -600">
                    <TableHead className="text-center font-semibold text-text  w-12">
                      No
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Judul
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Kategori
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Tanggal Publikasi
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Likes
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Views
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-semibold text-text ">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEdukasiList.map((edukasi, index) => (
                    <TableRow
                      key={edukasi.id}
                      className="bg-white hover:bg-slate-50 -700 transition-colors"
                    >
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div
                          className="truncate text-slate-900 "
                          title={edukasi.title}
                        >
                          {edukasi.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-800  ">
                          {edukasi.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(edukasi.publishDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          {edukasi.likes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-blue-500" />
                          {edukasi.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        {edukasi.isPopular && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            Populer
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(`/edukasi/${edukasi.id}`, "_blank")
                            }
                            title="Lihat di halaman user"
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(edukasi)}
                            title="Edit Edukasi"
                            className="hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(edukasi.id)}
                            title="Hapus Edukasi"
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
