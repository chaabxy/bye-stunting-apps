// perubahan caca: Presenter admin yang langsung berkomunikasi dengan backend
import type {
  UserMessage,
  MessageStats,
} from "@/model/admin/user-message-model";
import { toast } from "@/presenter/hooks/use-toast";

export interface MessageView {
  updateMessages: (messages: UserMessage[]) => void;
  updateFilteredMessages: (messages: UserMessage[]) => void;
  updateSelectedMessage: (message: UserMessage | null) => void;
  updateIsDetailOpen: (isOpen: boolean) => void;
  updateIsReplyOpen: (isOpen: boolean) => void;
  updateReplyText: (text: string) => void;
  updateIsLoading: (isLoading: boolean) => void;
  updateStats: (stats: MessageStats) => void;
}

export class MessagePresenter {
  private messages: UserMessage[];
  private view: MessageView;
  private searchTerm = "";
  private statusFilter = "semua";
  private backendUrl = "https://be-byestunting-production.up.railway.app";
  private stats: MessageStats = {
    total: 0,
    baru: 0,
    ditolak: 0,
    dibalas: 0,
  };

  constructor(view: MessageView) {
    this.messages = []; // Start with empty array
    this.view = view;

    // Fetch initial data from database only
    this.fetchMessages();
    this.fetchStats();

    console.log(
      "🔍 Trying to fetch messages from:",
      `${this.backendUrl}/api/messages`
    );
    console.log(
      "🔍 Trying to fetch stats from:",
      `${this.backendUrl}/api/messages/stats`
    );
  }

  public getStats(): MessageStats {
    return this.stats;
  }

  // Perbaikan: Gunakan headers yang sama seperti kelola-data-stunting
  private getHeaders(): HeadersInit {
    const token =
      localStorage.getItem("adminLoggedIn") === "true" ? "true" : null;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  public async fetchMessages() {
    this.view.updateIsLoading(true);
    try {
      // Fetch all messages first, then filter on frontend
      const response = await fetch(`${this.backendUrl}/api/messages`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("📡 Messages response status:", response.status);

      if (!response.ok) {
        console.error(
          `❌ Backend responded with status: ${response.status} ${response.statusText}`
        );
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Messages data received:", data);

      if (data.isError) {
        throw new Error(data.message || "Gagal mengambil data pesan");
      }

      if (!data.data || !Array.isArray(data.data)) {
        console.warn("⚠️ Data pesan tidak tersedia dari backend");
        this.messages = [];
        this.view.updateMessages([]);
        this.view.updateFilteredMessages([]);
        return;
      }

      // Map all messages
      this.messages = data.data.map((msg: any) => ({
        id: msg.id.toString(),
        namaLengkap: msg.nama_lengkap || msg.name || "Nama tidak tersedia",
        email: msg.email || "Email tidak tersedia",
        subjek: msg.subjek || msg.subject || "Subjek tidak tersedia",
        pesan: msg.pesan || msg.message || "Pesan tidak tersedia",
        tanggalKirim: msg.tanggal_kirim
          ? new Date(msg.tanggal_kirim).toLocaleString("id-ID")
          : new Date().toLocaleString("id-ID"),
        status: msg.status || "BelumDibaca",
        tanggalBalas: msg.tanggal_balas
          ? new Date(msg.tanggal_balas).toLocaleString("id-ID")
          : undefined,
      }));

      // Apply filters
      this.applyFilters();

      this.view.updateMessages(this.messages);
      console.log("✅ Messages loaded successfully:", this.messages.length);
    } catch (error) {
      console.error("Error fetching messages:", error);
      this.messages = [];
      this.view.updateMessages([]);
      this.view.updateFilteredMessages([]);

      toast({
        title: "Error",
        description: "Tidak dapat mengambil data pesan dari server",
        variant: "destructive",
      });
    } finally {
      this.view.updateIsLoading(false);
    }
  }

  // Perbaikan: Coba endpoint alternatif jika endpoint utama tidak ada
  private async fetchMessagesAlternative() {
    try {
      // Coba endpoint user-messages seperti di kelola-data-stunting
      const response = await fetch(`${this.backendUrl}/api/user-messages`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Alternative endpoint failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Alternative messages data received:", data);

      if (data.isError) {
        throw new Error(data.message || "Gagal mengambil data pesan");
      }

      if (!data.data || !Array.isArray(data.data)) {
        this.messages = [];
        this.view.updateMessages([]);
        this.view.updateFilteredMessages([]);
        return;
      }

      this.messages = data.data.map((msg: any) => ({
        id: msg.id.toString(),
        namaLengkap: msg.nama_lengkap || msg.name || "Nama tidak tersedia",
        email: msg.email || "Email tidak tersedia",
        subjek: msg.subjek || msg.subject || "Subjek tidak tersedia",
        pesan: msg.pesan || msg.message || "Pesan tidak tersedia",
        tanggalKirim: msg.tanggal_kirim
          ? new Date(msg.tanggal_kirim).toLocaleString("id-ID")
          : new Date().toLocaleString("id-ID"),
        status: msg.status || "BelumDibaca",
        tanggalBalas: msg.tanggal_balas
          ? new Date(msg.tanggal_balas).toLocaleString("id-ID")
          : undefined,
      }));

      this.view.updateMessages(this.messages);
      this.view.updateFilteredMessages(this.messages);
      console.log(
        "✅ Messages loaded from alternative endpoint:",
        this.messages.length
      );
    } catch (error) {
      console.error("Alternative endpoint also failed:", error);
      throw error;
    }
  }

  public async fetchStats() {
    try {
      const response = await fetch(`${this.backendUrl}/api/messages/stats`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      console.log("📡 Stats response status:", response.status);

      if (!response.ok) {
        console.error(
          `❌ Backend responded with status: ${response.status} ${response.statusText}`
        );

        // Jika endpoint tidak ada, hitung stats dari messages yang ada
        if (response.status === 404) {
          console.log("🔄 Calculating stats from messages...");
          this.calculateStatsFromMessages();
          return;
        }

        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Stats data received:", data);

      if (data.isError) {
        throw new Error(data.message || "Gagal mengambil statistik pesan");
      }

      // Hanya gunakan data asli dari backend
      if (!data.data) {
        console.warn("⚠️ Statistik pesan tidak tersedia dari backend");
        this.calculateStatsFromMessages();
        return;
      }

      // Convert BigInt to number for stats and store locally
      this.stats = {
        total: Number(data.data.total || 0),
        baru: Number(data.data.baru || data.data.pending || 0),
        ditolak: Number(data.data.ditolak || 0),
        dibalas: Number(data.data.replied || 0),
      };

      this.view.updateStats(this.stats);
      console.log("✅ Stats loaded successfully:", this.stats);
    } catch (error) {
      console.error("Error fetching message stats:", error);
      this.calculateStatsFromMessages();
    }
  }

  // Perbaikan: Hitung stats dari messages yang ada
  private calculateStatsFromMessages() {
    this.stats = {
      total: this.messages.length,
      baru: this.messages.filter((m) => m.status === "BelumDibaca").length,
      ditolak: this.messages.filter((m) => m.status === "Ditolak").length,
      dibalas: this.messages.filter((m) => m.status === "Dibalas").length,
    };

    this.view.updateStats(this.stats);
    console.log("✅ Stats calculated from messages:", this.stats);
  }

  private applyFilters() {
    let filtered = [...this.messages];

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (message) =>
          message.namaLengkap.toLowerCase().includes(searchLower) ||
          message.email.toLowerCase().includes(searchLower) ||
          message.subjek.toLowerCase().includes(searchLower) ||
          message.pesan.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter !== "semua") {
      filtered = filtered.filter(
        (message) => message.status === this.statusFilter
      );
    }

    this.view.updateFilteredMessages(filtered);
    console.log(
      `🔍 Applied filters: ${filtered.length} messages after filtering`
    );
  }

  public setSearchTerm(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  public setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  public async updateStatus(
    id: string,
    newStatus: UserMessage["status"],
    tanggalBalas?: string
  ): Promise<void> {
    try {
      console.log(`🔄 Updating status for message ID: ${id} to: ${newStatus}`);

      const payload: any = { status: newStatus };
      if (newStatus === "Dibalas" && tanggalBalas) {
        payload.tanggal_balas = tanggalBalas;
      }

      console.log(`📤 Sending payload:`, payload);

      const response = await fetch(
        `${this.backendUrl}/api/messages/${id}/status`,
        {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      console.log(`📡 Update status response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ Update status failed: ${response.status} - ${errorText}`
        );
        throw new Error(
          `Gagal mengubah status pesan - Server error: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(`📥 Update status response:`, data);

      if (data.isError) {
        throw new Error(data.message || "Gagal mengubah status pesan");
      }

      // Update local data hanya jika berhasil
      this.messages = this.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              status: newStatus,
              tanggalBalas:
                newStatus === "Dibalas"
                  ? tanggalBalas || new Date().toLocaleString("id-ID")
                  : undefined,
            }
          : message
      );

      this.view.updateMessages(this.messages);
      this.view.updateFilteredMessages(this.messages);
      this.calculateStatsFromMessages(); // Refresh stats

      toast({
        title: "Status Berhasil Diubah",
        description: `Status pesan berhasil diubah menjadi ${newStatus}`,
      });

      // Refresh data dari server
      await this.fetchMessages();
      await this.fetchStats();
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Gagal Mengubah Status",
        description:
          error instanceof Error
            ? error.message
            : "Tidak dapat mengubah status pesan",
        variant: "destructive",
      });
    }
  }

  public async deleteMessage(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.backendUrl}/api/messages/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus pesan - Server tidak tersedia");
      }

      const data = await response.json();

      if (data.isError) {
        throw new Error(data.message || "Gagal menghapus pesan");
      }

      // Update local data hanya jika berhasil
      this.messages = this.messages.filter((message) => message.id !== id);
      this.view.updateMessages(this.messages);
      this.view.updateFilteredMessages(this.messages);
      this.calculateStatsFromMessages(); // Refresh stats

      toast({
        title: "Pesan Dihapus",
        description: "Pesan berhasil dihapus dari sistem",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Gagal Menghapus Pesan",
        description: "Tidak dapat menghapus pesan - Server tidak tersedia",
        variant: "destructive",
      });
    }
  }

  public async downloadData(): Promise<void> {
    try {
      // Get current filtered messages
      const messagesToDownload =
        this.statusFilter !== "semua"
          ? this.messages.filter((m) => m.status === this.statusFilter)
          : this.messages;

      if (messagesToDownload.length === 0) {
        toast({
          title: "Tidak Ada Data",
          description: "Tidak ada data pesan untuk didownload",
          variant: "destructive",
        });
        return;
      }

      // Create CSV content
      const headers = [
        "No",
        "Nama Lengkap",
        "Email",
        "Subjek",
        "Pesan",
        "Tanggal Kirim",
        "Status",
        "Tanggal Balas",
      ];
      const csvContent = [
        headers.join(","),
        ...messagesToDownload.map((message, index) =>
          [
            index + 1,
            `"${message.namaLengkap}"`,
            `"${message.email}"`,
            `"${message.subjek}"`,
            `"${message.pesan.replace(/"/g, '""')}"`,
            `"${message.tanggalKirim}"`,
            `"${message.status}"`,
            `"${message.tanggalBalas || "-"}"`,
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `pesan-user-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Berhasil",
        description: `${messagesToDownload.length} pesan berhasil didownload`,
      });
    } catch (error) {
      console.error("Error downloading data:", error);
      toast({
        title: "Download Gagal",
        description: "Terjadi error saat mendownload data",
        variant: "destructive",
      });
    }
  }
}
