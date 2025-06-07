export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
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
  author?: {
    name: string;
    avatar?: string;
  };
  published_at: string;
  reading_time: number;
  status?: string;
  tags?: string[];
}

export interface EducationWithDetails extends Article {
  featured?: boolean;
}

export class ArticleModel {
  private static articles: EducationWithDetails[] = [
    {
      id: "1",
      title: "Mengenal Stunting dan Dampaknya pada Anak",
      excerpt:
        "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis.",
      category: "Stunting",
      content_sections: [
        {
          slug: "pengertian-stunting",
          heading: "Pengertian Stunting",
          paragraph: "Stunting merupakan masalah kesehatan yang serius...",
          section_order: 1,
        },
      ],
      conclusion: {
        heading: "Kesimpulan",
        paragraph: "Stunting dapat dicegah dengan nutrisi yang tepat...",
      },
      view_count: 1250,
      like_count: 45,
      featured_image: "/articles/stunting-1.jpg",
      author: {
        name: "Dr. Sarah Nutritionist",
        avatar: "/authors/dr-sarah.jpg",
      },
      published_at: "2024-01-15",
      reading_time: 5,
      tags: ["stunting", "kesehatan", "anak"],
    },
    {
      id: "2",
      title: "Nutrisi Penting untuk Mencegah Stunting",
      excerpt:
        "Pelajari nutrisi essential yang dibutuhkan anak untuk pertumbuhan optimal.",
      category: "Nutrisi",
      content_sections: [
        {
          slug: "nutrisi-penting",
          heading: "Nutrisi Penting",
          paragraph:
            "Nutrisi yang tepat sangat penting untuk mencegah stunting...",
          section_order: 1,
        },
      ],
      conclusion: {
        heading: "Kesimpulan",
        paragraph: "Nutrisi yang cukup adalah kunci pencegahan stunting...",
      },
      view_count: 980,
      like_count: 32,
      featured_image: "/articles/nutrition-1.jpg",
      author: {
        name: "Dr. Ahmad Gizi",
        avatar: "/authors/dr-ahmad.jpg",
      },
      published_at: "2024-01-10",
      reading_time: 7,
      tags: ["nutrisi", "stunting", "anak"],
    },
    {
      id: "3",
      title: "Tips Praktis Pemberian MPASI",
      excerpt: "Panduan lengkap memberikan makanan pendamping ASI yang tepat.",
      category: "MPASI",
      content_sections: [
        {
          slug: "tips-mpasi",
          heading: "Tips MPASI",
          paragraph: "MPASI yang tepat adalah kunci pertumbuhan anak...",
          section_order: 1,
        },
      ],
      conclusion: {
        heading: "Kesimpulan",
        paragraph:
          "Pemberian MPASI yang tepat mendukung tumbuh kembang anak...",
      },
      view_count: 1100,
      like_count: 58,
      featured_image: "/articles/mpasi-1.jpg",
      author: {
        name: "Dr. Lisa Pediatri",
        avatar: "/authors/dr-lisa.jpg",
      },
      published_at: "2024-01-05",
      reading_time: 6,
      tags: ["mpasi", "bayi", "makanan"],
    },
  ];

  static async getAllArticles(): Promise<EducationWithDetails[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.articles), 100);
    });
  }

  static getArticleById(id: string): Article | null {
    return this.articles.find((article) => article.id === id) || null;
  }

  static getRelatedArticles(
    category: string,
    excludeId: string,
    limit: number
  ): Article[] {
    return this.articles
      .filter(
        (article) => article.category === category && article.id !== excludeId
      )
      .slice(0, limit);
  }

  static updateArticleViews(id: string): void {
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      article.view_count = (article.view_count || 0) + 1;
    }
  }

  static updateArticleLikes(id: string, increment: number): void {
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      article.like_count = Math.max(0, (article.like_count || 0) + increment);
    }
  }

  static getAllCategories(): string[] {
    const categories = [
      ...new Set(this.articles.map((article) => article.category)),
    ];
    return categories;
  }

  static searchArticles(term: string): EducationWithDetails[] {
    const searchTerm = term.toLowerCase();
    return this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.excerpt.toLowerCase().includes(searchTerm)
    );
  }

  static filterByCategory(category: string): EducationWithDetails[] {
    if (category === "all") return this.articles;
    return this.articles.filter((article) => article.category === category);
  }
}
