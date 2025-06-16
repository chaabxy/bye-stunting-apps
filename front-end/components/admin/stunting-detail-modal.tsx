import React from "react";

interface StuntingData {
  namaAnak?: string;
  childName?: string;
  namaIbu?: string;
  motherName?: string;
  tanggalLahir?: string;
  birthDate?: string;
  jenisKelamin?: string;
  gender?: string;
  beratBadan?: number;
  weight?: number;
  tinggiBadan?: number;
  height?: number;
  usia?: number;
  ageInMonths?: number;
  status: string;
  risiko?: number;
  riskPercentage?: number;
  tanggalPemeriksaan?: string;
  createdAt?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  desa?: string;
  whoChartData?: any;
  predictionMessage?: string;
  recommendations?: string[];
  modelUsed?: string;
  recommendedEducationId?: string;
  heightPercentile?: number;
  weightPercentile?: number;
  heightCategory?: string;
  weightCategory?: string;
}

// Update bagian yang menampilkan data untuk menggunakan field names yang konsisten
const formatDisplayData = (data: StuntingData) => {
  return {
    // Gunakan field names yang konsisten dengan interface StuntingData
    namaAnak: data.namaAnak || data.childName || "",
    namaIbu: data.namaIbu || data.motherName || "",
    tanggalLahir: data.tanggalLahir || data.birthDate || "",
    jenisKelamin: data.jenisKelamin || data.gender || "",
    beratBadan: data.beratBadan || data.weight || 0,
    tinggiBadan: data.tinggiBadan || data.height || 0,
    usia: data.usia || data.ageInMonths || 0,
    status: data.status,
    risiko: data.risiko || data.riskPercentage || 0,
    tanggalPemeriksaan: data.tanggalPemeriksaan || data.createdAt || "",
    provinsi: data.provinsi || "",
    kabupaten: data.kabupaten || "",
    kecamatan: data.kecamatan || "",
    desa: data.desa || "",
    // Data tambahan
    whoChartData: data.whoChartData,
    predictionMessage: data.predictionMessage,
    recommendations: data.recommendations,
    modelUsed: data.modelUsed,
    recommendedEducationId: data.recommendedEducationId,
    heightPercentile: data.heightPercentile,
    weightPercentile: data.weightPercentile,
    heightCategory: data.heightCategory,
    weightCategory: data.weightCategory,
  };
};

interface StuntingDetailModalProps {
  data: StuntingData | null;
  onClose: () => void;
}

const StuntingDetailModal: React.FC<StuntingDetailModalProps> = ({
  data,
  onClose,
}) => {
  if (!data) {
    return null;
  }

  const displayData = formatDisplayData(data);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Detail Stunting</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Nama Anak:</strong> {displayData.namaAnak}
            </p>
            <p>
              <strong>Nama Ibu:</strong> {displayData.namaIbu}
            </p>
            <p>
              <strong>Tanggal Lahir:</strong> {displayData.tanggalLahir}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {displayData.jenisKelamin}
            </p>
            <p>
              <strong>Berat Badan:</strong> {displayData.beratBadan}
            </p>
            <p>
              <strong>Tinggi Badan:</strong> {displayData.tinggiBadan}
            </p>
            <p>
              <strong>Usia (bulan):</strong> {displayData.usia}
            </p>
            <p>
              <strong>Status:</strong> {displayData.status}
            </p>
            <p>
              <strong>Risiko:</strong> {displayData.risiko}
            </p>
            <p>
              <strong>Tanggal Pemeriksaan:</strong>{" "}
              {displayData.tanggalPemeriksaan}
            </p>
          </div>
          <div>
            <p>
              <strong>Provinsi:</strong> {displayData.provinsi}
            </p>
            <p>
              <strong>Kabupaten:</strong> {displayData.kabupaten}
            </p>
            <p>
              <strong>Kecamatan:</strong> {displayData.kecamatan}
            </p>
            <p>
              <strong>Desa:</strong> {displayData.desa}
            </p>
            <p>
              <strong>Prediction Message:</strong>{" "}
              {displayData.predictionMessage}
            </p>
            <p>
              <strong>Model Used:</strong> {displayData.modelUsed}
            </p>
            <p>
              <strong>Recommended Education ID:</strong>{" "}
              {displayData.recommendedEducationId}
            </p>
            <p>
              <strong>Height Percentile:</strong> {displayData.heightPercentile}
            </p>
            <p>
              <strong>Weight Percentile:</strong> {displayData.weightPercentile}
            </p>
            <p>
              <strong>Height Category:</strong> {displayData.heightCategory}
            </p>
            <p>
              <strong>Weight Category:</strong> {displayData.weightCategory}
            </p>
          </div>
        </div>

        {displayData.recommendations &&
          displayData.recommendations.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Recommendations:</h3>
              <ul>
                {displayData.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}

        <div className="mt-6 flex justify-end">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StuntingDetailModal;
