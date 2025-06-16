// perubahan caca: Mengubah model untuk mengambil data langsung dari database stunting_records menggantikan data dummy
import type {
  StuntingData,
  FilterState,
  StuntingRecordRaw,
} from "@/types/stunting";

export class StuntingModel {
  private data: StuntingData[] = [];

  // perubahan: Mengubah loadData untuk mengambil data dari backend API yang sudah ada
  async loadData(): Promise<StuntingData[]> {
    try {
      // Menggunakan endpoint backend yang sudah ada, bukan /api/stunting-records
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";
      console.log(
        "🔄 Attempting to fetch data from:",
        `${backendUrl}/stunting?limit=1000`
      );

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${backendUrl}/stunting?limit=1000`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `❌ Backend responded with status: ${response.status} ${response.statusText}`
        );

        if (response.status === 404) {
          throw new Error(
            `Backend endpoint tidak ditemukan. Pastikan server backend berjalan di ${backendUrl} dan endpoint /stunting tersedia.`
          );
        }

        throw new Error(
          `Backend error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        console.error("❌ Invalid data format received:", result);
        throw new Error("Format data dari backend tidak valid");
      }

      // Transform data dari backend ke format yang dibutuhkan UI
      const transformedData: StuntingData[] = result.data.map((record: any) => {
        // Normalize status dari backend
        const normalizedStatus = (record.status || "normal").toLowerCase();

        // Log untuk debugging
        console.log(
          "Original status from backend:",
          record.status,
          "-> Normalized:",
          normalizedStatus
        );

        return {
          id: record.id,
          namaAnak: record.childName || record.namaAnak || "", // Menyesuaikan dengan nama field di backend
          namaIbu: record.motherName || record.namaIbu || "",
          tanggalLahir:
            record.birthDate || record.tanggalLahir || new Date().toISOString(),
          jenisKelamin: record.gender || record.jenisKelamin || "",
          beratBadan: record.weight || record.beratBadan || 0,
          tinggiBadan: record.height || record.tinggiBadan || 0,
          usia: record.ageInMonths || record.usia || 0,
          // Ambil nama lokasi dari relasi
          provinsi:
            record.village?.district?.regency?.province?.name ||
            record.provinceName ||
            "",
          kabupaten:
            record.village?.district?.regency?.name || record.regencyName || "",
          kecamatan:
            record.village?.district?.name || record.districtName || "",
          desa: record.village?.name || record.villageName || "",
          status: normalizedStatus,
          risiko: Math.round(
            record.riskPercentage || record.risikoPersentase || 0
          ),
          tanggalPemeriksaan: record.createdAt || new Date().toISOString(),
          whoChartData: record.whoChartData || {},
          predictionMessage: record.predictionMessage || "",
          recommendations: record.recommendations || [],
          modelUsed: record.modelUsed || "",
          recommendedEducationId: record.recommendedEducationId || "",
        };
      });

      console.log(
        "✅ Data berhasil diambil:",
        transformedData.length,
        "records"
      );

      // Log status distribution untuk debugging
      const statusCounts = transformedData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log("📊 Status distribution:", statusCounts);

      // Format tanggal untuk tampilan dengan penanganan error yang lebih baik
      transformedData.forEach((item) => {
        // Handle tanggal lahir
        try {
          if (item.tanggalLahir) {
            const birthDate = new Date(item.tanggalLahir);
            if (!isNaN(birthDate.getTime())) {
              item.tanggalLahir = birthDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            } else {
              console.warn(
                `Invalid birth date for ${item.namaAnak}:`,
                item.tanggalLahir
              );
              item.tanggalLahir = "Tanggal tidak valid";
            }
          } else {
            item.tanggalLahir = "Tanggal tidak tersedia";
          }
        } catch (e) {
          console.error(
            "Error formatting birth date:",
            e,
            "for",
            item.namaAnak
          );
          item.tanggalLahir = "Error format tanggal";
        }

        // Handle tanggal pemeriksaan
        try {
          if (item.tanggalPemeriksaan) {
            const examDate = new Date(item.tanggalPemeriksaan);
            if (!isNaN(examDate.getTime())) {
              item.tanggalPemeriksaan = examDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            } else {
              console.warn(
                `Invalid exam date for ${item.namaAnak}:`,
                item.tanggalPemeriksaan
              );
              item.tanggalPemeriksaan = "Tanggal tidak valid";
            }
          } else {
            item.tanggalPemeriksaan = "Tanggal tidak tersedia";
          }
        } catch (e) {
          console.error("Error formatting exam date:", e, "for", item.namaAnak);
          item.tanggalPemeriksaan = "Error format tanggal";
        }
      });

      this.data = transformedData;
      return transformedData;
    } catch (error) {
      console.error("❌ Error loading data:", error);

      // Jangan gunakan mock data, lempar error yang jelas
      if (error.name === "AbortError") {
        throw new Error(
          "Koneksi ke backend timeout. Pastikan server backend berjalan di https://be-byestunting-production.up.railway.app"
        );
      }

      if (error.message.includes("fetch")) {
        throw new Error(
          "Tidak dapat terhubung ke backend server. Pastikan server backend berjalan di https://be-byestunting-production.up.railway.app"
        );
      }

      throw error;
    }
  }

  getData(): StuntingData[] {
    return this.data;
  }

  filterData(filters: FilterState): StuntingData[] {
    return this.data.filter((item) => {
      const searchMatch =
        item.namaAnak
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        item.namaIbu.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.provinsi
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        item.kabupaten.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const provinsiMatch =
        filters.selectedProvinsi === "all" ||
        item.provinsi === filters.selectedProvinsi;
      const kabupatenMatch =
        filters.selectedKabupaten === "all" ||
        item.kabupaten === filters.selectedKabupaten;
      const kecamatanMatch =
        filters.selectedKecamatan === "all" ||
        item.kecamatan === filters.selectedKecamatan;
      const desaMatch =
        filters.selectedDesa === "all" || item.desa === filters.selectedDesa;

      return (
        searchMatch &&
        provinsiMatch &&
        kabupatenMatch &&
        kecamatanMatch &&
        desaMatch
      );
    });
  }

  getUniqueProvinsis(): string[] {
    return [...new Set(this.data.map((d) => d.provinsi))];
  }

  getKabupatens(provinsi: string): string[] {
    if (provinsi === "all") return [];
    return [
      ...new Set(
        this.data.filter((d) => d.provinsi === provinsi).map((d) => d.kabupaten)
      ),
    ];
  }

  getKecamatans(provinsi: string, kabupaten: string): string[] {
    if (kabupaten === "all") return [];
    return [
      ...new Set(
        this.data
          .filter((d) => d.provinsi === provinsi && d.kabupaten === kabupaten)
          .map((d) => d.kecamatan)
      ),
    ];
  }

  getDesas(provinsi: string, kabupaten: string, kecamatan: string): string[] {
    if (kecamatan === "all") return [];
    return [
      ...new Set(
        this.data
          .filter(
            (d) =>
              d.provinsi === provinsi &&
              d.kabupaten === kabupaten &&
              d.kecamatan === kecamatan
          )
          .map((d) => d.desa)
      ),
    ];
  }

  getStatistics(filteredData: StuntingData[]) {
    const stats = {
      total: filteredData.length,
      normal: 0,
      stunting: 0,
      severelyStunting: 0,
    };

    filteredData.forEach((item) => {
      const status = item.status.toLowerCase();

      if (status === "normal") {
        stats.normal++;
      } else if (status === "stunting") {
        stats.stunting++;
      } else if (
        status === "severely stunting" ||
        status === "severly stunting" ||
        status === "stunting berat"
      ) {
        stats.severelyStunting++;
      }
    });

    console.log("📊 Calculated statistics:", stats);
    return stats;
  }

  exportToCSV(filteredData: StuntingData[]): string {
    const headers = [
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
    ];

    const getStatusForExport = (status: string) => {
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
          return "Normal";
      }
    };

    const rows = filteredData.map((item, index) => [
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
      getStatusForExport(item.status),
      item.risiko,
      item.tanggalPemeriksaan,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }

  // Method untuk mengambil detail record berdasarkan ID dari database
  async getRecordDetail(id: string): Promise<StuntingRecordRaw> {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";
      const response = await fetch(`${backendUrl}/stunting/${id}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch record detail: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Invalid data format received from server");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching record detail:", error);
      throw error;
    }
  }
}
