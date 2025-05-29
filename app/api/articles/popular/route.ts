import { NextResponse } from "next/server";

// Simulasi data artikel edukasi populer
// Dalam implementasi nyata, ini akan mengambil data dari database
export async function GET() {
  const data = [
    {
      id: "1",
      title: "Mengenal Stunting dan Dampaknya pada Anak dan pencegahan dan stunting dan tumbuh dan agar dan sayang dan cinta",
      views: 1250,
    },
    { id: "2", title: "Menu MPASI Bergizi untuk Anak 6-12 Bulan", views: 980 },
    {
      id: "3",
      title: "Cara Memantau Pertumbuhan Anak dengan Benar",
      views: 875,
    },
    {
      id: "4",
      title: "Nutrisi Penting untuk Ibu Hamil dan Menyusui",
      views: 820,
    },
    {
      id: "5",
      title: "Tanda-tanda Stunting yang Perlu Diwaspadai",
      views: 790,
    },
    {
      id: "6",
      title: "Pola Makan Sehat untuk Anak Usia 1-5 Tahun",
      views: 750,
    },
    { id: "7", title: "Pentingnya Imunisasi Lengkap untuk Anak", views: 720 },
    { id: "8", title: "Cara Mengatasi Anak Susah Makan", views: 680 },
  ];

  // Urutkan berdasarkan jumlah views
  data.sort((a, b) => b.views - a.views);

  return NextResponse.json(data);
}
