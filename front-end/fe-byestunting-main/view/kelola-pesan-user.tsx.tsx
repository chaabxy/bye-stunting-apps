"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
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
  AlertCircle,
  XCircle,
} from "lucide-react";

import type {
  UserMessage,
  MessageStats,
} from "@/model/admin/user-message-model";
import { MessagePresenter } from "@/presenter/admin/message-presenter";
import { StatusBadge } from "@/components/kelola-pesan/status-badge";
import { StatsCard } from "@/components/kelola-pesan/stats-card";

export default function KelolaPesanUserView() {
  // State (View's state)
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<UserMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<MessageStats>({
    total: 0,
    baru: 0,
    ditolak: 0,
    dibalas: 0,
  });
  const [tanggalBalas, setTanggalBalas] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Create presenter with proper view interface
  const [presenter] = useState<MessagePresenter>(
    () =>
      new MessagePresenter({
        updateMessages: setMessages,
        updateFilteredMessages: setFilteredMessages,
        updateSelectedMessage: setSelectedMessage,
        updateIsDetailOpen: setDialogOpen,
        updateIsReplyOpen: setIsReplyOpen,
        updateReplyText: setReplyText,
        updateIsLoading: setIsLoading,
        updateStats: setStats,
      })
  );

  // Refresh data periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Fetch data when refresh trigger changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        await presenter.fetchMessages();
        await presenter.fetchStats();
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    };

    fetchData();
  }, [refreshTrigger, presenter]);

  // Handle search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    presenter.setSearchTerm(term);
  };

  // Handle status filter changes
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    presenter.setStatusFilter(value);
  };

  // Handle status update
  const handleStatusUpdate = (newStatus: UserMessage["status"]) => {
    if (!selectedMessage) return;

    // Close dialog immediately
    setDialogOpen(false);

    // Update status in background
    if (newStatus === "Dibalas") {
      const currentDate = new Date().toISOString();
      setTanggalBalas(currentDate);
      presenter.updateStatus(selectedMessage.id, newStatus, currentDate);
    } else {
      presenter.updateStatus(selectedMessage.id, newStatus);
    }

    // Trigger refresh after a short delay
    setTimeout(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 1000);
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
            onClick={() => presenter.downloadData()}
            className="max-sm:mx-auto max-sm:w-fit bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Pesan"
          value={stats.total}
          icon={MessageSquare}
          gradientFrom="blue-50"
          gradientTo="blue-100"
          borderColor="blue-200"
          iconBgColor="blue-500"
          textColor="blue-700"
        />
        <StatsCard
          title="Belum Dibaca"
          value={stats.baru}
          icon={Clock}
          gradientFrom="orange-50"
          gradientTo="orange-100"
          borderColor="orange-200"
          iconBgColor="orange-500"
          textColor="orange-700"
        />
        <StatsCard
          title="Ditolak"
          value={stats.ditolak}
          icon={XCircle}
          gradientFrom="red-50"
          gradientTo="red-100"
          borderColor="red-200"
          iconBgColor="red-500"
          textColor="red-700"
        />
        <StatsCard
          title="Dibalas"
          value={stats.dibalas}
          icon={CheckCircle}
          gradientFrom="green-50"
          gradientTo="green-100"
          borderColor="green-200"
          iconBgColor="green-500"
          textColor="green-700"
        />
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
                  onChange={handleSearchChange}
                  className="pl-10 border-slate-300 -600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="rounded-xl md:w-40 border-slate-300 -600">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="BelumDibaca">Belum Dibaca</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2">Memuat data pesan...</span>
            </div>
          ) : filteredMessages.length > 0 ? (
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
                      <TableCell>
                        <StatusBadge status={message.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
                          onClick={() => {
                            setSelectedMessage(message);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Kelola
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Data Tidak Tersedia
                </h3>
                <p className="text-gray-600 -400">
                  {searchTerm || statusFilter !== "semua"
                    ? "Tidak ada pesan yang sesuai dengan filter pencarian"
                    : "Belum ada pesan dari pengguna atau server tidak tersedia"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Pastikan server backend berjalan dan admin sudah login
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Status Pesan</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Nama Lengkap</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMessage.namaLengkap}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMessage.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subjek</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMessage.subjek}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Kirim</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMessage.tanggalKirim}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Pesan</Label>
                <div className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                  {selectedMessage.pesan}
                </div>
              </div>

              {selectedMessage.tanggalBalas && (
                <div>
                  <Label className="text-sm font-medium">Tanggal Balasan</Label>
                  <p className="text-sm text-gray-600 mt-1 p-3 bg-green-50 rounded-lg">
                    {selectedMessage.tanggalBalas}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status Saat Ini</Label>
                <div className="mb-3">
                  <StatusBadge status={selectedMessage.status} />
                </div>

                <Label className="text-sm font-medium">Ubah Status</Label>
                <Select
                  defaultValue={selectedMessage.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(value as UserMessage["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status baru" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BelumDibaca">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        Belum Dibaca
                      </div>
                    </SelectItem>
                    <SelectItem value="Ditolak">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Ditolak
                      </div>
                    </SelectItem>
                    <SelectItem value="Dibalas">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Dibalas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <p className="text-xs text-gray-500 mt-2">
                  {selectedMessage.status === "Dibalas"
                    ? "Status dibalas akan otomatis menambahkan tanggal balasan"
                    : "Pilih status untuk mengubah status pesan"}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
