import { NextResponse } from "next/server";

// API endpoint to get detailed stunting data for a specific province
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get("provinceId");

  // In a real implementation, this would fetch data from a database
  // For now, we'll use mock data
  const mockData: Record<string, any> = {
    "32": {
      // Jawa Barat
      normal: 68,
      risk: 22,
      stunting: 10,
      totalChildren: 100,
    },
    "31": {
      // DKI Jakarta
      normal: 75,
      risk: 18,
      stunting: 7,
      totalChildren: 100,
    },
    "33": {
      // Jawa Tengah
      normal: 70,
      risk: 20,
      stunting: 10,
      totalChildren: 100,
    },
    "35": {
      // Jawa Timur
      normal: 65,
      risk: 23,
      stunting: 12,
      totalChildren: 100,
    },
    "51": {
      // Bali
      normal: 78,
      risk: 16,
      stunting: 6,
      totalChildren: 100,
    },
    "53": {
      // NTT
      normal: 52,
      risk: 28,
      stunting: 20,
      totalChildren: 100,
    },
    "73": {
      // Sulawesi Selatan
      normal: 62,
      risk: 25,
      stunting: 13,
      totalChildren: 100,
    },
    "76": {
      // Sulawesi Barat
      normal: 55,
      risk: 27,
      stunting: 18,
      totalChildren: 100,
    },
    "94": {
      // Papua
      normal: 58,
      risk: 24,
      stunting: 18,
      totalChildren: 100,
    },
  };

  // If no province is specified or province not found, return empty data
  if (!provinceId || !mockData[provinceId]) {
    return NextResponse.json({
      normal: 0,
      risk: 0,
      stunting: 0,
      totalChildren: 0,
    });
  }

  return NextResponse.json(mockData[provinceId]);
}
