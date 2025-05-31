"use client";

import {
  Search,
  Download,
  BarChart3,
  Eye,
  Loader2,
  Users,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

type StuntingData = {
  id: string;
  namaAnak: string;
  namaIbu: string;
  tanggalLahir: string;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  usia: number;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  status: "normal" | "berisiko" | "stunting";
  risiko: number;
  tanggalPemeriksaan: string;
};

export default function KelolaDataStunting() {
  const [data, setData] = useState<StuntingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<StuntingData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState("all");
  const [selectedKabupaten, setSelectedKabupaten] = useState("all");
  const [selectedKecamatan, setSelectedKecamatan] = useState("all");
  const [selectedDesa, setSelectedDesa] = useState("all");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data untuk dropdown filter
  const [kabupatens, setKabupatens] = useState<string[]>([]);
  const [kecamatans, setKecamatans] = useState<string[]>([]);
  const [desas, setDesas] = useState<string[]>([]);

  useEffect(() => {
    // Simulate fetching data from localStorage or API
    setTimeout(() => {
      const mockData: StuntingData[] = [
        {
          id: "1",
          namaAnak: "Andi",
          namaIbu: "Siti",
          tanggalLahir: "2021-05-03",
          jenisKelamin: "laki-laki",
          beratBadan: 10.5,
          tinggiBadan: 85.5,
          usia: 43,
          provinsi: "Jawa Barat",
          kabupaten: "Garut",
          kecamatan: "Cilawu",
          desa: "Sukamurni",
          status: "normal",
          risiko: 15,
          tanggalPemeriksaan: "2024-01-20",
        },
        {
          id: "2",
          namaAnak: "Rina",
          namaIbu: "Dewi",
          tanggalLahir: "2020-10-10",
          jenisKelamin: "perempuan",
          beratBadan: 8.0,
          tinggiBadan: 78.0,
          usia: 51,
          provinsi: "Jawa Tengah",
          kabupaten: "Semarang",
          kecamatan: "Tembalang",
          desa: "Sendangmulyo",
          status: "berisiko",
          risiko: 45,
          tanggalPemeriksaan: "2024-01-18",
        },
        {
          id: "3",
          namaAnak: "Budi",
          namaIbu: "Ani",
          tanggalLahir: "2022-03-15",
          jenisKelamin: "laki-laki",
          beratBadan: 7.2,
          tinggiBadan: 70.0,
          usia: 22,
          provinsi: "Jawa Timur",
          kabupaten: "Malang",
          kecamatan: "Klojen",
          desa: "Kauman",
          status: "stunting",
          risiko: 75,
          tanggalPemeriksaan: "2024-01-15",
        },
        {
          id: "4",
          namaAnak: "Sari",
          namaIbu: "Umi",
          tanggalLahir: "2021-08-20",
          jenisKelamin: "perempuan",
          beratBadan: 9.8,
          tinggiBadan: 82.0,
          usia: 29,
          provinsi: "Jawa Barat",
          kabupaten: "Bandung",
          kecamatan: "Coblong",
          desa: "Dago",
          status: "normal",
          risiko: 20,
          tanggalPemeriksaan: "2024-01-12",
        },
      ];
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Update dropdown options based on selected filters
  useEffect(() => {
    if (selectedProvinsi !== "all") {
      const uniqueKabupatens = [
        ...new Set(
          data
            .filter((d) => d.provinsi === selectedProvinsi)
            .map((d) => d.kabupaten)
        ),
      ];
      setKabupatens(uniqueKabupatens);
    } else {
      setKabupatens([]);
    }
    setSelectedKabupaten("all");
    setSelectedKecamatan("all");
    setSelectedDesa("all");
  }, [selectedProvinsi, data]);

  useEffect(() => {
    if (selectedKabupaten !== "all") {
      const uniqueKecamatans = [
        ...new Set(
          data
            .filter(
              (d) =>
                d.provinsi === selectedProvinsi &&
                d.kabupaten === selectedKabupaten
            )
            .map((d) => d.kecamatan)
        ),
      ];
      setKecamatans(uniqueKecamatans);
    } else {
      setKecamatans([]);
    }
    setSelectedKecamatan("all");
    setSelectedDesa("all");
  }, [selectedKabupaten, selectedProvinsi, data]);

  useEffect(() => {
    if (selectedKecamatan !== "all") {
      const uniqueDesas = [
        ...new Set(
          data
            .filter(
              (d) =>
                d.provinsi === selectedProvinsi &&
                d.kabupaten === selectedKabupaten &&
                d.kecamatan === selectedKecamatan
            )
            .map((d) => d.desa)
        ),
      ];
      setDesas(uniqueDesas);
    } else {
      setDesas([]);
    }
    setSelectedDesa("all");
  }, [selectedKecamatan, selectedKabupaten, selectedProvinsi, data]);

  const handleDownloadExcel = () => {
    // Simulate Excel download
    const csvContent = [
      [
        "No",
        "Nama Anak",
        "Nama Ibu",
        "Tanggal Lahir",
        "Jenis Kelamin",
        "Berat (kg)",
        "Tinggi (cm)",
        "Usia (bulan)",
        "Provinsi",
        "Kabupaten/Kota",
        "Kecamatan",
        "Desa",
        "Status",
        "Risiko (%)",
        "Tanggal Pemeriksaan",
      ],
      ...filteredData.map((item, index) => [
        index + 1,
        item.namaAnak,
        item.namaIbu,
        item.tanggalLahir,
        item.jenisKelamin === "laki-laki" ? "Laki-laki" : "Perempuan",
        item.beratBadan,
        item.tinggiBadan,
        item.usia,
        item.provinsi,
        item.kabupaten,
        item.kecamatan,
        item.desa,
        item.status === "normal"
          ? "Normal"
          : item.status === "berisiko"
          ? "Berisiko"
          : "Stunting",
        item.risiko,
        item.tanggalPemeriksaan,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `data-stunting-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage("Data berhasil diunduh!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredData = data.filter((item) => {
    const searchMatch =
      item.namaAnak.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaIbu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provinsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kabupaten.toLowerCase().includes(searchTerm.toLowerCase());

    const provinsiMatch =
      selectedProvinsi === "all" || item.provinsi === selectedProvinsi;
    const kabupatenMatch =
      selectedKabupaten === "all" || item.kabupaten === selectedKabupaten;
    const kecamatanMatch =
      selectedKecamatan === "all" || item.kecamatan === selectedKecamatan;
    const desaMatch = selectedDesa === "all" || item.desa === selectedDesa;

    return (
      searchMatch &&
      provinsiMatch &&
      kabupatenMatch &&
      kecamatanMatch &&
      desaMatch
    );
  });

  // Prepare chart data
  const chartData = filteredData.map((item, index) => ({
    name: item.namaAnak,
    usia: item.usia,
    beratBadan: item.beratBadan,
    tinggiBadan: item.tinggiBadan,
    risiko: item.risiko,
    status: item.status,
    jenisKelamin: item.jenisKelamin,
  }));

  const uniqueProvinsis = [...new Set(data.map((d) => d.provinsi))];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-foreground from-emerald-50 to-teal-50 rounded-3xl p-6 mb-6 border border-emerald-200 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold text-text ">
              Kelola Data Stunting
            </h1>
            <p className="text-muted-foreground mt-2 max-sm:text-center text-md md:text-lg">
              Kelola dan analisis data pemeriksaan stunting
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Dialog
              open={isChartDialogOpen}
              onOpenChange={setIsChartDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 shadow-md transition-all duration-200"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Lihat Grafik WHO
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-input">
                <DialogHeader>
                  <DialogTitle>Grafik WHO - Semua Data</DialogTitle>
                  <DialogDescription>
                    Visualisasi data pertumbuhan anak berdasarkan standar WHO
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Berat Badan vs Usia</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="usia"
                            label={{
                              value: "Usia (bulan)",
                              position: "insideBottom",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Berat (kg)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              value,
                              name === "beratBadan" ? "Berat Badan (kg)" : name,
                            ]}
                          />
                          <Scatter dataKey="beratBadan" fill="#22c55e" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      Berat Badan vs Jenis Kelamin
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="jenisKelamin"
                            label={{
                              value: "Jenis Kelamin",
                              position: "insideBottom",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Berat (kg)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              value,
                              name === "beratBadan" ? "Berat Badan (kg)" : name,
                            ]}
                          />
                          <Scatter dataKey="beratBadan" fill="#22c55e" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Tinggi Badan vs Usia</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="usia"
                            label={{
                              value: "Usia (bulan)",
                              position: "insideBottom",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Tinggi (cm)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              value,
                              name === "tinggiBadan"
                                ? "Tinggi Badan (cm)"
                                : name,
                            ]}
                          />
                          <Scatter dataKey="tinggiBadan" fill="#22c55e" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      Tinggi Badan vs Jenis Kelamin
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="jenisKelamin"
                            label={{
                              value: "Jenis Kelamin",
                              position: "insideBottom",
                              offset: -10,
                            }}
                          />
                          <YAxis
                            label={{
                              value: "Tinggi (cm)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              value,
                              name === "tinggiBadan"
                                ? "Tinggi Badan (cm)"
                                : name,
                            ]}
                          />
                          <Scatter dataKey="tinggiBadan" fill="#22c55e" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleDownloadExcel}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200 900/20 900 shadow-sm">
          <AlertTitle className="text-green-800 200">Berhasil</AlertTitle>
          <AlertDescription className="text-green-700 300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="shadow-sm">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 900/50 800/50 border-blue-200 700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-md font-medium text-blue-700 ">
                Total Data
              </CardTitle>
              <div className="text-2xl font-bold text-blue-900 100">
                {filteredData.length}
              </div>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 900/50 800/50 border-green-200 700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-md font-medium text-green-700 ">
                Status Normal
              </CardTitle>
              <div className="text-2xl font-bold text-green-900 ">
                {filteredData.filter((d) => d.status === "normal").length}
              </div>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <div className="h-4 w-4 bg-white rounded-full"></div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 900/50 800/50 border-yellow-200 700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-md font-medium text-yellow-700 ">
                Berisiko
              </CardTitle>
              <div className="text-2xl font-bold text-yellow-900 ">
                {filteredData.filter((d) => d.status === "berisiko").length}
              </div>
            </div>
            <div className="p-3 bg-yellow-500 rounded-full">
              <div className="h-4 w-4 bg-white rounded-full" />
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100  border-red-200 700 shadow-lg hover:shadow-xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-md font-medium text-red-700 ">
                Stunting
              </CardTitle>
              <div className="text-2xl font-bold text-red-900 ">
                {filteredData.filter((d) => d.status === "stunting").length}
              </div>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <div className="h-4 w-4 bg-white rounded-full" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="shadow-lg border-0 bg-white  mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-slate-100 700 rounded-lg">
                <Filter className="h-4 w-4 text-slate-600 " />
              </div>
              <span className="font-semibold text-slate-700">Filter Data</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama anak/ibu..."
                  className="pl-10 focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={selectedProvinsi}
                onValueChange={setSelectedProvinsi}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Provinsi</SelectItem>
                  {uniqueProvinsis.map((provinsi) => (
                    <SelectItem key={provinsi} value={provinsi}>
                      {provinsi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedKabupaten}
                onValueChange={setSelectedKabupaten}
                disabled={selectedProvinsi === "all"}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua Kabupaten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kabupaten</SelectItem>
                  {kabupatens.map((kabupaten) => (
                    <SelectItem key={kabupaten} value={kabupaten}>
                      {kabupaten}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedKecamatan}
                onValueChange={setSelectedKecamatan}
                disabled={selectedKabupaten === "all"}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua Kecamatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kecamatan</SelectItem>
                  {kecamatans.map((kecamatan) => (
                    <SelectItem key={kecamatan} value={kecamatan}>
                      {kecamatan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDesa}
                onValueChange={setSelectedDesa}
                disabled={selectedKecamatan === "all"}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                  <SelectValue placeholder="Semua Desa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Desa</SelectItem>
                  {desas.map((desa) => (
                    <SelectItem key={desa} value={desa}>
                      {desa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedProvinsi("all");
                  setSelectedKabupaten("all");
                  setSelectedKecamatan("all");
                  setSelectedDesa("all");
                }}
                className="w-full rounded-xl"
              >
                Reset Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="bg-foreground shadow-lg rounded-lg border border-gray-200 700 900">
        <CardHeader className="bg-input from-slate-50 to-slate-100 800 700 border-b border-slate-200 600">
          <CardTitle className="text-xl font-semibold text-slate-900 ">
            Daftar Data Stunting
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 m-5">
          <div className="rounded-lg border-0 overflow-x-auto">
            <Table className="bg-input rounded-lg">
              <TableHeader>
                <TableRow className="bg-slate-50 700 hover:bg-slate-100 slate-600 ">
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
                        <span className="text-gray-500 ">Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className="bg-white 800 rounded-lg mb-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <TableCell className="font-medium px-4 py-3">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium px-4 py-3">
                        {item.namaAnak}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {item.namaIbu}
                      </TableCell>
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
                      <TableCell className="px-4 py-3">
                        {item.provinsi}
                      </TableCell>
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
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.status === "normal"
                              ? "bg-green-100 text-green-700 border-green-200 900/20 300 800"
                              : item.status === "berisiko"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200 900/20 300 800"
                              : "bg-red-100 text-red-700 border-red-200 900/20 300 800"
                          }`}
                        >
                          {item.status === "normal"
                            ? "Normal"
                            : item.status === "berisiko"
                            ? "Berisiko"
                            : "Stunting"}
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
                        <Dialog
                          open={
                            selectedData?.id === item.id && isChartDialogOpen
                          }
                          onOpenChange={(open) => {
                            setIsChartDialogOpen(open);
                            if (!open && selectedData?.id === item.id)
                              setSelectedData(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedData(item);
                                setIsChartDialogOpen(true);
                              }}
                              className="text-white hover:text-blue-700"
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-input">
                            <DialogHeader>
                              <DialogTitle>
                                Grafik WHO - {item.namaAnak}
                              </DialogTitle>
                              <DialogDescription>
                                Visualisasi data pertumbuhan anak berdasarkan
                                standar WHO
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <h3 className="font-semibold mb-4">
                                  Berat Badan vs Usia
                                </h3>
                                <div className="h-[300px]">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <ScatterChart data={[item]}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis
                                        dataKey="usia"
                                        label={{
                                          value: "Usia (bulan)",
                                          position: "insideBottom",
                                          offset: -10,
                                        }}
                                        type="number"
                                        domain={[0, "dataMax"]}
                                      />
                                      <YAxis
                                        label={{
                                          value: "Berat (kg)",
                                          angle: -90,
                                          position: "insideLeft",
                                        }}
                                        type="number"
                                        domain={[0, "dataMax"]}
                                      />
                                      <Tooltip
                                        formatter={(value, name) => [
                                          value,
                                          name === "beratBadan"
                                            ? "Berat Badan (kg)"
                                            : name,
                                        ]}
                                      />
                                      <Scatter
                                        dataKey="beratBadan"
                                        fill={
                                          item.status === "normal"
                                            ? "#22c55e"
                                            : item.status === "berisiko"
                                            ? "#eab308"
                                            : "#ef4444"
                                        }
                                      />
                                    </ScatterChart>
                                  </ResponsiveContainer>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Grafik ini membandingkan berat badan anak
                                  dengan usianya. Warna hijau menunjukkan berat
                                  badan normal, kuning berisiko, dan merah
                                  stunting.
                                </p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-4">
                                  Tinggi Badan vs Usia
                                </h3>
                                <div className="h-[300px]">
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <ScatterChart data={[item]}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis
                                        dataKey="usia"
                                        label={{
                                          value: "Usia (bulan)",
                                          position: "insideBottom",
                                          offset: -10,
                                        }}
                                        type="number"
                                        domain={[0, "dataMax"]}
                                      />
                                      <YAxis
                                        label={{
                                          value: "Tinggi (cm)",
                                          angle: -90,
                                          position: "insideLeft",
                                        }}
                                        type="number"
                                        domain={[0, "dataMax"]}
                                      />
                                      <Tooltip
                                        formatter={(value, name) => [
                                          value,
                                          name === "tinggiBadan"
                                            ? "Tinggi Badan (cm)"
                                            : name,
                                        ]}
                                      />
                                      <Scatter
                                        dataKey="tinggiBadan"
                                        fill={
                                          item.status === "normal"
                                            ? "#22c55e"
                                            : item.status === "berisiko"
                                            ? "#eab308"
                                            : "#ef4444"
                                        }
                                      />
                                    </ScatterChart>
                                  </ResponsiveContainer>
                                </div>
                                <p className="text-sm text-gray-500">
                                  Grafik ini membandingkan tinggi badan anak
                                  dengan usianya. Warna hijau menunjukkan tinggi
                                  badan normal, kuning berisiko, dan merah
                                  stunting.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={
                              isDetailDialogOpen && selectedData?.id === item.id
                            }
                            onOpenChange={(open) => {
                              setIsDetailDialogOpen(open);
                              if (!open) setSelectedData(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedData(item)}
                                className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Data Stunting</DialogTitle>
                                <DialogDescription>
                                  Informasi lengkap hasil pemeriksaan
                                </DialogDescription>
                              </DialogHeader>
                              {selectedData && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-medium">
                                        Nama Anak
                                      </Label>
                                      <p>{selectedData.namaAnak}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Nama Ibu
                                      </Label>
                                      <p>{selectedData.namaIbu}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Tanggal Lahir
                                      </Label>
                                      <p>{selectedData.tanggalLahir}</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Usia
                                      </Label>
                                      <p>{selectedData.usia} bulan</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Jenis Kelamin
                                      </Label>
                                      <p>
                                        {selectedData.jenisKelamin ===
                                        "laki-laki"
                                          ? "Laki-laki"
                                          : "Perempuan"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Berat Badan
                                      </Label>
                                      <p>{selectedData.beratBadan} kg</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Tinggi Badan
                                      </Label>
                                      <p>{selectedData.tinggiBadan} cm</p>
                                    </div>
                                    <div>
                                      <Label className="font-medium">
                                        Status
                                      </Label>
                                      <Badge
                                        className={
                                          selectedData.status === "normal"
                                            ? "bg-green-100 text-green-800"
                                            : selectedData.status === "berisiko"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                        }
                                      >
                                        {selectedData.status === "normal"
                                          ? "Normal"
                                          : selectedData.status === "berisiko"
                                          ? "Berisiko"
                                          : "Stunting"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="font-medium">
                                      Alamat Lengkap
                                    </Label>
                                    <p>
                                      {selectedData.desa},{" "}
                                      {selectedData.kecamatan},{" "}
                                      {selectedData.kabupaten},{" "}
                                      {selectedData.provinsi}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">
                                      Tingkat Risiko
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full ${
                                            selectedData.risiko <= 25
                                              ? "bg-green-500"
                                              : selectedData.risiko <= 50
                                              ? "bg-yellow-500"
                                              : "bg-red-500"
                                          }`}
                                          style={{
                                            width: `${selectedData.risiko}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="font-medium">
                                        {selectedData.risiko}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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
                          <p className="text-gray-500 400 font-medium">
                            Tidak ada data yang ditemukan
                          </p>
                          <p className="text-sm text-gray-400 500">
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
    </div>
  );
}
