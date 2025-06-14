import type { StuntingModel } from "@/model/admin/stunting-model";
import type {
  StuntingData,
  FilterState,
  LocationOptions,
} from "@/types/stunting";

export class StuntingPresenter {
  private model: StuntingModel;
  private view: any; // Will be set by the view component

  constructor(model: StuntingModel) {
    this.model = model;
  }

  setView(view: any) {
    this.view = view;
  }

  async initialize() {
    this.view.setUIState({ isLoading: true });
    try {
      await this.model.loadData();
      this.view.setData(this.model.getData());
      this.updateLocationOptions();
    } catch (error) {
      this.view.setUIState({
        errorMessage: "Gagal memuat data",
        isLoading: false,
      });
    } finally {
      this.view.setUIState({ isLoading: false });
    }
  }

  handleFilterChange(filters: FilterState) {
    const filteredData = this.model.filterData(filters);
    this.view.setFilteredData(filteredData);
    this.updateLocationOptions(filters);
  }

  handleDownloadExcel(filteredData: StuntingData[]) {
    try {
      const csvContent = this.model.exportToCSV(filteredData);
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

      this.view.setUIState({ successMessage: "Data berhasil diunduh!" });
      setTimeout(() => {
        this.view.setUIState({ successMessage: null });
      }, 3000);
    } catch (error) {
      this.view.setUIState({ errorMessage: "Gagal mengunduh data" });
    }
  }

  handleViewDetail(data: StuntingData) {
    this.view.setUIState({
      selectedData: data,
      isDetailDialogOpen: true,
    });
  }

  handleViewChart(data: StuntingData) {
    this.view.setUIState({
      selectedData: data,
      isChartDialogOpen: true,
    });
  }

  handleCloseDialogs() {
    this.view.setUIState({
      isDetailDialogOpen: false,
      isChartDialogOpen: false,
      selectedData: null,
    });
  }

  getStatistics(filteredData: StuntingData[]) {
    return this.model.getStatistics(filteredData);
  }

  private updateLocationOptions(filters?: FilterState) {
    const locationOptions: LocationOptions = {
      kabupatens: [],
      kecamatans: [],
      desas: [],
    };

    if (filters?.selectedProvinsi && filters.selectedProvinsi !== "all") {
      locationOptions.kabupatens = this.model.getKabupatens(
        filters.selectedProvinsi
      );

      if (filters.selectedKabupaten && filters.selectedKabupaten !== "all") {
        locationOptions.kecamatans = this.model.getKecamatans(
          filters.selectedProvinsi,
          filters.selectedKabupaten
        );

        if (filters.selectedKecamatan && filters.selectedKecamatan !== "all") {
          locationOptions.desas = this.model.getDesas(
            filters.selectedProvinsi,
            filters.selectedKabupaten,
            filters.selectedKecamatan
          );
        }
      }
    }

    this.view.setLocationOptions(locationOptions);
  }

  getUniqueProvinsis(): string[] {
    return this.model.getUniqueProvinsis();
  }
}
