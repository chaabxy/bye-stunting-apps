// Model: Handles data fetching and business logic

export interface DashboardStats {
  articles: number;
  videos: number;
  healthData: number;
}

export interface EdukasiPopuler {
  id: number;
  title: string;
  view_count: number;
}

export interface UnreadMessage {
  id: number;
  status: string;
  name?: string;
  email?: string;
  subject?: string;
}

export interface UnreadMessagesSummary {
  count: number;
  messages: UnreadMessage[];
}

export interface StuntingRecord {
  id: number;
  createdAt: string;
  childName?: string;
  age?: number;
  name?: string;
  gender?: string;
  height?: number;
  weight?: number;
  status?: string;
  created_at?: string;
}

export interface DashboardSummary {
  edukasiPopuler: EdukasiPopuler[];
  unreadMessages: UnreadMessagesSummary;
  lastStuntingRecords: StuntingRecord[];
}

export class DashboardModel {
  // Base URL for backend API
  private baseUrl = "http://localhost:3001"; // Adjust this to match your backend server URL

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

  // Fetch popular education content directly from backend
  async fetchEdukasiPopuler(): Promise<EdukasiPopuler[]> {
    try {
      console.log(
        `🔍 Fetching popular education data from ${this.baseUrl}/api/dashboard/edukasi-populer...`
      );

      const response = await fetch(
        `${this.baseUrl}/api/dashboard/edukasi-populer`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any required auth headers here
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        throw new Error(
          `Failed to fetch popular education: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("📥 Popular education API response:", result);

      // Handle the specific response structure from your backend
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result)) {
        return result;
      }

      console.warn("Unexpected API response structure:", result);
      return [];
    } catch (error) {
      console.error("❌ Error fetching popular education:", error);
      return [];
    }
  }

  // Fetch unread messages directly from backend
  async fetchUnreadMessages(): Promise<UnreadMessagesSummary> {
    try {
      console.log(
        `🔍 Fetching unread messages from ${this.baseUrl}/api/dashboard/unread-messages...`
      );

      const response = await fetch(
        `${this.baseUrl}/api/dashboard/unread-messages`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any required auth headers here
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        throw new Error(`Failed to fetch unread messages: ${response.status}`);
      }

      const result = await response.json();
      console.log("📥 Unread messages API response:", result);

      if (result.data && result.data.messages) {
        return {
          count: result.data.summary?.unread || 0,
          messages: result.data.messages || [],
        };
      }

      return { count: 0, messages: [] };
    } catch (error) {
      console.error("❌ Error fetching unread messages:", error);
      return { count: 0, messages: [] };
    }
  }

  // Fetch latest stunting records directly from backend
  async fetchLastStuntingRecords(): Promise<StuntingRecord[]> {
    try {
      console.log(
        `🔍 Fetching last stunting records from ${this.baseUrl}/api/dashboard/last-stunting-records...`
      );

      const response = await fetch(
        `${this.baseUrl}/api/dashboard/last-stunting-records`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any required auth headers here
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        throw new Error(`Failed to fetch stunting records: ${response.status}`);
      }

      const result = await response.json();
      console.log("📥 Last stunting records API response:", result);

      if (result.data && Array.isArray(result.data)) {
        return result.data.map((record: any) => ({
          id: record.id,
          childName: record.name,
          age: record.age,
          gender: record.gender,
          height: record.height,
          weight: record.weight,
          status: record.status,
          createdAt: record.created_at || new Date().toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error("❌ Error fetching last stunting records:", error);
      return [];
    }
  }

  // Legacy method - kept for backward compatibility
  async fetchDashboardSummary(): Promise<DashboardSummary> {
    try {
      console.log("🔍 Fetching dashboard summary from multiple API sources...");

      // Use the new separate methods
      const [edukasiPopuler, unreadMessages, lastStuntingRecords] =
        await Promise.all([
          this.fetchEdukasiPopuler(),
          this.fetchUnreadMessages(),
          this.fetchLastStuntingRecords(),
        ]);

      console.log("📥 Dashboard summary composed successfully");

      return {
        edukasiPopuler,
        unreadMessages,
        lastStuntingRecords,
      };
    } catch (error) {
      console.error("❌ Error fetching dashboard summary:", error);

      // Return struktur kosong jika terjadi error
      return {
        edukasiPopuler: [],
        unreadMessages: { count: 0, messages: [] },
        lastStuntingRecords: [],
      };
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
