import { NextResponse } from "next/server";

// Simulasi data stunting berdasarkan provinsi
// Dalam implementasi nyata, ini akan mengambil data dari database
export async function GET() {
  const data = [
    { province: "NTT", prevalence: 37.8 },
    { province: "Sulawesi Barat", prevalence: 34.5 },
    { province: "Papua", prevalence: 32.8 },
    { province: "NTB", prevalence: 31.4 },
    { province: "Kalimantan Barat", prevalence: 30.5 },
    { province: "Sulawesi Tengah", prevalence: 29.8 },
    { province: "Aceh", prevalence: 29.2 },
    { province: "Kalimantan Tengah", prevalence: 28.5 },
    { province: "Sulawesi Selatan", prevalence: 28.0 },
    { province: "Maluku", prevalence: 27.7 },
  ];

  return NextResponse.json(data);
}
