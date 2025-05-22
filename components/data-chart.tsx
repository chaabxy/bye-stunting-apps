"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface DataChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  type?: "age" | "province";
}

// Kita tidak perlu remaining lagi
const prepareData = (data: Array<{ name: string; value: number }>) =>
  data.map((item) => ({
    ...item,
    full: 100, 
  }));

export default function DataChart({
  title,
  data,
  type = "age",
}: DataChartProps) {
  const chartData = prepareData(data);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-slate-800 text-md font-bold text-center">
          {title}
        </CardTitle>
        {type === "age" ? (
          <p className="text-slate-500 text-xs mt-1 text-center">
            Data prevalensi stunting berdasarkan kelompok usia
          </p>
        ) : type === "province" ? (
          <p className="text-slate-500 text-xs mt-1 text-center">
            Data prevalensi stunting berdasarkan provinsi
          </p>
        ) : null}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${data.length * 60}px`, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 15, right: 10, left: 5, bottom: 10 }}
              barCategoryGap={20}
              barSize={20}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#111827", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={110}
                hide
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #AAD1F2",
                }}
                formatter={(value) => [`${value}%`, "Prevalensi"]}
              />

              <Bar
                dataKey="value"
                fill="#317BC4"
                stackId="a"
                radius={[10, 10, 10, 10]}
                background={(props) => {
                  const { x, y, width, height } = props;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill="#E5E7EB"
                      rx={10}
                      ry={10}
                    />
                  );
                }}
              >
                <LabelList
                  dataKey="name"
                  position="top"
                  content={(props) => {
                    const { x, y, value } = props;
                    return (
                      <text
                        x={x} // posisi x dari bar
                        y={y! - 6} // sedikit naik biar sejajar atas
                        textAnchor="start" // rata kiri
                        fill="#111827"
                        fontSize={12}
                        fontWeight={500}
                      >
                        {value}
                      </text>
                    );
                  }}
                />

                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value) => `${value}%`}
                  style={{ fill: "#111827", fontSize: 13, fontWeight: 500 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


