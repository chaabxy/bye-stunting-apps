// Presenter: Mediates between Model and View

import {
  EdukasiModel,
  type Edukasi,
  type EdukasiFormData,
  type ContentSection,
  type ValidationResult,
} from "../../model/admin/edukasi-model"

export interface EdukasiView {
  displayEdukasiList(edukasiList: Edukasi[]): void
  displayLoading(isLoading: boolean): void
  displayError(message: string): void
  displaySuccess(message: string): void
  displayValidationErrors(errors: string[]): void
  displayValidationWarnings(warnings: string[]): void
  closeDialog(): void
  resetForm(): void
  showConfirmation(message: string): Promise<boolean>
}

export class EdukasiPresenter {
  private model: EdukasiModel
  private view: EdukasiView

  constructor(view: EdukasiView) {
    this.model = new EdukasiModel()
    this.view = view
  }

  async loadEdukasiList(): Promise<void> {
    try {
      this.view.displayLoading(true)
      const edukasiList = await this.model.fetchAllEdukasi()
      this.view.displayEdukasiList(edukasiList)
    } catch (error) {
      console.error("Error loading edukasi:", error)
      this.view.displayEdukasiList([])
      this.view.displayError("Gagal memuat data edukasi. Pastikan backend server berjalan.")
    } finally {
      this.view.displayLoading(false)
    }
  }

  validateFormData(formData: EdukasiFormData): ValidationResult {
    const validation = EdukasiModel.validateFormData(formData)

    // Tampilkan error secara real-time
    if (!validation.isValid) {
      console.log("Validation errors:", validation.errors)
    }

    if (validation.warnings.length > 0) {
      console.log("Validation warnings:", validation.warnings)
    }

    return validation
  }

  validateField(fieldName: string, value: any, context?: any): string {
    return EdukasiModel.validateField(fieldName, value, context)
  }

  async uploadImage(file: File): Promise<string> {
    try {
      return await this.model.uploadImage(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      throw new Error("Gagal mengunggah gambar")
    }
  }

  async saveEdukasi(formData: EdukasiFormData, editingId: number | null, author: string): Promise<void> {
    console.log("=== PRESENTER SAVE EDUKASI ===")
    console.log("Form data received:", {
      title: formData.title,
      category: formData.category,
      tags: formData.tags,
      contentSections: formData.content?.length || 0,
      importantPoints: formData.importantPoints?.length || 0,
      isPublished: formData.isPublished,
      editingId,
      author,
    })

    // PERBAIKAN: Validasi komprehensif dengan pesan error yang lebih jelas
    const validation = this.validateFormData(formData)

    if (!validation.isValid) {
      console.error("Validation failed:", validation.errors)
      this.view.displayValidationErrors(validation.errors)
      return
    }

    if (validation.warnings.length > 0) {
      this.view.displayValidationWarnings(validation.warnings)
    }

    try {
      this.view.displayLoading(true)

      // PERBAIKAN: Clean dan prepare data dengan batasan yang lebih ketat
      const safeFormData: EdukasiFormData = {
        title: formData.title?.trim().substring(0, 80) || "",
        slug: formData.slug?.trim().substring(0, 50) || EdukasiModel.generateSlug(formData.title || ""),
        headerImage: formData.headerImage?.trim() || "",
        category: formData.category?.trim() || "",
        tags: Array.isArray(formData.tags)
          ? formData.tags
              .filter((tag) => tag && tag.trim())
              .slice(0, 5) // Maksimal 5 tags
              .map((tag) => tag.trim().substring(0, 15)) // Maksimal 15 karakter per tag
          : [],
        source: formData.source?.trim().substring(0, 100) || "",
        readingTime: Math.min(Number(formData.readingTime) || 5, 30), // Maksimal 30 menit
        excerpt: formData.excerpt?.trim().substring(0, 300) || "",
        content: Array.isArray(formData.content)
          ? formData.content
              .filter((section) => section && section.h2?.trim() && section.paragraph?.trim())
              .slice(0, 10) // Maksimal 10 sections
              .map((section) => ({
                id: section.id,
                h2: section.h2.trim().substring(0, 60), // Maksimal 60 karakter
                paragraph: section.paragraph.trim().substring(0, 2000), // Maksimal 2000 karakter
                illustration: section.illustration
                  ? {
                      type: section.illustration.type,
                      url: section.illustration.url?.trim() || "",
                      caption: section.illustration.caption?.trim().substring(0, 100) || "", // Maksimal 100 karakter
                    }
                  : undefined,
              }))
          : [],
        importantPoints: Array.isArray(formData.importantPoints)
          ? formData.importantPoints
              .filter((point) => point && point.trim())
              .slice(0, 8) // Maksimal 8 poin
              .map((point) => point.trim().substring(0, 150)) // Maksimal 150 karakter
          : [],
        conclusion: {
          h2: formData.conclusion?.h2?.trim() || "Kesimpulan",
          paragraph: formData.conclusion?.paragraph?.trim().substring(0, 800) || "", // Maksimal 800 karakter
        },
        isPublished: Boolean(formData.isPublished),
        recommendedEducation: formData.recommendedEducation || "normal",
      }

      // PERBAIKAN: Validasi ulang setelah cleaning dengan pesan yang lebih spesifik
      const finalValidation = this.validateFormData(safeFormData)
      if (!finalValidation.isValid) {
        this.view.displayValidationErrors([
          "Data terlalu panjang atau tidak valid setelah pembersihan:",
          ...finalValidation.errors,
        ])
        return
      }

      console.log("=== CLEANED FORM DATA ===")
      console.log("Safe form data:", {
        title: safeFormData.title,
        headerImage: safeFormData.headerImage ? "provided" : "missing",
        category: safeFormData.category,
        tags: safeFormData.tags,
        excerpt: safeFormData.excerpt ? `${safeFormData.excerpt.length} chars` : "missing",
        contentSections: safeFormData.content.length,
        conclusion: safeFormData.conclusion.paragraph ? `${safeFormData.conclusion.paragraph.length} chars` : "missing",
        importantPoints: safeFormData.importantPoints.length,
        isPublished: safeFormData.isPublished,
        recommendedEducation: safeFormData.recommendedEducation,
      })

      let result: Edukasi
      if (editingId) {
        console.log("=== UPDATING EXISTING EDUKASI ===")
        result = await this.model.updateEdukasi(editingId, safeFormData, author)
        this.view.displaySuccess(`Edukasi "${result.title}" berhasil diperbarui!`)
      } else {
        console.log("=== CREATING NEW EDUKASI ===")
        result = await this.model.createEdukasi(safeFormData, author)
        this.view.displaySuccess(
          `Edukasi "${result.title}" berhasil ${safeFormData.isPublished ? "dipublikasi" : "disimpan sebagai draft"}!`,
        )
      }

      // Tunggu sebentar sebelum menutup dialog dan reload data
      setTimeout(async () => {
        this.view.closeDialog()
        this.view.resetForm()
        await this.loadEdukasiList()
      }, 1500)
    } catch (error) {
      console.error("=== SAVE EDUKASI ERROR ===")
      console.error("Error details:", error)

      let errorMessage = "Terjadi kesalahan saat menyimpan edukasi"
      if (error instanceof Error) {
        // PERBAIKAN: Pesan error yang lebih user-friendly
        if (error.message.includes("timeout") || error.message.includes("Transaction API error")) {
          errorMessage =
            "Server sedang sibuk. Silakan coba lagi dalam beberapa saat atau kurangi ukuran data (gambar, teks)."
        } else if (error.message.includes("terlalu besar")) {
          errorMessage = "Data terlalu besar. Silakan kurangi ukuran gambar atau panjang teks."
        } else {
          errorMessage = error.message
        }
      }

      this.view.displayError(errorMessage)
    } finally {
      this.view.displayLoading(false)
    }
  }

  async deleteEdukasi(id: number, title: string): Promise<void> {
    try {
      const confirmed = await this.view.showConfirmation(
        `Apakah Anda yakin ingin menghapus edukasi "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      )

      if (!confirmed) return

      this.view.displayLoading(true)
      await this.model.deleteEdukasi(id)
      this.view.displaySuccess(`Edukasi "${title}" berhasil dihapus!`)
      await this.loadEdukasiList()
    } catch (error) {
      console.error("Error deleting edukasi:", error)
      this.view.displayError(error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus edukasi")
    } finally {
      this.view.displayLoading(false)
    }
  }

  async togglePublishStatus(id: number, isPublished: boolean, title: string): Promise<void> {
    try {
      const action = isPublished ? "mempublikasi" : "menjadikan draft"
      const confirmed = await this.view.showConfirmation(`Apakah Anda yakin ingin ${action} edukasi "${title}"?`)

      if (!confirmed) return

      this.view.displayLoading(true)
      await this.model.togglePublishStatus(id, isPublished)
      this.view.displaySuccess(`Edukasi "${title}" berhasil ${isPublished ? "dipublikasi" : "dijadikan draft"}!`)
      await this.loadEdukasiList()
    } catch (error) {
      console.error("Error toggling publish status:", error)
      this.view.displayError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat mengubah status publikasi",
      )
    } finally {
      this.view.displayLoading(false)
    }
  }

  // Helper methods for form manipulation
  addContentSection(content: ContentSection[]): ContentSection[] {
    const newId = Date.now().toString()
    return [...content, { id: newId, h2: "", paragraph: "", illustration: undefined }]
  }

  removeContentSection(content: ContentSection[], id: string): ContentSection[] {
    if (content.length > 1) {
      return content.filter((section) => section.id !== id)
    }
    return content
  }

  updateContentSection(
    content: ContentSection[],
    id: string,
    field: keyof ContentSection,
    value: any,
  ): ContentSection[] {
    return content.map((section) => (section.id === id ? { ...section, [field]: value } : section))
  }

  addIllustrationToContent(content: ContentSection[], id: string): ContentSection[] {
    return content.map((section) =>
      section.id === id
        ? {
            ...section,
            illustration: { type: "image", url: "", caption: "" },
          }
        : section,
    )
  }

  removeIllustrationFromContent(content: ContentSection[], id: string): ContentSection[] {
    return content.map((section) => (section.id === id ? { ...section, illustration: undefined } : section))
  }

  addImportantPoint(points: string[]): string[] {
    return [...points, ""]
  }

  removeImportantPoint(points: string[], index: number): string[] {
    if (points.length > 1) {
      return points.filter((_, i) => i !== index)
    }
    return points
  }

  updateImportantPoint(points: string[], index: number, value: string): string[] {
    return points.map((point, i) => (i === index ? value : point))
  }

  // Helper methods untuk tags
  addTag(tags: string[]): string[] {
    return [...tags, ""]
  }

  removeTag(tags: string[], index: number): string[] {
    if (tags.length > 1) {
      return tags.filter((_, i) => i !== index)
    }
    return tags
  }

  updateTag(tags: string[], index: number, value: string): string[] {
    return tags.map((tag, i) => (i === index ? value : tag))
  }

  async previewEdukasi(id: number, isDraft: boolean): Promise<Edukasi | null> {
    try {
      this.view.displayLoading(true)
      const edukasi = await this.model.getEducationPreview(id, isDraft)
      return edukasi
    } catch (error) {
      console.error("Error previewing edukasi:", error)
      this.view.displayError(error instanceof Error ? error.message : "Terjadi kesalahan saat melihat preview edukasi")
      return null
    } finally {
      this.view.displayLoading(false)
    }
  }
}
