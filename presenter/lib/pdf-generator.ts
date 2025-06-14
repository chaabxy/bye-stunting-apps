import type { PredictionResult } from "@/app/(user)/cek-stunting/page"

export interface ChildData {
  nama: string
  namaIbu: string
  tanggalLahir: Date
  usia: number
  jenisKelamin: string
  beratBadan: number
  tinggiBadan: number
  alamat: {
    provinsi: string
    kabupaten: string
    kecamatan: string
    desa: string
  }
}

export interface WHOChartData {
  weightChartData: any[]
  heightChartData: any[]
  weightPercentile: number
  heightPercentile: number
}

// Replace the entire generatePdfContent function with this improved version
export function generatePdfContent(
  childData: ChildData,
  result: PredictionResult,
  whoChartData?: WHOChartData,
): string {
  const today = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const tanggalLahir = childData.tanggalLahir.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const statusColor = result.status === "normal" ? "#22c55e" : result.status === "berisiko" ? "#eab308" : "#ef4444"

  const statusText =
    result.status === "normal" ? "Normal" : result.status === "berisiko" ? "Berisiko Stunting" : "Stunting"

  const getWeightInterpretation = (percentile: number) => {
    if (percentile < 3) return "sangat kurang (gizi buruk akut)"
    if (percentile < 15) return "kurang (berat badan kurang)"
    if (percentile > 85 && percentile < 97) return "di atas normal (berisiko kelebihan berat badan)"
    if (percentile >= 97) return "sangat tinggi (obesitas)"
    return "normal (berat badan sehat)"
  }

  const getHeightInterpretation = (percentile: number) => {
    if (percentile < 3) return "sangat pendek (stunting berat)"
    if (percentile < 15) return "di bawah normal (risiko stunting)"
    return "normal (tinggi badan sesuai standar WHO)"
  }

  // Generate WHO Chart visualization
  const generateWHOChartHTML = () => {
    if (!whoChartData) return ""

    const { weightChartData, heightChartData, weightPercentile, heightPercentile } = whoChartData

    // Find current child data point
    const currentWeightData = weightChartData.find((d) => d.childWeight !== null && d.childWeight !== undefined)
    const currentHeightData = heightChartData.find((d) => d.childHeight !== null && d.childHeight !== undefined)

    return `
      <div class="section">
        <div class="section-title">📊 Analisis Kurva Pertumbuhan WHO</div>
        
        <!-- Weight Chart Data -->
        <div class="chart-section">
          <h4 class="chart-title">Berat Badan menurut Usia</h4>
          <div class="chart-container">
            <div class="chart-info">
              <div class="percentile-display">
                <span class="percentile-label">Persentil Berat Badan:</span>
                <span class="percentile-value">${weightPercentile.toFixed(1)}%</span>
                <span class="percentile-interpretation">${getWeightInterpretation(weightPercentile)}</span>
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
                      <td>${data.childWeight ? `<strong>${data.childWeight.toFixed(1)} kg</strong>` : "-"}</td>
                    </tr>
                  `,
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
                <p>Pada usia <strong>${childData.usia} bulan</strong>, berat badan anak <strong>${
                  childData.beratBadan
                } kg</strong> berada pada:</p>
                <ul>
                  <li>Persentil: <strong>${weightPercentile.toFixed(1)}</strong></li>
                  <li>Referensi WHO P50 (median): <strong>${currentWeightData.p50.toFixed(1)} kg</strong></li>
                  <li>Selisih dari median: <strong>${(childData.beratBadan - currentWeightData.p50).toFixed(
                    1,
                  )} kg</strong></li>
                  <li>Status: <strong>${getWeightInterpretation(weightPercentile)}</strong></li>
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
                <span class="percentile-value">${heightPercentile.toFixed(1)}%</span>
                <span class="percentile-interpretation">${getHeightInterpretation(heightPercentile)}</span>
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
                      <td>${data.childHeight ? `<strong>${data.childHeight.toFixed(1)} cm</strong>` : "-"}</td>
                    </tr>
                  `,
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
                <p>Pada usia <strong>${childData.usia} bulan</strong>, tinggi badan anak <strong>${
                  childData.tinggiBadan
                } cm</strong> berada pada:</p>
                <ul>
                  <li>Persentil: <strong>${heightPercentile.toFixed(1)}</strong></li>
                  <li>Referensi WHO P50 (median): <strong>${currentHeightData.p50.toFixed(1)} cm</strong></li>
                  <li>Selisih dari median: <strong>${(childData.tinggiBadan - currentHeightData.p50).toFixed(
                    1,
                  )} cm</strong></li>
                  <li>Status: <strong>${getHeightInterpretation(heightPercentile)}</strong></li>
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
                weightPercentile < 15 ? "status-warning" : weightPercentile > 85 ? "status-warning" : "status-normal"
              }">
                ${getWeightInterpretation(weightPercentile)}
              </p>
            </div>
            <div class="analysis-item">
              <h5>Status Pertumbuhan Berdasarkan Tinggi/Usia:</h5>
              <p class="status-text ${heightPercentile < 15 ? "status-danger" : "status-normal"}">
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
                1,
              )}) dengan tinggi badan rendah (P${heightPercentile.toFixed(
                1,
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
    `
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Laporan Pemeriksaan Stunting</title>
<style>
  * {
    box-sizing: border-box !important;
    margin: 0 !important;
    padding: 0 !important;
    font-family: 'Arial', 'Helvetica', sans-serif !important;
    color: #000000 !important;
  }

  body {
    background-color: #ffffff !important;
    padding: 0 !important;
    color: #000000 !important;
    font-size: 12px !important;
    line-height: 1.4 !important;
    width: 210mm !important;
    min-height: 297mm !important;
  }

  .container {
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 auto !important;
    background-color: #ffffff !important;
    padding: 12mm 15mm 15mm 15mm !important;
    box-sizing: border-box !important;
    position: relative !important;
  }

  .header {
    text-align: center !important;
    margin-bottom: 8mm !important;
    padding-bottom: 6mm !important;
    border-bottom: 2px solid #000000 !important;
  }

  .logo {
    font-size: 20px !important;
    font-weight: bold !important;
    color: #000000 !important;
    margin-bottom: 2mm !important;
  }

  .subtitle {
    font-size: 11px !important;
    color: #000000 !important;
    margin-bottom: 3mm !important;
  }

  .title {
    font-size: 16px !important;
    font-weight: bold !important;
    margin-bottom: 2mm !important;
    color: #000000 !important;
  }

  .date {
    font-size: 11px !important;
    color: #000000 !important;
  }

  .section {
    margin-bottom: 6mm !important;
    page-break-inside: avoid !important;
  }

  .section-title {
    font-size: 14px !important;
    font-weight: bold !important;
    margin-bottom: 4mm !important;
    color: #000000 !important;
    border-bottom: 1px solid #000000 !important;
    padding-bottom: 1mm !important;
  }

  .data-table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 4mm !important;
  }

  .data-table td {
    border: 1px solid #000000 !important;
    padding: 2mm !important;
    vertical-align: top !important;
    font-size: 11px !important;
    color: #000000 !important;
  }

  .data-table td:first-child {
    width: 35% !important;
    font-weight: bold !important;
    background-color: #f0f0f0 !important;
    color: #000000 !important;
  }

  .result {
    background-color: #f5f5f5 !important;
    padding: 4mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    margin-bottom: 4mm !important;
  }

  .result .status {
    font-weight: bold !important;
    margin-bottom: 2mm !important;
    font-size: 13px !important;
    color: #000000 !important;
  }

  .result .message {
    margin-bottom: 3mm !important;
    font-size: 11px !important;
    color: #000000 !important;
    line-height: 1.4 !important;
  }

  .score-container {
    margin-bottom: 3mm !important;
  }

  .score-label {
    font-weight: bold !important;
    margin-bottom: 1mm !important;
    color: #000000 !important;
  }

  .progress-container {
    margin-top: 2mm !important;
    background-color: #e0e0e0 !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    height: 5mm !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .progress-bar {
    height: 100% !important;
    border-radius: 1mm !important;
  }

  .progress-text {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 11px !important;
    font-weight: bold !important;
    color: #000000 !important;
  }

  .recommendations-title {
    font-weight: bold !important;
    margin-bottom: 2mm !important;
    margin-top: 3mm !important;
    color: #000000 !important;
  }

  .recommendation-item {
    margin-bottom: 1.5mm !important;
    font-size: 11px !important;
    padding-left: 4mm !important;
    position: relative !important;
    color: #000000 !important;
    line-height: 1.3 !important;
  }

  .recommendation-number {
    position: absolute !important;
    left: 0 !important;
    font-weight: bold !important;
    color: #000000 !important;
  }

  /* WHO Chart Styles */
  .chart-section {
    margin-bottom: 5mm !important;
    page-break-inside: avoid !important;
  }

  .chart-title {
    font-size: 13px !important;
    font-weight: bold !important;
    margin-bottom: 2mm !important;
    color: #000000 !important;
    border-bottom: 1px solid #000000 !important;
    padding-bottom: 1mm !important;
  }

  .chart-container {
    background-color: #f8f8f8 !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
  }

  .percentile-display {
    background-color: #ffffff !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    margin-bottom: 2mm !important;
    border-left: 3px solid #000000 !important;
  }

  .percentile-label {
    font-weight: bold !important;
    margin-right: 1mm !important;
    color: #000000 !important;
  }

  .percentile-value {
    font-size: 13px !important;
    font-weight: bold !important;
    color: #000000 !important;
    margin-right: 1mm !important;
  }

  .percentile-interpretation {
    font-style: italic !important;
    color: #000000 !important;
  }

  .who-table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 2mm !important;
    font-size: 9px !important;
  }

  .who-table th,
  .who-table td {
    border: 1px solid #000000 !important;
    padding: 1.5mm !important;
    text-align: center !important;
    color: #000000 !important;
  }

  .who-table th {
    background-color: #000000 !important;
    color: #ffffff !important;
    font-weight: bold !important;
  }

  .who-table .current-child {
    background-color: #d4edda !important;
    font-weight: bold !important;
    color: #000000 !important;
  }

  .chart-analysis {
    background-color: #ffffff !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    font-size: 10px !important;
    margin-top: 2mm !important;
  }

  .chart-analysis h5 {
    margin-bottom: 1mm !important;
    color: #000000 !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }

  .chart-analysis ul {
    margin-left: 4mm !important;
  }

  .chart-analysis li {
    margin-bottom: 0.5mm !important;
    color: #000000 !important;
  }

  .combined-analysis {
    background-color: #f0f8ff !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    margin-top: 3mm !important;
    page-break-inside: avoid !important;
  }

  .combined-analysis h4 {
    margin-bottom: 2mm !important;
    font-size: 13px !important;
    color: #000000 !important;
    font-weight: bold !important;
  }

  .analysis-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 2mm !important;
    margin-bottom: 2mm !important;
  }

  .analysis-item {
    background-color: #ffffff !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
  }

  .analysis-item h5 {
    margin-bottom: 1mm !important;
    color: #000000 !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }

  .status-normal {
    color: #006600 !important;
    font-weight: bold !important;
  }

  .status-warning {
    color: #cc6600 !important;
    font-weight: bold !important;
  }

  .status-danger {
    color: #cc0000 !important;
    font-weight: bold !important;
  }

  .critical-warning {
    background-color: #fff0f0 !important;
    border: 2px solid #cc0000 !important;
    padding: 2mm !important;
    border-radius: 1mm !important;
    margin-top: 2mm !important;
    page-break-inside: avoid !important;
  }

  .critical-warning h5 {
    color: #cc0000 !important;
    margin-bottom: 1mm !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }

  .who-reference {
    background-color: #f8f8f8 !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
    margin-top: 3mm !important;
    page-break-inside: avoid !important;
  }

  .who-reference h4 {
    margin-bottom: 2mm !important;
    font-size: 13px !important;
    color: #000000 !important;
    font-weight: bold !important;
  }

  .reference-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 2mm !important;
  }

  .reference-item {
    background-color: #ffffff !important;
    padding: 2mm !important;
    border: 1px solid #000000 !important;
    border-radius: 1mm !important;
  }

  .reference-item h5 {
    margin-bottom: 1mm !important;
    color: #000000 !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }

  .reference-item ul {
    margin-left: 3mm !important;
  }

  .reference-item li {
    margin-bottom: 0.5mm !important;
    font-size: 9px !important;
    color: #000000 !important;
  }

  .disclaimer {
    background-color: #fff8f0 !important;
    padding: 2mm !important;
    border: 2px solid #cc6600 !important;
    border-radius: 1mm !important;
    margin-top: 3mm !important;
    page-break-inside: avoid !important;
  }

  .disclaimer-title {
    font-weight: bold !important;
    margin-bottom: 1mm !important;
    color: #cc0000 !important;
    font-size: 12px !important;
  }

  .disclaimer-text {
    font-size: 10px !important;
    color: #000000 !important;
    line-height: 1.3 !important;
  }

  .footer {
    text-align: center !important;
    font-size: 9px !important;
    color: #000000 !important;
    border-top: 1px solid #000000 !important;
    padding-top: 2mm !important;
    margin-top: 5mm !important;
    page-break-inside: avoid !important;
  }

  .footer-logo {
    font-weight: bold !important;
    margin-bottom: 1mm !important;
    font-size: 11px !important;
    color: #000000 !important;
  }

  @media print {
    body {
      width: 210mm !important;
      height: 297mm !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    
    .container {
      width: 210mm !important;
      min-height: 297mm !important;
      padding: 10mm 15mm 10mm 15mm !important;
      margin: 0 !important;
      box-shadow: none !important;
      background: white !important;
    }
    
    .page-break {
      page-break-before: always !important;
    }

    .section {
      page-break-inside: avoid !important;
    }

    .chart-section {
      page-break-inside: avoid !important;
    }

    .who-reference {
      page-break-inside: avoid !important;
    }

    .disclaimer {
      page-break-inside: avoid !important;
    }

    .footer {
      page-break-inside: avoid !important;
    }
  }

  @page {
    size: A4 !important;
    margin: 0 !important;
  }

  /* Force text colors */
  h1, h2, h3, h4, h5, h6, p, span, div, td, th, li, strong, b {
    color: #000000 !important;
  }

  /* Override any inherited styles */
  .container * {
    color: #000000 !important;
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
          <tr><td>Jenis Kelamin</td><td>${childData.jenisKelamin === "laki-laki" ? "Laki-laki" : "Perempuan"}</td></tr>
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
              <div class="progress-bar" style="width: ${result.score}%; background: ${statusColor};"></div>
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
            `,
              )
              .join("")}
          </div>
        </div>
      </div>

      ${generateWHOChartHTML()}

      <div class="section">
        <div class="section-title">📢 Disclaimer</div>
        <div class="disclaimer">
          <div class="disclaimer-title">⚠ Penting!</div>
          <div class="disclaimer-text">
            Informasi yang diberikan dalam laporan ini bersifat prediktif dan tidak menggantikan diagnosis profesional dari tenaga medis. Kurva pertumbuhan WHO digunakan sebagai referensi standar internasional. Mohon konsultasikan lebih lanjut dengan dokter atau petugas kesehatan setempat untuk pemeriksaan dan saran yang lebih akurat.
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-logo">ByeStunting</div>
        <div>© ${new Date().getFullYear()} Sistem Deteksi Dini dan Pencegahan Stunting</div>
        <div style="margin-top: 5px; font-size: 9px;">Berdasarkan Standar WHO Child Growth Standards</div>
      </div>
    </div>
  </body>
  </html>
  `
}

// Declare html2pdf type to avoid TypeScript errors
declare global {
  interface Window {
    html2pdf: any
  }
}

// Replace the generatePdf function with this improved version
export async function generatePdf(
  childData: ChildData,
  result: PredictionResult,
  whoChartData?: WHOChartData,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Check if html2pdf is already loaded
      if (typeof window !== "undefined" && window.html2pdf) {
        generatePdfWithLibrary(window.html2pdf, childData, result, whoChartData).then(resolve).catch(reject)
        return
      }

      // Load html2pdf dynamically
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
      script.onload = () => {
        if (window.html2pdf) {
          generatePdfWithLibrary(window.html2pdf, childData, result, whoChartData).then(resolve).catch(reject)
        } else {
          reject(new Error("Failed to load html2pdf library"))
        }
      }
      script.onerror = () => {
        reject(new Error("Failed to load html2pdf script"))
      }
      document.head.appendChild(script)
    } catch (error) {
      console.error("Error in generatePdf:", error)
      reject(error)
    }
  })
}

async function generatePdfWithLibrary(
  html2pdf: any,
  childData: ChildData,
  result: PredictionResult,
  whoChartData?: WHOChartData,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const htmlContent = generatePdfContent(childData, result, whoChartData)

      // Buat element temporary untuk konversi
      const element = document.createElement("div")
      element.innerHTML = htmlContent
      element.style.position = "absolute"
      element.style.left = "-9999px"
      element.style.top = "-9999px"
      element.style.width = "210mm"
      element.style.height = "auto"
      document.body.appendChild(element)

      // Konfigurasi html2pdf
      const options = {
        margin: 0,
        filename: `laporan-stunting-${childData.nama.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123, // A4 height in pixels at 96 DPI
          // Avoid SVG rendering issues
          ignoreElements: (element: Element) => {
            return element.tagName.toLowerCase() === "svg"
          },
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: false,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break",
          after: ".section",
          avoid: [".chart-section", ".who-reference", ".disclaimer", ".footer"],
        },
      }

      // Generate PDF
      html2pdf()
        .set(options)
        .from(element)
        .outputPdf("blob")
        .then((pdfBlob: Blob) => {
          // Clean up the temporary element
          document.body.removeChild(element)
          resolve(pdfBlob)
        })
        .catch((error: any) => {
          console.error("Error generating PDF:", error)
          // Clean up the temporary element even on error
          if (document.body.contains(element)) {
            document.body.removeChild(element)
          }
          reject(error)
        })
    } catch (error) {
      console.error("Error in generatePdfWithLibrary:", error)
      reject(error)
    }
  })
}

// Fungsi untuk mengunduh PDF
export function downloadPdf(blob: Blob, filename: string): void {
  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading PDF:", error)
    alert("Gagal mengunduh PDF. Silakan coba lagi.")
  }
}

// Fungsi untuk membagikan hasil via WhatsApp
export function shareViaWhatsApp(childData: ChildData, result: PredictionResult, whoChartData?: WHOChartData): void {
  const statusText =
    result.status === "normal" ? "Normal" : result.status === "berisiko" ? "Berisiko Stunting" : "Stunting"

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
        whoChartData.heightPercentile < 3 ? "Sangat Pendek" : whoChartData.heightPercentile < 15 ? "Pendek" : "Normal"
      }`
    : ""

  const message = `
*HASIL PEMERIKSAAN STUNTING*

Data Anak:
• Nama: ${childData.nama}
• Ibu: ${childData.namaIbu}
• Usia: ${childData.usia} bulan
• Berat: ${childData.beratBadan} kg
• Tinggi: ${childData.tinggiBadan} cm
• Alamat: ${childData.alamat.desa}, ${childData.alamat.kecamatan}, ${childData.alamat.kabupaten}

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
  `

  const encodedMessage = encodeURIComponent(message.trim())
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`

  window.open(whatsappUrl, "_blank")
}
