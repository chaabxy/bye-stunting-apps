// Model: Represents the data structure and business logic

export interface ContentSection {
  id: string
  h2: string
  paragraph: string
  illustration?: {
    type: "image" | "video"
    url: string
    caption: string
  }
}

// Tambahkan enum RecommendedEducationType
export type RecommendedEducationType = "normal" | "stunting" | "severly_stunting"

export interface Edukasi {
  id: number
  title: string
  slug: string // Tambahkan field slug
  headerImage: string
  category: string
  tags: string[]
  source?: string
  author: string
  publishDate?: string
  createdAt: string
  readingTime: number
  excerpt: string
  content: ContentSection[]
  conclusion: {
    h2: string
    paragraph: string
  }
  importantPoints: string[]
  tableOfContents: string[]
  likes: number
  views: number
  isPopular: boolean
  isPublished: boolean
  isDraft: boolean
  recommendedEducation: RecommendedEducationType // Tambahkan field baru
}

export interface EdukasiFormData {
  title: string
  slug?: string // Tambahkan field slug opsional
  headerImage: string
  category: string
  tags: string[]
  source?: string
  readingTime: number
  excerpt: string
  content: ContentSection[]
  conclusion: {
    h2: string
    paragraph: string
  }
  importantPoints: string[]
  isPublished?: boolean
  recommendedEducation: RecommendedEducationType // Tambahkan field baru
}

// Tambahkan array untuk opsi rekomendasi edukasi
export const recommendedEducationOptions: {
  value: RecommendedEducationType
  label: string
}[] = [
  { value: "normal", label: "Normal" },
  { value: "stunting", label: "Stunting" },
  { value: "severly_stunting", label: "Severly Stunting" },
]

export const categories = ["Pengetahuan Umum", "Nutrisi", "Tips Praktis", "Resep Makanan"]

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export class EdukasiModel {
  private readonly baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app"

  // Tambahkan method untuk generate slug
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .substring(0, 50) // PERBAIKAN: Batasi panjang slug maksimal 50 karakter
  }

  // Tambahkan method untuk ensure unique slug
  static async ensureUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    // This would typically check against database, for now return base slug with timestamp if needed
    const timestamp = Date.now().toString().slice(-4)
    return `${baseSlug}-${timestamp}`
  }

  static validateFormData(formData: EdukasiFormData): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // PERBAIKAN: Validasi Title dengan batasan yang lebih ketat
    if (!formData.title?.trim()) {
      errors.push("Judul wajib diisi")
    } else {
      const titleLength = formData.title.trim().length
      if (titleLength < 10) {
        errors.push("Judul minimal 10 karakter")
      } else if (titleLength > 80) {
        // PERBAIKAN: Batasi maksimal 80 karakter
        errors.push("Judul maksimal 80 karakter")
      }
    }

    // PERBAIKAN: Validasi Slug dengan batasan yang lebih ketat
    if (formData.slug && formData.slug.trim()) {
      const slug = formData.slug.trim()
      if (!/^[a-z0-9-]+$/.test(slug)) {
        errors.push("Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung")
      }
      if (slug.length > 50) {
        // PERBAIKAN: Batasi maksimal 50 karakter
        errors.push("Slug maksimal 50 karakter")
      }
    }

    // Validasi Header Image
    if (!formData.headerImage?.trim()) {
      errors.push("Gambar header wajib diisi")
    } else {
      const imageUrl = formData.headerImage.trim()
      // PERBAIKAN: Validasi ukuran base64 image (maksimal 1MB dalam base64)
      if (imageUrl.startsWith("data:image/")) {
        const base64Size = (imageUrl.length * 3) / 4 / 1024 // Convert to KB
        if (base64Size > 1024) {
          // 1MB
          errors.push("Ukuran gambar header terlalu besar (maksimal 1MB)")
        }
      }
    }

    // Validasi Category
    if (!formData.category?.trim()) {
      errors.push("Kategori wajib dipilih")
    } else if (!categories.includes(formData.category.trim())) {
      errors.push("Kategori yang dipilih tidak valid")
    }

    // PERBAIKAN: Validasi Tags dengan batasan yang lebih ketat
    const validTags = (formData.tags || []).filter((tag) => tag && tag.trim() !== "")
    if (validTags.length === 0) {
      errors.push("Minimal 1 tag wajib diisi")
    } else if (validTags.length > 5) {
      // PERBAIKAN: Batasi maksimal 5 tag
      errors.push("Maksimal 5 tag diperbolehkan")
    } else {
      validTags.forEach((tag, index) => {
        if (tag.trim().length < 2) {
          errors.push(`Tag ${index + 1} minimal 2 karakter`)
        } else if (tag.trim().length > 15) {
          // PERBAIKAN: Batasi maksimal 15 karakter per tag
          errors.push(`Tag ${index + 1} maksimal 15 karakter`)
        }
      })
    }

    // Validasi Reading Time
    if (!formData.readingTime || formData.readingTime < 1) {
      errors.push("Waktu baca minimal 1 menit")
    } else if (formData.readingTime > 30) {
      // PERBAIKAN: Batasi maksimal 30 menit
      errors.push("Waktu baca maksimal 30 menit")
    }

    // PERBAIKAN: Validasi Excerpt dengan batasan yang lebih ketat
    if (!formData.excerpt?.trim()) {
      errors.push("Ringkasan wajib diisi")
    } else {
      const excerptLength = formData.excerpt.trim().length
      if (excerptLength < 50) {
        errors.push("Ringkasan minimal 50 karakter")
      } else if (excerptLength > 300) {
        // PERBAIKAN: Batasi maksimal 300 karakter
        errors.push("Ringkasan maksimal 300 karakter")
      }
    }

    // PERBAIKAN: Validasi Content Sections dengan batasan yang lebih ketat
    const validContent = (formData.content || []).filter(
      (section) => section && section.h2?.trim() && section.paragraph?.trim(),
    )

    if (validContent.length === 0) {
      errors.push("Minimal 1 konten section wajib diisi")
    } else if (validContent.length > 10) {
      // PERBAIKAN: Batasi maksimal 10 section
      errors.push("Maksimal 10 konten section diperbolehkan")
    } else {
      validContent.forEach((section, index) => {
        // Validasi H2
        if (!section.h2?.trim()) {
          errors.push(`Konten ${index + 1}: Heading wajib diisi`)
        } else {
          const h2Length = section.h2.trim().length
          if (h2Length < 5) {
            errors.push(`Konten ${index + 1}: Heading minimal 5 karakter`)
          } else if (h2Length > 60) {
            // PERBAIKAN: Batasi maksimal 60 karakter
            errors.push(`Konten ${index + 1}: Heading maksimal 60 karakter`)
          }
        }

        // Validasi Paragraph
        if (!section.paragraph?.trim()) {
          errors.push(`Konten ${index + 1}: Paragraf wajib diisi`)
        } else {
          const paragraphLength = section.paragraph.trim().length
          if (paragraphLength < 100) {
            errors.push(`Konten ${index + 1}: Paragraf minimal 100 karakter`)
          } else if (paragraphLength > 2000) {
            // PERBAIKAN: Batasi maksimal 2000 karakter
            errors.push(`Konten ${index + 1}: Paragraf maksimal 2000 karakter`)
          }
        }

        // Validasi Illustration jika ada
        if (section.illustration) {
          if (!section.illustration.url?.trim()) {
            errors.push(`Konten ${index + 1}: URL ilustrasi wajib diisi`)
          } else {
            const illustrationUrl = section.illustration.url.trim()
            if (section.illustration.type === "image") {
              // PERBAIKAN: Validasi ukuran base64 image untuk ilustrasi
              if (illustrationUrl.startsWith("data:image/")) {
                const base64Size = (illustrationUrl.length * 3) / 4 / 1024 // Convert to KB
                if (base64Size > 512) {
                  // 512KB untuk ilustrasi
                  errors.push(`Konten ${index + 1}: Ukuran gambar ilustrasi terlalu besar (maksimal 512KB)`)
                }
              }
            } else if (section.illustration.type === "video") {
              if (
                !illustrationUrl.includes("youtube.com") &&
                !illustrationUrl.includes("youtu.be") &&
                !illustrationUrl.includes("vimeo.com")
              ) {
                warnings.push(`Konten ${index + 1}: URL video sebaiknya dari YouTube atau Vimeo`)
              }
            }
          }

          if (!section.illustration.caption?.trim()) {
            errors.push(`Konten ${index + 1}: Caption ilustrasi wajib diisi`)
          } else if (section.illustration.caption.trim().length < 5) {
            errors.push(`Konten ${index + 1}: Caption minimal 5 karakter`)
          } else if (section.illustration.caption.trim().length > 100) {
            // PERBAIKAN: Batasi maksimal 100 karakter
            errors.push(`Konten ${index + 1}: Caption maksimal 100 karakter`)
          }
        }
      })
    }

    // PERBAIKAN: Validasi Important Points dengan batasan yang lebih ketat
    const validPoints = (formData.importantPoints || []).filter((point) => point && point.trim() !== "")
    if (validPoints.length === 0) {
      warnings.push("Sebaiknya tambahkan minimal 1 poin penting")
    } else if (validPoints.length > 8) {
      // PERBAIKAN: Batasi maksimal 8 poin
      errors.push("Maksimal 8 poin penting diperbolehkan")
    } else {
      validPoints.forEach((point, index) => {
        const pointLength = point.trim().length
        if (pointLength < 10) {
          errors.push(`Poin penting ${index + 1} minimal 10 karakter`)
        } else if (pointLength > 150) {
          // PERBAIKAN: Batasi maksimal 150 karakter
          errors.push(`Poin penting ${index + 1} maksimal 150 karakter`)
        }
      })
    }

    // PERBAIKAN: Validasi Conclusion dengan batasan yang lebih ketat
    if (!formData.conclusion?.paragraph?.trim()) {
      errors.push("Kesimpulan wajib diisi")
    } else {
      const conclusionLength = formData.conclusion.paragraph.trim().length
      if (conclusionLength < 50) {
        errors.push("Kesimpulan minimal 50 karakter")
      } else if (conclusionLength > 800) {
        // PERBAIKAN: Batasi maksimal 800 karakter
        errors.push("Kesimpulan maksimal 800 karakter")
      }
    }

    // PERBAIKAN: Validasi Source dengan batasan yang lebih ketat
    if (!formData.source?.trim()) {
      warnings.push("Sebaiknya tambahkan sumber referensi")
    } else if (formData.source.trim().length > 100) {
      // PERBAIKAN: Batasi maksimal 100 karakter
      errors.push("Sumber referensi maksimal 100 karakter")
    }

    // Validasi Recommended Education
    if (!formData.recommendedEducation) {
      errors.push("Rekomendasi edukasi wajib dipilih")
    } else {
      const validRecommendations = recommendedEducationOptions.map((opt) => opt.value)
      if (!validRecommendations.includes(formData.recommendedEducation)) {
        errors.push("Rekomendasi edukasi tidak valid")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  static validateField(fieldName: string, value: any, context?: any): string {
    switch (fieldName) {
      case "title":
        if (!value?.trim()) return "Judul wajib diisi"
        const titleLength = value.trim().length
        if (titleLength < 10) return "Judul minimal 10 karakter"
        if (titleLength > 80) return "Judul maksimal 80 karakter" // PERBAIKAN
        return ""

      case "slug":
        if (value && value.trim()) {
          const slug = value.trim()
          if (!/^[a-z0-9-]+$/.test(slug)) {
            return "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"
          }
          if (slug.length > 50) return "Slug maksimal 50 karakter" // PERBAIKAN
        }
        return ""

      case "headerImage":
        if (!value?.trim()) return "Gambar header wajib diisi"
        const imageUrl = value.trim()
        if (imageUrl.startsWith("data:image/")) {
          const base64Size = (imageUrl.length * 3) / 4 / 1024
          if (base64Size > 1024) return "Ukuran gambar header terlalu besar (maksimal 1MB)" // PERBAIKAN
        }
        return ""

      case "category":
        if (!value?.trim()) return "Kategori wajib dipilih"
        if (!categories.includes(value.trim())) return "Kategori yang dipilih tidak valid"
        return ""

      case "readingTime":
        if (!value || value < 1) return "Waktu baca minimal 1 menit"
        if (value > 30) return "Waktu baca maksimal 30 menit" // PERBAIKAN
        return ""

      case "excerpt":
        if (!value?.trim()) return "Ringkasan wajib diisi"
        const excerptLength = value.trim().length
        if (excerptLength < 50) return "Ringkasan minimal 50 karakter"
        if (excerptLength > 300) return "Ringkasan maksimal 300 karakter" // PERBAIKAN
        return ""

      case "h2":
        if (!value?.trim()) return "Heading wajib diisi"
        const h2Length = value.trim().length
        if (h2Length < 5) return "Heading minimal 5 karakter"
        if (h2Length > 60) return "Heading maksimal 60 karakter" // PERBAIKAN
        return ""

      case "paragraph":
        if (!value?.trim()) return "Paragraf wajib diisi"
        const paragraphLength = value.trim().length
        if (paragraphLength < 100) return "Paragraf minimal 100 karakter"
        if (paragraphLength > 2000) return "Paragraf maksimal 2000 karakter" // PERBAIKAN
        return ""

      case "conclusion.paragraph":
        if (!value?.trim()) return "Kesimpulan wajib diisi"
        const conclusionLength = value.trim().length
        if (conclusionLength < 50) return "Kesimpulan minimal 50 karakter"
        if (conclusionLength > 800) return "Kesimpulan maksimal 800 karakter" // PERBAIKAN
        return ""

      case "importantPoint":
        if (!value?.trim()) return "Poin penting wajib diisi"
        const pointLength = value.trim().length
        if (pointLength < 10) return "Poin penting minimal 10 karakter"
        if (pointLength > 150) return "Poin penting maksimal 150 karakter" // PERBAIKAN
        return ""

      case "illustration.url":
        if (!value?.trim()) return "URL ilustrasi wajib diisi"
        const illustrationUrl = value.trim()
        if (context?.type === "image") {
          if (illustrationUrl.startsWith("data:image/")) {
            const base64Size = (illustrationUrl.length * 3) / 4 / 1024
            if (base64Size > 512) return "Ukuran gambar ilustrasi terlalu besar (maksimal 512KB)" // PERBAIKAN
          }
        }
        return ""

      case "illustration.caption":
        if (!value?.trim()) return "Caption ilustrasi wajib diisi"
        const captionLength = value.trim().length
        if (captionLength < 5) return "Caption minimal 5 karakter"
        if (captionLength > 100) return "Caption maksimal 100 karakter" // PERBAIKAN
        return ""

      case "source":
        if (value && value.trim().length > 100) return "Sumber referensi maksimal 100 karakter" // PERBAIKAN
        return ""

      case "tags":
        if (!Array.isArray(value) || value.length === 0) return "Minimal 1 tag wajib diisi"
        if (value.length > 5) return "Maksimal 5 tag diperbolehkan" // PERBAIKAN
        for (let i = 0; i < value.length; i++) {
          const tag = value[i]
          if (tag.trim().length < 2) return `Tag ${i + 1} minimal 2 karakter`
          if (tag.trim().length > 15) return `Tag ${i + 1} maksimal 15 karakter` // PERBAIKAN
        }
        return ""

      case "recommendedEducation":
        if (!value) return "Rekomendasi edukasi wajib dipilih"
        const validRecommendations = recommendedEducationOptions.map((opt) => opt.value)
        if (!validRecommendations.includes(value)) return "Rekomendasi edukasi tidak valid"
        return ""

      default:
        return ""
    }
  }

  async fetchAllEdukasi(): Promise<Edukasi[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/educations?admin=true`, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Fetch error response:", errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()

      if (result.isError) {
        throw new Error(result.message || "Unknown error from backend")
      }

      return (result.data || []).map((item: any) => ({
        id: item.id,
        title: item.title || "",
        slug: item.slug || EdukasiModel.generateSlug(item.title || ""), // Include slug
        headerImage: item.header_image || "/placeholder.svg?height=400&width=600",
        category: item.category || "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        source: item.source || "",
        author: item.author || "Admin",
        publishDate: item.publish_date || null,
        createdAt: item.created_at || new Date().toISOString(),
        readingTime: item.reading_time || 5,
        excerpt: item.excerpt || "",
        content:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            h2: section.heading || "",
            paragraph: section.paragraph || "",
            illustration: section.illustration || undefined,
          })) || [],
        conclusion: item.conclusion?.[0] || { h2: "Kesimpulan", paragraph: "" },
        importantPoints: item.important_points?.map((point: any) => point.content || point) || [],
        tableOfContents: this.generateTableOfContentsFromData(item),
        likes: item.like_count || 0,
        views: item.view_count || 0,
        isPopular: item.is_popular || false,
        isPublished: item.is_published || false,
        isDraft: item.is_draft !== false,
        recommendedEducation: item.recommendedEducation || item.recommended_education || "normal", // Support both field names
      }))
    } catch (error) {
      console.error("Error fetching edukasi:", error)
      throw new Error("Gagal memuat data edukasi. Pastikan backend server berjalan.")
    }
  }

  async uploadImage(file: File): Promise<string> {
    try {
      // PERBAIKAN: Validasi ukuran file yang lebih ketat
      if (file.size > 512 * 1024) {
        // 512KB untuk mencegah timeout
        throw new Error("Ukuran file terlalu besar. Maksimal 512KB")
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        throw new Error("File harus berupa gambar")
      }

      // PERBAIKAN: Validasi format file yang didukung
      const supportedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!supportedFormats.includes(file.type)) {
        throw new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP")
      }

      // Convert file to base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
          const result = reader.result as string
          console.log("Image converted to base64 successfully")
          resolve(result)
        }

        reader.onerror = () => {
          console.error("Error converting image to base64:", reader.error)
          reject(new Error("Gagal memproses gambar"))
        }

        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  async createEdukasi(data: EdukasiFormData, author: string): Promise<Edukasi> {
    try {
      console.log("=== FRONTEND CREATE REQUEST ===")

      // PERBAIKAN: Generate slug yang lebih pendek
      const slug = data.slug || EdukasiModel.generateSlug(data.title)

      console.log("Original form data:", {
        title: data.title,
        slug: slug,
        category: data.category,
        tags: data.tags,
        contentSections: data.content?.length || 0,
        importantPoints: data.importantPoints?.length || 0,
        isPublished: data.isPublished,
        headerImage: data.headerImage ? "provided" : "missing",
        excerpt: data.excerpt ? `${data.excerpt.length} chars` : "missing",
        conclusion: data.conclusion?.paragraph ? `${data.conclusion.paragraph.length} chars` : "missing",
        recommendedEducation: data.recommendedEducation || "normal",
      })

      // PERBAIKAN: Validasi data sebelum dikirim dengan batasan yang lebih ketat
      if (!data.title?.trim()) {
        throw new Error("Judul wajib diisi")
      }
      if (data.title.trim().length > 80) {
        throw new Error("Judul terlalu panjang (maksimal 80 karakter)")
      }
      if (!data.excerpt?.trim()) {
        throw new Error("Ringkasan wajib diisi")
      }
      if (data.excerpt.trim().length > 300) {
        throw new Error("Ringkasan terlalu panjang (maksimal 300 karakter)")
      }
      if (!data.category?.trim()) {
        throw new Error("Kategori wajib dipilih")
      }
      if (!data.headerImage?.trim()) {
        throw new Error("Gambar header wajib diisi")
      }
      if (!data.content || data.content.length === 0) {
        throw new Error("Minimal 1 konten section wajib diisi")
      }
      if (data.content.length > 10) {
        throw new Error("Terlalu banyak konten section (maksimal 10)")
      }
      if (!data.conclusion?.paragraph?.trim()) {
        throw new Error("Kesimpulan wajib diisi")
      }
      if (data.conclusion.paragraph.trim().length > 800) {
        throw new Error("Kesimpulan terlalu panjang (maksimal 800 karakter)")
      }

      // PERBAIKAN: Buat payload yang lebih ringkas
      const payload = {
        title: data.title.trim().substring(0, 80), // Potong jika terlalu panjang
        slug: slug.substring(0, 50), // Potong jika terlalu panjang
        excerpt: data.excerpt.trim().substring(0, 300), // Potong jika terlalu panjang
        category: data.category.trim(),
        tags: Array.isArray(data.tags)
          ? data.tags
              .filter((tag) => tag && tag.trim() !== "")
              .slice(0, 5) // Maksimal 5 tags
              .map((tag) => tag.trim().substring(0, 15)) // Potong tag jika terlalu panjang
          : [],
        source: data.source?.trim().substring(0, 100) || "", // Potong jika terlalu panjang
        author: author.trim(),
        headerImage: data.headerImage.trim(),
        readingTime: Math.min(Number(data.readingTime) || 5, 30), // Maksimal 30 menit
        content: data.content
          .filter((section) => section && section.h2?.trim() && section.paragraph?.trim())
          .slice(0, 10) // Maksimal 10 sections
          .map((section) => ({
            id: section.id || Date.now().toString(),
            h2: section.h2.trim().substring(0, 60), // Potong jika terlalu panjang
            paragraph: section.paragraph.trim().substring(0, 2000), // Potong jika terlalu panjang
            illustration: section.illustration
              ? {
                  type: section.illustration.type,
                  url: section.illustration.url.trim(),
                  caption: section.illustration.caption?.trim().substring(0, 100) || "", // Potong jika terlalu panjang
                }
              : undefined,
          })),
        conclusion: {
          h2: data.conclusion.h2?.trim() || "Kesimpulan",
          paragraph: data.conclusion.paragraph.trim().substring(0, 800), // Potong jika terlalu panjang
        },
        importantPoints: Array.isArray(data.importantPoints)
          ? data.importantPoints
              .filter((point) => point && point.trim() !== "")
              .slice(0, 8) // Maksimal 8 poin
              .map((point) => point.trim().substring(0, 150)) // Potong jika terlalu panjang
          : [],
        isPublished: Boolean(data.isPublished),
        recommendedEducation: data.recommendedEducation || "normal",
      }

      // PERBAIKAN: Validasi payload sebelum dikirim
      if (payload.content.length === 0) {
        throw new Error("Minimal 1 konten section dengan heading dan paragraf wajib diisi")
      }

      if (payload.tags.length === 0) {
        throw new Error("Minimal 1 tag wajib diisi")
      }

      console.log("=== SENDING PAYLOAD TO BACKEND ===")
      console.log("Payload structure:", {
        title: payload.title,
        excerpt: `${payload.excerpt.length} chars`,
        category: payload.category,
        tags: payload.tags,
        author: payload.author,
        headerImage: payload.headerImage ? "provided" : "missing",
        readingTime: payload.readingTime,
        contentSections: payload.content.length,
        conclusion: payload.conclusion.paragraph ? `${payload.conclusion.paragraph.length} chars` : "missing",
        importantPoints: payload.importantPoints.length,
        isPublished: payload.isPublished,
        recommendedEducation: payload.recommendedEducation,
      })

      // PERBAIKAN: Timeout yang lebih panjang untuk request besar
      const response = await fetch(`${this.baseUrl}/api/educations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000), // 60 detik timeout
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("=== BACKEND ERROR RESPONSE ===")
        console.error("Status:", response.status)
        console.error("Error text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
          console.error("Parsed error data:", errorData)
        } catch {
          errorData = { message: errorText }
        }

        // PERBAIKAN: Error handling yang lebih spesifik untuk database timeout
        if (response.status === 500) {
          if (errorData.message?.includes("Transaction API error") || errorData.message?.includes("timeout")) {
            throw new Error("Server sedang sibuk. Silakan coba lagi dalam beberapa saat atau kurangi ukuran data.")
          }
        }

        if (response.status === 400) {
          if (errorData.details) {
            const validationErrors = errorData.details.map((detail: any) => detail.message).join(", ")
            throw new Error(`Validasi gagal: ${validationErrors}`)
          } else {
            throw new Error(`Validasi gagal: ${errorData.message || errorText}`)
          }
        }

        throw new Error(errorData.message || `HTTP ${response.status}: Failed to create edukasi`)
      }

      const result = await response.json()
      console.log("=== SUCCESS RESPONSE ===")
      console.log("Result:", result)

      if (result.isError) {
        throw new Error(result.message || "Failed to create edukasi")
      }

      // Return data dengan struktur yang konsisten
      return {
        id: result.data.id,
        title: data.title,
        slug: slug,
        headerImage: data.headerImage,
        category: data.category,
        tags: data.tags,
        source: data.source,
        author,
        publishDate: data.isPublished ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        readingTime: data.readingTime,
        excerpt: data.excerpt,
        content: data.content,
        conclusion: data.conclusion,
        importantPoints: data.importantPoints,
        tableOfContents: this.generateTableOfContents(data),
        likes: 0,
        views: 0,
        isPopular: false,
        isPublished: data.isPublished || false,
        isDraft: !data.isPublished,
        recommendedEducation: data.recommendedEducation || "normal",
      }
    } catch (error) {
      console.error("=== CREATE EDUKASI ERROR ===")
      console.error("Error details:", error)
      throw error
    }
  }

  async updateEdukasi(id: number, data: EdukasiFormData, author: string): Promise<Edukasi> {
    try {
      console.log("=== FRONTEND UPDATE REQUEST ===")
      console.log("Education ID:", id)

      // PERBAIKAN: Buat payload yang lebih ringkas untuk update
      const payload = {
        title: data.title.trim().substring(0, 80),
        slug: data.slug || EdukasiModel.generateSlug(data.title),
        excerpt: data.excerpt.trim().substring(0, 300),
        category: data.category,
        tags: Array.isArray(data.tags)
          ? data.tags
              .filter((tag) => tag.trim() !== "")
              .slice(0, 5)
              .map((tag) => tag.trim().substring(0, 15))
          : [],
        source: data.source?.trim().substring(0, 100) || "",
        author: author.trim(),
        headerImage: data.headerImage,
        readingTime: Math.min(Number(data.readingTime) || 5, 30),
        content: data.content
          .filter((section) => section.h2.trim() && section.paragraph.trim())
          .slice(0, 10)
          .map((section) => ({
            id: section.id,
            h2: section.h2.trim().substring(0, 60),
            paragraph: section.paragraph.trim().substring(0, 2000),
            illustration: section.illustration || undefined,
          })),
        conclusion: {
          h2: data.conclusion.h2.trim() || "Kesimpulan",
          paragraph: data.conclusion.paragraph.trim().substring(0, 800),
        },
        importantPoints: data.importantPoints
          .filter((point) => point.trim() !== "")
          .slice(0, 8)
          .map((point) => point.trim().substring(0, 150)),
        isPublished: Boolean(data.isPublished),
        recommendedEducation: data.recommendedEducation || "normal",
      }

      const response = await fetch(`${this.baseUrl}/api/educations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60000), // 60 detik timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Backend error response:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        // PERBAIKAN: Error handling untuk timeout di update
        if (response.status === 500 && errorData.message?.includes("timeout")) {
          throw new Error("Server sedang sibuk. Silakan coba lagi dalam beberapa saat.")
        }

        throw new Error(errorData.message || `HTTP ${response.status}: Failed to update edukasi`)
      }

      const result = await response.json()

      if (result.isError) {
        throw new Error(result.message || "Failed to update edukasi")
      }

      return {
        id,
        title: data.title,
        slug: data.slug || EdukasiModel.generateSlug(data.title),
        headerImage: data.headerImage,
        category: data.category,
        tags: data.tags,
        source: data.source,
        author,
        publishDate: data.isPublished ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString(),
        readingTime: data.readingTime,
        excerpt: data.excerpt,
        content: data.content,
        conclusion: data.conclusion,
        importantPoints: data.importantPoints,
        tableOfContents: this.generateTableOfContents(data),
        likes: 0,
        views: 0,
        isPopular: false,
        isPublished: data.isPublished || false,
        isDraft: !data.isPublished,
        recommendedEducation: data.recommendedEducation || "normal",
      }
    } catch (error) {
      console.error("Error updating edukasi:", error)
      throw error
    }
  }

  async deleteEdukasi(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/educations/${id}`, {
        method: "DELETE",
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Delete error response:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        throw new Error(errorData.message || "Failed to delete edukasi")
      }

      const result = await response.json()

      if (result.isError) {
        throw new Error(result.message || "Failed to delete edukasi")
      }
    } catch (error) {
      console.error("Error deleting edukasi:", error)
      throw error
    }
  }

  async togglePublishStatus(id: number, isPublished: boolean): Promise<void> {
    try {
      const payload = {
        is_published: Boolean(isPublished),
        is_draft: !Boolean(isPublished),
      }

      console.log("Toggling publish status:", { id, payload })

      const response = await fetch(`${this.baseUrl}/api/educations/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Toggle status error response:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { message: errorText }
        }

        throw new Error(errorData.message || "Failed to toggle publish status")
      }

      const result = await response.json()

      if (result.isError) {
        throw new Error(result.message || "Failed to toggle publish status")
      }
    } catch (error) {
      console.error("Error toggling publish status:", error)
      throw error
    }
  }

  generateTableOfContents(formData: EdukasiFormData): string[] {
    const toc: string[] = []

    if (formData.content && Array.isArray(formData.content)) {
      formData.content.forEach((section) => {
        if (section && section.h2 && section.h2.trim() !== "") {
          toc.push(section.h2.trim())
        }
      })
    }

    if (formData.conclusion && formData.conclusion.paragraph && formData.conclusion.paragraph.trim() !== "") {
      const conclusionTitle =
        formData.conclusion.h2 && formData.conclusion.h2.trim() !== "" ? formData.conclusion.h2.trim() : "Kesimpulan"
      toc.push(conclusionTitle)
    }

    return toc
  }

  private generateTableOfContentsFromData(item: any): string[] {
    const toc: string[] = []

    if (item.content_sections && Array.isArray(item.content_sections)) {
      item.content_sections.forEach((section: any) => {
        if (section.heading && section.heading.trim()) {
          toc.push(section.heading.trim())
        }
      })
    }

    if (item.conclusion && Array.isArray(item.conclusion) && item.conclusion[0]) {
      const conclusion = item.conclusion[0]
      if (conclusion.paragraph && conclusion.paragraph.trim()) {
        const conclusionTitle =
          conclusion.heading && conclusion.heading.trim() !== "" ? conclusion.heading.trim() : "Kesimpulan"
        toc.push(conclusionTitle)
      }
    }

    return toc
  }

  async getEducationPreview(id: number, isDraft = false): Promise<Edukasi | null> {
    try {
      const endpoint = `${this.baseUrl}/api/educations/${id}?admin=true`

      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        return null
      }

      const result = await response.json()
      const item = result.data

      return {
        id: item.id,
        title: item.title || "",
        slug: item.slug || EdukasiModel.generateSlug(item.title || ""),
        headerImage: item.header_image || "/placeholder.svg?height=400&width=600",
        category: item.category || "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        source: item.source || "",
        author: item.author || "Admin",
        publishDate: item.publish_date || null,
        createdAt: item.created_at || new Date().toISOString(),
        readingTime: item.reading_time || 5,
        excerpt: item.excerpt || "",
        content:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            h2: section.heading || "",
            paragraph: section.paragraph || "",
            illustration: section.illustration,
          })) || [],
        conclusion: item.conclusion?.[0] || { h2: "Kesimpulan", paragraph: "" },
        importantPoints: item.important_points?.map((point: any) => point.content || point) || [],
        tableOfContents: this.generateTableOfContentsFromData(item),
        likes: item.like_count || 0,
        views: item.view_count || 0,
        isPopular: item.is_popular || false,
        isPublished: item.is_published || false,
        isDraft: item.is_draft !== false,
        recommendedEducation: item.recommendedEducation || item.recommended_education || "normal",
      }
    } catch (error) {
      console.error("Error fetching education preview:", error)
      return null
    }
  }
}
