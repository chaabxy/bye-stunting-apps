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
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";

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

  // Fetch provinces that have stunting data
  async fetchProvincesWithData(): Promise<{ id: string; name: string }[]> {
    try {
      console.log("🔍 Fetching provinces with stunting data...");

      // Try backend API directly
      try {
        const result = await this.fetchWithErrorHandling(
          `${this.baseUrl}/api/provinces-with-data`
        );

        console.log("🔍 Raw backend response:", result);

        // Handle different response formats
        if (result && result.success && Array.isArray(result.data)) {
          console.log(
            "✅ Provinces with data fetched from backend (success format):",
            result.data
          );
          return result.data.map((province: any) => ({
            id: String(province.id),
            name: province.name,
          }));
        } else if (result && Array.isArray(result.data)) {
          console.log(
            "✅ Provinces with data fetched from backend (data format):",
            result.data
          );
          return result.data.map((province: any) => ({
            id: String(province.id),
            name: province.name,
          }));
        } else if (Array.isArray(result)) {
          console.log(
            "✅ Provinces with data fetched from backend (array format):",
            result
          );
          return result.map((province: any) => ({
            id: String(province.id),
            name: province.name,
          }));
        } else {
          console.log("⚠️ Unexpected response format:", result);
        }
      } catch (error) {
        console.log("⚠️ Backend API failed:", error);
      }

      // Return mock data for testing
      console.log("⚠️ Using mock data for provinces");
      return [
        { id: "1", name: "DKI Jakarta" },
        { id: "2", name: "Jawa Barat" },
        { id: "3", name: "Jawa Tengah" },
        { id: "4", name: "Jawa Timur" },
        { id: "5", name: "Sumatera Utara" },
      ];
    } catch (error) {
      console.error("❌ Error fetching provinces with data:", error);
      return [];
    }
  }

  // Fetch province statistics
  async fetchProvinceStats(provinceId: string): Promise<{
    normal: number;
    stunting: number;
    stuntingBerat: number;
    totalChildren: number;
  }> {
    try {
      console.log(`🔍 Fetching stats for province: ${provinceId}`);

      // Try backend API directly
      try {
        const result = await this.fetchWithErrorHandling(
          `${this.baseUrl}/api/health-data/province-detail?provinceId=${provinceId}`
        );

        console.log("🔍 Raw province stats response:", result);

        if (result && typeof result === "object") {
          const stats = {
            normal: Number(result.normal) || 0,
            stunting: Number(result.stunting) || 0,
            stuntingBerat:
              Number(result.stuntingBerat) ||
              Number(result.severe_stunting) ||
              0,
            totalChildren: Number(result.totalChildren) || 0,
          };
          console.log("✅ Province stats processed:", stats);
          console.log(
            `📊 Validation - Total percentage: ${
              stats.normal + stats.stunting + stats.stuntingBerat
            }%`
          );
          return stats;
        }
      } catch (error) {
        console.log("⚠️ Backend API failed:", error);
      }

      // Return realistic mock stats for testing
      console.log("⚠️ Using realistic mock stats for province:", provinceId);
      return {
        normal: 65,
        stunting: 25,
        stuntingBerat: 10,
        totalChildren: 1500,
      };
    } catch (error) {
      console.error("❌ Error fetching province stats:", error);
      return {
        normal: 0,
        stunting: 0,
        stuntingBerat: 0,
        totalChildren: 0,
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
