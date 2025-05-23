import type { PredictionResult } from "@/app/cek-stunting/page";

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
  result: PredictionResult
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Laporan Pemeriksaan Stunting</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 10px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #3b82f6;
        }
        .title {
          font-size: 20px;
          margin: 10px 0;
        }
        .date {
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #3b82f6;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .data-table td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        .data-table td:first-child {
          font-weight: bold;
          width: 40%;
        }
        .result {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 5px;
          border-left: 5px solid ${statusColor};
        }
        .status {
          font-size: 18px;
          font-weight: bold;
          color: ${statusColor};
          margin-bottom: 10px;
        }
        .message {
          margin-bottom: 15px;
        }
        .progress-container {
          height: 20px;
          background-color: #e5e7eb;
          border-radius: 10px;
          margin: 15px 0;
        }
        .progress-bar {
          height: 100%;
          border-radius: 10px;
          background-color: ${statusColor};
          width: ${result.score}%;
        }
        .recommendations {
          margin-top: 20px;
        }
        .recommendation-item {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        .recommendation-item:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #3b82f6;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ByeStunting</div>
          <div class="title">Laporan Pemeriksaan Stunting</div>
          <div class="date">Tanggal Pemeriksaan: ${today}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Data Anak</div>
          <table class="data-table">
            <tr>
              <td>Nama Anak</td>
              <td>${childData.nama}</td>
            </tr>
            <tr>
              <td>Nama Ibu Kandung</td>
              <td>${childData.namaIbu}</td>
            </tr>
            <tr>
              <td>Tanggal Lahir</td>
              <td>${tanggalLahir}</td>
            </tr>
            <tr>
              <td>Usia</td>
              <td>${childData.usia} bulan</td>
            </tr>
            <tr>
              <td>Jenis Kelamin</td>
              <td>${
                childData.jenisKelamin === "laki-laki"
                  ? "Laki-laki"
                  : "Perempuan"
              }</td>
            </tr>
            <tr>
              <td>Berat Badan</td>
              <td>${childData.beratBadan} kg</td>
            </tr>
            <tr>
              <td>Tinggi Badan</td>
              <td>${childData.tinggiBadan} cm</td>
            </tr>
            <tr>
              <td>Alamat</td>
              <td>
                ${childData.alamat.desa}, ${childData.alamat.kecamatan}, ${
    childData.alamat.kabupaten
  }, ${childData.alamat.provinsi}
              </td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">Hasil Analisis</div>
          <div class="result">
            <div class="status">Status: ${statusText}</div>
            <div class="message">${result.message}</div>
            
            <div>Tingkat Risiko: ${result.score}%</div>
            <div class="progress-container">
              <div class="progress-bar"></div>
            </div>
            
            <div class="recommendations">
              <div style="font-weight: bold; margin-bottom: 10px;">Rekomendasi:</div>
              ${result.recommendations
                .map((rec) => `<div class="recommendation-item">${rec}</div>`)
                .join("")}
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Artikel Rekomendasi</div>
          <ul>
            ${result.recommendedArticles
              .map(
                (article) => `<li>${article.title} (${article.category})</li>`
              )
              .join("")}
          </ul>
        </div>
        
        <div class="footer">
          <p>Laporan ini dibuat secara otomatis oleh sistem ByeStunting.</p>
          <p>Silakan konsultasikan dengan tenaga kesehatan untuk penanganan lebih lanjut.</p>
          <p>© ${new Date().getFullYear()} ByeStunting - Cegah Stunting Indonesia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Fungsi untuk menghasilkan PDF dari HTML
export async function generatePdf(
  childData: ChildData,
  result: PredictionResult
): Promise<Blob> {
  const htmlContent = generatePdfContent(childData, result);

  // Dalam implementasi nyata, kita akan menggunakan library seperti jsPDF atau html2pdf
  // Untuk demo, kita akan mengembalikan Blob HTML saja
  return new Blob([htmlContent], { type: "text/html" });
}

// Fungsi untuk mengunduh PDF
export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
*Hasil Pemeriksaan Stunting*

Nama: ${childData.nama}
Usia: ${childData.usia} bulan
Status: *${statusText}*
Tingkat Risiko: ${result.score}%

${result.message}

*Rekomendasi:*
${result.recommendations.map((rec) => `- ${rec}`).join("\n")}

Periksa selengkapnya di aplikasi ByeStunting.
  `;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
}
