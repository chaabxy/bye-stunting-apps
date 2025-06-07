// Model: Handles data fetching and business logic

export interface DashboardStats {
  articles: number;
  videos: number;
  healthData: number;
}

export class DashboardModel {
  async fetchStats(): Promise<DashboardStats> {
    try {
      const [articlesRes, videosRes, healthDataRes] = await Promise.all([
        fetch("/api/articles"),
        fetch("/api/videos"),
        fetch("/api/health-data"),
      ]);

      const [articles, videos, healthData] = await Promise.all([
        articlesRes.json(),
        videosRes.json(),
        healthDataRes.json(),
      ]);

      return {
        articles: Array.isArray(articles) ? articles.length : 0,
        videos: Array.isArray(videos) ? videos.length : 0,
        healthData: Array.isArray(healthData) ? healthData.length : 0,
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { articles: 0, videos: 0, healthData: 0 };
    }
  }

  getQuickActions() {
    return [
      {
        label: "Kelola Edukasi",
        href: "/kelola-edukasi",
        icon: "FileText" as const,
        color: "from-blue-500 to-blue-600",
        description: "Artikel & Video",
      },
      {
        label: "Kelola Data Stunting",
        href: "/kelola-data-stunting",
        icon: "Database" as const,
        color: "from-green-500 to-green-600",
        description: "Data Kesehatan",
      },
      {
        label: "Pesan User",
        href: "/kelola-pesan-user",
        icon: "TrendingUp" as const,
        color: "from-purple-500 to-purple-600",
        description: "Komunikasi",
      },
    ];
  }
}
