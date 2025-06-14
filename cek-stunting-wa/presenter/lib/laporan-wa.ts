// Define PredictionResult interface locally
export interface PredictionResult {
  status: "normal" | "stunting" | "stunting berat";
  score: number;
  message: string;
  recommendations: string[];
  recommendedArticles: Array<{
    id: number;
    title: string;
    slug: string;
  }>;
}

export interface ChildData {
  nama: string;
  namaIbu: string;
  tanggalLahir: Date;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  alamat: {
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    desa: string;
  };
}

export interface WHOChartData {
  weightChartData: any[];
  heightChartData: any[];
  weightPercentile: number;
  heightPercentile: number;
}


// Fungsi untuk membagikan hasil via WhatsApp
export function shareViaWhatsApp(
  childData: ChildData,
  result: PredictionResult,
  whoChartData?: WHOChartData
): void {
  const statusText =
    result.status === "normal"
      ? "Normal"
      : result.status === "berisiko"
      ? "Berisiko Stunting"
      : "Stunting";

  const whoInfo = whoChartData
    ? `

ANALISIS WHO:
• Persentil Berat: ${whoChartData.weightPercentile.toFixed(1)}%
• Persentil Tinggi: ${whoChartData.heightPercentile.toFixed(1)}%
• Status BB: ${
        whoChartData.weightPercentile < 3
          ? "Sangat Kurang"
          : whoChartData.weightPercentile < 15
          ? "Kurang"
          : whoChartData.weightPercentile > 85
          ? "Lebih"
          : "Normal"
      }
• Status TB: ${
        whoChartData.heightPercentile < 3
          ? "Sangat Pendek"
          : whoChartData.heightPercentile < 15
          ? "Pendek"
          : "Normal"
      }`
    : "";

  const message = `
*HASIL PEMERIKSAAN STUNTING*

Data Anak:
• Nama: ${childData.nama}
• Ibu: ${childData.namaIbu}
• Usia: ${childData.usia} bulan
• Berat: ${childData.beratBadan} kg
• Tinggi: ${childData.tinggiBadan} cm
• Alamat: ${childData.alamat.desa}, ${childData.alamat.kecamatan}, ${
    childData.alamat.kabupaten
  }

Status: ${statusText}
Tingkat Risiko: ${result.score}%

${result.message}${whoInfo}

Rekomendasi Utama:
${result.recommendations
  .slice(0, 5)
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

Untuk informasi lebih lengkap dan mendalam, silakan cek artikel-artikel edukatif kami di fitur edukasi pada Link https://bye-stunting-apps.vercel.app/edukasi, seperti:
${result.recommendedArticles
  .slice(0, 5)
  .map((article) => `• ${article.title}`)
  .join("\n")}
  
---
*Cek Informasi Lengkap di Website ByeStunting*
Jika Anda menemukan gejala atau membutuhkan penanganan lebih lanjut, jangan ragu untuk berkonsultasi langsung dengan tenaga medis profesional.
#ByeStunting #CegahStunting #AnakSehat #TumbuhOptimal
  `;

  const encodedMessage = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}
