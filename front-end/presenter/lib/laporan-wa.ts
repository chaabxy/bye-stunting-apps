// Define PredictionResult interface yang sesuai dengan model
export interface PredictionResult {
  nama: string;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  status: string;
  score: number;
  message: string;
  whoChartData?: any;
  recommendations?: string[];
  suggestions?: string[];
  recommendedArticles?: Array<{
    id: string;
    title: string;
    slug: string;
    category?: string;
  }>;
  slug?: string;
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
  try {
    console.log("🔍 ShareViaWhatsApp called with:", {
      childData: childData.nama,
      status: result.status,
      score: result.score,
    });

    const statusText =
      result.status === "normal"
        ? "Normal"
        : result.status === "stunting berat"
        ? "Stunting Berat"
        : result.status === "stunting"
        ? "Stunting"
        : "Berisiko Stunting";

    console.log("🔍 Status text:", statusText);

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

    // Pastikan recommendations ada dan berupa array
    const recommendations = Array.isArray(result.recommendations)
      ? result.recommendations
      : Array.isArray(result.suggestions)
      ? result.suggestions
      : [
          "Konsultasi dengan tenaga medis",
          "Perbaiki pola makan",
          "Rutin kontrol kesehatan",
        ];

    // Pastikan recommendedArticles ada dan berupa array
    const articles = Array.isArray(result.recommendedArticles)
      ? result.recommendedArticles
      : [];

    console.log("🔍 Recommendations:", recommendations);
    console.log("🔍 Articles:", articles);

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
${recommendations
  .slice(0, 5)
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

Untuk informasi lebih lengkap dan mendalam, silakan cek artikel-artikel edukatif kami di fitur edukasi pada Link https://byestunting-app.vercel.app/edukasi${
      articles.length > 0
        ? `, seperti:
${articles
  .slice(0, 3)
  .map((article) => `• ${article.title}`)
  .join("\n")}`
        : ""
    }
  
---
*Cek Informasi Lengkap di Website ByeStunting*
Jika Anda menemukan gejala atau membutuhkan penanganan lebih lanjut, jangan ragu untuk berkonsultasi langsung dengan tenaga medis profesional.
#ByeStunting #CegahStunting #AnakSehat #TumbuhOptimal
    `;

    console.log("🔍 Message prepared, length:", message.length);

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    console.log(
      "🔍 Opening WhatsApp URL:",
      whatsappUrl.substring(0, 100) + "..."
    );

    // Coba buka WhatsApp
    const opened = window.open(whatsappUrl, "_blank");

    if (!opened) {
      console.error("❌ Failed to open WhatsApp window");
      alert("Gagal membuka WhatsApp. Pastikan popup blocker tidak aktif.");
    } else {
      console.log("✅ WhatsApp window opened successfully");
    }
  } catch (error) {
    console.error("❌ Error in shareViaWhatsApp:", error);
    alert("Terjadi kesalahan saat membuka WhatsApp. Silakan coba lagi.");
  }
}
