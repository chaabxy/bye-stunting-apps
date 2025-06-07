import type { StuntingData, FilterState } from "@/types/stunting";

export class StuntingModel {
  private data: StuntingData[] = [];

  async loadData(): Promise<StuntingData[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: StuntingData[] = [
          {
            id: "1",
            namaAnak: "Andi",
            namaIbu: "Siti",
            tanggalLahir: "2021-05-03",
            jenisKelamin: "laki-laki",
            beratBadan: 10.5,
            tinggiBadan: 85.5,
            usia: 43,
            provinsi: "Jawa Barat",
            kabupaten: "Garut",
            kecamatan: "Cilawu",
            desa: "Sukamurni",
            status: "normal",
            risiko: 15,
            tanggalPemeriksaan: "2024-01-20",
          },
          {
            id: "2",
            namaAnak: "Rina",
            namaIbu: "Dewi",
            tanggalLahir: "2020-10-10",
            jenisKelamin: "perempuan",
            beratBadan: 8.0,
            tinggiBadan: 78.0,
            usia: 51,
            provinsi: "Jawa Tengah",
            kabupaten: "Semarang",
            kecamatan: "Tembalang",
            desa: "Sendangmulyo",
            status: "berisiko",
            risiko: 45,
            tanggalPemeriksaan: "2024-01-18",
          },
          {
            id: "3",
            namaAnak: "Budi",
            namaIbu: "Ani",
            tanggalLahir: "2022-03-15",
            jenisKelamin: "laki-laki",
            beratBadan: 7.2,
            tinggiBadan: 70.0,
            usia: 22,
            provinsi: "Jawa Timur",
            kabupaten: "Malang",
            kecamatan: "Klojen",
            desa: "Kauman",
            status: "stunting",
            risiko: 75,
            tanggalPemeriksaan: "2024-01-15",
          },
          {
            id: "4",
            namaAnak: "Sari",
            namaIbu: "Umi",
            tanggalLahir: "2021-08-20",
            jenisKelamin: "perempuan",
            beratBadan: 9.8,
            tinggiBadan: 82.0,
            usia: 29,
            provinsi: "Jawa Barat",
            kabupaten: "Bandung",
            kecamatan: "Coblong",
            desa: "Dago",
            status: "normal",
            risiko: 20,
            tanggalPemeriksaan: "2024-01-12",
          },
        ];
        this.data = mockData;
        resolve(mockData);
      }, 1000);
    });
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
    return {
      total: filteredData.length,
      normal: filteredData.filter((d) => d.status === "normal").length,
      berisiko: filteredData.filter((d) => d.status === "berisiko").length,
      stunting: filteredData.filter((d) => d.status === "stunting").length,
    };
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
      item.status === "normal"
        ? "Normal"
        : item.status === "berisiko"
        ? "Berisiko"
        : "Stunting",
      item.risiko,
      item.tanggalPemeriksaan,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  }
}
