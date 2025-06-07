// Presenter: Mediates between Model and View

import {
  EdukasiModel,
  type Edukasi,
  type EdukasiFormData,
  type ContentSection,
} from "../../model/admin/edukasi-model";

export interface EdukasiView {
  displayEdukasiList(edukasiList: Edukasi[]): void;
  displayLoading(isLoading: boolean): void;
  displayError(message: string): void;
  displaySuccess(message: string): void;
  closeDialog(): void;
  resetForm(): void;
}

export class EdukasiPresenter {
  private model: EdukasiModel;
  private view: EdukasiView;

  constructor(view: EdukasiView) {
    this.model = new EdukasiModel();
    this.view = view;
  }

  async loadEdukasiList(): Promise<void> {
    try {
      this.view.displayLoading(true);
      const edukasiList = await this.model.fetchAllEdukasi();
      this.view.displayEdukasiList(edukasiList);
    } catch (error) {
      this.view.displayError("Gagal memuat data edukasi");
    } finally {
      this.view.displayLoading(false);
    }
  }

  async saveEdukasi(
    formData: EdukasiFormData,
    editingId: number | null
  ): Promise<void> {
    // Validate form data
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
      this.view.displayError(
        "Mohon lengkapi semua field yang wajib diisi termasuk minimal 1 konten dan kesimpulan"
      );
      return;
    }

    try {
      // Clean up data before saving
      const cleanedFormData = {
        ...formData,
        tableOfContents: this.model.generateTableOfContents(formData),
        content: formData.content.filter(
          (section) =>
            section.h2.trim() !== "" && section.paragraph.trim() !== ""
        ),
        importantPoints: formData.importantPoints.filter(
          (point) => point.trim() !== ""
        ),
      };

      if (editingId) {
        await this.model.updateEdukasi(editingId, cleanedFormData);
        this.view.displaySuccess("Edukasi berhasil diperbarui");
      } else {
        await this.model.createEdukasi(cleanedFormData);
        this.view.displaySuccess("Edukasi berhasil ditambahkan");
      }

      this.view.closeDialog();
      this.view.resetForm();
      await this.loadEdukasiList();
    } catch (error) {
      this.view.displayError("Terjadi kesalahan saat menyimpan edukasi");
    }
  }

  async deleteEdukasi(id: number): Promise<void> {
    try {
      await this.model.deleteEdukasi(id);
      this.view.displaySuccess("Edukasi berhasil dihapus");
      await this.loadEdukasiList();
    } catch (error) {
      this.view.displayError("Terjadi kesalahan saat menghapus Edukasi");
    }
  }

  // Helper methods for form manipulation
  addContentSection(content: ContentSection[]): ContentSection[] {
    const newId = Date.now().toString();
    return [
      ...content,
      { id: newId, h2: "", paragraph: "", illustration: undefined },
    ];
  }

  removeContentSection(
    content: ContentSection[],
    id: string
  ): ContentSection[] {
    if (content.length > 1) {
      return content.filter((section) => section.id !== id);
    }
    return content;
  }

  updateContentSection(
    content: ContentSection[],
    id: string,
    field: keyof ContentSection,
    value: any
  ): ContentSection[] {
    return content.map((section) =>
      section.id === id ? { ...section, [field]: value } : section
    );
  }

  addIllustrationToContent(
    content: ContentSection[],
    id: string
  ): ContentSection[] {
    return content.map((section) =>
      section.id === id
        ? {
            ...section,
            illustration: { type: "image", url: "", caption: "" },
          }
        : section
    );
  }

  removeIllustrationFromContent(
    content: ContentSection[],
    id: string
  ): ContentSection[] {
    return content.map((section) =>
      section.id === id ? { ...section, illustration: undefined } : section
    );
  }

  addImportantPoint(points: string[]): string[] {
    return [...points, ""];
  }

  removeImportantPoint(points: string[], index: number): string[] {
    if (points.length > 1) {
      return points.filter((_, i) => i !== index);
    }
    return points;
  }

  updateImportantPoint(
    points: string[],
    index: number,
    value: string
  ): string[] {
    return points.map((point, i) => (i === index ? value : point));
  }
}
