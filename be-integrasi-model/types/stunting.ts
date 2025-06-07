export type StuntingData = {
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

export type FilterState = {
  searchTerm: string;
  selectedProvinsi: string;
  selectedKabupaten: string;
  selectedKecamatan: string;
  selectedDesa: string;
};

export type UIState = {
  isLoading: boolean;
  isChartDialogOpen: boolean;
  isDetailDialogOpen: boolean;
  selectedData: StuntingData | null;
  successMessage: string | null;
  errorMessage: string | null;
};

export type LocationOptions = {
  kabupatens: string[];
  kecamatans: string[];
  desas: string[];
};
