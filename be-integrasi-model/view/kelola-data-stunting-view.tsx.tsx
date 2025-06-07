"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

import { StuntingModel } from "@/model/admin/stunting-model";
import { StuntingPresenter } from "@/presenter/admin/stunting-presenter";
import type {
  StuntingData,
  FilterState,
  UIState,
  LocationOptions,
} from "@/types/stunting";
import { StatsCards } from "@/components/kelola-stunting/stats-card";
import { FilterSection } from "@/components/kelola-stunting/filter-section";
import { DataTable } from "@/components/kelola-stunting/data-table";

export default function KelolaDataStuntingView() {
  // State management
  const [data, setData] = useState<StuntingData[]>([]);
  const [filteredData, setFilteredData] = useState<StuntingData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    selectedProvinsi: "all",
    selectedKabupaten: "all",
    selectedKecamatan: "all",
    selectedDesa: "all",
  });
  const [uiState, setUIState] = useState<UIState>({
    isLoading: true,
    isChartDialogOpen: false,
    isDetailDialogOpen: false,
    selectedData: null,
    successMessage: null,
    errorMessage: null,
  });
  const [locationOptions, setLocationOptions] = useState<LocationOptions>({
    kabupatens: [],
    kecamatans: [],
    desas: [],
  });

  // Initialize MVP
  const model = useMemo(() => new StuntingModel(), []);
  const presenter = useMemo(() => new StuntingPresenter(model), [model]);

  // Set up presenter-view communication
  useEffect(() => {
    presenter.setView({
      setData: (newData: StuntingData[]) => {
        setData(newData);
        setFilteredData(newData);
      },
      setFilteredData,
      setUIState: (newState: Partial<UIState>) => {
        setUIState((prev) => ({ ...prev, ...newState }));
      },
      setLocationOptions,
    });

    presenter.initialize();
  }, [presenter]);

  // Handle filter changes
  useEffect(() => {
    presenter.handleFilterChange(filters);
  }, [filters, presenter]);

  // Event handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      selectedProvinsi: "all",
      selectedKabupaten: "all",
      selectedKecamatan: "all",
      selectedDesa: "all",
    });
  };

  const handleDownloadExcel = () => {
    presenter.handleDownloadExcel(filteredData);
  };

  const handleViewDetail = (data: StuntingData) => {
    presenter.handleViewDetail(data);
  };

  const handleViewChart = (data: StuntingData) => {
    presenter.handleViewChart(data);
  };

  const handleCloseDialogs = () => {
    presenter.handleCloseDialogs();
  };

  // Computed values
  const statistics = presenter.getStatistics(filteredData);
  const uniqueProvinsis = presenter.getUniqueProvinsis();
  const chartData = filteredData.map((item) => ({
    name: item.namaAnak,
    usia: item.usia,
    beratBadan: item.beratBadan,
    tinggiBadan: item.tinggiBadan,
    risiko: item.risiko,
    status: item.status,
    jenisKelamin: item.jenisKelamin,
  }));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-foreground from-emerald-50 to-teal-50 rounded-3xl p-6 mb-6 border border-emerald-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="max-sm:text-center text-2xl md:text-3xl font-bold text-text">
              Kelola Data Stunting
            </h1>
            <p className="text-muted-foreground mt-2 max-sm:text-center text-md md:text-lg">
              Kelola dan analisis data pemeriksaan stunting
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <Dialog
              open={uiState.isChartDialogOpen && !uiState.selectedData}
              onOpenChange={(open) =>
                setUIState((prev) => ({ ...prev, isChartDialogOpen: open }))
              }
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
      {uiState.successMessage && (
        <Alert className="bg-green-50 border-green-200 shadow-sm">
          <AlertTitle className="text-green-800">Berhasil</AlertTitle>
          <AlertDescription className="text-green-700">
            {uiState.successMessage}
          </AlertDescription>
        </Alert>
      )}

      {uiState.errorMessage && (
        <Alert variant="destructive" className="shadow-sm">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{uiState.errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <StatsCards stats={statistics} />

      {/* Filters Section */}
      <FilterSection
        filters={filters}
        locationOptions={locationOptions}
        uniqueProvinsis={uniqueProvinsis}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Data Table */}
      <DataTable
        data={filteredData}
        isLoading={uiState.isLoading}
        onViewDetail={handleViewDetail}
        onViewChart={handleViewChart}
      />

      {/* Detail Dialog */}
      <Dialog
        open={uiState.isDetailDialogOpen}
        onOpenChange={(open) => !open && handleCloseDialogs()}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Data Stunting</DialogTitle>
            <DialogDescription>
              Informasi lengkap hasil pemeriksaan
            </DialogDescription>
          </DialogHeader>
          {uiState.selectedData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nama Anak</Label>
                  <p>{uiState.selectedData.namaAnak}</p>
                </div>
                <div>
                  <Label className="font-medium">Nama Ibu</Label>
                  <p>{uiState.selectedData.namaIbu}</p>
                </div>
                <div>
                  <Label className="font-medium">Tanggal Lahir</Label>
                  <p>{uiState.selectedData.tanggalLahir}</p>
                </div>
                <div>
                  <Label className="font-medium">Usia</Label>
                  <p>{uiState.selectedData.usia} bulan</p>
                </div>
                <div>
                  <Label className="font-medium">Jenis Kelamin</Label>
                  <p>
                    {uiState.selectedData.jenisKelamin === "laki-laki"
                      ? "Laki-laki"
                      : "Perempuan"}
                  </p>
                </div>
                <div>
                  <Label className="font-medium">Berat Badan</Label>
                  <p>{uiState.selectedData.beratBadan} kg</p>
                </div>
                <div>
                  <Label className="font-medium">Tinggi Badan</Label>
                  <p>{uiState.selectedData.tinggiBadan} cm</p>
                </div>
                <div>
                  <Label className="font-medium">Status</Label>
                  <Badge
                    className={
                      uiState.selectedData.status === "normal"
                        ? "bg-green-100 text-green-800"
                        : uiState.selectedData.status === "berisiko"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {uiState.selectedData.status === "normal"
                      ? "Normal"
                      : uiState.selectedData.status === "berisiko"
                      ? "Berisiko"
                      : "Stunting"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="font-medium">Alamat Lengkap</Label>
                <p>
                  {uiState.selectedData.desa}, {uiState.selectedData.kecamatan},{" "}
                  {uiState.selectedData.kabupaten},{" "}
                  {uiState.selectedData.provinsi}
                </p>
              </div>
              <div>
                <Label className="font-medium">Tingkat Risiko</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        uiState.selectedData.risiko <= 25
                          ? "bg-green-500"
                          : uiState.selectedData.risiko <= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${uiState.selectedData.risiko}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-medium">
                    {uiState.selectedData.risiko}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
