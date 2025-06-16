"use client";

import { BarChart3, Eye, Loader2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StuntingData } from "@/types/stunting";

type DataTableProps = {
  data: StuntingData[];
  isLoading: boolean;
  onViewDetail: (data: StuntingData) => void;
  onViewChart: (data: StuntingData) => void;
};

// Helper function untuk mendapatkan display status
const getStatusDisplay = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "normal":
      return "Normal";
    case "stunting":
      return "Stunting";
    case "severely stunting":
    case "severly stunting":
    case "stunting berat":
      return "Stunting Berat";
    default:
      console.log("Unknown status:", status);
      return "Normal"; // fallback
  }
};

// Helper function untuk mendapatkan style status
const getStatusStyle = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "normal":
      return "bg-green-100 text-green-700 border-green-200 text-center";
    case "stunting":
      return "bg-orange-100 text-orange-700 border-orange-200 text-center";
    case "severely stunting":
    case "severly stunting":
    case "stunting berat":
      return "bg-red-100 text-red-700 border-red-200 text-center";
    default:
      return "bg-green-100 text-green-700 border-green-200 text-center"; // fallback
  }
};

export function DataTable({
  data,
  isLoading,
  onViewDetail,
  onViewChart,
}: DataTableProps) {
  // Debug log untuk melihat data yang diterima
  console.log(
    "DataTable received data:",
    data.map((item) => ({ name: item.namaAnak, status: item.status }))
  );

  return (
    <Card className="bg-foreground shadow-lg rounded-lg border border-gray-200">
      <CardHeader className="bg-input border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-900">
          Daftar Data Stunting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 m-5">
        <div className="rounded-lg border-0 overflow-x-auto">
          <Table className="bg-input rounded-lg">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-100">
                <TableHead className="font-semibold py-3 px-4 rounded-l-lg text-center text-text">
                  No
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Nama Anak
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Nama Ibu
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Tanggal Lahir
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Jenis Kelamin
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Berat (kg)
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Tinggi (cm)
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Provinsi
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Kabupaten/Kota
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Kecamatan
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Desa
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Status
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Risiko (%)
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  Tanggal Pengecekan
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 text-center text-text">
                  WHO Chart
                </TableHead>
                <TableHead className="font-semibold py-3 px-4 rounded-r-lg text-center text-text">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={16} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                      <span className="text-gray-500">Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="bg-white rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <TableCell className="font-medium px-4 py-3">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium px-4 py-3">
                      {item.namaAnak}
                    </TableCell>
                    <TableCell className="px-4 py-3">{item.namaIbu}</TableCell>
                    <TableCell className="px-4 py-3">
                      {item.tanggalLahir}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.jenisKelamin === "laki-laki"
                        ? "Laki-laki"
                        : "Perempuan"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.beratBadan}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.tinggiBadan}
                    </TableCell>
                    <TableCell className="px-4 py-3">{item.provinsi}</TableCell>
                    <TableCell className="px-4 py-3">
                      {item.kabupaten}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.kecamatan}
                    </TableCell>
                    <TableCell className="px-4 py-3">{item.desa}</TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {getStatusDisplay(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          item.risiko <= 25
                            ? "text-green-600"
                            : item.risiko <= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.risiko}%
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {item.tanggalPemeriksaan}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewChart(item)}
                        className="text-white hover:text-blue-700"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onViewDetail(item)}
                          className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={16} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <Users className="h-12 w-12 text-gray-400" />
                      <div>
                        <p className="text-gray-500 font-medium">
                          Tidak ada data yang ditemukan
                        </p>
                        <p className="text-sm text-gray-400">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
