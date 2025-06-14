import { fetchStuntingByProvince } from "@/presenter/lib/api";

export interface StuntingByProvince {
  name: string;
  value: number;
}

export interface PopularEducation {
  id: string;
  title: string;
  slug: string;
  views: number;
}

export interface HomeData {
  stuntingByProvince: StuntingByProvince[];
  popularEducation: PopularEducation[];
}

export class HomeModel {
  async fetchHomeData(): Promise<HomeData> {
    try {
      console.log("=== HOME MODEL FETCH DATA (SERVER-SIDE) ===");

      // Ambil data provinsi
      const stuntingByProvince = await fetchStuntingByProvince();
      console.log("Stunting data:", stuntingByProvince?.length || 0, "items");

      // Ambil data edukasi populer dari backend
      let popularEducation: PopularEducation[] = [];

      try {
        // Cek apakah backend server berjalan
        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3001";
        console.log("Checking backend availability at:", backendUrl);

        // Tambahkan timeout untuk fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 detik timeout

        const response = await fetch(
          `${backendUrl}/api/dashboard/edukasi-populer`,
          {
            cache: "no-store",
            next: { revalidate: 0 },
            headers: {
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          console.log("Backend response:", result);

          if (result.isError === false && Array.isArray(result.data)) {
            popularEducation = result.data.map((item: any) => ({
              id: item.id?.toString() || "",
              title: item.title || "",
              slug:
                item.title
                  ?.toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "") || "",
              views: Number(item.view_count) || 0,
            }));
            console.log(
              "✅ Popular education data from backend:",
              popularEducation.length,
              "items"
            );
          } else {
            console.log(
              "⚠️ Backend returned error or invalid data format:",
              result
            );
            throw new Error("Invalid data format from backend");
          }
        } else {
          console.log(`⚠️ Backend API returned status: ${response.status}`);
          throw new Error(`Backend returned ${response.status}`);
        }
      } catch (eduError) {
        console.error("❌ Backend server tidak tersedia atau error:", eduError);
        console.log("🔄 Menggunakan data fallback untuk edukasi populer");

        // Fallback ke data dummy jika backend tidak tersedia
        popularEducation = [
          {
            id: "1",
            title:
              "Mengenal Stunting: Penyebab, Dampak, dan Cara Pencegahannya",
            slug: "mengenal-stunting",
            views: 892,
          },
          {
            id: "2",
            title: "Resep MPASI Bergizi untuk Bayi 6-12 Bulan",
            slug: "resep-mpasi",
            views: 789,
          },
          {
            id: "3",
            title: "Strategi Perbaikan Gizi untuk Anak dengan Stunting",
            slug: "strategi-perbaikan-gizi",
            views: 725,
          },
          {
            id: "4",
            title: "Resep Makanan Tinggi Protein untuk Anak Stunting",
            slug: "resep-makanan-tinggi-protein",
            views: 656,
          },
          {
            id: "5",
            title: "Tips Praktis Membiasakan Anak Makan Sayur dan Buah",
            slug: "tips-makan-sayur-buah",
            views: 612,
          },
        ];
      }

      return {
        stuntingByProvince: stuntingByProvince || [],
        popularEducation: popularEducation || [],
      };
    } catch (error) {
      console.error("Error fetching home data:", error);

      // Jika error pada edukasi populer, tetap kembalikan data stunting
      const stuntingByProvince = await fetchStuntingByProvince().catch(() => [
        { name: "NTT", value: 37.8 },
        { name: "Sulawesi Barat", value: 34.5 },
        { name: "Papua", value: 32.8 },
        { name: "NTB", value: 31.4 },
        { name: "Kalimantan Barat", value: 30.5 },
      ]);

      // Fallback data untuk edukasi populer
      const popularEducation = [
        {
          id: "1",
          title: "Mengenal Stunting: Penyebab, Dampak, dan Cara Pencegahannya",
          slug: "mengenal-stunting",
          views: 892,
        },
        {
          id: "2",
          title: "Resep MPASI Bergizi untuk Bayi 6-12 Bulan",
          slug: "resep-mpasi",
          views: 789,
        },
        {
          id: "3",
          title: "Strategi Perbaikan Gizi untuk Anak dengan Stunting",
          slug: "strategi-perbaikan-gizi",
          views: 725,
        },
      ];

      return {
        stuntingByProvince,
        popularEducation,
      };
    }
  }
}
