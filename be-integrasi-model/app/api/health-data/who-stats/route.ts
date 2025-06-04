import { NextResponse } from "next/server";

// Mock data untuk statistik WHO
const mockWHOStats = {
  overall: {
    normal: 65.2,
    atRisk: 18.5,
    stunting: 12.8,
    severeStunting: 3.5,
    totalChildren: 15420,
  },
  byAgeGroup: [
    {
      ageGroup: "0-6 bulan",
      normal: 78.5,
      atRisk: 15.2,
      stunting: 5.1,
      severeStunting: 1.2,
      total: 1250,
    },
    {
      ageGroup: "6-12 bulan",
      normal: 72.3,
      atRisk: 18.7,
      stunting: 7.2,
      severeStunting: 1.8,
      total: 2100,
    },
    {
      ageGroup: "12-24 bulan",
      normal: 68.1,
      atRisk: 19.8,
      stunting: 9.5,
      severeStunting: 2.6,
      total: 3200,
    },
    {
      ageGroup: "24-36 bulan",
      normal: 62.4,
      atRisk: 20.1,
      stunting: 13.2,
      severeStunting: 4.3,
      total: 2800,
    },
    {
      ageGroup: "36-48 bulan",
      normal: 58.9,
      atRisk: 19.5,
      stunting: 16.8,
      severeStunting: 4.8,
      total: 3070,
    },
    {
      ageGroup: "48-59 bulan",
      normal: 55.2,
      atRisk: 18.9,
      stunting: 19.1,
      severeStunting: 6.8,
      total: 3000,
    },
  ],
  byGender: {
    male: {
      normal: 63.8,
      atRisk: 19.2,
      stunting: 13.1,
      severeStunting: 3.9,
      total: 7890,
    },
    female: {
      normal: 66.7,
      atRisk: 17.8,
      stunting: 12.4,
      severeStunting: 3.1,
      total: 7530,
    },
  },
  trends: [
    {
      month: "Jan",
      normal: 62.1,
      atRisk: 20.5,
      stunting: 14.2,
      severeStunting: 3.2,
    },
    {
      month: "Feb",
      normal: 63.4,
      atRisk: 19.8,
      stunting: 13.6,
      severeStunting: 3.2,
    },
    {
      month: "Mar",
      normal: 64.2,
      atRisk: 19.1,
      stunting: 13.4,
      severeStunting: 3.3,
    },
    {
      month: "Apr",
      normal: 64.8,
      atRisk: 18.9,
      stunting: 13.1,
      severeStunting: 3.2,
    },
    {
      month: "May",
      normal: 65.0,
      atRisk: 18.7,
      stunting: 12.9,
      severeStunting: 3.4,
    },
    {
      month: "Jun",
      normal: 65.2,
      atRisk: 18.5,
      stunting: 12.8,
      severeStunting: 3.5,
    },
  ],
};

export async function GET() {
  try {
    // Simulasi delay API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(mockWHOStats);
  } catch (error) {
    console.error("Error fetching WHO stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch WHO statistics" },
      { status: 500 }
    );
  }
}
