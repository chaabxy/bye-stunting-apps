"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Users, TrendingUp, Activity, AlertTriangle } from "lucide-react";

interface WHOStats {
  overall: {
    normal: number;
    atRisk: number;
    stunting: number;
    severeStunting: number;
    totalChildren: number;
  };
  byAgeGroup: Array<{
    ageGroup: string;
    normal: number;
    atRisk: number;
    stunting: number;
    severeStunting: number;
    total: number;
  }>;
  byGender: {
    male: {
      normal: number;
      atRisk: number;
      stunting: number;
      severeStunting: number;
      total: number;
    };
    female: {
      normal: number;
      atRisk: number;
      stunting: number;
      severeStunting: number;
      total: number;
    };
  };
  trends: Array<{
    month: string;
    normal: number;
    atRisk: number;
    stunting: number;
    severeStunting: number;
  }>;
}

const COLORS = {
  normal: "#10B981",
  atRisk: "#F59E0B",
  stunting: "#EF4444",
  severeStunting: "#DC2626",
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  percentage,
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  color: string;
  percentage: number;
}) => (
  <Card className="relative overflow-hidden bg-gray-100">
    <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="mt-2">
        <div className="text-xs text-muted-foreground mb-1">
          {percentage.toFixed(1)}% dari total
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function WHOStatisticsCharts() {
  const [stats, setStats] = useState<WHOStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/health-data/who-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching WHO stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const pieData = [
    { name: "Tinggi Badan", value: stats.overall.normal, color: COLORS.normal },
    { name: "Berat Badan", value: stats.overall.atRisk, color: COLORS.atRisk },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Normal"
          value={`${Math.round(
            (stats.overall.normal * stats.overall.totalChildren) / 100
          ).toLocaleString()}`}
          description="Anak dengan pertumbuhan normal"
          icon={Users}
          color="bg-green-500"
          percentage={stats.overall.normal}
        />
        <StatCard
          title="Berisiko"
          value={`${Math.round(
            (stats.overall.atRisk * stats.overall.totalChildren) / 100
          ).toLocaleString()}`}
          description="Anak berisiko stunting"
          icon={TrendingUp}
          color="bg-yellow-500"
          percentage={stats.overall.atRisk}
        />
        <StatCard
          title="Stunting"
          value={`${Math.round(
            (stats.overall.stunting * stats.overall.totalChildren) / 100
          ).toLocaleString()}`}
          description="Anak mengalami stunting"
          icon={Activity}
          color="bg-red-500"
          percentage={stats.overall.stunting}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-input">
          <CardHeader className="text-center">
            <CardTitle>Perbandingan Tinggi Badan & Berat Badan</CardTitle>
            <CardDescription>
              Menunjukkan proporsi risiko stunting berdasarkan indikator tinggi
              badan atau berat badan dari{" "}
              {stats.overall.totalChildren.toLocaleString()} anak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [
                    `${value.toFixed(1)}%`,
                    "Persentase",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Age Groups */}
        <Card className="bg-input">
          <CardHeader className="text-center">
            <CardTitle>Status Gizi Berdasarkan Kelompok Usia</CardTitle>
            <CardDescription>
              Persentase status gizi per kelompok usia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.byAgeGroup}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="ageGroup"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="normal"
                  stackId="a"
                  fill={COLORS.normal}
                  name="Normal"
                />
                <Bar
                  dataKey="atRisk"
                  stackId="a"
                  fill={COLORS.atRisk}
                  name="Berisiko"
                />
                <Bar
                  dataKey="stunting"
                  stackId="a"
                  fill={COLORS.stunting}
                  name="Stunting"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Trends */}
        <Card className="bg-input">
          <CardHeader className="text-center">
            <CardTitle>Tren Status Gizi 6 Bulan Terakhir</CardTitle>
            <CardDescription>
              Perubahan persentase status gizi dari waktu ke waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="normal"
                  stroke={COLORS.normal}
                  strokeWidth={3}
                  name="Normal"
                  dot={{ fill: COLORS.normal, strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="atRisk"
                  stroke={COLORS.atRisk}
                  strokeWidth={3}
                  name="Berisiko"
                  dot={{ fill: COLORS.atRisk, strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="stunting"
                  stroke={COLORS.stunting}
                  strokeWidth={3}
                  name="Stunting"
                  dot={{ fill: COLORS.stunting, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Comparison */}
        <Card className="bg-input">
          <CardHeader className="text-center">
            <CardTitle>Perbandingan Berdasarkan Jenis Kelamin</CardTitle>
            <CardDescription>
              Status gizi anak laki-laki vs perempuan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    gender: "Laki-laki",
                    normal: stats.byGender.male.normal,
                    atRisk: stats.byGender.male.atRisk,
                    stunting: stats.byGender.male.stunting,
                    severeStunting: stats.byGender.male.severeStunting,
                  },
                  {
                    gender: "Perempuan",
                    normal: stats.byGender.female.normal,
                    atRisk: stats.byGender.female.atRisk,
                    stunting: stats.byGender.female.stunting,
                    severeStunting: stats.byGender.female.severeStunting,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gender" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="normal" fill={COLORS.normal} name="Normal" />
                <Bar dataKey="atRisk" fill={COLORS.atRisk} name="Berisiko" />
                <Bar
                  dataKey="stunting"
                  fill={COLORS.stunting}
                  name="Stunting"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
