import axios from "axios";

// Konfigurasi backend URL - Support multiple hosts
const BACKEND_HOSTS = [
  "https://be-byestunting-production.up.railway.app",
  "http://127.0.0.1:3001",
  "http://192.168.56.1:3001",
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || BACKEND_HOSTS[0];

// Interface untuk input prediksi (sesuai dengan yang dikirim dari form)
export interface PredictionInput {
  nama: string;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
}

// Interface untuk hasil prediksi
export interface PredictionResult {
  status: "normal" | "berisiko" | "stunting";
  message: string;
  recommendations: string[];
  score: number;
  recommendedArticles: {
    id: number;
    slug: string;
    title: string;
    category: string;
  }[];
  modelUsed?: string;
  timestamp?: string;
}

// Interface untuk error prediksi
export interface PredictionError {
  isError: true;
  message: string;
}

/**
 * Konversi tanggal lahir ke usia dalam bulan
 */
export function calculateAgeInMonths(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();

  // Adjust jika hari belum lewat di bulan ini
  if (today.getDate() < birth.getDate()) {
    months--;
  }

  return Math.max(0, months);
}

/**
 * Validasi input berdasarkan jenis kelamin dan rentang yang ditentukan
 */
export function validateInputRanges(input: PredictionInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (input.usia < 0 || input.usia > 60) {
    errors.push("Usia harus antara 0-60 bulan");
  }

  if (!["laki-laki", "perempuan"].includes(input.jenisKelamin)) {
    errors.push('Jenis kelamin harus "laki-laki" atau "perempuan"');
  }

  // Validasi berat badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.beratBadan < 1.5 || input.beratBadan > 22.07) {
      errors.push(
        "Berat badan untuk anak laki-laki harus antara 1,5 - 22,07 kg"
      );
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.beratBadan < 1.5 || input.beratBadan > 21.42) {
      errors.push(
        "Berat badan untuk anak perempuan harus antara 1,5 - 21,42 kg"
      );
    }
  }

  // Validasi tinggi badan berdasarkan jenis kelamin
  if (input.jenisKelamin === "laki-laki") {
    if (input.tinggiBadan < 41.02 || input.tinggiBadan > 127.0) {
      errors.push(
        "Tinggi badan untuk anak laki-laki harus antara 41,02 - 127,0 cm"
      );
    }
  } else if (input.jenisKelamin === "perempuan") {
    if (input.tinggiBadan < 40.01 || input.tinggiBadan > 128.0) {
      errors.push(
        "Tinggi badan untuk anak perempuan harus antara 40,01 - 128,0 cm"
      );
    }
  }

  // Validasi nama tidak boleh kosong
  if (!input.nama || input.nama.trim().length === 0) {
    errors.push("Nama anak harus diisi");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create axios client with proper CORS configuration
 */
const createApiClient = (baseURL: string) => {
  return axios.create({
    baseURL,
    timeout: 15000, // 15 detik timeout
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: false, // Disable credentials for CORS
  });
};

/**
 * Try multiple backend hosts if one fails
 */
async function tryMultipleHosts<T>(
  operation: (client: any) => Promise<T>
): Promise<T> {
  const hosts = [
    BACKEND_URL,
    ...BACKEND_HOSTS.filter((h) => h !== BACKEND_URL),
  ];

  for (let i = 0; i < hosts.length; i++) {
    try {
      const client = createApiClient(hosts[i]);
      console.log(`🔄 Trying backend host: ${hosts[i]}`);
      const result = await operation(client);
      console.log(`✅ Success with host: ${hosts[i]}`);
      return result;
    } catch (error) {
      console.log(`❌ Failed with host ${hosts[i]}:`, error.message);
      if (i === hosts.length - 1) {
        throw error; // Throw the last error if all hosts fail
      }
    }
  }

  throw new Error("All backend hosts failed");
}

/**
 * Fungsi untuk melakukan prediksi stunting menggunakan backend API
 * TIDAK ADA FALLBACK - Jika backend gagal, tampilkan error message sesuai ketentuan
 */
export async function predictStunting(
  input: PredictionInput
): Promise<PredictionResult | PredictionError> {
  try {
    console.log("🔄 Memulai prediksi stunting via backend API...");

    // Validasi input terlebih dahulu
    const validation = validateInputRanges(input);
    if (!validation.isValid) {
      console.error("❌ Validasi input gagal:", validation.errors);
      return {
        isError: true,
        message: `Validasi input gagal: ${validation.errors.join(", ")}`,
      };
    }

    // Siapkan data untuk dikirim ke backend dengan field names yang konsisten
    const requestData = {
      nama: input.nama,
      usia: input.usia,
      jenisKelamin: input.jenisKelamin,
      beratBadan: input.beratBadan,
      tinggiBadan: input.tinggiBadan,
    };

    console.log("📤 Data yang dikirim ke backend:", requestData);

    // Try multiple hosts
    const response = await tryMultipleHosts(async (client) => {
      return await client.post("/api/predict", requestData);
    });

    console.log("✅ Prediksi berhasil dari backend dengan model asli");

    // Transform response untuk konsistensi dengan interface yang diharapkan
    const result = response.data;

    return {
      status: result.status,
      message: result.message,
      recommendations: result.recommendations || [],
      score: result.score || 0,
      recommendedArticles: result.recommendedArticles || [],
      // Tambahan metadata
      modelUsed: result.modelUsed || "backend-ml",
      timestamp: result.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ Error predicting stunting via backend:", error);

    // TIDAK ADA FALLBACK - Langsung return error message sesuai ketentuan
    return {
      isError: true,
      message:
        "Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya.",
    };
  }
}

/**
 * Test koneksi ke backend
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await tryMultipleHosts(async (client) => {
      return await client.get("/health");
    });

    return response.status === 200 && response.data.status === "OK";
  } catch (error) {
    console.error("Backend connection test failed:", error);
    return false;
  }
}

/**
 * Dapatkan rekomendasi artikel
 */
export async function getRecommendedArticles(
  status: "normal" | "berisiko" | "stunting",
  usia: number,
  jenisKelamin: string
): Promise<any[]> {
  try {
    const response = await tryMultipleHosts(async (client) => {
      return await client.post("/api/recommend", {
        status,
        usia,
        jenisKelamin,
      });
    });

    return response.data;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    // Return empty array jika gagal
    return [];
  }
}
