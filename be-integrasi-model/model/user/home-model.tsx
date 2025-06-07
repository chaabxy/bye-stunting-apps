import { fetchStuntingByProvince } from "@/presenter/lib/api";

export interface StuntingByProvince {
  province: string;
  percentage: number;
}

export interface PopularEducation {
  id: string;
  title: string;
}

export interface HomeData {
  stuntingByProvince: StuntingByProvince[];
}

export class HomeModel {
  async fetchHomeData(): Promise<HomeData> {
    try {
      // Hanya mengambil data provinsi
      const stuntingByProvince = await fetchStuntingByProvince();

      return {
        stuntingByProvince: stuntingByProvince || [],
      };
    } catch (error) {
      console.error("Error fetching home data:", error);
      // Kembalikan data default jika terjadi error
      return {
        stuntingByProvince: [
          { name: "NTT", value: 37.8 },
          { name: "Sulawesi Barat", value: 34.5 },
          { name: "Papua", value: 32.8 },
          { name: "NTB", value: 31.4 },
          { name: "Kalimantan Barat", value: 30.5 },
        ],
      };
    }
  }
}
