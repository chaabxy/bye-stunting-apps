// Presenter: Handles business logic and mediates between Model and View

import {
  type UserMessage,
  type MessageStats,
  sampleMessages,
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
}

export class MessagePresenter {
  private messages: UserMessage[];
  private view: MessageView;
  private searchTerm = "";
  private statusFilter = "semua";

  constructor(view: MessageView) {
    this.messages = [...sampleMessages];
    this.view = view;

    // Initialize view with data
    this.view.updateMessages(this.messages);
    this.view.updateFilteredMessages(this.messages);
  }

  public getStats(): MessageStats {
    return {
      total: this.messages.length,
      baru: this.messages.filter((m) => m.status === "Belum Dibaca").length,
      dibaca: this.messages.filter((m) => m.status === "Dibaca").length,
      dibalas: this.messages.filter((m) => m.status === "Dibalas").length,
    };
  }

  public setSearchTerm(term: string): void {
    this.searchTerm = term;
    this.filterMessages();
  }

  public setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.filterMessages();
  }

  private filterMessages(): void {
    let filtered = this.messages;

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.namaLengkap
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          message.subjek
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          message.pesan.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (this.statusFilter !== "semua") {
      filtered = filtered.filter(
        (message) => message.status === this.statusFilter
      );
    }

    this.view.updateFilteredMessages(filtered);
  }

  public updateStatus(id: string, newStatus: UserMessage["status"]): void {
    this.messages = this.messages.map((message) =>
      message.id === id ? { ...message, status: newStatus } : message
    );

    this.view.updateMessages(this.messages);
    this.filterMessages();

    toast({
      title: "Status Updated",
      description: `Status pesan berhasil diubah menjadi ${newStatus}`,
    });
  }

  public sendReply(messageId: string, replyText: string): void {
    if (!replyText.trim()) return;

    this.view.updateIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      this.messages = this.messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              status: "Dibalas",
              balasan: replyText,
              tanggalBalas: new Date().toLocaleString("id-ID"),
            }
          : message
      );

      this.view.updateMessages(this.messages);
      this.filterMessages();
      this.view.updateReplyText("");
      this.view.updateIsReplyOpen(false);
      this.view.updateIsLoading(false);

      const message = this.messages.find((m) => m.id === messageId);

      toast({
        title: "Balasan Terkirim",
        description: `Balasan berhasil dikirim ke ${message?.email}`,
      });
    }, 1000);
  }

  public deleteMessage(id: string): void {
    this.messages = this.messages.filter((message) => message.id !== id);
    this.view.updateMessages(this.messages);
    this.filterMessages();

    toast({
      title: "Pesan Dihapus",
      description: "Pesan berhasil dihapus dari sistem",
    });
  }

  public downloadData(): void {
    const filteredMessages = this.messages.filter((message) => {
      // Apply the same filters as in filterMessages
      let matchesSearch = true;
      let matchesStatus = true;

      if (this.searchTerm) {
        matchesSearch =
          message.namaLengkap
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          message.subjek
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          message.pesan.toLowerCase().includes(this.searchTerm.toLowerCase());
      }

      if (this.statusFilter !== "semua") {
        matchesStatus = message.status === this.statusFilter;
      }

      return matchesSearch && matchesStatus;
    });

    const csvContent = [
      [
        "No",
        "Nama Lengkap",
        "Email",
        "Subjek",
        "Pesan",
        "Tanggal Kirim",
        "Status",
        "Balasan",
        "Tanggal Balas",
      ],
      ...filteredMessages.map((message, index) => [
        index + 1,
        message.namaLengkap,
        message.email,
        message.subjek,
        message.pesan,
        message.tanggalKirim,
        message.status,
        message.balasan || "",
        message.tanggalBalas || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pesan-user-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Berhasil",
      description: "Data pesan user berhasil didownload",
    });
  }
}
