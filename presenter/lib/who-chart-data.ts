// Data kurva pertumbuhan WHO untuk berat badan berdasarkan usia
// Sumber: WHO Child Growth Standards

export interface WHOChartData {
  months: number; // Usia dalam bulan
  male: {
    p3: number; // Persentil 3
    p15: number; // Persentil 15
    p50: number; // Persentil 50 (median)
    p85: number; // Persentil 85
    p97: number; // Persentil 97
  };
  female: {
    p3: number; // Persentil 3
    p15: number; // Persentil 15
    p50: number; // Persentil 50 (median)
    p85: number; // Persentil 85
    p97: number; // Persentil 97
  };
}

// Data kurva pertumbuhan WHO untuk berat badan berdasarkan usia (0-60 bulan)
export const weightForAgeData: WHOChartData[] = [
  // 0-12 bulan
  {
    months: 0,
    male: { p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.7, p97: 4.0 },
    female: { p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.6, p97: 3.9 },
  },
  {
    months: 1,
    male: { p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.5 },
    female: { p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.1 },
  },
  {
    months: 2,
    male: { p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 6.8 },
    female: { p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.2 },
  },
  {
    months: 3,
    male: { p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 7.7 },
    female: { p3: 4.5, p15: 5.2, p50: 5.8, p85: 6.6, p97: 7.1 },
  },
  {
    months: 4,
    male: { p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.8, p97: 8.4 },
    female: { p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.3, p97: 7.8 },
  },
  {
    months: 5,
    male: { p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.0 },
    female: { p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.4 },
  },
  {
    months: 6,
    male: { p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.5 },
    female: { p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 8.8 },
  },
  {
    months: 7,
    male: { p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 9.9 },
    female: { p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.2 },
  },
  {
    months: 8,
    male: { p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.3 },
    female: { p3: 6.3, p15: 7.0, p50: 7.9, p85: 8.9, p97: 9.6 },
  },
  {
    months: 9,
    male: { p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 10.6 },
    female: { p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.2, p97: 9.9 },
  },
  {
    months: 10,
    male: { p3: 7.4, p15: 8.1, p50: 9.2, p85: 10.2, p97: 10.9 },
    female: { p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.5, p97: 10.2 },
  },
  {
    months: 11,
    male: { p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.2 },
    female: { p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.8, p97: 10.5 },
  },
  {
    months: 12,
    male: { p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.5 },
    female: { p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.0, p97: 10.8 },
  },

  // 13-24 bulan
  {
    months: 15,
    male: { p3: 8.3, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.3 },
    female: { p3: 7.6, p15: 8.5, p50: 9.6, p85: 10.8, p97: 11.6 },
  },
  {
    months: 18,
    male: { p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.0 },
    female: { p3: 8.1, p15: 9.1, p50: 10.2, p85: 11.5, p97: 12.4 },
  },
  {
    months: 21,
    male: { p3: 9.2, p15: 10.2, p50: 11.5, p85: 12.8, p97: 13.7 },
    female: { p3: 8.6, p15: 9.6, p50: 10.8, p85: 12.2, p97: 13.1 },
  },
  {
    months: 24,
    male: { p3: 9.7, p15: 10.7, p50: 12.0, p85: 13.4, p97: 14.3 },
    female: { p3: 9.0, p15: 10.0, p50: 11.3, p85: 12.8, p97: 13.7 },
  },

  // 25-36 bulan
  {
    months: 27,
    male: { p3: 10.1, p15: 11.1, p50: 12.5, p85: 13.9, p97: 14.9 },
    female: { p3: 9.4, p15: 10.5, p50: 11.8, p85: 13.3, p97: 14.3 },
  },
  {
    months: 30,
    male: { p3: 10.5, p15: 11.6, p50: 13.0, p85: 14.5, p97: 15.5 },
    female: { p3: 9.8, p15: 10.9, p50: 12.3, p85: 13.9, p97: 14.9 },
  },
  {
    months: 33,
    male: { p3: 10.9, p15: 12.0, p50: 13.5, p85: 15.0, p97: 16.1 },
    female: { p3: 10.2, p15: 11.3, p50: 12.8, p85: 14.4, p97: 15.5 },
  },
  {
    months: 36,
    male: { p3: 11.3, p15: 12.4, p50: 13.9, p85: 15.5, p97: 16.6 },
    female: { p3: 10.5, p15: 11.7, p50: 13.2, p85: 14.9, p97: 16.0 },
  },

  // 37-48 bulan
  {
    months: 39,
    male: { p3: 11.6, p15: 12.8, p50: 14.3, p85: 16.0, p97: 17.1 },
    female: { p3: 10.9, p15: 12.1, p50: 13.7, p85: 15.4, p97: 16.6 },
  },
  {
    months: 42,
    male: { p3: 12.0, p15: 13.1, p50: 14.7, p85: 16.4, p97: 17.6 },
    female: { p3: 11.2, p15: 12.5, p50: 14.1, p85: 15.9, p97: 17.1 },
  },
  {
    months: 45,
    male: { p3: 12.3, p15: 13.5, p50: 15.1, p85: 16.9, p97: 18.1 },
    female: { p3: 11.5, p15: 12.8, p50: 14.5, p85: 16.4, p97: 17.6 },
  },
  {
    months: 48,
    male: { p3: 12.6, p15: 13.8, p50: 15.5, p85: 17.3, p97: 18.6 },
    female: { p3: 11.8, p15: 13.2, p50: 14.9, p85: 16.8, p97: 18.1 },
  },

  // 49-60 bulan
  {
    months: 51,
    male: { p3: 12.9, p15: 14.1, p50: 15.9, p85: 17.8, p97: 19.1 },
    female: { p3: 12.1, p15: 13.5, p50: 15.3, p85: 17.3, p97: 18.6 },
  },
  {
    months: 54,
    male: { p3: 13.2, p15: 14.5, p50: 16.3, p85: 18.2, p97: 19.6 },
    female: { p3: 12.4, p15: 13.8, p50: 15.7, p85: 17.7, p97: 19.1 },
  },
  {
    months: 57,
    male: { p3: 13.5, p15: 14.8, p50: 16.6, p85: 18.6, p97: 20.1 },
    female: { p3: 12.7, p15: 14.2, p50: 16.1, p85: 18.2, p97: 19.6 },
  },
  {
    months: 60,
    male: { p3: 13.7, p15: 15.1, p50: 17.0, p85: 19.0, p97: 20.5 },
    female: { p3: 12.9, p15: 14.5, p50: 16.4, p85: 18.6, p97: 20.1 },
  },
];

// Data kurva pertumbuhan WHO untuk tinggi badan berdasarkan usia (0-60 bulan)
export const heightForAgeData: WHOChartData[] = [
  // 0-12 bulan
  {
    months: 0,
    male: { p3: 46.3, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.4 },
    female: { p3: 45.6, p15: 47.2, p50: 49.1, p85: 51.0, p97: 52.7 },
  },
  {
    months: 1,
    male: { p3: 51.1, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.4 },
    female: { p3: 50.0, p15: 51.7, p50: 53.7, p85: 55.6, p97: 57.4 },
  },
  {
    months: 2,
    male: { p3: 54.7, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.2 },
    female: { p3: 53.2, p15: 55.0, p50: 57.1, p85: 59.1, p97: 61.0 },
  },
  {
    months: 3,
    male: { p3: 57.6, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.3 },
    female: { p3: 55.8, p15: 57.7, p50: 59.8, p85: 61.9, p97: 63.8 },
  },
  {
    months: 4,
    male: { p3: 60.0, p15: 61.8, p50: 63.9, p85: 66.0, p97: 67.8 },
    female: { p3: 58.0, p15: 59.9, p50: 62.1, p85: 64.3, p97: 66.2 },
  },
  {
    months: 5,
    male: { p3: 62.0, p15: 63.8, p50: 65.9, p85: 68.0, p97: 69.9 },
    female: { p3: 59.9, p15: 61.8, p50: 64.0, p85: 66.2, p97: 68.2 },
  },
  {
    months: 6,
    male: { p3: 63.8, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.6 },
    female: { p3: 61.5, p15: 63.5, p50: 65.7, p85: 68.0, p97: 70.0 },
  },
  {
    months: 7,
    male: { p3: 65.4, p15: 67.2, p50: 69.2, p85: 71.3, p97: 73.2 },
    female: { p3: 63.0, p15: 65.0, p50: 67.3, p85: 69.6, p97: 71.6 },
  },
  {
    months: 8,
    male: { p3: 66.9, p15: 68.6, p50: 70.6, p85: 72.8, p97: 74.7 },
    female: { p3: 64.3, p15: 66.4, p50: 68.7, p85: 71.1, p97: 73.2 },
  },
  {
    months: 9,
    male: { p3: 68.3, p15: 70.0, p50: 72.0, p85: 74.2, p97: 76.0 },
    female: { p3: 65.6, p15: 67.7, p50: 70.1, p85: 72.6, p97: 74.7 },
  },
  {
    months: 10,
    male: { p3: 69.6, p15: 71.3, p50: 73.3, p85: 75.6, p97: 77.4 },
    female: { p3: 66.8, p15: 69.0, p50: 71.5, p85: 73.9, p97: 76.1 },
  },
  {
    months: 11,
    male: { p3: 70.8, p15: 72.5, p50: 74.5, p85: 76.9, p97: 78.7 },
    female: { p3: 68.0, p15: 70.2, p50: 72.8, p85: 75.3, p97: 77.5 },
  },
  {
    months: 12,
    male: { p3: 72.0, p15: 73.7, p50: 75.7, p85: 78.1, p97: 80.0 },
    female: { p3: 69.2, p15: 71.3, p50: 74.0, p85: 76.6, p97: 78.9 },
  },

  // 13-24 bulan
  {
    months: 15,
    male: { p3: 75.0, p15: 76.9, p50: 79.1, p85: 81.5, p97: 83.5 },
    female: { p3: 72.3, p15: 74.6, p50: 77.5, p85: 80.2, p97: 82.5 },
  },
  {
    months: 18,
    male: { p3: 77.6, p15: 79.6, p50: 82.0, p85: 84.5, p97: 86.6 },
    female: { p3: 75.0, p15: 77.4, p50: 80.3, p85: 83.2, p97: 85.6 },
  },
  {
    months: 21,
    male: { p3: 80.0, p15: 82.0, p50: 84.5, p85: 87.1, p97: 89.3 },
    female: { p3: 77.4, p15: 79.9, p50: 82.9, p85: 85.9, p97: 88.4 },
  },
  {
    months: 24,
    male: { p3: 82.1, p15: 84.2, p50: 86.8, p85: 89.5, p97: 91.7 },
    female: { p3: 79.6, p15: 82.2, p50: 85.3, p85: 88.4, p97: 91.0 },
  },

  // 25-36 bulan
  {
    months: 27,
    male: { p3: 84.1, p15: 86.2, p50: 88.9, p85: 91.7, p97: 94.0 },
    female: { p3: 81.7, p15: 84.3, p50: 87.5, p85: 90.7, p97: 93.4 },
  },
  {
    months: 30,
    male: { p3: 85.9, p15: 88.1, p50: 90.9, p85: 93.8, p97: 96.1 },
    female: { p3: 83.6, p15: 86.3, p50: 89.6, p85: 92.9, p97: 95.7 },
  },
  {
    months: 33,
    male: { p3: 87.6, p15: 89.9, p50: 92.7, p85: 95.7, p97: 98.1 },
    female: { p3: 85.4, p15: 88.2, p50: 91.6, p85: 95.0, p97: 97.9 },
  },
  {
    months: 36,
    male: { p3: 89.2, p15: 91.5, p50: 94.4, p85: 97.5, p97: 99.9 },
    female: { p3: 87.1, p15: 90.0, p50: 93.5, p85: 97.0, p97: 99.9 },
  },

  // 37-48 bulan
  {
    months: 39,
    male: { p3: 90.7, p15: 93.1, p50: 96.1, p85: 99.2, p97: 101.7 },
    female: { p3: 88.7, p15: 91.7, p50: 95.3, p85: 98.9, p97: 101.9 },
  },
  {
    months: 42,
    male: { p3: 92.1, p15: 94.6, p50: 97.7, p85: 100.9, p97: 103.4 },
    female: { p3: 90.3, p15: 93.3, p50: 97.0, p85: 100.7, p97: 103.8 },
  },
  {
    months: 45,
    male: { p3: 93.5, p15: 96.0, p50: 99.2, p85: 102.5, p97: 105.1 },
    female: { p3: 91.8, p15: 94.9, p50: 98.7, p85: 102.5, p97: 105.6 },
  },
  {
    months: 48,
    male: { p3: 94.9, p15: 97.4, p50: 100.7, p85: 104.0, p97: 106.7 },
    female: { p3: 93.3, p15: 96.4, p50: 100.3, p85: 104.2, p97: 107.4 },
  },

  // 49-60 bulan
  {
    months: 51,
    male: { p3: 96.2, p15: 98.8, p50: 102.1, p85: 105.5, p97: 108.3 },
    female: { p3: 94.7, p15: 97.9, p50: 101.9, p85: 105.9, p97: 109.1 },
  },
  {
    months: 54,
    male: { p3: 97.5, p15: 100.1, p50: 103.5, p85: 107.0, p97: 109.8 },
    female: { p3: 96.1, p15: 99.3, p50: 103.4, p85: 107.5, p97: 110.8 },
  },
  {
    months: 57,
    male: { p3: 98.7, p15: 101.4, p50: 104.9, p85: 108.5, p97: 111.3 },
    female: { p3: 97.4, p15: 100.7, p50: 104.9, p85: 109.1, p97: 112.4 },
  },
  {
    months: 60,
    male: { p3: 99.9, p15: 102.7, p50: 106.2, p85: 109.9, p97: 112.8 },
    female: { p3: 98.7, p15: 102.0, p50: 106.3, p85: 110.6, p97: 114.0 },
  },
];

// Fungsi untuk mendapatkan data kurva pertumbuhan berdasarkan usia
export function getWeightForAgeData(
  ageInMonths: number,
  gender: "laki-laki" | "perempuan"
): any {
  // Cari data yang paling dekat dengan usia yang diberikan
  const closestData = weightForAgeData.reduce((prev, curr) => {
    return Math.abs(curr.months - ageInMonths) <
      Math.abs(prev.months - ageInMonths)
      ? curr
      : prev;
  });

  return gender === "laki-laki" ? closestData.male : closestData.female;
}

export function getHeightForAgeData(
  ageInMonths: number,
  gender: "laki-laki" | "perempuan"
): any {
  // Cari data yang paling dekat dengan usia yang diberikan
  const closestData = heightForAgeData.reduce((prev, curr) => {
    return Math.abs(curr.months - ageInMonths) <
      Math.abs(prev.months - ageInMonths)
      ? curr
      : prev;
  });

  return gender === "laki-laki" ? closestData.male : closestData.female;
}

// Fungsi untuk menentukan status pertumbuhan berdasarkan persentil
export function getWeightStatus(
  weight: number,
  ageInMonths: number,
  gender: "laki-laki" | "perempuan"
): {
  status: "sangat-kurang" | "kurang" | "normal" | "lebih" | "obesitas";
  percentile: number;
} {
  const data = getWeightForAgeData(ageInMonths, gender);

  // Hitung persentil (estimasi kasar)
  let percentile = 0;

  if (weight < data.p3) {
    percentile = (weight / data.p3) * 3;
    return { status: "sangat-kurang", percentile };
  } else if (weight < data.p15) {
    percentile = 3 + ((weight - data.p3) / (data.p15 - data.p3)) * 12;
    return { status: "kurang", percentile };
  } else if (weight < data.p85) {
    percentile = 15 + ((weight - data.p15) / (data.p85 - data.p15)) * 70;
    return { status: "normal", percentile };
  } else if (weight < data.p97) {
    percentile = 85 + ((weight - data.p85) / (data.p97 - data.p85)) * 12;
    return { status: "lebih", percentile };
  } else {
    percentile = 97 + ((weight - data.p97) / data.p97) * 3;
    percentile = Math.min(percentile, 100);
    return { status: "obesitas", percentile };
  }
}

export function getHeightStatus(
  height: number,
  ageInMonths: number,
  gender: "laki-laki" | "perempuan"
): {
  status: "sangat-pendek" | "pendek" | "normal" | "tinggi";
  percentile: number;
} {
  const data = getHeightForAgeData(ageInMonths, gender);

  // Hitung persentil (estimasi kasar)
  let percentile = 0;

  if (height < data.p3) {
    percentile = (height / data.p3) * 3;
    return { status: "sangat-pendek", percentile };
  } else if (height < data.p15) {
    percentile = 3 + ((height - data.p3) / (data.p15 - data.p3)) * 12;
    return { status: "pendek", percentile };
  } else if (height < data.p85) {
    percentile = 15 + ((height - data.p15) / (data.p85 - data.p15)) * 70;
    return { status: "normal", percentile };
  } else {
    percentile = 85 + ((height - data.p85) / (data.p97 - data.p85)) * 15;
    percentile = Math.min(percentile, 100);
    return { status: "tinggi", percentile };
  }
}
