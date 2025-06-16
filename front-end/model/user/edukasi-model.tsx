export interface Article {
  id: string;
  slug?: string; // Add slug field
  title: string;
  excerpt: string;
  category: string;
  tags: string[]; // perubahan caca: Menambahkan field tags
  source?: string; // perubahan caca: Menambahkan field source
  author: string; // perubahan caca: Menambahkan field author
  recommended_education?: "normal" | "stunting" | "severly_stunting";
  content_sections: Array<{
    id?: string;
    slug: string;
    heading: string;
    paragraph: string;
    section_order: number;
    illustration?: {
      type: "image" | "video";
      url: string;
      caption?: string;
    };
  }>;
  conclusion: {
    heading: string;
    paragraph: string;
  };
  important_points?: Array<{
    id: string;
    content: string;
    point_order: number;
  }>;
  view_count: number;
  like_count: number;
  featured_image?: string;
  published_at: string;
  created_at: string; // perubahan caca: Menambahkan created date
  reading_time: number;
  status?: string;
}

export interface EducationWithDetails extends Article {
  featured?: boolean;
}

export class ArticleModel {
  // perubahan caca: Update endpoint ke educations
  private static readonly baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";

  static async getAllArticles(): Promise<EducationWithDetails[]> {
    try {
      // perubahan caca: Update endpoint ke educations
      const response = await fetch(`${this.baseUrl}/api/educations`);
      if (!response.ok) {
        throw new Error("Failed to fetch educations");
      }

      const result = await response.json();

      // perubahan caca: Transform data dengan field tambahan
      return result.data.map((item: any) => ({
        id: item.id.toString(),
        slug: item.slug, // Add slug field
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tags: item.tags || [], // perubahan caca: Include tags
        source: item.source, // perubahan caca: Include source
        author: item.author, // perubahan caca: Include author
        recommended_education: item.recommended_education || "normal",
        content_sections:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            slug: this.generateSlug(section.heading),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: {
          heading: item.conclusion?.[0]?.heading || "Kesimpulan",
          paragraph: item.conclusion?.[0]?.paragraph || "",
        },
        important_points:
          item.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: item.view_count || 0,
        like_count: item.like_count || 0,
        featured_image:
          item.header_image || "/placeholder.svg?height=400&width=600",
        published_at: item.publish_date || item.created_at,
        created_at: item.created_at, // perubahan caca: Include created date
        reading_time: item.reading_time || 5,
      }));
    } catch (error) {
      console.error("Error fetching educations:", error);
      return [];
    }
  }

  static async getArticleById(id: string): Promise<Article | null> {
    try {
      // perubahan caca: Update endpoint ke educations
      const response = await fetch(`${this.baseUrl}/api/educations/${id}`);
      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      const item = result.data;

      // perubahan caca: Transform single education data dengan field tambahan
      return {
        id: item.id.toString(),
        slug: item.slug, // Add slug field
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tags: item.tags || [], // perubahan caca: Include tags
        source: item.source, // perubahan caca: Include source
        author: item.author, // perubahan caca: Include author
        recommended_education: item.recommended_education || "normal",
        content_sections:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            slug: this.generateSlug(section.heading),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: {
          heading: item.conclusion?.[0]?.heading || "Kesimpulan",
          paragraph: item.conclusion?.[0]?.paragraph || "",
        },
        important_points:
          item.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: item.view_count || 0,
        like_count: item.like_count || 0,
        featured_image:
          item.header_image || "/placeholder.svg?height=400&width=600",
        published_at: item.publish_date || item.created_at,
        created_at: item.created_at, // perubahan caca: Include created date
        reading_time: item.reading_time || 5,
      };
    } catch (error) {
      console.error("Error fetching education:", error);
      return null;
    }
  }

  // NEW: Get article by slug - PERBAIKAN URL
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      // Coba endpoint educations terlebih dahulu (konsisten dengan getAllArticles)
      let response = await fetch(`${this.baseUrl}/api/educations/slug/${slug}`);

      // Jika gagal, coba endpoint articles sebagai fallback
      if (!response.ok) {
        console.log(
          `Educations endpoint failed for ${slug}, trying articles endpoint`
        );
        response = await fetch(`${this.baseUrl}/api/articles/slug/${slug}`);
      }

      // Jika masih gagal dan slug terlihat seperti ID, coba sebagai ID
      if (!response.ok && !isNaN(Number(slug))) {
        console.log(`Slug ${slug} not found, trying as ID`);
        response = await fetch(`${this.baseUrl}/api/educations/${slug}`);
      }

      if (!response.ok) {
        console.log(`Article not found: ${slug}`);
        return null;
      }

      const result = await response.json();
      const item = result.data;

      return {
        id: item.id.toString(),
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tags: item.tags || [],
        source: item.source,
        author: item.author,
        recommended_education: item.recommended_education || "normal",
        content_sections:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            slug: this.generateSlug(section.heading),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: {
          heading: item.conclusion?.[0]?.heading || "Kesimpulan",
          paragraph: item.conclusion?.[0]?.paragraph || "",
        },
        important_points:
          item.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: item.view_count || 0,
        like_count: item.like_count || 0,
        featured_image:
          item.header_image || "/placeholder.svg?height=400&width=600",
        published_at: item.publish_date || item.created_at,
        created_at: item.created_at,
        reading_time: item.reading_time || 5,
      };
    } catch (error) {
      console.error("Error fetching education by slug:", error);
      return null;
    }
  }

  static async getRelatedArticles(
    category: string,
    excludeId: string,
    limit: number
  ): Promise<Article[]> {
    try {
      const articles = await this.getAllArticles();
      return articles
        .filter(
          (article) => article.category === category && article.id !== excludeId
        )
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching related educations:", error);
      return [];
    }
  }

  static async updateArticleViews(id: string): Promise<void> {
    try {
      // perubahan caca: View count sudah dihandle otomatis di backend saat get education by id
      // Tidak perlu implementasi khusus di sini
    } catch (error) {
      console.error("Error updating education views:", error);
    }
  }

  // perubahan caca: Update like function dengan toggle functionality
  static async updateArticleLikes(
    id: string
  ): Promise<{ action: "liked" | "unliked" }> {
    try {
      // perubahan caca: Update endpoint ke educations
      const response = await fetch(
        `${this.baseUrl}/api/educations/${id}/like`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      const result = await response.json();
      return { action: result.action };
    } catch (error) {
      console.error("Error updating education likes:", error);
      return { action: "liked" };
    }
  }

  // perubahan caca: Check if user has liked education
  static async checkLikeStatus(id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/educations/${id}/like-status`
      );
      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.data.hasLiked;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  }

  static async getAllCategories(): Promise<string[]> {
    try {
      const articles = await this.getAllArticles();
      const categories = [
        ...new Set(articles.map((article) => article.category)),
      ];
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  static async searchArticles(term: string): Promise<EducationWithDetails[]> {
    try {
      const articles = await this.getAllArticles();
      const searchTerm = term.toLowerCase();
      return articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm) ||
          article.excerpt.toLowerCase().includes(searchTerm) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) // perubahan caca: Include tags dalam search
      );
    } catch (error) {
      console.error("Error searching educations:", error);
      return [];
    }
  }

  static async filterByCategory(
    category: string
  ): Promise<EducationWithDetails[]> {
    try {
      if (category === "all") {
        return await this.getAllArticles();
      }

      // perubahan caca: Update endpoint ke educations
      const response = await fetch(
        `${this.baseUrl}/api/educations?category=${encodeURIComponent(
          category
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch educations by category");
      }

      const result = await response.json();

      // perubahan caca: Transform data dengan field tambahan
      return result.data.map((item: any) => ({
        id: item.id.toString(),
        slug: item.slug, // Add slug field
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tags: item.tags || [], // perubahan caca: Include tags
        source: item.source, // perubahan caca: Include source
        author: item.author, // perubahan caca: Include author
        recommended_education: item.recommended_education || "normal",
        content_sections:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            slug: this.generateSlug(section.heading),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: {
          heading: item.conclusion?.[0]?.heading || "Kesimpulan",
          paragraph: item.conclusion?.[0]?.paragraph || "",
        },
        important_points:
          item.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: item.view_count || 0,
        like_count: item.like_count || 0,
        featured_image:
          item.header_image || "/placeholder.svg?height=400&width=600",
        published_at: item.publish_date || item.created_at,
        created_at: item.created_at, // perubahan caca: Include created date
        reading_time: item.reading_time || 5,
      }));
    } catch (error) {
      console.error("Error filtering educations by category:", error);
      return [];
    }
  }

  static async getRecommendedArticles(
    recommendationType: "normal" | "stunting" | "severly_stunting"
  ): Promise<EducationWithDetails[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/educations?recommended_education=${recommendationType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommended educations");
      }

      const result = await response.json();

      return result.data.map((item: any) => ({
        id: item.id.toString(),
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        category: item.category,
        tags: item.tags || [],
        source: item.source,
        author: item.author,
        recommended_education: item.recommended_education || "normal",
        content_sections:
          item.content_sections?.map((section: any, index: number) => ({
            id: section.id?.toString() || index.toString(),
            slug: this.generateSlug(section.heading),
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.section_order || index + 1,
            illustration: section.illustration,
          })) || [],
        conclusion: {
          heading: item.conclusion?.[0]?.heading || "Kesimpulan",
          paragraph: item.conclusion?.[0]?.paragraph || "",
        },
        important_points:
          item.important_points?.map((point: any) => ({
            id: point.id?.toString() || Math.random().toString(),
            content: point.content,
            point_order: point.point_order || 1,
          })) || [],
        view_count: item.view_count || 0,
        like_count: item.like_count || 0,
        featured_image:
          item.header_image || "/placeholder.svg?height=400&width=600",
        published_at: item.publish_date || item.created_at,
        created_at: item.created_at,
        reading_time: item.reading_time || 5,
      }));
    } catch (error) {
      console.error("Error fetching recommended educations:", error);
      return [];
    }
  }

  private static generateSlug(heading: string): string {
    return heading
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
}
