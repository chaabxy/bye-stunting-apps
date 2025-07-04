"use client";

import { useState, useEffect, useMemo } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
import { getWeightForAgeData, getHeightForAgeData } from "@/presenter/lib/who-chart-data";

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
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";
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
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";
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

  // Generate WHO weight chart data - menggunakan data WHO yang akurat
  const generateWHOWeightData = (
    childAge: number,
    childWeight: number,
    gender: string
  ) => {
    const data = [];
    for (let age = 0; age <= 60; age++) {
      // Gunakan data WHO yang akurat dari who-chart-data.ts
      const whoData = getWeightForAgeData(
        age,
        gender as "laki-laki" | "perempuan"
      );

      data.push({
        age,
        p3: whoData.p3,
        p15: whoData.p15,
        p50: whoData.p50,
        p85: whoData.p85,
        p97: whoData.p97,
        childWeight: age === childAge ? childWeight : null,
      });
    }
    return data;
  };

  // Generate WHO height chart data - menggunakan data WHO yang akurat
  const generateWHOHeightData = (
    childAge: number,
    childHeight: number,
    gender: string
  ) => {
    const data = [];
    for (let age = 0; age <= 60; age++) {
      // Gunakan data WHO yang akurat dari who-chart-data.ts
      const whoData = getHeightForAgeData(
        age,
        gender as "laki-laki" | "perempuan"
      );

      data.push({
        age,
        p3: whoData.p3,
        p15: whoData.p15,
        p50: whoData.p50,
        p85: whoData.p85,
        p97: whoData.p97,
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

      {/* WHO Chart Dialog - Individual Record */}
      <Dialog
        open={uiState.isChartDialogOpen && !!uiState.selectedData}
        onOpenChange={(open) => !open && handleCloseDialogs()}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-black">
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
