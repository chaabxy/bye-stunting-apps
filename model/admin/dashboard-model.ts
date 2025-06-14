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
  private baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      console.log(`🔍 Fetching from: ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      // Check if response is ok
      if (!response.ok) {
        console.error(
          `❌ HTTP Error: ${response.status} ${response.statusText}`
        );
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`❌ Invalid content type: ${contentType}`);
        const text = await response.text();
        console.error("Response body:", text.substring(0, 200));
        throw new Error("Response is not JSON");
      }

      const data = await response.json();
      console.log(`✅ Successfully fetched data from ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error);
      throw error;
    }
  }

  async fetchStats(): Promise<DashboardStats> {
    try {
      // Use Next.js API routes instead of external backend
      const [articlesRes, healthDataRes] = await Promise.allSettled([
        this.fetchWithErrorHandling("/api/articles"),
        this.fetchWithErrorHandling("/api/health-data"),
      ]);

      let articles = 0;
      let healthData = 0;

      if (articlesRes.status === "fulfilled") {
        articles = Array.isArray(articlesRes.value)
          ? articlesRes.value.length
          : 0;
      }

      if (healthDataRes.status === "fulfilled") {
        healthData = Array.isArray(healthDataRes.value)
          ? healthDataRes.value.length
          : 0;
      }

      return {
        articles,
        videos: 0, // Placeholder since videos API might not exist
        healthData,
      };
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      return { articles: 0, videos: 0, healthData: 0 };
    }
  }

  // Fetch popular education content with fallback
  async fetchEdukasiPopuler(): Promise<EdukasiPopuler[]> {
    try {
      // Try Next.js API route first
      try {
        const result = await this.fetchWithErrorHandling(
          "/api/articles/popular"
        );
        if (result && Array.isArray(result)) {
          return result.slice(0, 5); // Limit to 5 items
        }
      } catch (error) {
        console.log("⚠️ Next.js API route failed, trying backend...");
      }

      // Fallback to backend API
      try {
        const result = await this.fetchWithErrorHandling(
          `${this.baseUrl}/api/dashboard/edukasi-populer`
        );

        if (result.data && Array.isArray(result.data)) {
          return result.data;
        } else if (Array.isArray(result)) {
          return result;
        }
      } catch (error) {
        console.log("⚠️ Backend API also failed");
      }

      // Return mock data as fallback
      return [
        { id: 1, title: "Panduan Nutrisi Balita", view_count: 150 },
        { id: 2, title: "Mengenal Tanda-tanda Stunting", view_count: 120 },
        { id: 3, title: "Tips Mencegah Stunting", view_count: 100 },
      ];
    } catch (error) {
      console.error("❌ Error fetching popular education:", error);
      return [];
    }
  }

  // Fetch unread messages with fallback
  async fetchUnreadMessages(): Promise<UnreadMessagesSummary> {
    try {
      // Try Next.js API route first
      try {
        const result = await this.fetchWithErrorHandling("/api/user-messages");
        if (result && Array.isArray(result)) {
          const unreadMessages = result
            .filter((msg) => msg.status === "BelumDibaca")
            .slice(0, 5);
          return {
            count: unreadMessages.length,
            messages: unreadMessages,
          };
        }
      } catch (error) {
        console.log("⚠️ Next.js API route failed, trying backend...");
      }

      // Fallback to backend API
      try {
        const result = await this.fetchWithErrorHandling(
          `${this.baseUrl}/api/dashboard/unread-messages`
        );

        if (result.data && result.data.messages) {
          return {
            count: result.data.summary?.unread || 0,
            messages: result.data.messages || [],
          };
        }
      } catch (error) {
        console.log("⚠️ Backend API also failed");
      }

      // Return mock data as fallback
      return {
        count: 2,
        messages: [
          {
            id: 1,
            status: "BelumDibaca",
            name: "Ibu Sarah",
            email: "sarah@email.com",
            subject: "Konsultasi Stunting",
          },
          {
            id: 2,
            status: "BelumDibaca",
            name: "Bapak Ahmad",
            email: "ahmad@email.com",
            subject: "Pertanyaan Nutrisi",
          },
        ],
      };
    } catch (error) {
      console.error("❌ Error fetching unread messages:", error);
      return { count: 0, messages: [] };
    }
  }

  // Fetch latest stunting records with fallback
  async fetchLastStuntingRecords(): Promise<StuntingRecord[]> {
    try {
      // Try Next.js API route first
      try {
        const result = await this.fetchWithErrorHandling("/api/health-data");
        if (result && Array.isArray(result)) {
          return result.slice(0, 5).map((record: any) => ({
            id: record.id,
            childName: record.child_name || record.name,
            age: record.age,
            gender: record.gender,
            height: record.height,
            weight: record.weight,
            status: record.status,
            createdAt: record.created_at || new Date().toISOString(),
          }));
        }
      } catch (error) {
        console.log("⚠️ Next.js API route failed, trying backend...");
      }

      // Fallback to backend API
      try {
        const result = await this.fetchWithErrorHandling(
          `${this.baseUrl}/api/dashboard/last-stunting-records`
        );

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
      } catch (error) {
        console.log("⚠️ Backend API also failed");
      }

      // Return mock data as fallback
      return [
        {
          id: 1,
          childName: "Andi",
          age: 24,
          gender: "L",
          height: 85,
          weight: 12,
          status: "normal",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          childName: "Sari",
          age: 30,
          gender: "P",
          height: 82,
          weight: 10,
          status: "stunting",
          createdAt: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error("❌ Error fetching last stunting records:", error);
      return [];
    }
  }

  // Main method to fetch all dashboard data
  async fetchDashboardSummary(): Promise<DashboardSummary> {
    try {
      console.log("🔍 Fetching dashboard summary...");

      // Use Promise.allSettled to prevent one failure from breaking everything
      const [edukasiResult, messagesResult, recordsResult] =
        await Promise.allSettled([
          this.fetchEdukasiPopuler(),
          this.fetchUnreadMessages(),
          this.fetchLastStuntingRecords(),
        ]);

      const edukasiPopuler =
        edukasiResult.status === "fulfilled" ? edukasiResult.value : [];
      const unreadMessages =
        messagesResult.status === "fulfilled"
          ? messagesResult.value
          : { count: 0, messages: [] };
      const lastStuntingRecords =
        recordsResult.status === "fulfilled" ? recordsResult.value : [];

      console.log("✅ Dashboard summary fetched successfully");

      return {
        edukasiPopuler,
        unreadMessages,
        lastStuntingRecords,
      };
    } catch (error) {
      console.error("❌ Error fetching dashboard summary:", error);

      // Return empty structure if everything fails
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
