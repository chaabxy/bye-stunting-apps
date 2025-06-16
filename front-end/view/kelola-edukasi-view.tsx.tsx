"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Tag,
  FileText,
  User,
  Send,
  Save,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EdukasiPresenter, type EdukasiView } from "../presenter/admin/edukasi-presenter"
import {
  type Edukasi,
  type EdukasiFormData,
  categories,
  type ContentSection,
  recommendedEducationOptions,
} from "../model/admin/edukasi-model"

export default function KelolaEdukasi() {
  // State
  const [edukasiList, setEdukasiList] = useState<Edukasi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEdukasi, setEditingEdukasi] = useState<Edukasi | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Alert Dialog State
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  // PERBAIKAN: Form state dengan default values yang konsisten dan batasan yang lebih ketat
  const [formData, setFormData] = useState<EdukasiFormData>({
    title: "",
    slug: "",
    headerImage: "",
    category: "",
    tags: [],
    source: "",
    readingTime: 5,
    excerpt: "",
    content: [{ id: "1", h2: "", paragraph: "", illustration: undefined }],
    conclusion: { h2: "Kesimpulan", paragraph: "" },
    importantPoints: [""],
    isPublished: false,
    recommendedEducation: "normal",
  })

  // Validation states untuk setiap field
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Tag input state
  const [tagInput, setTagInput] = useState("")
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Simulasi user login
  const currentUser = "Admin User"

  // Initialize presenter
  const presenter = new EdukasiPresenter({
    displayEdukasiList: (list) => setEdukasiList(list),
    displayLoading: (loading) => {
      setIsLoading(loading)
      if (loading) setIsSaving(true)
      else setIsSaving(false)
    },
    displayError: (message) => {
      toast({
        title: "❌ Error",
        description: message,
        variant: "destructive",
        duration: 5000,
      })
      setIsSaving(false)
    },
    displaySuccess: (message) => {
      toast({
        title: "✅ Berhasil",
        description: message,
        variant: "default",
        duration: 4000,
      })
      setIsSaving(false)
    },
    displayValidationErrors: (errors) => {
      toast({
        title: "❌ Validasi Gagal",
        description: `${errors.length} kesalahan ditemukan: ${errors
          .slice(0, 2)
          .join(", ")}${errors.length > 2 ? "..." : ""}`,
        variant: "destructive",
        duration: 6000,
      })
    },
    displayValidationWarnings: (warnings) => {
      toast({
        title: "⚠️ Peringatan",
        description: warnings.join(", "),
        variant: "default",
        duration: 3000,
      })
    },
    closeDialog: () => {
      setIsDialogOpen(false)
      setIsSaving(false)
    },
    resetForm: resetForm,
    showConfirmation: (message) => {
      return new Promise((resolve) => {
        setAlertDialog({
          isOpen: true,
          title: "Konfirmasi",
          description: message,
          onConfirm: () => {
            setAlertDialog((prev) => ({ ...prev, isOpen: false }))
            resolve(true)
          },
        })
      })
    },
  } as EdukasiView)

  // Check if the presenter's uploadImage method is properly configured
  useEffect(() => {
    // This is just a check to ensure the presenter is properly handling image uploads
    if (presenter && typeof presenter.uploadImage === "function") {
      console.log("Image upload handler is available")
    } else {
      console.error("Warning: Image upload handler is not properly configured")
    }
  }, [])

  useEffect(() => {
    presenter.loadEdukasiList()
  }, [])

  // Fungsi untuk menentukan konten populer berdasarkan views
  const determinePopularContent = (edukasiList: Edukasi[]) => {
    if (edukasiList.length === 0) return edukasiList

    // Urutkan berdasarkan views dari yang tertinggi
    const sorted = [...edukasiList].sort((a, b) => b.views - a.views)

    // Ambil 5 teratas
    const top5 = sorted.slice(0, 5)

    // Tandai yang masuk top 5 sebagai populer
    return edukasiList.map((item) => ({
      ...item,
      isPopular: top5.some((topItem) => topItem.id === item.id),
    }))
  }

  // Update useEffect untuk menerapkan logika populer
  useEffect(() => {
    const loadData = async () => {
      await presenter.loadEdukasiList()
      // Setelah data dimuat, tentukan konten populer
      setEdukasiList((prevList) => determinePopularContent(prevList))
    }

    loadData()
  }, [])

  // Juga update saat ada perubahan data
  useEffect(() => {
    if (edukasiList.length > 0) {
      setEdukasiList((prevList) => determinePopularContent(prevList))
    }
  }, [edukasiList.length])

  // PERBAIKAN: Validasi realtime untuk setiap field dengan batasan yang lebih ketat
  const validateField = (fieldName: string, value: any, context?: any): string => {
    return presenter.validateField(fieldName, value, context)
  }

  const updateFieldError = (fieldName: string, value: any, context?: any) => {
    const error = validateField(fieldName, value, context)
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }))
    return error
  }

  // PERBAIKAN: Validasi tags dengan batasan yang lebih ketat
  const validateTags = (tags: string[]): string => {
    if (!Array.isArray(tags) || tags.length === 0) {
      return "Minimal 1 tag wajib diisi"
    }
    if (tags.length > 5) {
      // PERBAIKAN: Maksimal 5 tag
      return "Maksimal 5 tag diperbolehkan"
    }
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      if (!tag || tag.trim().length < 2) {
        return `Tag ${i + 1} minimal 2 karakter`
      }
      if (tag.trim().length > 15) {
        // PERBAIKAN: Maksimal 15 karakter per tag
        return `Tag ${i + 1} maksimal 15 karakter`
      }
    }
    return ""
  }

  const filteredEdukasiList = edukasiList.filter((edukasi) => {
    const lowerSearch = searchTerm.toLowerCase()

    const matchesSearch =
      edukasi.title.toLowerCase().includes(lowerSearch) ||
      edukasi.excerpt.toLowerCase().includes(lowerSearch) ||
      // Tambahkan cek status publish/draft sebagai string
      (lowerSearch === "publish" && edukasi.isPublished) ||
      (lowerSearch === "published" && edukasi.isPublished) ||
      (lowerSearch === "draft" && edukasi.isDraft)

    const matchesCategory =
      selectedCategory === "" || selectedCategory === "all" || edukasi.category === selectedCategory

    const matchesStatus =
      selectedStatus === "" ||
      selectedStatus === "all" ||
      (selectedStatus === "published" && edukasi.isPublished) ||
      (selectedStatus === "draft" && edukasi.isDraft) ||
      (selectedStatus === "popular" && edukasi.isPopular)

    const matchesDateFrom = dateFrom === "" || new Date(edukasi.createdAt) >= new Date(dateFrom)
    const matchesDateTo = dateTo === "" || new Date(edukasi.createdAt) <= new Date(dateTo)

    return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedStatus("")
    setDateFrom("")
    setDateTo("")
  }

  // PERBAIKAN: handleSubmit dengan validasi yang lebih ketat dan error handling yang lebih baik
  const handleSubmit = async (e: React.FormEvent, publishAction: "draft" | "publish") => {
    e.preventDefault()

    console.log("=== FORM SUBMIT VALIDATION ===")

    // PERBAIKAN: Validasi menggunakan presenter dengan pesan error yang lebih jelas
    const validation = presenter.validateFormData(formData)

    if (!validation.isValid) {
      console.error("Validation failed:", validation.errors)

      // Set semua error ke state dengan mapping yang lebih baik
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        // Parse error message untuk menentukan field
        if (error.includes("Judul")) errorMap.title = error
        else if (error.includes("Gambar header")) errorMap.headerImage = error
        else if (error.includes("Kategori")) errorMap.category = error
        else if (error.includes("tag")) errorMap.tags = error
        else if (error.includes("Waktu baca")) errorMap.readingTime = error
        else if (error.includes("Ringkasan")) errorMap.excerpt = error
        else if (error.includes("Kesimpulan")) errorMap["conclusion.paragraph"] = error
        else if (error.includes("Sumber")) errorMap.source = error
        else if (error.includes("Rekomendasi")) errorMap.recommendedEducation = error
        else if (error.includes("Konten")) {
          // Parse content errors
          const match = error.match(/Konten (\d+):/)
          if (match) {
            const index = Number.parseInt(match[1]) - 1
            if (error.includes("Heading")) {
              errorMap[`content.${index}.h2`] = error
            } else if (error.includes("Paragraf")) {
              errorMap[`content.${index}.paragraph`] = error
            }
          }
        } else if (error.includes("Poin penting")) {
          const match = error.match(/Poin penting (\d+)/)
          if (match) {
            const index = Number.parseInt(match[1]) - 1
            errorMap[`importantPoint.${index}`] = error
          }
        }
      })

      setFieldErrors(errorMap)

      toast({
        title: "❌ Validasi Gagal",
        description: `${validation.errors.length} kesalahan ditemukan. Mohon periksa form.`,
        variant: "destructive",
        duration: 6000,
      })
      return
    }

    if (validation.warnings.length > 0) {
      toast({
        title: "⚠️ Peringatan",
        description: validation.warnings.join(", "),
        variant: "default",
        duration: 3000,
      })
    }

    // Lanjutkan dengan save jika validasi berhasil
    const formDataWithStatus = {
      ...formData,
      isPublished: publishAction === "publish",
    }

    setIsSaving(true)
    try {
      await presenter.saveEdukasi(formDataWithStatus, editingEdukasi?.id || null, currentUser)
    } catch (error) {
      setIsSaving(false)
    }
  }

  // PERBAIKAN: Reset form dengan default values yang konsisten
  function resetForm() {
    setFormData({
      title: "",
      slug: "",
      headerImage: "",
      category: "",
      tags: [],
      source: "",
      readingTime: 5,
      excerpt: "",
      content: [{ id: "1", h2: "", paragraph: "", illustration: undefined }],
      conclusion: { h2: "Kesimpulan", paragraph: "" },
      importantPoints: [""],
      isPublished: false,
      recommendedEducation: "normal",
    })
    setEditingEdukasi(null)
    setFieldErrors({})
    setTagInput("")
  }

  // Content Section Functions
  const addContentSection = () => {
    // PERBAIKAN: Batasi maksimal 10 content sections
    if (formData.content.length >= 10) {
      toast({
        title: "❌ Error",
        description: "Maksimal 10 konten section diperbolehkan",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const newSection = presenter.addContentSection(formData.content)
    setFormData((prev) => ({
      ...prev,
      content: newSection,
    }))

    // Tambahkan validasi untuk section baru
    const newIndex = newSection.length - 1
    const newId = newSection[newIndex].id

    // Set error untuk field baru
    setFieldErrors((prev) => ({
      ...prev,
      [`content.${newIndex}.h2`]: "Heading wajib diisi",
      [`content.${newIndex}.paragraph`]: "Paragraf wajib diisi",
    }))
  }

  const removeContentSection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      content: presenter.removeContentSection(prev.content, id),
    }))
  }

  const updateContentSection = (id: string, field: keyof ContentSection, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: presenter.updateContentSection(prev.content, id, field, value),
    }))

    // Update validation
    const sectionIndex = formData.content.findIndex((s) => s.id === id)
    if (field === "h2") {
      updateFieldError(`content.${sectionIndex}.h2`, value)
    } else if (field === "paragraph") {
      updateFieldError(`content.${sectionIndex}.paragraph`, value)
    } else if (field === "illustration" && value && typeof value === "object") {
      if (value.url !== undefined) {
        updateFieldError(`content.${sectionIndex}.illustration.url`, value.url, { type: value.type })
      }
      if (value.caption !== undefined) {
        updateFieldError(`content.${sectionIndex}.illustration.caption`, value.caption)
      }
    }
  }

  const addIllustrationToContent = (id: string) => {
    const updatedContent = presenter.addIllustrationToContent(formData.content, id)
    setFormData((prev) => ({
      ...prev,
      content: updatedContent,
    }))

    // Tambahkan validasi untuk ilustrasi baru
    const sectionIndex = updatedContent.findIndex((s) => s.id === id)
    if (sectionIndex !== -1) {
      setFieldErrors((prev) => ({
        ...prev,
        [`content.${sectionIndex}.illustration.url`]: "URL ilustrasi wajib diisi",
        [`content.${sectionIndex}.illustration.caption`]: "Caption ilustrasi wajib diisi",
      }))
    }
  }

  const removeIllustrationFromContent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      content: presenter.removeIllustrationFromContent(prev.content, id),
    }))
  }

  // Important Points Functions
  const addImportantPoint = () => {
    // PERBAIKAN: Batasi maksimal 8 important points
    if (formData.importantPoints.length >= 8) {
      toast({
        title: "❌ Error",
        description: "Maksimal 8 poin penting diperbolehkan",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const newPoints = presenter.addImportantPoint(formData.importantPoints)
    setFormData((prev) => ({
      ...prev,
      importantPoints: newPoints,
    }))

    // Tambahkan validasi untuk poin baru
    const newIndex = newPoints.length - 1
    setFieldErrors((prev) => ({
      ...prev,
      [`importantPoint.${newIndex}`]: "Poin penting wajib diisi",
    }))
  }

  const removeImportantPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      importantPoints: presenter.removeImportantPoint(prev.importantPoints, index),
    }))
  }

  const updateImportantPoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      importantPoints: presenter.updateImportantPoint(prev.importantPoints, index, value),
    }))

    // Validasi real-time
    updateFieldError(`importantPoint.${index}`, value)
  }

  // PERBAIKAN: Fungsi addTag dengan validasi yang lebih ketat
  const addTag = (tag: string) => {
    if (!tag.trim()) {
      toast({
        title: "❌ Error",
        description: "Tag tidak boleh kosong",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (tag.trim().length < 2) {
      toast({
        title: "❌ Error",
        description: "Tag minimal 2 karakter",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (tag.trim().length > 15) {
      // PERBAIKAN: Maksimal 15 karakter
      toast({
        title: "❌ Error",
        description: "Tag maksimal 15 karakter",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    if (formData.tags.includes(tag.trim())) {
      toast({
        title: "⚠️ Peringatan",
        description: "Tag sudah ada",
        variant: "default",
        duration: 3000,
      })
      return
    }

    if (formData.tags.length >= 5) {
      // PERBAIKAN: Maksimal 5 tag
      toast({
        title: "❌ Error",
        description: "Maksimal 5 tag diperbolehkan",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    const newTags = [...formData.tags, tag.trim()]
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
    updateFieldError("tags", newTags)
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToRemove)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
    updateFieldError("tags", newTags)
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  // Perbaikan: Handle edit dengan mempertahankan semua data termasuk gambar
  const handleEdit = (edukasi: Edukasi) => {
    setEditingEdukasi(edukasi)

    // Ensure all fields have correct default values and preserve image URLs
    setFormData({
      title: edukasi.title || "",
      slug: edukasi.slug || "", // Include slug
      headerImage: edukasi.headerImage || "", // Preserve header image URL
      category: edukasi.category || "",
      tags: Array.isArray(edukasi.tags) ? [...edukasi.tags] : [],
      source: edukasi.source || "",
      readingTime: edukasi.readingTime || 5,
      excerpt: edukasi.excerpt || "",
      content:
        edukasi.content && edukasi.content.length > 0
          ? edukasi.content.map((section) => ({
              ...section,
              // Ensure illustration data is properly preserved
              illustration: section.illustration
                ? {
                    ...section.illustration,
                    url: section.illustration.url || "",
                  }
                : undefined,
            }))
          : [{ id: "1", h2: "", paragraph: "", illustration: undefined }],
      conclusion: edukasi.conclusion || { h2: "Kesimpulan", paragraph: "" },
      importantPoints:
        edukasi.importantPoints && edukasi.importantPoints.length > 0 ? [...edukasi.importantPoints] : [""],
      isPublished: edukasi.isPublished || false,
      recommendedEducation: edukasi.recommendedEducation || "normal", // Tambahkan field baru
    })

    setFieldErrors({})
    setTagInput("")
    setIsDialogOpen(true)
  }

  // Handle delete dengan konfirmasi yang lebih baik
  const handleDelete = async (id: number, title: string) => {
    await presenter.deleteEdukasi(id, title)
  }

  // Handle toggle publish dengan konfirmasi
  const handleTogglePublish = async (id: number, currentStatus: boolean, title: string) => {
    await presenter.togglePublishStatus(id, !currentStatus, title)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  // PERBAIKAN: Handle image upload dengan validasi yang lebih ketat
  const handleImageUpload = async (field: string, file?: File, sectionId?: string) => {
    // If no file is selected, keep the existing image
    if (!file) {
      return
    }

    try {
      // PERBAIKAN: Check file size before upload (max 512KB)
      if (file.size > 512 * 1024) {
        toast({
          title: "❌ Gagal",
          description: "Ukuran file terlalu besar (maksimal 512KB)",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "❌ Gagal",
          description: "File harus berupa gambar (JPG, PNG, WebP)",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // PERBAIKAN: Check supported formats
      const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!supportedFormats.includes(file.type)) {
        toast({
          title: "❌ Gagal",
          description: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP",
          variant: "destructive",
          duration: 3000,
        })
        return
      }

      // Show loading toast
      toast({
        title: "📤 Mengunggah gambar...",
        description: "Mohon tunggu sebentar",
        duration: 2000,
      })

      // Upload image and get base64 string
      const imageUrl = await presenter.uploadImage(file)

      // Validate the returned URL
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("Invalid image URL returned from upload")
      }

      if (sectionId) {
        // For content section illustration
        const currentSection = formData.content.find((c) => c.id === sectionId)
        const currentCaption = currentSection?.illustration?.caption || ""

        updateContentSection(sectionId, "illustration", {
          type: "image" as const,
          url: imageUrl,
          caption: currentCaption,
        })
      } else {
        // For header image
        setFormData((prev) => ({ ...prev, [field]: imageUrl }))
        updateFieldError(field, imageUrl)
      }

      toast({
        title: "✅ Berhasil",
        description: "Gambar berhasil diunggah dan akan disimpan ke database",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "❌ Gagal",
        description: error instanceof Error ? error.message : "Gagal mengunggah gambar. Silakan coba lagi.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Utility function to handle image URLs properly
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg?height=160&width=300"

    // Jika sudah berupa data URL (base64), langsung return
    if (url.startsWith("data:image/")) {
      return url
    }

    // Jika blob URL, gunakan placeholder karena kemungkinan sudah expired
    if (url.startsWith("blob:")) {
      console.warn("Blob URL detected and replaced with placeholder")
      return "/placeholder.svg?height=160&width=300"
    }

    // Untuk URL biasa, tambahkan cache busting
    if (!url.includes("placeholder.svg")) {
      const separator = url.includes("?") ? "&" : "?"
      return `${url}${separator}t=${Date.now()}`
    }

    return url
  }

  // Fixed: Improved table of contents generation
  const generateTableOfContents = () => {
    const toc: string[] = []

    // Add content sections
    formData.content.forEach((section) => {
      if (section.h2 && section.h2.trim() !== "") {
        toc.push(section.h2.trim())
      }
    })

    // Add conclusion if it has content
    if (formData.conclusion && formData.conclusion.paragraph && formData.conclusion.paragraph.trim() !== "") {
      const conclusionTitle =
        formData.conclusion.h2 && formData.conclusion.h2.trim() !== "" ? formData.conclusion.h2.trim() : "Kesimpulan"
      toc.push(conclusionTitle)
    }

    return toc
  }

  // Fungsi untuk preview edukasi - UPDATED to use slug
  const handlePreview = async (edukasi: Edukasi, isDraft: boolean) => {
    try {
      // Gunakan slug jika tersedia, fallback ke ID jika tidak ada slug
      const urlIdentifier = edukasi.slug && edukasi.slug.trim() !== "" ? edukasi.slug : edukasi.id.toString()

      let previewUrl = `/edukasi/${urlIdentifier}`

      if (isDraft) {
        previewUrl += `?preview=true`
      }

      window.open(previewUrl, "_blank")

      toast({
        title: "🔍 Preview",
        description: `Membuka preview ${isDraft ? "draft" : "published"} edukasi`,
        duration: 2000,
      })
    } catch (error) {
      console.error("Error previewing edukasi:", error)

      toast({
        title: "❌ Gagal",
        description: "Gagal membuka preview edukasi",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // Update presenter view untuk menerapkan logika populer setelah save
  const originalDisplayEdukasiList = presenter.view.displayEdukasiList
  presenter.view.displayEdukasiList = (list) => {
    const updatedList = determinePopularContent(list)
    setEdukasiList(updatedList)
  }

  const generateSlugFromTitle = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .substring(0, 50) // PERBAIKAN: Batasi panjang slug
  }

  const validateSlugUniqueness = (slug: string, currentId?: number): boolean => {
    return !edukasiList.some((item) => item.slug === slug && item.id !== currentId)
  }

  return (
    <div className="container mx-auto px-0 bg-input">
      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.isOpen}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-black">{alertDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialog((prev) => ({ ...prev, isOpen: false }))}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={alertDialog.onConfirm}>Ya, Lanjutkan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="bg-foreground from-blue-50 to-indigo-50 rounded-3xl p-6 mb-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold text-text">Kelola Edukasi</h1>
            <p className="text-muted-foreground max-sm:text-center text-md md:text-lg mt-2">
              Kelola dan analisis konten edukasi stunting
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="rounded-xl bg-secondary hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    setEditingEdukasi(null) // reset mode edit
                    resetForm() // kosongkan form
                    setIsDialogOpen(true) // buka dialog
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Edukasi
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-input max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
                onInteractOutside={(e) => e.preventDefault()} // mencegah klik di luar
                onEscapeKeyDown={(e) => e.preventDefault()} // opsional: mencegah tombol ESC
              >
                <DialogHeader className="flex-shrink-0 text-black">
                  <DialogTitle>{editingEdukasi ? "Edit" : "Tambah"} Edukasi</DialogTitle>
                  <DialogDescription>
                    Form untuk {editingEdukasi ? "mengedit" : "menambah"} data edukasi.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 bg-white p-5">
                  <form className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Judul Edukasi (10-80 karakter)</Label>
                          <Input
                            id="title"
                            value={formData.title || ""} // Perbaikan: Pastikan tidak undefined
                            onChange={(e) => {
                              const value = e.target.value
                              // PERBAIKAN: Batasi input maksimal 80 karakter
                              if (value.length <= 80) {
                                setFormData((prev) => ({
                                  ...prev,
                                  title: value,
                                  slug: generateSlugFromTitle(value), // Auto-generate slug
                                }))
                                updateFieldError("title", value)
                              }
                            }}
                            onBlur={(e) => {
                              const error = updateFieldError("title", e.target.value)
                              if (error) {
                                toast({
                                  title: "❌ Error",
                                  description: error,
                                  variant: "destructive",
                                  duration: 3000,
                                })
                              }
                            }}
                            placeholder="Masukkan judul Edukasi"
                            className={fieldErrors.title ? "border-red-500 focus:border-red-500" : ""}
                            maxLength={80}
                          />
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{(formData.title || "").length}/80 karakter</span>
                            {fieldErrors.title && (
                              <div className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>{fieldErrors.title}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="slug">URL Slug (otomatis dari judul, maksimal 50 karakter)</Label>
                          <Input
                            id="slug"
                            value={formData.slug || ""}
                            onChange={(e) => {
                              const value = e.target.value
                              // PERBAIKAN: Batasi input maksimal 50 karakter
                              if (value.length <= 50) {
                                setFormData((prev) => ({
                                  ...prev,
                                  slug: value,
                                }))
                              }
                            }}
                            placeholder="url-slug-otomatis"
                            className="bg-gray-50"
                            maxLength={50}
                          />
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>URL akan menjadi: /edukasi/{formData.slug || "url-slug"}</span>
                            <span>{(formData.slug || "").length}/50 karakter</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="headerImage">Gambar Header (maksimal 512KB)</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            {formData.headerImage ? (
                              <div className="space-y-3">
                                <div className="text-center">
                                  <img
                                    src={
                                      getImageUrl(formData.headerImage) ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt="Header Preview"
                                    className="max-h-40 mx-auto rounded object-cover border"
                                    onError={(e) => {
                                      console.error("Failed to load header image")
                                      e.currentTarget.src = "/placeholder.svg?height=160&width=300"
                                    }}
                                  />
                                  <p className="text-sm text-green-600 mt-2 font-medium">✅ Gambar header sudah ada</p>
                                  <p className="text-xs text-gray-500">
                                    {formData.headerImage.startsWith("data:image/")
                                      ? `Ukuran: ${Math.round((formData.headerImage.length * 3) / 4 / 1024)}KB (Base64)`
                                      : "Gambar dari database"}
                                  </p>
                                </div>
                                <div className="text-center border-t pt-3">
                                  <label htmlFor="headerImageFile" className="cursor-pointer">
                                    <div
                                      className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 border
 border-blue-200 rounded-lg transition-colors"
                                    >
                                      <Upload className="h-4 w-4 mr-2 text-blue-600" />
                                      <span className="text-sm font-medium text-blue-700">
                                        {editingEdukasi ? "Ganti Gambar" : "Ganti Gambar"}
                                      </span>
                                    </div>
                                    <input
                                      id="headerImageFile"
                                      type="file"
                                      className="hidden"
                                      accept="image/jpeg,image/jpg,image/png,image/webp"
                                      onChange={(e) => handleImageUpload("headerImage", e.target.files?.[0])}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-2">
                                  <label htmlFor="headerImageFile" className="cursor-pointer">
                                    <span className="mt-2 block text-sm font-medium text-gray-900">
                                      Klik Untuk Memilih Gambar
                                    </span>
                                    <input
                                      id="headerImageFile"
                                      type="file"
                                      className="hidden"
                                      accept="image/jpeg,image/jpg,image/png,image/webp"
                                      onChange={(e) => handleImageUpload("headerImage", e.target.files?.[0])}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-muted-foreground">JPG, PNG, WebP hingga 512KB</p>
                              </div>
                            )}
                          </div>
                          {fieldErrors.headerImage && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {fieldErrors.headerImage}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Select
                              value={formData.category || ""} // Perbaikan: Pastikan tidak undefined
                              onValueChange={(value) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                                updateFieldError("category", value)
                              }}
                            >
                              <SelectTrigger className={fieldErrors.category ? "border-red-500" : ""}>
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
                            {fieldErrors.category && (
                              <div className="flex items-center gap-1 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {fieldErrors.category}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="readingTime">Waktu Baca (1-30 menit)</Label>
                            <Input
                              id="readingTime"
                              type="number"
                              min="1"
                              max="30"
                              value={formData.readingTime || 5} // Perbaikan: Pastikan tidak undefined
                              onChange={(e) => {
                                const value = Math.min(Number.parseInt(e.target.value) || 5, 30)
                                setFormData((prev) => ({
                                  ...prev,
                                  readingTime: value,
                                }))
                                updateFieldError("readingTime", value)
                              }}
                              placeholder="5"
                              className={fieldErrors.readingTime ? "border-red-500" : ""}
                            />
                            {fieldErrors.readingTime && (
                              <div className="flex items-center gap-1 text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {fieldErrors.readingTime}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recommendedEducation">Rekomendasi Edukasi</Label>
                            <Select
                              value={formData.recommendedEducation || "normal"}
                              onValueChange={(value) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  recommendedEducation: value as any,
                                }))
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih rekomendasi" />
                              </SelectTrigger>
                              <SelectContent>
                                {recommendedEducationOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* PERBAIKAN: Tags Input dengan batasan yang lebih jelas */}
                        <div className="space-y-2">
                          <Label>Tags (1-5 tag, maksimal 15 karakter per tag)</Label>

                          {/* Input + List Tag */}
                          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-background">
                            <Input
                              ref={tagInputRef}
                              value={tagInput || ""}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={handleTagInputKeyPress}
                              placeholder={
                                (formData.tags || []).length === 0 ? "Ketik tag dan tekan Enter" : "Tambah tag..."
                              }
                              className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[120px]"
                              maxLength={15}
                            />
                          </div>

                          {/* Tombol + Daftar Tag */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addTag(tagInput)}
                              disabled={!tagInput?.trim() || formData.tags.length >= 5}
                            >
                              <Tag className="h-4 w-4 mr-1" />
                              Tambah Tag ({formData.tags.length}/5)
                            </Button>

                            {/* Daftar Tag */}
                            <div className="flex flex-wrap gap-2">
                              {(formData.tags || []).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1 px-2 py-1 text-white"
                                >
                                  {tag}
                                  <X
                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                    onClick={() => removeTag(tag)}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Error */}
                          {fieldErrors.tags && (
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                              <AlertCircle className="h-4 w-4" />
                              {fieldErrors.tags}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="source">Sumber (maksimal 100 karakter)</Label>
                          <Input
                            id="source"
                            value={formData.source || ""}
                            onChange={(e) => {
                              const value = e.target.value
                              // PERBAIKAN: Batasi input maksimal 100 karakter
                              if (value.length <= 100) {
                                setFormData((prev) => ({
                                  ...prev,
                                  source: value,
                                }))
                                updateFieldError("source", value)
                              }
                            }}
                            placeholder="Masukkan sumber referensi"
                            className={fieldErrors.source ? "border-red-500" : ""}
                            maxLength={100}
                          />
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{(formData.source || "").length}/100 karakter</span>
                            {fieldErrors.source && (
                              <div className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>{fieldErrors.source}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="excerpt">Ringkasan Singkat (50-300 karakter)</Label>
                          <Textarea
                            id="excerpt"
                            className={`bg-input ${fieldErrors.excerpt ? "border-red-500 focus:border-red-500" : ""}`}
                            value={formData.excerpt || ""} // Perbaikan: Pastikan tidak undefined
                            onChange={(e) => {
                              const value = e.target.value
                              // PERBAIKAN: Batasi input maksimal 300 karakter
                              if (value.length <= 300) {
                                setFormData((prev) => ({
                                  ...prev,
                                  excerpt: value,
                                }))
                                updateFieldError("excerpt", value)
                              }
                            }}
                            onBlur={(e) => {
                              const error = updateFieldError("excerpt", e.target.value)
                              if (error) {
                                toast({
                                  title: "❌ Error",
                                  description: error,
                                  variant: "destructive",
                                  duration: 3000,
                                })
                              }
                            }}
                            placeholder="Masukkan ringkasan singkat Edukasi yang akan ditampilkan di halaman utama"
                            rows={3}
                            maxLength={300}
                          />
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{(formData.excerpt || "").length}/300 karakter</span>
                            {fieldErrors.excerpt && (
                              <div className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>{fieldErrors.excerpt}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Author
                            </Label>
                            <Input value={currentUser} disabled className="bg-gray-100" />
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Tanggal Pembuatan
                            </Label>
                            <Input value={new Date().toLocaleDateString("id-ID")} disabled className="bg-gray-100" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Content Sections - tetap sama seperti sebelumnya */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Konten Edukasi (maksimal 10 section)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(formData.content || []).map((section, index) => (
                          <div key={section.id} className="border rounded-lg p-4 space-y-4">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                              <h4 className="font-semibold text-md md:text-xl">Konten {index + 1}</h4>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addIllustrationToContent(section.id)}
                                  disabled={!!section.illustration}
                                >
                                  <ImageIcon className="h-4 w-4 mr-1" />
                                  Tambah Ilustrasi
                                </Button>
                                {(formData.content || []).length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeContentSection(section.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Heading (H2, 5-60 karakter)</Label>
                              <Input
                                value={section.h2 || ""}
                                onChange={(e) => {
                                  const val = e.target.value
                                  // PERBAIKAN: Batasi input maksimal 60 karakter
                                  if (val.length <= 60) {
                                    updateContentSection(section.id, "h2", val)
                                    updateFieldError(`content.${index}.h2`, val)
                                  }
                                }}
                                onBlur={(e) => {
                                  const error = updateFieldError(`content.${index}.h2`, e.target.value)
                                  if (error) {
                                    toast({
                                      title: "❌ Error",
                                      description: `Konten ${index + 1}: ${error}`,
                                      variant: "destructive",
                                      duration: 3000,
                                    })
                                  }
                                }}
                                placeholder="Masukkan judul bagian"
                                className={
                                  fieldErrors[`content.${index}.h2`] ? "border-red-500 focus:border-red-500" : ""
                                }
                                maxLength={60}
                              />
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{(section.h2 || "").length}/60 karakter</span>
                                {fieldErrors[`content.${index}.h2`] && (
                                  <div className="flex items-center gap-1 text-red-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{fieldErrors[`content.${index}.h2`]}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Paragraf (100-2000 karakter)</Label>
                              <Textarea
                                className={`bg-input ${
                                  fieldErrors[`content.${index}.paragraph`] ? "border-red-500 focus:border-red-500" : ""
                                }`}
                                value={section.paragraph || ""}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // PERBAIKAN: Batasi input maksimal 2000 karakter
                                  if (value.length <= 2000) {
                                    updateContentSection(section.id, "paragraph", value)
                                    updateFieldError(`content.${index}.paragraph`, value)
                                  }
                                }}
                                onBlur={(e) => {
                                  const error = updateFieldError(`content.${index}.paragraph`, e.target.value)
                                  if (error) {
                                    toast({
                                      title: "❌ Error",
                                      description: `Konten ${index + 1}: ${error}`,
                                      variant: "destructive",
                                      duration: 3000,
                                    })
                                  }
                                }}
                                placeholder="Masukkan isi paragraf"
                                rows={4}
                                maxLength={2000}
                              />
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{(section.paragraph || "").length}/2000 karakter</span>
                                {fieldErrors[`content.${index}.paragraph`] && (
                                  <div className="flex items-center gap-1 text-red-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>{fieldErrors[`content.${index}.paragraph`]}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Illustration section tetap sama */}
                            {section.illustration && (
                              <div className="border-t pt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="font-medium">Ilustrasi</h5>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeIllustrationFromContent(section.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Tipe Ilustrasi</Label>
                                    <Select
                                      value={section.illustration.type || "image"} // Perbaikan: Pastikan tidak undefined
                                      onValueChange={(value: "image" | "video") =>
                                        updateContentSection(section.id, "illustration", {
                                          ...section.illustration!,
                                          type: value,
                                          url: value === "image" ? "" : section.illustration!.url,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="image">Gambar</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {section.illustration.type === "image" ? (
                                    <div className="space-y-2">
                                      <Label>Upload Gambar (maksimal 512KB)</Label>
                                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                        {section.illustration.url ? (
                                          <div className="space-y-3">
                                            <div className="text-center">
                                              <img
                                                src={
                                                  section.illustration.url
                                                    ? getImageUrl(section.illustration.url)
                                                    : "/placeholder.svg?height=128&width=200"
                                                }
                                                alt="Illustration Preview"
                                                className="max-h-32 mx-auto rounded object-cover border"
                                                onError={(e) => {
                                                  console.error(
                                                    "Failed to load illustration image:",
                                                    section.illustration.url,
                                                  )
                                                  e.currentTarget.src = "/placeholder.svg?height=128&width=200"
                                                  // Keep the original URL in the illustration data to prevent data loss
                                                }}
                                              />
                                              <p className="text-sm text-green-600 mt-2 font-medium">
                                                ✅ Ilustrasi sudah ada
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                Pilih file baru untuk mengganti ilustrasi
                                              </p>
                                            </div>
                                            <div className="text-center border-t pt-3">
                                              <label htmlFor={`illustration-${section.id}`} className="cursor-pointer">
                                                <div className="inline-flex items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
                                                  <Upload className="h-4 w-4 mr-2 text-blue-600" />
                                                  <span className="text-sm font-medium text-blue-700">
                                                    Ganti Ilustrasi
                                                  </span>
                                                </div>
                                                <input
                                                  id={`illustration-${section.id}`}
                                                  type="file"
                                                  className="hidden"
                                                  accept="image/jpeg,image/jpg,image/png,image/webp"
                                                  onChange={(e) =>
                                                    handleImageUpload("illustration", e.target.files?.[0], section.id)
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-center">
                                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                            <div className="mt-2">
                                              <label htmlFor={`illustration-${section.id}`} className="cursor-pointer">
                                                <span className="text-sm font-medium text-gray-900">
                                                  Pilih gambar ilustrasi
                                                </span>
                                                <input
                                                  id={`illustration-${section.id}`}
                                                  type="file"
                                                  className="hidden"
                                                  accept="image/jpeg,image/jpg,image/png,image/webp"
                                                  onChange={(e) =>
                                                    handleImageUpload("illustration", e.target.files?.[0], section.id)
                                                  }
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {fieldErrors[`content.${index}.illustration`] && (
                                        <div className="flex items-center gap-1 text-red-500 text-sm">
                                          <AlertCircle className="h-4 w-4" />
                                          {fieldErrors[`content.${index}.illustration`]}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    // Video section tetap sama
                                    <div className="space-y-2">
                                      <Label>URL Video</Label>
                                      <Input
                                        value={section.illustration.url || ""}
                                        onChange={(e) => {
                                          const value = e.target.value
                                          updateContentSection(section.id, "illustration", {
                                            ...section.illustration!,
                                            url: value,
                                          })
                                          updateFieldError(`content.${index}.illustration.url`, value)
                                        }}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className={
                                          fieldErrors[`content.${index}.illustration.url`] ? "border-red-500" : ""
                                        }
                                      />
                                      {fieldErrors[`content.${index}.illustration.url`] && (
                                        <div className="flex items-center gap-1 text-red-500 text-sm">
                                          <AlertCircle className="h-4 w-4" />
                                          {fieldErrors[`content.${index}.illustration.url`]}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <Label>Caption (5-100 karakter)</Label>
                                    <Input
                                      value={section.illustration.caption || ""}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        // PERBAIKAN: Batasi input maksimal 100 karakter
                                        if (value.length <= 100) {
                                          updateContentSection(section.id, "illustration", {
                                            ...section.illustration!,
                                            caption: value,
                                          })
                                          updateFieldError(`content.${index}.illustration.caption`, value)
                                        }
                                      }}
                                      placeholder="Masukkan caption untuk ilustrasi"
                                      className={
                                        fieldErrors[`content.${index}.illustration.caption`] ? "border-red-500" : ""
                                      }
                                      maxLength={100}
                                    />
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                      <span>{(section.illustration.caption || "").length}/100 karakter</span>
                                      {fieldErrors[`content.${index}.illustration.caption`] && (
                                        <div className="flex items-center gap-1 text-red-500">
                                          <AlertCircle className="h-4 w-4" />
                                          <span>{fieldErrors[`content.${index}.illustration.caption`]}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
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
                          disabled={formData.content.length >= 10}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Konten ({formData.content.length}/10)
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Important Points - tetap sama */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Poin-Poin Penting (maksimal 8 poin)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {(formData.importantPoints || []).map((point, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={point || ""}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // PERBAIKAN: Batasi input maksimal 150 karakter
                                  if (value.length <= 150) {
                                    updateImportantPoint(index, value)
                                    updateFieldError(`importantPoint.${index}`, value)
                                  }
                                }}
                                placeholder={`Poin penting ${index + 1} (10-150 karakter)`}
                                className={fieldErrors[`importantPoint.${index}`] ? "border-red-500" : ""}
                                maxLength={150}
                              />
                              {(formData.importantPoints || []).length > 1 && (
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
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{(point || "").length}/150 karakter</span>
                              {fieldErrors[`importantPoint.${index}`] && (
                                <div className="flex items-center gap-1 text-red-500">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>{fieldErrors[`importantPoint.${index}`]}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImportantPoint}
                          className="w-full"
                          disabled={formData.importantPoints.length >= 8}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Poin Penting ({formData.importantPoints.length}/8)
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Conclusion - tetap sama */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Kesimpulan</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Heading (H2)</Label>
                          <Input
                            value={formData.conclusion?.h2 || "Kesimpulan"} // Perbaikan: Pastikan tidak undefined
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
                          <Label>Paragraf Kesimpulan (50-800 karakter)</Label>
                          <Textarea
                            className={`bg-input ${fieldErrors["conclusion.paragraph"] ? "border-red-500" : ""}`}
                            value={formData.conclusion?.paragraph || ""} // Perbaikan: Pastikan tidak undefined
                            onChange={(e) => {
                              const value = e.target.value
                              // PERBAIKAN: Batasi input maksimal 800 karakter
                              if (value.length <= 800) {
                                setFormData((prev) => ({
                                  ...prev,
                                  conclusion: {
                                    ...prev.conclusion,
                                    paragraph: value,
                                  },
                                }))
                                updateFieldError("conclusion.paragraph", value)
                              }
                            }}
                            placeholder="Masukkan kesimpulan Edukasi"
                            rows={4}
                            maxLength={800}
                          />
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{(formData.conclusion?.paragraph || "").length}/800 karakter</span>
                            {fieldErrors["conclusion.paragraph"] && (
                              <div className="flex items-center gap-1 text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <span>{fieldErrors["conclusion.paragraph"]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Table of Contents Preview - tetap sama */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Preview Daftar Isi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Daftar Isi (Otomatis)</h4>
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

                    {/* Button actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isSaving}>
                        Batal
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => handleSubmit(e, "draft")}
                        disabled={isSaving}
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Menyimpan..." : "Simpan sebagai Draft"}
                      </Button>
                      <Button
                        type="button"
                        onClick={(e) => handleSubmit(e, "publish")}
                        disabled={isSaving}
                        className="bg-secondary hover:bg-[#2A6CB0]"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSaving ? "Menyimpan..." : editingEdukasi ? "Update & Publish" : "Publish"} Edukasi
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          {
            title: "Total Edukasi",
            count: edukasiList.length,
            cardClass: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
            textClass: "text-blue-700",
            numberClass: "text-blue-900",
            iconBgClass: "bg-blue-500",
            icon: <FileText className="h-6 w-6 text-white" />,
          },
          {
            title: "Published",
            count: edukasiList.filter((item) => item.isPublished).length,
            cardClass: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
            textClass: "text-green-700",
            numberClass: "text-green-900",
            iconBgClass: "bg-green-500",
            icon: <Send className="h-6 w-6 text-white" />,
          },
          {
            title: "Draft",
            count: edukasiList.filter((item) => item.isDraft).length,
            cardClass: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
            textClass: "text-yellow-700",
            numberClass: "text-yellow-900",
            iconBgClass: "bg-yellow-500",
            icon: <Save className="h-6 w-6 text-white" />,
          },
          {
            title: "Populer",
            count: edukasiList.filter((item) => item.isPopular).length,
            cardClass: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
            textClass: "text-purple-700",
            numberClass: "text-purple-900",
            iconBgClass: "bg-purple-500",
            icon: <Heart className="h-6 w-6 text-white" />,
          },
          {
            title: "Total Views",
            count: edukasiList.reduce((total, item) => total + item.views, 0),
            cardClass: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
            textClass: "text-amber-700",
            numberClass: "text-amber-900",
            iconBgClass: "bg-amber-500",
            icon: <Eye className="h-6 w-6 text-white" />,
          },
        ].map((stat, index) => (
          <Card key={index} className={`${stat.cardClass} border shadow-md`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${stat.textClass}`}>{stat.title}</p>
                  <p className={`mt-3 text-2xl font-bold ${stat.numberClass}`}>{stat.count}</p>
                </div>
                <div className={`${stat.iconBgClass} p-3 rounded-full`}>{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6 shadow-lg border-0 bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search" className="ml-2 text-md font-medium text-slate-700">
                Cari Judul / Ringkasan Edukasi Publish
              </Label>
              <Input
                id="search"
                placeholder="Cari berdasarkan judul atau ringkasan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="ml-1 text-md font-medium text-slate-700">Kategori</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

            <div>
              <Label className="text-md ml-1 font-medium text-slate-700">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="mt-1 rounded-xl">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="popular">Populer</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

      <Card className="shadow-lg border-0 bg-foreground">
        <CardHeader className="bg-input from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-xl font-semibold text-slate-900">Daftar Edukasi</CardTitle>
        </CardHeader>
        <CardContent className="px-2 m-5">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500">Memuat data...</div>
            </div>
          ) : filteredEdukasiList.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-slate-500">
                {edukasiList.length === 0 ? "Belum ada data edukasi" : "Tidak ada Edukasi yang sesuai dengan filter"}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-0 overflow-x-auto mt-3">
              <Table className="bg-input p-5">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-100">
                    <TableHead className="text-center font-semibold text-text w-12">No</TableHead>
                    <TableHead className="text-center font-semibold text-text">Judul</TableHead>
                    <TableHead className="text-center font-semibold text-text">Kategori</TableHead>
                    <TableHead className="text-center font-semibold text-text">Author</TableHead>
                    <TableHead className="text-center font-semibold text-text">Tags</TableHead>
                    <TableHead className="text-center font-semibold text-text">Tanggal Dibuat</TableHead>
                    <TableHead className="text-center font-semibold text-text">Views</TableHead>
                    <TableHead className="text-center font-semibold text-text">Status</TableHead>
                    <TableHead className="text-center font-semibold text-text">Rekomendasi</TableHead>
                    <TableHead className="text-center font-semibold text-text">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEdukasiList.map((edukasi, index) => (
                    <TableRow key={edukasi.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate text-slate-900" title={edukasi.title}>
                          {edukasi.title}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-800">{edukasi.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <User className="h-4 w-4" />
                          {edukasi.author}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {(edukasi.tags || []).slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs text-black">
                              #{tag}
                            </Badge>
                          ))}
                          {(edukasi.tags || []).length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{(edukasi.tags || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(edukasi.createdAt).toLocaleDateString("id-ID")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-blue-500" />
                          {edukasi.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-center justify-center items-center">
                          {/* Status Utama */}
                          {edukasi.isPublished ? (
                            <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
                          ) : (
                            <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>
                          )}

                          {/* Status Populer */}
                          {edukasi.isPopular && (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Populer</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`
                            ${edukasi.recommendedEducation === "normal" ? "bg-green-500 hover:bg-green-600" : ""}
                            ${edukasi.recommendedEducation === "stunting" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                            ${edukasi.recommendedEducation === "severly_stunting" ? "bg-red-500 hover:bg-red-600" : ""}
                          `}
                        >
                          {edukasi.recommendedEducation === "normal"
                            ? "Normal"
                            : edukasi.recommendedEducation === "stunting"
                              ? "Stunting"
                              : "Severly Stunting"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center flex-wrap md:flex-nowrap overflow-x-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish(edukasi.id, edukasi.isPublished, edukasi.title)}
                            title={edukasi.isPublished ? "Jadikan Draft" : "Publish"}
                            className={
                              edukasi.isPublished
                                ? "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600"
                                : "hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                            }
                            disabled={isLoading}
                          >
                            {edukasi.isPublished ? <Save className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                          </Button>
                          {!edukasi.isDraft && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(edukasi, edukasi.isDraft)} // Pass the whole edukasi object
                              title="Preview published content"
                              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(edukasi)}
                            title="Edit Edukasi"
                            className="hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(edukasi.id, edukasi.title)}
                            title="Hapus Edukasi"
                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
                            disabled={isLoading}
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
  )
}
