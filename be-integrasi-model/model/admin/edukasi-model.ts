// Model: Represents the data structure and business logic

export interface ContentSection {
  id: string;
  h2: string;
  paragraph: string;
  illustration?: {
    type: "image" | "video";
    url: string;
    caption: string;
  };
}

export interface Edukasi {
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

export interface EdukasiFormData {
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
}

export const categories = [
  "Pengetahuan Umum",
  "Nutrisi",
  "Tips Praktis",
  "Resep Makanan",
];

export class EdukasiModel {
  async fetchAllEdukasi(): Promise<Edukasi[]> {
    try {
      const response = await fetch("/api/articles");
      if (!response.ok) {
        throw new Error("Failed to fetch edukasi data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching edukasi:", error);
      throw error;
    }
  }

  async createEdukasi(data: EdukasiFormData): Promise<Edukasi> {
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create edukasi");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating edukasi:", error);
      throw error;
    }
  }

  async updateEdukasi(id: number, data: EdukasiFormData): Promise<Edukasi> {
    try {
      const response = await fetch("/api/articles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update edukasi");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating edukasi:", error);
      throw error;
    }
  }

  async deleteEdukasi(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete edukasi");
      }
    } catch (error) {
      console.error("Error deleting edukasi:", error);
      throw error;
    }
  }

  generateTableOfContents(formData: EdukasiFormData): string[] {
    const toc = formData.content
      .filter((section) => section.h2.trim() !== "")
      .map((section) => section.h2);

    if (formData.conclusion.paragraph.trim() !== "") {
      toc.push(formData.conclusion.h2);
    }

    return toc;
  }
}
