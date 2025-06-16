export interface FormData {
  nama: string;
  namaIbu: string;
  tanggalLahir: Date | undefined;
  usia: string;
  jenisKelamin: string;
  beratBadan: string;
  tinggiBadan: string;
  provinsiId: string;
  kabupatenId: string;
  kecamatanId: string;
  desaId: string;
}

export interface FormErrors {
  nama?: string;
  namaIbu?: string;
  tanggalLahir?: string;
  usia?: string;
  jenisKelamin?: string;
  beratBadan?: string;
  tinggiBadan?: string;
  provinsiId?: string;
  kabupatenId?: string;
  kecamatanId?: string;
  desaId?: string;
}

export interface RecommendedArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  readTime?: number;
  tags?: string[];
}

export interface PredictionResult {
  nama: string;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  status: string;
  score: number;
  message: string;
  whoChartData?: any;
  recommendations?: string[];
  suggestions?: string[];
  recommendedArticles?: RecommendedArticle[];
  slug?: string;
}

export interface LocationData {
  id: string;
  name: string;
}

export interface ChartData {
  age: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
  childWeight?: number;
  childHeight?: number;
}

export class CekStuntingModel {
  private formData: FormData = {
    nama: "",
    namaIbu: "",
    tanggalLahir: undefined,
    usia: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
    provinsiId: "",
    kabupatenId: "",
    kecamatanId: "",
    desaId: "",
  };

  private errors: FormErrors = {};

  getFormData(): FormData {
    return { ...this.formData };
  }

  getErrors(): FormErrors {
    return { ...this.errors };
  }

  updateFormData(field: keyof FormData, value: any): void {
    this.formData[field] = value;
  }

  updateErrors(field: keyof FormErrors, error: string): void {
    this.errors[field] = error;
  }

  validateField(field: keyof FormData, value: any): boolean {
    let isValid = true;

    switch (field) {
      case "nama":
        if (!value || value.trim().length < 2) {
          this.errors.nama = "Nama anak minimal 2 karakter";
          isValid = false;
        } else {
          delete this.errors.nama;
        }
        break;

      case "namaIbu":
        if (!value || value.trim().length < 2) {
          this.errors.namaIbu = "Nama ibu minimal 2 karakter";
          isValid = false;
        } else {
          delete this.errors.namaIbu;
        }
        break;

      case "tanggalLahir":
        if (!value) {
          this.errors.tanggalLahir = "Tanggal lahir harus diisi";
          isValid = false;
        } else {
          delete this.errors.tanggalLahir;
        }
        break;

      case "jenisKelamin":
        if (!value) {
          this.errors.jenisKelamin = "Jenis kelamin harus dipilih";
          isValid = false;
        } else {
          delete this.errors.jenisKelamin;
        }
        break;

      case "beratBadan":
        const weight = Number.parseFloat(value);
        if (!value || isNaN(weight) || weight <= 0 || weight > 50) {
          this.errors.beratBadan = "Berat badan harus antara 0.1 - 50 kg";
          isValid = false;
        } else {
          delete this.errors.beratBadan;
        }
        break;

      case "tinggiBadan":
        const height = Number.parseFloat(value);
        if (!value || isNaN(height) || height <= 0 || height > 150) {
          this.errors.tinggiBadan = "Tinggi badan harus antara 1 - 150 cm";
          isValid = false;
        } else {
          delete this.errors.tinggiBadan;
        }
        break;

      case "provinsiId":
        if (!value) {
          this.errors.provinsiId = "Provinsi harus dipilih";
          isValid = false;
        } else {
          delete this.errors.provinsiId;
        }
        break;

      case "kabupatenId":
        if (!value) {
          this.errors.kabupatenId = "Kabupaten/Kota harus dipilih";
          isValid = false;
        } else {
          delete this.errors.kabupatenId;
        }
        break;

      case "kecamatanId":
        if (!value) {
          this.errors.kecamatanId = "Kecamatan harus dipilih";
          isValid = false;
        } else {
          delete this.errors.kecamatanId;
        }
        break;

      case "desaId":
        if (!value) {
          this.errors.desaId = "Desa/Kelurahan harus dipilih";
          isValid = false;
        } else {
          delete this.errors.desaId;
        }
        break;
    }

    return isValid;
  }

  validateAllFields(): boolean {
    let isValid = true;

    // Validate all required fields
    const fieldsToValidate: (keyof FormData)[] = [
      "nama",
      "namaIbu",
      "tanggalLahir",
      "jenisKelamin",
      "beratBadan",
      "tinggiBadan",
      "provinsiId",
      "kabupatenId",
      "kecamatanId",
      "desaId",
    ];

    fieldsToValidate.forEach((field) => {
      const fieldValid = this.validateField(field, this.formData[field]);
      if (!fieldValid) {
        isValid = false;
      }
    });

    return isValid;
  }

  reset(): void {
    this.formData = {
      nama: "",
      namaIbu: "",
      tanggalLahir: undefined,
      usia: "",
      jenisKelamin: "",
      beratBadan: "",
      tinggiBadan: "",
      provinsiId: "",
      kabupatenId: "",
      kecamatanId: "",
      desaId: "",
    };
    this.errors = {};
  }
}

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim();
};

// Helper function to process recommended articles and ensure they have slugs
export const processRecommendedArticles = (
  articles: any[]
): RecommendedArticle[] => {
  if (!Array.isArray(articles)) {
    return [];
  }

  return articles.map((article) => {
    // Ensure slug exists, generate from title if not available
    const slug =
      article.slug || generateSlug(article.title || `article-${article.id}`);

    return {
      id: article.id?.toString() || "",
      slug: slug,
      title: article.title || "Untitled Article",
      category: article.category || "General",
      excerpt: article.excerpt || "",
      content: article.content || "",
      imageUrl: article.imageUrl || article.image_url || "",
      author: article.author || "Admin",
      publishedAt:
        article.publishedAt || article.published_at || new Date().toISOString(),
      readTime: article.readTime || article.read_time || 5,
      tags: Array.isArray(article.tags) ? article.tags : [],
    };
  });
};

// Updated interface for backward compatibility
export interface CekStuntingResult {
  nama: string;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  status: string;
  score: number;
  message: string;
  whoChartData?: any;
  recommendations?: any[];
  suggestions?: string[];
  slug?: string;
  recommendedArticles?: RecommendedArticle[];
}

// API service functions
export const predictStunting = async (
  formData: FormData
): Promise<PredictionResult> => {
  try {
    const response = await fetch("/api/ml/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: formData.nama,
        namaIbu: formData.namaIbu,
        tanggalLahir: formData.tanggalLahir,
        usia: Number.parseInt(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
        provinsiId: formData.provinsiId,
        kabupatenId: formData.kabupatenId,
        kecamatanId: formData.kecamatanId,
        desaId: formData.desaId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Process recommended articles to ensure they have proper slugs
    const processedArticles = processRecommendedArticles(
      result.recommendedArticles || []
    );

    return {
      nama: result.nama || formData.nama,
      usia: result.usia || Number.parseInt(formData.usia),
      jenisKelamin: result.jenisKelamin || formData.jenisKelamin,
      beratBadan: result.beratBadan || Number.parseFloat(formData.beratBadan),
      tinggiBadan:
        result.tinggiBadan || Number.parseFloat(formData.tinggiBadan),
      status: result.status || "normal",
      score: result.score || 0,
      message: result.message || "Prediksi berhasil dilakukan",
      whoChartData: result.whoChartData,
      recommendations: result.recommendations || [],
      suggestions: result.suggestions || [],
      recommendedArticles: processedArticles,
      slug: result.slug,
    };
  } catch (error) {
    console.error("Error predicting stunting:", error);
    throw new Error("Gagal melakukan prediksi. Silakan coba lagi.");
  }
};

// Function to get location data
export const getLocationData = async (
  type: "provinsi" | "kabupaten" | "kecamatan" | "desa",
  parentId?: string
): Promise<LocationData[]> => {
  try {
    let url = `/api/locations/${type}`;
    if (parentId) {
      url += `?parentId=${parentId}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id?.toString() || "",
      name: item.name || item.nama || "",
    }));
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    return [];
  }
};
