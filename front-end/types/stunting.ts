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
  status:
    | "normal"
    | "berisiko"
    | "stunting"
    | "severely stunting"
    | "severly stunting";
  risiko: number;
  tanggalPemeriksaan: string;
  // Field tambahan untuk mendukung WHO Chart dan Result component
  whoChartData?: any;
  predictionMessage?: string;
  recommendations?: string[];
  modelUsed?: string;
  recommendedEducationId?: string;
  // Add detailed result data
  detailedResult?: DetailedStuntingResult;
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

// Interface untuk data mentah dari database stunting_records
export type StuntingRecordRaw = {
  id: string;
  childName?: string;
  motherName?: string;
  namaAnak?: string;
  namaIbu?: string;
  birthDate?: string;
  tanggalLahir?: string;
  gender?: string;
  jenisKelamin?: string;
  weight?: number;
  beratBadan?: number;
  height?: number;
  tinggiBadan?: number;
  ageInMonths?: number;
  usia?: number;
  status: string;
  riskPercentage?: number;
  risikoPersentase?: number;
  createdAt: string;
  whoChartData?: any;
  predictionMessage?: string;
  recommendations?: string[];
  modelUsed?: string;
  recommendedEducationId?: string;
  province?: { name: string };
  regency?: { name: string };
  district?: { name: string };
  village?: { name: string };
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  desa?: string;
};

// Add these new interfaces after the existing types
export type SuggestedAction = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: number;
};

export type RecommendedEducation = {
  id: string;
  title: string;
  category: string;
  slug: string;
  content?: string;
  image?: string;
};

export type DetailedStuntingResult = {
  id: string;
  childName: string;
  motherName: string;
  birthDate: string;
  gender: string;
  weight: number;
  height: number;
  ageInMonths: number;
  status: string;
  riskPercentage: number;
  predictionMessage: string;
  modelUsed: string;
  createdAt: string;
  province?: { name: string };
  regency?: { name: string };
  district?: { name: string };
  village?: { name: string };
  whoChartData?: any;
  suggestedActions?: SuggestedAction[];
  recommendedEducations?: RecommendedEducation[];
  recommendations?: string[];
};
