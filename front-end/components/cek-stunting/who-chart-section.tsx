import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartData } from "@/model/user/cek-stunting-model";

interface WHOChartSectionProps {
  chartData: ChartData[];
  heightChartData: ChartData[];
  weightPercentile: number;
  heightPercentile: number;
  childName: string;
  result: any;
}

export function WHOChartSection({
  chartData,
  heightChartData,
  weightPercentile,
  heightPercentile,
  childName,
  result,
}: WHOChartSectionProps) {
  // Fungsi untuk menentukan kategori berdasarkan persentil - PERBAIKAN UTAMA
  const getWeightCategory = (
    percentile: number
  ): { text: string; color: string } => {
    if (percentile <= 3)
      return { text: "sangat kurang", color: "text-red-600" };
    if (percentile <= 15) return { text: "kurang", color: "text-orange-600" };
    if (percentile >= 97)
      return { text: "sangat tinggi", color: "text-red-600" };
    if (percentile >= 85) return { text: "tinggi", color: "text-orange-600" };
    return { text: "normal", color: "text-green-600" };
  };

  const getHeightCategory = (
    percentile: number
  ): { text: string; color: string } => {
    if (percentile <= 3)
      return { text: "sangat pendek", color: "text-red-600" };
    if (percentile <= 15) return { text: "pendek", color: "text-orange-600" };
    if (percentile >= 97)
      return { text: "sangat tinggi", color: "text-red-600" };
    if (percentile >= 85) return { text: "tinggi", color: "text-orange-600" };
    return { text: "normal", color: "text-green-600" };
  };

  const weightCategory = getWeightCategory(weightPercentile);
  const heightCategory = getHeightCategory(heightPercentile);

  return (
    <Card className="shadow-lg border-blue-100 overflow-hidden">
      <CardHeader className="bg-foreground from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-text">
          Kurva Pertumbuhan <span className="text-secondary">WHO</span>
        </CardTitle>
        <CardDescription>
          Posisi anak Anda pada kurva pertumbuhan standar WHO
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Berat Badan menurut Usia</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    label={{
                      value: "Usia (bulan)",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Berat (kg)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: 20,
                      lineHeight: "24px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p3"
                    stroke="#ef4444"
                    name="Persentil 3"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p15"
                    stroke="#f97316"
                    name="Persentil 15"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="#3b82f6"
                    name="Persentil 50 (Median)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="p85"
                    stroke="#f97316"
                    name="Persentil 85"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p97"
                    stroke="#ef4444"
                    name="Persentil 97"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="childWeight"
                    stroke="#10b981"
                    name="Berat Anak"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    label={{
                      position: "bottom",
                      fill: "#10b981",
                      fontSize: 12,
                      formatter: () => "Anak Anda",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm space-y-2">
              <h4 className="font-semibold mb-2">
                Keterangan Kurva Persentil:
              </h4>
              <ul className="list-disc pl-10 space-y-1">
                <li>
                  <span className="text-red-600 font-medium">Persentil 3</span>{" "}
                  – Berat badan sangat rendah. Anak lebih ringan dari 97% anak
                  seusianya. Indikasi gizi buruk dan risiko stunting berat.
                </li>
                <li>
                  <span className="text-orange-600 font-medium">
                    Persentil 15
                  </span>{" "}
                  – Berat badan rendah. Masih dalam kategori aman tapi perlu
                  dipantau. Bisa menjadi tanda awal kekurangan gizi.
                </li>
                <li>
                  <span className="text-secondary font-medium">
                    Persentil 50
                  </span>{" "}
                  – Berat badan rata-rata (median). Anak tumbuh sesuai rata-rata
                  populasi WHO.
                </li>
                <li>
                  <span className="text-orange-600 font-medium">
                    Persentil 85
                  </span>{" "}
                  – Berat badan lebih tinggi dari rata-rata. Waspadai potensi
                  kelebihan berat atau gizi berlebih.
                </li>
                <li>
                  <span className="text-red-600 font-medium">Persentil 97</span>{" "}
                  – Berat badan sangat tinggi. Anak lebih berat dari 97% anak
                  seusianya. Bisa menjadi indikasi obesitas.
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Persentil Berat Badan:</span>{" "}
                {weightPercentile.toFixed(1)}
                <br />
                <span className="text-xs text-muted-foreground">
                  Persentil menunjukkan posisi anak Anda dibandingkan dengan
                  anak-anak lain seusianya. Persentil 50 adalah median
                  (rata-rata).
                </span>
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Tinggi Badan menurut Usia</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={heightChartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    label={{
                      value: "Usia (bulan)",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Tinggi (cm)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: 20,
                      lineHeight: "24px",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p3"
                    stroke="#ef4444"
                    name="Persentil 3"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p15"
                    stroke="#f97316"
                    name="Persentil 15"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    stroke="#3b82f6"
                    name="Persentil 50 (Median)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="p85"
                    stroke="#f97316"
                    name="Persentil 85"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="p97"
                    stroke="#ef4444"
                    name="Persentil 97"
                    dot={false}
                    strokeWidth={1}
                  />
                  <Line
                    type="monotone"
                    dataKey="childHeight"
                    stroke="#10b981"
                    name="Tinggi Anak"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    label={{
                      position: "bottom",
                      fill: "#10b981",
                      fontSize: 12,
                      formatter: () => "Anak Anda",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm space-y-2">
              <h4 className="font-semibold mb-2">
                Keterangan Kurva Persentil Tinggi Badan:
              </h4>
              <ul className="list-disc pl-10 space-y-1">
                <li>
                  <span className="text-red-600 font-medium">Persentil 3</span>{" "}
                  – Tinggi badan sangat pendek. Indikasi stunting berat.
                </li>
                <li>
                  <span className="text-orange-600 font-medium">
                    Persentil 15
                  </span>{" "}
                  – Tinggi badan di bawah normal. Risiko stunting.
                </li>
                <li>
                  <span className="text-secondary font-medium">
                    Persentil 50
                  </span>{" "}
                  – Tinggi badan rata-rata (median). Pertumbuhan normal.
                </li>
                <li>
                  <span className="text-orange-600 font-medium">
                    Persentil 85
                  </span>{" "}
                  – Tinggi badan di atas rata-rata. Pertumbuhan baik.
                </li>
                <li>
                  <span className="text-red-600 font-medium">Persentil 97</span>{" "}
                  – Tinggi badan sangat tinggi. Pertumbuhan sangat baik.
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">Persentil Tinggi Badan:</span>{" "}
                {heightPercentile.toFixed(1)}
                <br />
                <span className="text-xs text-muted-foreground">
                  Tinggi badan anak dibandingkan dengan standar WHO untuk
                  usianya.
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Interpretasi Hasil
            </h3>
            <div className="p-4 rounded-md bg-blue-50 text-sm leading-relaxed">
              <p>
                Berdasarkan kurva pertumbuhan WHO:
                <br />
                <strong>• Berat badan:</strong> Persentil{" "}
                <strong>{weightPercentile.toFixed(1)}</strong> –{" "}
                <span className={`font-medium ${weightCategory.color}`}>
                  {weightCategory.text}
                </span>
                . Anak berada dalam kategori berat badan {weightCategory.text}.
              </p>

              <p className="mt-3">
                <strong>• Tinggi badan:</strong> Persentil{" "}
                <strong>{heightPercentile.toFixed(1)}</strong> –{" "}
                <span className={`font-medium ${heightCategory.color}`}>
                  {heightCategory.text}
                </span>
                . Anak berada dalam kategori tinggi badan {heightCategory.text}.
              </p>

              <hr className="my-4 border-t border-gray-300" />

              <p className="text-base font-semibold">
                ✅ <span className="text-secondary">Kesimpulan:</span>{" "}
                Berdasarkan hasil analisis, anak {childName} berada dalam
                kondisi{" "}
                {result.status === "normal"
                  ? "normal"
                  : result.status === "stunting berat"
                  ? "stunting berat"
                  : result.status === "stunting"
                  ? "stunting"
                  : "berisiko stunting"}
                . Kami harap informasi ini dapat membantu Anda memahami kondisi
                tumbuh kembang anak dengan lebih baik. Jika diperlukan, jangan
                ragu untuk berkonsultasi dengan tenaga medis atau ahli gizi guna
                mendapatkan dukungan dan penanganan yang tepat.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
