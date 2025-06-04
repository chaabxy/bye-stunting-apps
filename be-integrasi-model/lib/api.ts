// Fungsi untuk mengambil data stunting berdasarkan umur
export async function fetchStuntingByAge() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/health-data/age-stats`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stunting data by age");
    }

    const data = await response.json();
    return data.map((item: any) => ({
      name: item.ageGroup,
      value: Number.parseFloat(item.prevalence.toFixed(1)),
    }));
  } catch (error) {
    console.error("Error fetching stunting data by age:", error);
    // Fallback data jika API gagal
    return [
      { name: "0-6 bulan", value: 100 },
      { name: "6-12 bulan", value: 17.8 },
      { name: "12-24 bulan", value: 30.2 },
      { name: "24-36 bulan", value: 25.6 },
      { name: "36-48 bulan", value: 22.3 },
      { name: "48-59 bulan", value: 19.7 },
    ];
  }
}

// Fungsi untuk mengambil data stunting berdasarkan provinsi (5 teratas)
export async function fetchStuntingByProvince() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/health-data/province-stats`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stunting data by province");
    }

    const data = await response.json();
    // Urutkan data berdasarkan prevalensi tertinggi dan ambil 5 teratas
    return data
      .sort((a: any, b: any) => b.prevalence - a.prevalence)
      .slice(0, 5)
      .map((item: any) => ({
        name: item.province,
        value: Number.parseFloat(item.prevalence.toFixed(1)),
      }));
  } catch (error) {
    console.error("Error fetching stunting data by province:", error);
    // Fallback data jika API gagal
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
