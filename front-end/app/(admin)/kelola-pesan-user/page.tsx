"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  Filter,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserMessage {
  id: string;
  namaLengkap: string;
  email: string;
  subjek: string;
  pesan: string;
  tanggalKirim: string;
  status: "Belum Dibaca" | "Dibaca" | "Dibalas";
  balasan?: string;
  tanggalBalas?: string;
}

// Sample data
const sampleMessages: UserMessage[] = [
  {
    id: "1",
    namaLengkap: "Rina Ayu",
    email: "rina@gmail.com",
    subjek: "Permintaan info",
    pesan:
      "Halo, saya ingin mengetahui lebih lanjut tentang cara menggunakan aplikasi ini untuk mengecek stunting pada anak saya. Apakah ada panduan lengkap yang bisa saya dapatkan?",
    tanggalKirim: "2025-05-24 13:42",
    status: "Belum Dibaca",
  },
  {
    id: "2",
    namaLengkap: "Dedi Supriadi",
    email: "dedi@mail.com",
    subjek: "Saran aplikasi",
    pesan:
      "Aplikasi ini sangat membantu, namun saya berharap ada fitur untuk menyimpan riwayat pemeriksaan anak dalam jangka waktu yang lebih lama. Terima kasih.",
    tanggalKirim: "2025-05-23 09:15",
    status: "Dibaca",
  },
  {
    id: "3",
    namaLengkap: "Maya Sari",
    email: "maya.sari@email.com",
    subjek: "Konsultasi hasil",
    pesan:
      "Hasil pemeriksaan anak saya menunjukkan risiko tinggi stunting. Apa langkah yang harus saya ambil selanjutnya? Mohon bantuannya.",
    tanggalKirim: "2025-05-22 16:30",
    status: "Dibalas",
    balasan:
      "Terima kasih atas pertanyaannya. Untuk kasus risiko tinggi stunting, kami sarankan untuk segera berkonsultasi dengan dokter anak atau ahli gizi terdekat. Kami juga telah mengirimkan panduan nutrisi ke email Anda.",
    tanggalBalas: "2025-05-22 17:15",
  },
];

export default function KelolaPesanUserPage() {
  const [messages, setMessages] = useState<UserMessage[]>(sampleMessages);
  const [filteredMessages, setFilteredMessages] =
    useState<UserMessage[]>(sampleMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter messages
  useEffect(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.namaLengkap
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.subjek.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.pesan.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "semua") {
      filtered = filtered.filter((message) => message.status === statusFilter);
    }

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter]);

  const handleUpdateStatus = (id: string, newStatus: UserMessage["status"]) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id ? { ...message, status: newStatus } : message
      )
    );
    toast({
      title: "Status Updated",
      description: `Status pesan berhasil diubah menjadi ${newStatus}`,
    });
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === selectedMessage.id
            ? {
                ...message,
                status: "Dibalas",
                balasan: replyText,
                tanggalBalas: new Date().toLocaleString("id-ID"),
              }
            : message
        )
      );

      setReplyText("");
      setIsReplyOpen(false);
      setIsLoading(false);

      toast({
        title: "Balasan Terkirim",
        description: `Balasan berhasil dikirim ke ${selectedMessage.email}`,
      });
    }, 1000);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
    toast({
      title: "Pesan Dihapus",
      description: "Pesan berhasil dihapus dari sistem",
    });
  };

  const handleDownloadData = () => {
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
  };

  const getStatusBadge = (status: UserMessage["status"]) => {
    const variants = {
      "Belum Dibaca":
        "bg-blue-100 text-blue-800 -900 -300",
      Dibaca:
        "bg-yellow-100 text-yellow-800 -900 -300",
      Dibalas:
        "bg-green-100 text-green-800 -900 -300",
    };

    const icons = {
      "Belum Dibaca": <Clock className="w-3 h-3 mr-1" />,
      Dibaca: <Eye className="w-3 h-3 mr-1" />,
      Dibalas: <CheckCircle className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge className={`${variants[status]} flex items-center`}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const stats = {
    total: messages.length,
    baru: messages.filter((m) => m.status === "Belum Dibaca").length,
    dibaca: messages.filter((m) => m.status === "Dibaca").length,
    dibalas: messages.filter((m) => m.status === "Dibalas").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-foreground from-purple-50 to-indigo-50 -900 -900 rounded-3xl p-6 mb-6 border border-purple-200 -700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold text-text ">
              Kelola Pesan User
            </h1>
            <p className="text-muted-foreground max-sm:text-center text-md md:text-lg mt-2">
              Kelola dan tanggapi pesan dari pengguna aplikasi
            </p>
          </div>
          <Button
            onClick={handleDownloadData}
            className="max-sm:mx-auto max-sm:w-fit bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 -900/50 -800/50 border-blue-200 -700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-blue-700 -300">
                  Total Pesan
                </p>
                <p className="mt-3 text-2xl font-bold text-blue-900 -100">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 -900/50 -800/50 border-orange-200 -700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-orange-700 -300">
                  Belum Dibaca
                </p>
                <p className="text-2xl font-bold text-orange-900 -100">
                  {stats.baru}
                </p>
              </div>
              <div className="p-3 bg-orange-500 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 -900/50 -800/50 border-yellow-200 -700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-yellow-700 -300">
                  Dibaca
                </p>
                <p className="mt-3 text-2xl font-bold text-yellow-900 -100">
                  {stats.dibaca}
                </p>
              </div>
              <div className="p-3 bg-yellow-500 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 -900/50 -800/50 border-green-200 -700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-green-700 -300">
                  Dibalas
                </p>
                <p className="mt-3 text-2xl font-bold text-green-900 -100">
                  {stats.dibalas}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white -800 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama, email, subjek, atau pesan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-300 -600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl md:w-40 border-slate-300 -600">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Belum Dibaca">Belum Dibaca</SelectItem>
                  <SelectItem value="Dibaca">Dibaca</SelectItem>
                  <SelectItem value="Dibalas">Dibalas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card className="shadow-lg border-0 bg-foreground -80">
        <CardHeader className="bg-input from-slate-50 to-slate-100 -800 -700 border-b border-slate-200 -600">
          <CardTitle className="text-xl font-semibold text-slate-900 ">
            Daftar Pesan User
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 m-5">
          <div className="overflow-x-auto bg-white rounded-lg">
            <Table className="">
              <TableHeader>
                <TableRow className="py-3 bg-slate-50 -700 hover:bg-slate-100 -slate-600">
                  <TableHead className="w-12 font-semibold text-slate-700 -30 text-center text-text">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Nama Lengkap
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Email
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Subjek
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Pesan
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Tanggal Kirim
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 -300 text-center text-text">
                    Status
                  </TableHead>
                  <TableHead className="w-32 font-semibold text-slate-700 -300 text-center text-text">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredMessages.map((message, index) => (
                  <TableRow
                    key={message.id}
                    className="bg-white hover:bg-slate-50 -slate-700 transition-colors"
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {message.namaLengkap}
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:text-blue-800 -400 -blue-300"
                      >
                        {message.email}
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">
                      {message.subjek}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate" title={message.pesan}>
                        {message.pesan}
                      </p>
                    </TableCell>
                    <TableCell>{message.tanggalKirim}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Status
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Kelola Status Pesan</DialogTitle>
                          </DialogHeader>

                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">
                                    Nama Lengkap
                                  </Label>
                                  <p className="text-sm text-gray-600 -400">
                                    {selectedMessage.namaLengkap}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Email
                                  </Label>
                                  <p className="text-sm text-gray-600 -400">
                                    {selectedMessage.email}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Subjek
                                  </Label>
                                  <p className="text-sm text-gray-600 -400">
                                    {selectedMessage.subjek}
                                  </p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">
                                    Tanggal Kirim
                                  </Label>
                                  <p className="text-sm text-gray-600 -400">
                                    {selectedMessage.tanggalKirim}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium">
                                  Pesan
                                </Label>
                                <p className="text-sm text-gray-600 -400 mt-1 p-3 bg-gray-50 -800 rounded-lg">
                                  {selectedMessage.pesan}
                                </p>
                              </div>

                              {selectedMessage.balasan && (
                                <div>
                                  <Label className="text-sm font-medium">
                                    Balasan
                                  </Label>
                                  <p className="text-sm text-gray-600 -400 mt-1 p-3 bg-green-50 -900/20 rounded-lg">
                                    {selectedMessage.balasan}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Dibalas pada: {selectedMessage.tanggalBalas}
                                  </p>
                                </div>
                              )}

                              <div>
                                <Label className="text-sm font-medium">
                                  Ubah Status
                                </Label>
                                <Select
                                  value={selectedMessage.status}
                                  onValueChange={(value) =>
                                    handleUpdateStatus(
                                      selectedMessage.id,
                                      value as UserMessage["status"]
                                    )
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Belum Dibaca">
                                      Belum Dibaca
                                    </SelectItem>
                                    <SelectItem value="Dibaca">
                                      Dibaca
                                    </SelectItem>
                                    <SelectItem value="Dibalas">
                                      Dibalas
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900  mb-2">
              Tidak ada pesan ditemukan
            </h3>
            <p className="text-gray-600 -400">
              {searchTerm || statusFilter !== "semua"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Belum ada pesan dari pengguna"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
