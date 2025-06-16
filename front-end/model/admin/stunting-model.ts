// perubahan caca: Mengubah model untuk mengambil data langsung dari database stunting_records menggantikan data dummy
import type {
  StuntingData,
  FilterState,
  StuntingRecordRaw,
  SuggestedAction,
  RecommendedEducation,
  DetailedStuntingResult,
} from "@/types/stunting";

export class StuntingModel {
  private data: StuntingData[] = [];

  // perubahan: Mengubah loadData untuk mengambil data dari backend API yang sudah ada
  async loadData(): Promise<StuntingData[]> {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";
      console.log(
        "🔄 Attempting to fetch data from:",
        `${backendUrl}/stunting?limit=1000`
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        throw new Error(
          `Backend error: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("📊 Raw backend response:", result);

      if (!result.success || !Array.isArray(result.data)) {
        console.error("❌ Invalid data format received:", result);
        throw new Error("Format data dari backend tidak valid");
      }

      // Transform data sesuai dengan struktur backend yang sebenarnya
      const transformedData: StuntingData[] = result.data.map((record: any) => {
        console.log("🔄 Transforming record:", record.id, record);

        return {
          id: record.id,
          namaAnak: record.childName || "",
          namaIbu: record.motherName || "",
          tanggalLahir: record.birthDate || new Date().toISOString(),
          jenisKelamin: record.gender || "",
          beratBadan: record.weight || 0,
          tinggiBadan: record.height || 0,
          usia: record.ageInMonths || 0,
          // Ambil nama lokasi dari nested relations
          provinsi: record.village?.district?.regency?.province?.name || "",
          kabupaten: record.village?.district?.regency?.name || "",
          kecamatan: record.village?.district?.name || "",
          desa: record.village?.name || "",
          status: record.status || "normal",
          risiko: Math.round(record.riskPercentage || 0),
          tanggalPemeriksaan: record.createdAt || new Date().toISOString(),
          whoChartData: {
            weightPercentile: record.weightPercentile || 0,
            heightPercentile: record.heightPercentile || 0,
            weightCategory: record.weightCategory || "",
            heightCategory: record.heightCategory || "",
          },
          predictionMessage: record.predictionMessage || "",
          recommendations: record.recommendations || [],
          modelUsed: record.modelUsed || "",
          recommendedEducationId:
            record.recommendedEducationId?.toString() || "",
          // Store raw backend data for detailed view
          detailedResult: {
            id: record.id,
            childName: record.childName || "",
            motherName: record.motherName || "",
            birthDate: record.birthDate || "",
            gender: record.gender || "",
            weight: record.weight || 0,
            height: record.height || 0,
            ageInMonths: record.ageInMonths || 0,
            status: record.status || "",
            riskPercentage: record.riskPercentage || 0,
            predictionMessage: record.predictionMessage || "",
            modelUsed: record.modelUsed || "",
            createdAt: record.createdAt || "",
            province: record.village?.district?.regency?.province,
            regency: record.village?.district?.regency,
            district: record.village?.district,
            village: record.village,
            whoChartData: {
              weightPercentile: record.weightPercentile || 0,
              heightPercentile: record.heightPercentile || 0,
              weightCategory: record.weightCategory || "",
              heightCategory: record.heightCategory || "",
            },
            suggestedActions: record.suggestedAction
              ? [
                  {
                    id: record.suggestedAction.id?.toString() || "",
                    title: record.suggestedAction.suggestion || "",
                    description: record.suggestedAction.suggestion || "",
                    category: "nutrisi",
                    priority: 1,
                  },
                ]
              : [],
            recommendedEducations: [], // Will be populated later
            recommendations: record.recommendations || [],
          },
        };
      });

      console.log(
        "✅ Data berhasil diambil:",
        transformedData.length,
        "records"
      );

      // Format tanggal untuk tampilan
      transformedData.forEach((item) => {
        try {
          if (item.tanggalLahir) {
            const birthDate = new Date(item.tanggalLahir);
            if (!isNaN(birthDate.getTime())) {
              item.tanggalLahir = birthDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            }
          }
        } catch (e) {
          console.error("Error formatting birth date:", e);
          item.tanggalLahir = "Tanggal tidak valid";
        }

        try {
          if (item.tanggalPemeriksaan) {
            const examDate = new Date(item.tanggalPemeriksaan);
            if (!isNaN(examDate.getTime())) {
              item.tanggalPemeriksaan = examDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
            }
          }
        } catch (e) {
          console.error("Error formatting exam date:", e);
          item.tanggalPemeriksaan = "Tanggal tidak valid";
        }
      });

      // Fetch recommended educations for all records
      await this.populateRecommendedEducations(transformedData);

      this.data = transformedData;
      return transformedData;
    } catch (error) {
      console.error("❌ Error loading data:", error);

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

  // Method baru untuk populate recommended educations
  private async populateRecommendedEducations(
    data: StuntingData[]
  ): Promise<void> {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";

      // Get unique education IDs
      const educationIds = [
        ...new Set(
          data
            .map((item) => item.recommendedEducationId)
            .filter((id) => id && id !== "")
        ),
      ];

      console.log("🔄 Fetching educations for IDs:", educationIds);

      if (educationIds.length === 0) {
        console.log("ℹ️ No education IDs to fetch");
        return;
      }

      // Fetch educations from backend
      const response = await fetch(`${backendUrl}/api/educations`);

      if (!response.ok) {
        console.warn(`Failed to fetch educations: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("📚 Educations response:", result);

      if (result.success && Array.isArray(result.data)) {
        const educationsMap = new Map();

        result.data.forEach((edu: any) => {
          educationsMap.set(edu.id.toString(), {
            id: edu.id.toString(),
            title: edu.title || "",
            category: edu.category || "",
            slug: edu.slug || "",
            content: edu.content || "",
            image: edu.image || "",
          });
        });

        // Populate recommended educations in detailed results
        data.forEach((item) => {
          if (item.detailedResult && item.recommendedEducationId) {
            const education = educationsMap.get(item.recommendedEducationId);
            if (education) {
              item.detailedResult.recommendedEducations = [education];
            }
          }
        });

        console.log("✅ Successfully populated recommended educations");
      }
    } catch (error) {
      console.error("❌ Error fetching recommended educations:", error);
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
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";
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

  // Method untuk mengambil suggested actions berdasarkan data anak
  async getSuggestedActions(childData: {
    ageInMonths: number;
    weight: number;
    height: number;
    gender: string;
    status: string;
  }): Promise<SuggestedAction[]> {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";

      console.log("🔄 Fetching suggested actions with data:", childData);

      const response = await fetch(`${backendUrl}/suggested-actions`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      console.log("📡 Suggested actions response status:", response.status);

      if (!response.ok) {
        console.warn(`Failed to fetch suggested actions: ${response.status}`);
        // Return default suggestions if API fails
        return [
          {
            id: "default-1",
            title: "ASI Eksklusif",
            description: "Berikan ASI eksklusif selama 6 bulan pertama",
            category: "nutrisi",
            priority: 1,
          },
          {
            id: "default-2",
            title: "MPASI Bergizi",
            description:
              "Berikan makanan pendamping ASI yang bergizi setelah 6 bulan",
            category: "nutrisi",
            priority: 2,
          },
          {
            id: "default-3",
            title: "Pemantauan Rutin",
            description: "Lakukan pemantauan pertumbuhan secara rutin",
            category: "kesehatan",
            priority: 3,
          },
        ];
      }

      const result = await response.json();
      console.log("📊 Suggested actions result:", result);

      if (result.success && Array.isArray(result.data)) {
        const actions = result.data.map((action: any) => ({
          id: action.id || Math.random().toString(),
          title: action.title || "",
          description: action.description || action.title || "",
          category: action.category || "general",
          priority: action.priority || 1,
        }));
        console.log("✅ Processed suggested actions:", actions);
        return actions;
      }

      // Return default if no valid data
      return [
        {
          id: "default-1",
          title: "ASI Eksklusif",
          description: "Berikan ASI eksklusif selama 6 bulan pertama",
          category: "nutrisi",
          priority: 1,
        },
        {
          id: "default-2",
          title: "MPASI Bergizi",
          description:
            "Berikan makanan pendamping ASI yang bergizi setelah 6 bulan",
          category: "nutrisi",
          priority: 2,
        },
      ];
    } catch (error) {
      console.error("Error fetching suggested actions:", error);
      // Return default suggestions on error
      return [
        {
          id: "default-1",
          title: "ASI Eksklusif",
          description: "Berikan ASI eksklusif selama 6 bulan pertama",
          category: "nutrisi",
          priority: 1,
        },
        {
          id: "default-2",
          title: "MPASI Bergizi",
          description:
            "Berikan makanan pendamping ASI yang bergizi setelah 6 bulan",
          category: "nutrisi",
          priority: 2,
        },
        {
          id: "default-3",
          title: "Pemantauan Rutin",
          description: "Lakukan pemantauan pertumbuhan secara rutin",
          category: "kesehatan",
          priority: 3,
        },
      ];
    }
  }

  // Method untuk mengambil recommended educations
  async getRecommendedEducations(
    recommendedEducationIds?: string[]
  ): Promise<RecommendedEducation[]> {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";

      console.log(
        "🔄 Fetching recommended educations, IDs:",
        recommendedEducationIds
      );

      const response = await fetch(`${backendUrl}/api/educations`);

      console.log("📡 Educations response status:", response.status);

      if (!response.ok) {
        console.warn(`Failed to fetch educations: ${response.status}`);
        // Return default educations if API fails
        return [
          {
            id: "default-1",
            title: "Mengenal Stunting: Penyebab, Dampak, dan Pencegahan",
            category: "Pengetahuan Umum",
            slug: "mengenal-stunting-penyebab-dampak-dan-pencegahan",
          },
          {
            id: "default-2",
            title: "Gizi Seimbang untuk Mencegah Stunting",
            category: "Nutrisi",
            slug: "gizi-seimbang-untuk-mencegah-stunting",
          },
        ];
      }

      const result = await response.json();
      console.log("📊 Educations result:", result);

      if (result.success && Array.isArray(result.data)) {
        let educations = result.data.map((edu: any) => ({
          id: edu.id,
          title: edu.title || "",
          category: edu.category || "",
          slug: edu.slug || "",
          content: edu.content || "",
          image: edu.image || "",
        }));

        console.log("📚 All educations:", educations);

        // Filter by recommended education IDs if provided
        if (recommendedEducationIds && recommendedEducationIds.length > 0) {
          educations = educations.filter((edu: RecommendedEducation) =>
            recommendedEducationIds.includes(edu.id)
          );
          console.log("🎯 Filtered educations:", educations);
        }

        // If no specific recommendations or filtered result is empty, return first 3 educations
        if (educations.length === 0) {
          educations = result.data.slice(0, 3).map((edu: any) => ({
            id: edu.id,
            title: edu.title || "",
            category: edu.category || "",
            slug: edu.slug || "",
            content: edu.content || "",
            image: edu.image || "",
          }));
          console.log("📖 Default educations:", educations);
        }

        return educations;
      }

      // Return default if no valid data
      return [
        {
          id: "default-1",
          title: "Mengenal Stunting: Penyebab, Dampak, dan Pencegahan",
          category: "Pengetahuan Umum",
          slug: "mengenal-stunting-penyebab-dampak-dan-pencegahan",
        },
        {
          id: "default-2",
          title: "Gizi Seimbang untuk Mencegah Stunting",
          category: "Nutrisi",
          slug: "gizi-seimbang-untuk-mencegah-stunting",
        },
      ];
    } catch (error) {
      console.error("Error fetching recommended educations:", error);
      // Return default educations on error
      return [
        {
          id: "default-1",
          title: "Mengenal Stunting: Penyebab, Dampak, dan Pencegahan",
          category: "Pengetahuan Umum",
          slug: "mengenal-stunting-penyebab-dampak-dan-pencegahan",
        },
        {
          id: "default-2",
          title: "Gizi Seimbang untuk Mencegah Stunting",
          category: "Nutrisi",
          slug: "gizi-seimbang-untuk-mencegah-stunting",
        },
        {
          id: "default-3",
          title: "Pentingnya 1000 Hari Pertama Kehidupan",
          category: "Tumbuh Kembang",
          slug: "pentingnya-1000-hari-pertama-kehidupan",
        },
      ];
    }
  }

  // Method untuk mengambil detail lengkap record dengan suggested actions dan recommendations
  async getDetailedRecordResult(
    id: string
  ): Promise<DetailedStuntingResult | null> {
    try {
      console.log(`🔍 Getting detailed record result for ID: ${id}`);

      // Find the record in loaded data first
      const record = this.data.find((item) => item.id === id);

      if (record && record.detailedResult) {
        console.log(
          "✅ Found detailed result in loaded data:",
          record.detailedResult
        );
        return record.detailedResult;
      }

      // If not found in loaded data, fetch from backend
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://be-byestunting-production.up.railway.app";

      console.log(`🔄 Fetching detailed record from backend for ID: ${id}`);

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

      const recordData = result.data;

      // Build suggested actions from the record
      const suggestedActions: SuggestedAction[] = [];
      if (recordData.suggestedAction) {
        suggestedActions.push({
          id: recordData.suggestedAction.id?.toString() || "",
          title: recordData.suggestedAction.suggestion || "",
          description: recordData.suggestedAction.suggestion || "",
          category: "nutrisi",
          priority: 1,
        });
      }

      // Fetch recommended educations if ID exists
      const recommendedEducations: RecommendedEducation[] = [];
      if (recordData.recommendedEducationId) {
        const educations = await this.getRecommendedEducations([
          recordData.recommendedEducationId.toString(),
        ]);
        recommendedEducations.push(...educations);
      }

      // Transform and return detailed result
      const detailedResult: DetailedStuntingResult = {
        id: recordData.id,
        childName: recordData.childName || "",
        motherName: recordData.motherName || "",
        birthDate: recordData.birthDate || "",
        gender: recordData.gender || "",
        weight: recordData.weight || 0,
        height: recordData.height || 0,
        ageInMonths: recordData.ageInMonths || 0,
        status: recordData.status || "",
        riskPercentage: recordData.riskPercentage || 0,
        predictionMessage:
          recordData.predictionMessage ||
          `Berdasarkan hasil analisis, anak dengan nama ${recordData.childName} berada dalam kondisi ${recordData.status}.`,
        modelUsed: recordData.modelUsed || "",
        createdAt: recordData.createdAt || "",
        province: recordData.village?.district?.regency?.province,
        regency: recordData.village?.district?.regency,
        district: recordData.village?.district,
        village: recordData.village,
        whoChartData: {
          weightPercentile: recordData.weightPercentile || 0,
          heightPercentile: recordData.heightPercentile || 0,
          weightCategory: recordData.weightCategory || "",
          heightCategory: recordData.heightCategory || "",
        },
        suggestedActions,
        recommendedEducations,
        recommendations: recordData.recommendations || [],
      };

      console.log(
        "✅ Successfully fetched detailed record result:",
        detailedResult
      );
      return detailedResult;
    } catch (error) {
      console.error("Error fetching detailed record result:", error);
      return null;
    }
  }
}
