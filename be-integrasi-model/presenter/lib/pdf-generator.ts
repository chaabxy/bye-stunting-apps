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

export interface WHOChartData {
  weightChartData: any[];
  heightChartData: any[];
  weightPercentile: number;
  heightPercentile: number;
}

// Fungsi untuk menghasilkan HTML yang akan dikonversi menjadi PDF
export function generatePdfContent(
  childData: ChildData,
  result: PredictionResult,
  whoChartData?: WHOChartData
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

  // Generate WHO Chart visualization
  const generateWHOChartHTML = () => {
    if (!whoChartData) return "";

    const {
      weightChartData,
      heightChartData,
      weightPercentile,
      heightPercentile,
    } = whoChartData;

    // Find current child data point
    const currentWeightData = weightChartData.find(
      (d) => d.childWeight !== null && d.childWeight !== undefined
    );
    const currentHeightData = heightChartData.find(
      (d) => d.childHeight !== null && d.childHeight !== undefined
    );

    return `
      <div class="section">
        <div class="section-title">📈 Analisis Kurva Pertumbuhan WHO</div>
        
        <!-- Weight Chart Data -->
        <div class="chart-section">
          <h4 class="chart-title">Berat Badan menurut Usia</h4>
          <div class="chart-container">
            <div class="chart-info">
              <div class="percentile-display">
                <span class="percentile-label">Persentil Berat Badan:</span>
                <span class="percentile-value">${weightPercentile.toFixed(
                  1
                )}%</span>
                <span class="percentile-interpretation">${getWeightInterpretation(
                  weightPercentile
                )}</span>
              </div>
            </div>
            
            <div class="chart-data-table">
              <table class="who-table">
                <thead>
                  <tr>
                    <th>Usia (bulan)</th>
                    <th>P3</th>
                    <th>P15</th>
                    <th>P50</th>
                    <th>P85</th>
                    <th>P97</th>
                    <th>Anak Anda</th>
                  </tr>
                </thead>
                <tbody>
                  ${weightChartData
                    .slice(0, 8)
                    .map(
                      (data) => `
                    <tr ${data.childWeight ? 'class="current-child"' : ""}>
                      <td>${data.age}</td>
                      <td>${data.p3.toFixed(1)} kg</td>
                      <td>${data.p15.toFixed(1)} kg</td>
                      <td>${data.p50.toFixed(1)} kg</td>
                      <td>${data.p85.toFixed(1)} kg</td>
                      <td>${data.p97.toFixed(1)} kg</td>
                      <td>${
                        data.childWeight
                          ? `<strong>${data.childWeight.toFixed(1)} kg</strong>`
                          : "-"
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            ${
              currentWeightData
                ? `
              <div class="chart-analysis">
                <h5>Analisis Posisi Anak:</h5>
                <p>Pada usia <strong>${
                  childData.usia
                } bulan</strong>, berat badan anak <strong>${
                    childData.beratBadan
                  } kg</strong> berada pada:</p>
                <ul>
                  <li>Persentil: <strong>${weightPercentile.toFixed(
                    1
                  )}</strong></li>
                  <li>Referensi WHO P50 (median): <strong>${currentWeightData.p50.toFixed(
                    1
                  )} kg</strong></li>
                  <li>Selisih dari median: <strong>${(
                    childData.beratBadan - currentWeightData.p50
                  ).toFixed(1)} kg</strong></li>
                  <li>Status: <strong>${getWeightInterpretation(
                    weightPercentile
                  )}</strong></li>
                </ul>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Height Chart Data -->
        <div class="chart-section">
          <h4 class="chart-title">Tinggi Badan menurut Usia</h4>
          <div class="chart-container">
            <div class="chart-info">
              <div class="percentile-display">
                <span class="percentile-label">Persentil Tinggi Badan:</span>
                <span class="percentile-value">${heightPercentile.toFixed(
                  1
                )}%</span>
                <span class="percentile-interpretation">${getHeightInterpretation(
                  heightPercentile
                )}</span>
              </div>
            </div>
            
            <div class="chart-data-table">
              <table class="who-table">
                <thead>
                  <tr>
                    <th>Usia (bulan)</th>
                    <th>P3</th>
                    <th>P15</th>
                    <th>P50</th>
                    <th>P85</th>
                    <th>P97</th>
                    <th>Anak Anda</th>
                  </tr>
                </thead>
                <tbody>
                  ${heightChartData
                    .slice(0, 8)
                    .map(
                      (data) => `
                    <tr ${data.childHeight ? 'class="current-child"' : ""}>
                      <td>${data.age}</td>
                      <td>${data.p3.toFixed(1)} cm</td>
                      <td>${data.p15.toFixed(1)} cm</td>
                      <td>${data.p50.toFixed(1)} cm</td>
                      <td>${data.p85.toFixed(1)} cm</td>
                      <td>${data.p97.toFixed(1)} cm</td>
                      <td>${
                        data.childHeight
                          ? `<strong>${data.childHeight.toFixed(1)} cm</strong>`
                          : "-"
                      }</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            
            ${
              currentHeightData
                ? `
              <div class="chart-analysis">
                <h5>Analisis Posisi Anak:</h5>
                <p>Pada usia <strong>${
                  childData.usia
                } bulan</strong>, tinggi badan anak <strong>${
                    childData.tinggiBadan
                  } cm</strong> berada pada:</p>
                <ul>
                  <li>Persentil: <strong>${heightPercentile.toFixed(
                    1
                  )}</strong></li>
                  <li>Referensi WHO P50 (median): <strong>${currentHeightData.p50.toFixed(
                    1
                  )} cm</strong></li>
                  <li>Selisih dari median: <strong>${(
                    childData.tinggiBadan - currentHeightData.p50
                  ).toFixed(1)} cm</strong></li>
                  <li>Status: <strong>${getHeightInterpretation(
                    heightPercentile
                  )}</strong></li>
                </ul>
              </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Combined Analysis -->
        <div class="combined-analysis">
          <h4>Analisis Gabungan WHO</h4>
          <div class="analysis-grid">
            <div class="analysis-item">
              <h5>Status Gizi Berdasarkan Berat/Usia:</h5>
              <p class="status-text ${
                weightPercentile < 15
                  ? "status-warning"
                  : weightPercentile > 85
                  ? "status-warning"
                  : "status-normal"
              }">
                ${getWeightInterpretation(weightPercentile)}
              </p>
            </div>
            <div class="analysis-item">
              <h5>Status Pertumbuhan Berdasarkan Tinggi/Usia:</h5>
              <p class="status-text ${
                heightPercentile < 15 ? "status-danger" : "status-normal"
              }">
                ${getHeightInterpretation(heightPercentile)}
              </p>
            </div>
          </div>
          
          ${
            weightPercentile > 85 && heightPercentile < 15
              ? `
            <div class="critical-warning">
              <h5>⚠️ Peringatan Khusus:</h5>
              <p>Kombinasi berat badan tinggi (P${weightPercentile.toFixed(
                1
              )}) dengan tinggi badan rendah (P${heightPercentile.toFixed(
                  1
                )}) menunjukkan kondisi <strong>"stunting dengan obesitas"</strong>. Kondisi ini memerlukan perhatian medis segera dan intervensi gizi khusus.</p>
            </div>
          `
              : ""
          }
        </div>

        <!-- WHO Standards Reference -->
        <div class="who-reference">
          <h4>Referensi Standar WHO</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <h5>Interpretasi Persentil:</h5>
              <ul>
                <li><strong>P3:</strong> Batas bawah normal (3% anak lebih rendah)</li>
                <li><strong>P15:</strong> Di bawah rata-rata</li>
                <li><strong>P50:</strong> Median/rata-rata populasi</li>
                <li><strong>P85:</strong> Di atas rata-rata</li>
                <li><strong>P97:</strong> Batas atas normal (97% anak lebih rendah)</li>
              </ul>
            </div>
            <div class="reference-item">
              <h5>Kategori Status Gizi WHO:</h5>
              <ul>
                <li><strong>Normal:</strong> P15 - P85</li>
                <li><strong>Berisiko Kurang:</strong> P3 - P15</li>
                <li><strong>Gizi Kurang/Stunting:</strong> < P3</li>
                <li><strong>Berisiko Lebih:</strong> P85 - P97</li>
                <li><strong>Gizi Lebih/Obesitas:</strong> > P97</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
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

  /* WHO Chart Styles */
  .chart-section {
    margin-bottom: 25px;
    page-break-inside: avoid;
  }

  .chart-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
  }

  .chart-container {
    background-color: #f8f9fa;
    padding: 15px 5px 15px 15px; /* Kurangi padding kanan */
    border-radius: 8px;
    border: 1px solid #e9ecef;
    overflow: visible; /* Biarkan content keluar jika perlu */
  }

  .percentile-display {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    border-left: 4px solid #3498db;
  }

  .percentile-label {
    font-weight: bold;
    margin-right: 10px;
  }

  .percentile-value {
    font-size: 18px;
    font-weight: bold;
    color: #2c3e50;
    margin-right: 10px;
  }

  .percentile-interpretation {
    font-style: italic;
    color: #666;
  }

  .who-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    font-size: 12px;
    margin-left: -20px; /* Geser tabel ke kiri */
    max-width: calc(100% + 40px); /* Biarkan tabel sedikit keluar dari container */
  }

  .who-table th,
  .who-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  .who-table th {
    background-color: #3498db;
    color: white;
    font-weight: bold;
  }

  .who-table .current-child {
    background-color: #e8f5e8;
    font-weight: bold;
  }

  .chart-analysis {
    background-color: #fff;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .chart-analysis h5 {
    margin-bottom: 8px;
    color: #2c3e50;
  }

  .chart-analysis ul {
    margin-left: 20px;
  }

  .chart-analysis li {
    margin-bottom: 4px;
  }

  .combined-analysis {
    background-color: #f0f8ff;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #b3d9ff;
    margin-top: 20px;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
  }

  .analysis-item {
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .analysis-item h5 {
    margin-bottom: 5px;
    color: #2c3e50;
  }

  .status-normal {
    color: #27ae60;
    font-weight: bold;
  }

  .status-warning {
    color: #f39c12;
    font-weight: bold;
  }

  .status-danger {
    color: #e74c3c;
    font-weight: bold;
  }

  .critical-warning {
    background-color: #fff5f5;
    border: 2px solid #e74c3c;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
  }

  .critical-warning h5 {
    color: #e74c3c;
    margin-bottom: 8px;
  }

  .who-reference {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    margin-top: 20px;
  }

  .reference-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .reference-item {
    background-color: #fff;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .reference-item h5 {
    margin-bottom: 8px;
    color: #2c3e50;
  }

  .reference-item ul {
    margin-left: 15px;
  }

  .reference-item li {
    margin-bottom: 3px;
    font-size: 12px;
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

  /* Print optimizations */
  @media print {
    .chart-section {
      page-break-inside: avoid;
    }
    
    .who-table {
      font-size: 10px;
    }
    
    .analysis-grid,
    .reference-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Responsive */
  @media (max-width: 600px) {
    .analysis-grid,
    .reference-grid {
      grid-template-columns: 1fr;
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

      ${generateWHOChartHTML()}

      <div class="section">
        <div class="section-title">📢 Disclaimer</div>
        <div class="disclaimer">
          <div class="disclaimer-title">⚠️ Penting!</div>
          <div class="disclaimer-text">
            Informasi yang diberikan dalam laporan ini bersifat prediktif dan tidak menggantikan diagnosis profesional dari tenaga medis. Kurva pertumbuhan WHO digunakan sebagai referensi standar internasional. Mohon konsultasikan lebih lanjut dengan dokter atau petugas kesehatan setempat untuk pemeriksaan dan saran yang lebih akurat.
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-logo">ByeStunting</div>
        <div>© ${new Date().getFullYear()} Sistem Deteksi Dini dan Pencegahan Stunting</div>
        <div style="margin-top: 5px; font-size: 11px;">Berdasarkan Standar WHO Child Growth Standards</div>
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
  whoChartData?: WHOChartData
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Import html2pdf secara dinamis
      import("html2pdf.js")
        .then((html2pdf) => {
          const htmlContent = generatePdfContent(
            childData,
            result,
            whoChartData
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
  .slice(0, 3)
  .map((rec, index) => `${index + 1}. ${rec}`)
  .join("\n")}

Untuk informasi lebih lengkap dan mendalam, silakan cek artikel-artikel edukatif kami di fitur edukasi pada Link https://bye-stunting-apps.vercel.app/edukasi, seperti:
${result.recommendedArticles
  .slice(0, 2)
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
