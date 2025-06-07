// Fungsi untuk mengambil data stunting berdasarkan provinsi (6 teratas) dari JSON
export async function fetchStuntingByProvince() {
  try {
    // Import data JSON secara langsung
    const provinceData = await import(
      "@/model/backend/data-presentase-stunting/prevalensi_stunting_Provinsi_indonesia_2024.json"
    ).catch((err) => {
      console.error("Error importing province data:", err);
      return { default: [] };
    });

    if (
      !provinceData ||
      !provinceData.default ||
      !Array.isArray(provinceData.default)
    ) {
      console.error("Invalid province data format:", provinceData);
      return [];
    }

    // Urutkan data berdasarkan prevalensi tertinggi dan ambil 5 teratas
    const sortedData = provinceData.default
      .sort((a: any, b: any) => {
        const aValue =
          a["Prevalensi_Stunting(%)"] || a.percentage || a.prevalence;
        const bValue =
          b["Prevalensi_Stunting(%)"] || b.percentage || b.prevalence;
        return bValue - aValue;
      })
      .slice(0, 6);

    // Sesuaikan dengan format yang dibutuhkan DataChart (name, value)
    return sortedData.map((item: any) => ({
      name: item.Provinsi || item.province,
      value: Number.parseFloat(
        (
          item["Prevalensi_Stunting(%)"] ||
          item.percentage ||
          item.prevalence
        ).toFixed(1)
      ),
    }));
  } catch (error) {
    console.error("Error fetching stunting data by province:", error);
    // Fallback data jika JSON tidak bisa dibaca
    return [
      { name: "NTT", value: 37.8 },
      { name: "Sulawesi Barat", value: 34.5 },
      { name: "Papua", value: 32.8 },
      { name: "NTB", value: 31.4 },
      { name: "Kalimantan Barat", value: 30.5 },
    ];
  }
}

// Fungsi untuk mengambil artikel edukasi populer
export async function fetchPopularEducation() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/articles/popular`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular education articles");
    }

    const data = await response.json();
    return data.slice(0, 5).map((item: any) => ({
      id: item.id,
      title: item.title,
    }));
  } catch (error) {
    console.error("Error fetching popular education articles:", error);
    // Fallback data jika API gagal
    return [
      { id: "1", title: "Pentingnya ASI Eksklusif untuk Cegah Stunting" },
      { id: "2", title: "Menu MPASI Bergizi untuk Anak 6-12 Bulan" },
      { id: "3", title: "Cara Memantau Pertumbuhan Anak dengan Benar" },
      { id: "4", title: "Nutrisi Penting untuk Ibu Hamil dan Menyusui" },
      { id: "5", title: "Tanda-tanda Stunting yang Perlu Diwaspadai" },
    ];
  }
}

// Fungsi tambahan untuk mendapatkan semua data provinsi (untuk keperluan admin/dashboard)
export async function fetchAllProvinceData() {
  try {
    const provinceData = await import(
      "@/model/backend/data-presentase-stunting/prevalensi_stunting_Provinsi_indonesia_2024.json"
    );

    return provinceData.default.map((item: any) => ({
      province: item.Provinsi || item.province,
      year: item.Tahun || item.year || 2024,
      percentage: Number.parseFloat(
        (
          item["Prevalensi_Stunting(%)"] ||
          item.percentage ||
          item.prevalence
        ).toFixed(1)
      ),
    }));
  } catch (error) {
    console.error("Error fetching all province data:", error);
    return [];
  }
}

// Fungsi tambahan untuk mendapatkan detail data berdasarkan provinsi tertentu
export async function fetchProvinceDetail(provinceName: string) {
  try {
    const provinceData = await import(
      "@/model/backend/data-presentase-stunting/prevalensi_stunting_Provinsi_indonesia_2024.json"
    );

    const provinceDetail = provinceData.default.find(
      (item: any) =>
        (item.Provinsi || item.province).toLowerCase() ===
        provinceName.toLowerCase()
    );

    if (provinceDetail) {
      return {
        province: provinceDetail.Provinsi || provinceDetail.province,
        year: provinceDetail.Tahun || provinceDetail.year || 2024,
        percentage: Number.parseFloat(
          (
            provinceDetail["Prevalensi_Stunting(%)"] ||
            provinceDetail.percentage ||
            provinceDetail.prevalence
          ).toFixed(1)
        ),
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching province detail:", error);
    return null;
  }
}
