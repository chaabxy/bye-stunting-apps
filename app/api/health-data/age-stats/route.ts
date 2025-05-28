import { NextResponse } from "next/server";

// Simulasi data stunting berdasarkan umur
// Dalam implementasi nyata, ini akan mengambil data dari database
export async function GET() {
  const data = [
    { ageGroup: "0-6 bulan", prevalence: 99.5 },
    { ageGroup: "6-12 bulan", prevalence: 17.8 },
    { ageGroup: "12-24 bulan", prevalence: 30.2 },
    { ageGroup: "24-36 bulan", prevalence: 25.6 },
    { ageGroup: "36-48 bulan", prevalence: 22.3 },
    { ageGroup: "48-59 bulan", prevalence: 19.7 },
  ];

  return NextResponse.json(data);
}
