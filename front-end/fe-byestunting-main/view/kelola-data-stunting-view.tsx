"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, BarChart3, Loader2 } from "lucide-react";
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
import { WHOChartSection } from "@/components/cek-stunting/who-chart-section";
import { ResultSection } from "@/components/cek-stunting/result-section";
import type { PredictionResult } from "@/model/user/cek-stunting-model";

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
  const [selectedRecordDetail, setSelectedRecordDetail] = useState<any>(null);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

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

  const handleViewDetail = async (data: StuntingData) => {
    setUIState((prev) => ({
      ...prev,
      selectedData: data,
      isDetailDialogOpen: true,
    }));

    // Fetch detailed record data for the detail view
    await fetchRecordDetailForResult(data.id);
  };

  const handleViewChart = async (data: StuntingData) => {
    setUIState((prev) => ({
      ...prev,
      selectedData: data,
      isChartDialogOpen: true,
    }));

    // Fetch detailed record data for WHO chart
    await fetchRecordDetailForChart(data.id);
  };

  // Function to fetch record details for ResultSection
  const fetchRecordDetailForResult = async (recordId: string) => {
    setIsLoadingDetail(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";
      console.log(
        `🔍 Fetching record detail for ResultSection, ID: ${recordId}`
      );

      const response = await fetch(`${backendUrl}/stunting/${recordId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          "✅ Successfully fetched record detail for ResultSection:",
          result
        );

        if (result.success && result.data) {
          setSelectedRecordDetail(result.data);
        } else {
          console.error("❌ Invalid response format:", result);
          setSelectedRecordDetail(null);
        }
      } else {
        console.error(
          `❌ Failed to fetch record detail. Status: ${response.status}`
        );
        setSelectedRecordDetail(null);
      }
    } catch (error) {
      console.error("❌ Error fetching record detail:", error);
      setSelectedRecordDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Function to fetch record details for WHO Chart
  const fetchRecordDetailForChart = async (recordId: string) => {
    setIsLoadingChart(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";
      console.log(`🔍 Fetching WHO chart data for record ID: ${recordId}`);

      const response = await fetch(`${backendUrl}/stunting/${recordId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          "✅ Successfully fetched record detail for WHO Chart:",
          result
        );

        if (result.success && result.data) {
          // Transform backend data to match WHO chart component format
          const transformedData = {
            childName: result.data.childName,
            ageInMonths: result.data.ageInMonths,
            weight: result.data.weight,
            height: result.data.height,
            gender: result.data.gender,
            weightPercentile: result.data.weightPercentile || 0,
            heightPercentile: result.data.heightPercentile || 0,
            weightCategory: result.data.weightCategory || "normal",
            heightCategory: result.data.heightCategory || "normal",
            // Generate WHO chart data based on the child's measurements
            whoChartData: {
              weightChartData: generateWHOWeightData(
                result.data.ageInMonths,
                result.data.weight,
                result.data.gender
              ),
              heightChartData: generateWHOHeightData(
                result.data.ageInMonths,
                result.data.height,
                result.data.gender
              ),
              weightPercentile: result.data.weightPercentile || 0,
              heightPercentile: result.data.heightPercentile || 0,
            },
          };
          setSelectedRecordDetail(transformedData);
        } else {
          console.error("❌ Invalid response format:", result);
          setSelectedRecordDetail(null);
        }
      } else {
        console.error(
          `❌ Failed to fetch record detail. Status: ${response.status}`
        );
        setSelectedRecordDetail(null);
      }
    } catch (error) {
      console.error("❌ Error fetching record detail:", error);
      setSelectedRecordDetail(null);
    } finally {
      setIsLoadingChart(false);
    }
  };

  // Generate WHO weight chart data
  const generateWHOWeightData = (
    childAge: number,
    childWeight: number,
    gender: string
  ) => {
    const data = [];
    for (let age = 0; age <= 60; age++) {
      // WHO weight-for-age percentiles (simplified approximation)
      const baseWeight =
        gender === "laki-laki"
          ? 3.3 + age * 0.15
          : // Boys
            3.2 + age * 0.14; // Girls

      data.push({
        age,
        p3: baseWeight * 0.75,
        p15: baseWeight * 0.85,
        p50: baseWeight,
        p85: baseWeight * 1.15,
        p97: baseWeight * 1.25,
        childWeight: age === childAge ? childWeight : null,
      });
    }
    return data;
  };

  // Generate WHO height chart data
  const generateWHOHeightData = (
    childAge: number,
    childHeight: number,
    gender: string
  ) => {
    const data = [];
    for (let age = 0; age <= 60; age++) {
      // WHO height-for-age percentiles (simplified approximation)
      const baseHeight =
        gender === "laki-laki"
          ? 49.9 + age * 1.1
          : // Boys
            49.1 + age * 1.0; // Girls

      data.push({
        age,
        p3: baseHeight * 0.92,
        p15: baseHeight * 0.96,
        p50: baseHeight,
        p85: baseHeight * 1.04,
        p97: baseHeight * 1.08,
        childHeight: age === childAge ? childHeight : null,
      });
    }
    return data;
  };

  const handleCloseDialogs = () => {
    setUIState((prev) => ({
      ...prev,
      isDetailDialogOpen: false,
      isChartDialogOpen: false,
      selectedData: null,
    }));
    setSelectedRecordDetail(null);
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

      {/* Detail Dialog - Using ResultSection Component */}
      <Dialog
        open={uiState.isDetailDialogOpen}
        onOpenChange={(open) => !open && handleCloseDialogs()}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Hasil Pemeriksaan - {uiState.selectedData?.namaAnak}
            </DialogTitle>
            <DialogDescription>
              Hasil pemeriksaan stunting untuk {uiState.selectedData?.namaAnak}{" "}
              ({uiState.selectedData?.usia} bulan)
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Memuat hasil...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Data Inputan */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Data Inputan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nama Anak
                    </p>
                    <p className="font-semibold">
                      {uiState.selectedData?.namaAnak}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Usia</p>
                    <p>{uiState.selectedData?.usia} bulan</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Berat Badan
                    </p>
                    <p className="font-semibold">
                      {uiState.selectedData?.beratBadan} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tinggi Badan
                    </p>
                    <p className="font-semibold">
                      {uiState.selectedData?.tinggiBadan} cm
                    </p>
                  </div>
                </div>
              </div>

              {/* ResultSection Component */}
              {uiState.selectedData && (
                <ResultSection
                  result={
                    {
                      status: uiState.selectedData.status,
                      score: uiState.selectedData.risiko,
                      message: `Berdasarkan hasil analisis machine learning, anak yang bernama ${
                        uiState.selectedData.namaAnak
                      } berada dalam kondisi ${
                        uiState.selectedData.status === "normal"
                          ? "normal"
                          : uiState.selectedData.status === "berisiko"
                          ? "berisiko"
                          : "stunting"
                      }.`,
                      suggestions: [
                        "Berikan ASI eksklusif selama 6 bulan pertama",
                        "Berikan makanan pendamping ASI yang bergizi setelah 6 bulan",
                        "Lakukan pemantauan pertumbuhan secara rutin",
                        "Pastikan anak mendapatkan imunisasi lengkap",
                        "Berikan makanan dengan gizi seimbang",
                      ],
                      recommendations: [
                        "Konsultasi rutin dengan tenaga kesehatan",
                        "Pantau perkembangan anak secara berkala",
                        "Berikan nutrisi seimbang sesuai usia",
                        "Jaga kebersihan lingkungan dan makanan",
                      ],
                      recommendedArticles: [
                        {
                          id: "1",
                          title:
                            "Mengenal Stunting: Penyebab, Dampak, dan Pencegahan",
                          category: "Pengetahuan Umum",
                          slug: "mengenal-stunting-penyebab-dampak-dan-pencegahan", // Tambahkan slug
                        },
                      ],
                    } as PredictionResult
                  }
                  onBackToForm={() => handleCloseDialogs()}
                  onPrintReport={() => {
                    console.log(
                      "Print report for:",
                      uiState.selectedData?.namaAnak
                    );
                  }}
                  onShareWhatsApp={() => {
                    const message = `Hasil pemeriksaan stunting untuk ${uiState.selectedData?.namaAnak}: Status ${uiState.selectedData?.status}, Risiko ${uiState.selectedData?.risiko}%`;
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                      message
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* WHO Chart Dialog - Individual Record */}
      <Dialog
        open={uiState.isChartDialogOpen && !!uiState.selectedData}
        onOpenChange={(open) => !open && handleCloseDialogs()}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              WHO Chart - {uiState.selectedData?.namaAnak}
            </DialogTitle>
            <DialogDescription>
              Grafik pertumbuhan WHO untuk {uiState.selectedData?.namaAnak} (
              {uiState.selectedData?.usia} bulan)
            </DialogDescription>
          </DialogHeader>

          {isLoadingChart ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-500">Memuat grafik WHO...</span>
            </div>
          ) : selectedRecordDetail?.whoChartData ? (
            <WHOChartSection
              chartData={
                selectedRecordDetail.whoChartData.weightChartData || []
              }
              heightChartData={
                selectedRecordDetail.whoChartData.heightChartData || []
              }
              weightPercentile={selectedRecordDetail.weightPercentile || 0}
              heightPercentile={selectedRecordDetail.heightPercentile || 0}
              childName={selectedRecordDetail.childName || ""}
              result={{
                status: uiState.selectedData?.status || "",
                risiko: uiState.selectedData?.risiko || 0,
              }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Data WHO Chart tidak tersedia untuk record ini.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Record ID: {uiState.selectedData?.id}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
