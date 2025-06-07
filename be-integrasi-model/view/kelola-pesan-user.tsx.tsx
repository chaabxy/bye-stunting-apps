"use client";

import type React from "react";
import { useState } from "react";
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

import type { UserMessage } from "@/model/admin/user-message-model";
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Create presenter
  const [presenter] = useState<MessagePresenter>(
    () =>
      new MessagePresenter({
        updateMessages: setMessages,
        updateFilteredMessages: setFilteredMessages,
        updateSelectedMessage: setSelectedMessage,
        updateIsDetailOpen: setIsDetailOpen,
        updateIsReplyOpen: setIsReplyOpen,
        updateReplyText: setReplyText,
        updateIsLoading: setIsLoading,
      })
  );

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

  // Get statistics
  const stats = presenter.getStats();

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
          title="Dibaca"
          value={stats.dibaca}
          icon={Eye}
          gradientFrom="yellow-50"
          gradientTo="yellow-100"
          borderColor="yellow-200"
          iconBgColor="yellow-500"
          textColor="yellow-700"
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
                    <TableCell>
                      <StatusBadge status={message.status} />
                    </TableCell>
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
                                    presenter.updateStatus(
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
