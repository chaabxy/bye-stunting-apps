import type { PredictionResult } from "@/app/(user)/cek-stunting/page";

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

// Fungsi untuk menghasilkan HTML yang akan dikonversi menjadi PDF
export function generatePdfContent(
  childData: ChildData,
  result: PredictionResult,
  chartData?: any[],
  weightPercentile?: number,
  heightPercentile?: number
): string {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const tanggalLahir = childData.tanggalLahir.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const statusColor =
    result.status === "normal"
      ? "#22c55e"
      : result.status === "berisiko"
      ? "#eab308"
      : "#ef4444";

  const statusText =
    result.status === "normal"
      ? "Normal"
      : result.status === "berisiko"
      ? "Berisiko Stunting"
      : "Stunting";

  const getWeightInterpretation = (percentile: number) => {
    if (percentile < 3) return "sangat kurang (gizi buruk akut)";
    if (percentile < 15) return "kurang (berat badan kurang)";
    if (percentile > 85 && percentile < 97)
      return "di atas normal (berisiko kelebihan berat badan)";
    if (percentile >= 97) return "sangat tinggi (obesitas)";
    return "normal (berat badan sehat)";
  };

  const getHeightInterpretation = (percentile: number) => {
    if (percentile < 3) return "sangat pendek (stunting berat)";
    if (percentile < 15) return "di bawah normal (risiko stunting)";
    return "normal (tinggi badan sesuai standar WHO)";
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Laporan Pemeriksaan Stunting</title>
<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f2f5;
    padding: 20px;
    color: #333;
  }

  .container {
    max-width: 850px;
    margin: auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo {
    font-size: 28px;
    font-weight: bold;
    color: #2c3e50;
  }

  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 5px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-top: 15px;
  }

  .date {
    margin-top: 8px;
    font-size: 14px;
    color: #888;
  }

  .section {
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #2c3e50;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table td {
    border: 1px solid #ddd;
    padding: 10px;
    vertical-align: top;
    font-size: 14px;
  }

  .data-table td:first-child {
    width: 40%;
    font-weight: bold;
    background-color: #f9f9f9;
  }

  .result .status {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .result .message {
    margin-bottom: 15px;
    font-size: 14px;
  }

  .score-container {
    margin-bottom: 20px;
  }

  .score-label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .progress-container {
    margin-top: 20px;
    background-color: #e0e0e0;
    border-radius: 5px;
    height: 25px;
    position: relative;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    border-radius: 5px;
    transition: width 0.4s ease-in-out;
  }

  .progress-text {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
    line-height: 25px;
    font-weight: bold;
    color: black;
  }

  .recommendations-title {
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  .recommendation-item {
    margin-bottom: 6px;
    font-size: 14px;
    padding-left: 10px;
    text-indent: -10px;
  }

  .recommendation-number {
    font-weight: bold;
    margin-right: 5px;
  }

  .percentile-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .percentile-card {
    flex: 1 1 45%;
    background-color: #f6f9fc;
    padding: 15px;
    border-left: 5px solid #3498db;
    border-radius: 8px;
  }

  .percentile-label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .percentile-value {
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
  }

  .percentile-desc {
    font-size: 13px;
    color: #555;
    margin-top: 4px;
  }

  .interpretation {
    margin-top: 15px;
    font-size: 13px;
    color: #666;
  }

  .disclaimer {
    background-color: #fff8f0;
    padding: 15px;
    border-left: 5px solid #f39c12;
    border-radius: 8px;
  }

  .disclaimer-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #c0392b;
  }

  .disclaimer-text {
    font-size: 14px;
    color: #555;
  }

  .footer {
    text-align: center;
    font-size: 13px;
    color: #777;
    border-top: 1px solid #ddd;
    padding-top: 15px;
    margin-top: 40px;
  }

  .footer-logo {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .percentile-info {
      flex-direction: column;
    }

    .percentile-card {
      flex: 1 1 100%;
    }
  }
</style>

  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">ByeStunting</div>
        <div class="subtitle">Sistem Deteksi Dini dan Pencegahan Stunting</div>
        <div class="title">Laporan Pemeriksaan Stunting</div>
        <div class="date">📅 Tanggal Pemeriksaan: ${today}</div>
      </div>

      <div class="section">
        <div class="section-title">👶 Data Anak</div>
        <table class="data-table">
          <tr><td>Nama Anak</td><td>${childData.nama}</td></tr>
          <tr><td>Nama Ibu Kandung</td><td>${childData.namaIbu}</td></tr>
          <tr><td>Tanggal Lahir</td><td>${tanggalLahir}</td></tr>
          <tr><td>Usia</td><td>${childData.usia} bulan</td></tr>
          <tr><td>Jenis Kelamin</td><td>${
            childData.jenisKelamin === "laki-laki" ? "Laki-laki" : "Perempuan"
          }</td></tr>
          <tr><td>Berat Badan</td><td>${childData.beratBadan} kg</td></tr>
          <tr><td>Tinggi Badan</td><td>${childData.tinggiBadan} cm</td></tr>
          <tr><td>Alamat</td><td>${childData.alamat.desa}, ${
    childData.alamat.kecamatan
  }<br>${childData.alamat.kabupaten}, ${childData.alamat.provinsi}</td></tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">📊 Hasil Analisis</div>
        <div class="result">
          <div class="status">Status: ${statusText}</div>
          <div class="message">${result.message}</div>

          <div class="score-container">
            <div class="score-label">Tingkat Risiko Stunting</div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${
                result.score
              }%; background: ${statusColor};"></div>
              <div class="progress-text">${result.score}%</div>
            </div>
          </div>

          <div class="recommendations">
            <div class="recommendations-title">💡 Rekomendasi Pencegahan & Penanganan:</div>
            ${result.recommendations
              .map(
                (rec, index) => `
              <div class="recommendation-item">
                <span class="recommendation-number">${index + 1}.</span> ${rec}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>

      ${
        weightPercentile !== undefined && heightPercentile !== undefined
          ? `
      <div class="section">
        <div class="section-title">📈 Analisis Kurva Pertumbuhan WHO</div>
        <div class="who-analysis">
          <div class="percentile-info">
            <div class="percentile-card">
              <div class="percentile-label">Persentil Berat Badan</div>
              <div class="percentile-value">${weightPercentile.toFixed(
                1
              )}%</div>
              <div class="percentile-desc">${getWeightInterpretation(
                weightPercentile
              )}</div>
            </div>
            <div class="percentile-card">
              <div class="percentile-label">Persentil Tinggi Badan</div>
              <div class="percentile-value">${heightPercentile.toFixed(
                1
              )}%</div>
              <div class="percentile-desc">${getHeightInterpretation(
                heightPercentile
              )}</div>
            </div>
          </div>
          <div class="interpretation">
            Interpretasi persentil dilakukan berdasarkan standar WHO untuk pertumbuhan anak sehat. Nilai persentil menunjukkan posisi anak dibandingkan dengan populasi anak sehat di usianya.
          </div>
        </div>
      </div>
      `
          : ""
      }

      <div class="section">
        <div class="section-title">📢 Disclaimer</div>
        <div class="disclaimer">
          <div class="disclaimer-title">⚠️ Penting!</div>
          <div class="disclaimer-text">
            Informasi yang diberikan dalam laporan ini bersifat prediktif dan tidak menggantikan diagnosis profesional dari tenaga medis. Mohon konsultasikan lebih lanjut dengan dokter atau petugas kesehatan setempat untuk pemeriksaan dan saran yang lebih akurat.
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-logo">ByeStunting</div>
        <div>© ${new Date().getFullYear()} Sistem Deteksi Dini dan Pencegahan Stunting</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Fungsi untuk menghasilkan PDF dari HTML menggunakan html2pdf
export async function generatePdf(
  childData: ChildData,
  result: PredictionResult,
  chartData?: any[],
  weightPercentile?: number,
  heightPercentile?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Import html2pdf secara dinamis
      import("html2pdf.js")
        .then((html2pdf) => {
          const htmlContent = generatePdfContent(
            childData,
            result,
            chartData,
            weightPercentile,
            heightPercentile
          );

          // Buat element temporary untuk konversi
          const element = document.createElement("div");
          element.innerHTML = htmlContent;
          element.style.width = "210mm";
          element.style.minHeight = "297mm";

          // Konfigurasi html2pdf
          const options = {
            margin: [10, 10, 10, 10],
            filename: `laporan-stunting-${childData.nama.replace(
              /\s+/g,
              "-"
            )}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              letterRendering: true,
              allowTaint: true,
            },
            jsPDF: {
              unit: "mm",
              format: "a4",
              orientation: "portrait",
              compress: true,
            },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          };

          // Generate PDF
          html2pdf
            .default()
            .set(options)
            .from(element)
            .outputPdf("blob")
            .then((pdfBlob: Blob) => {
              resolve(pdfBlob);
            })
            .catch((error: any) => {
              console.error("Error generating PDF:", error);
              reject(error);
            });
        })
        .catch((error) => {
          console.error("Error importing html2pdf:", error);
          reject(error);
        });
    } catch (error) {
      console.error("Error in generatePdf:", error);
      reject(error);
    }
  });
}

// Fungsi untuk mengunduh PDF
export function downloadPdf(blob: Blob, filename: string): void {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Gagal mengunduh PDF. Silakan coba lagi.");
  }
}

// Fungsi untuk membagikan hasil via WhatsApp
export function shareViaWhatsApp(
  childData: ChildData,
  result: PredictionResult
): void {
  const statusText =
    result.status === "normal"
      ? "Normal"
      : result.status === "berisiko"
      ? "Berisiko Stunting"
      : "Stunting";

  const message = `
HASIL PEMERIKSAAN STUNTING

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

${result.message}

Rekomendasi Utama:
${result.recommendations
  .slice(0, 3)
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

Artikel Edukasi:
${result.recommendedArticles
  .slice(0, 2)
  .map((article) => `• ${article.title}`)
  .join("\n")}

---
Cek lengkap di website ByeStunting
Download laporan PDF untuk detail lengkap
Konsultasi ke dokter untuk penanganan lanjutan

#ByeStunting #CegahStunting #AnakSehat
  `;

  const encodedMessage = encodeURIComponent(message.trim());
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}
