"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Map,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { fetchProvinces } from "@/lib/location-data";

interface ProvinceStatsCardProps {
  className?: string;
}

interface StuntingData {
  normal: number;
  risk: number;
  stunting: number;
  totalChildren: number;
}

interface Province {
  id: string;
  name: string;
}

export function ProvinceStatsCard({ className }: ProvinceStatsCardProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [stuntingData, setStuntingData] = useState<StuntingData>({
    normal: 0,
    risk: 0,
    stunting: 0,
    totalChildren: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProvinces()
      .then((data) => setProvinces(data))
      .catch((error) => console.error("Gagal memuat provinsi:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setLoading(true);
      fetch(`/api/health-data/province-detail?provinceId=${selectedProvince}`)
        .then((res) => res.json())
        .then((data) => {
          setStuntingData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching province data:", error);
          setLoading(false);
        });
    }
  }, [selectedProvince]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${className}`}>
      {/* Pilih Provinsi */}
      <Card className="md:col-span-1 shadow-md rounded-xl flex flex-col justify-between p-6 bg-white">
        <div className="flex flex-col items-center gap-2">
          <Map className="w-8 h-8 text-blue-600" />
          <h3 className="text-blue-700 font-semibold text-lg text-center">
            Pilih Provinsi
          </h3>
        </div>
        <div className="mt-4">
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Provinsi" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Statistik */}
      {loading ? (
        <div className="md:col-span-4 flex flex-col justify-center gap-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      ) : selectedProvince ? (
        <>
          {/* Normal */}
          <Card className="bg-green-50 shadow-md rounded-xl p-4 flex flex-col justify-center  items-center text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
            <h4 className="text-green-700 font-semibold text-base mb-1">
              Normal
            </h4>
            <p className="text-green-700 font-extrabold text-3xl">
              {stuntingData.normal}%
            </p>
            <Progress
              value={stuntingData.normal}
              className="h-2 w-full mt-4 rounded"
              indicatorClassName="bg-green-600"
            />
          </Card>

          {/* Risiko */}
          <Card className="bg-yellow-50 shadow-md rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <AlertTriangle className="w-10 h-10 text-yellow-600 mb-2" />
            <h4 className="text-yellow-700 font-semibold text-base mb-1">
              Berisiko
            </h4>
            <p className="text-yellow-700 font-extrabold text-3xl">
              {stuntingData.risk}%
            </p>
            <Progress
              value={stuntingData.risk}
              className="h-2 w-full mt-4 rounded"
              indicatorClassName="bg-yellow-500"
            />
          </Card>

          {/* Stunting */}
          <Card className="bg-red-50 shadow-md rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mb-2" />
            <h4 className="text-red-700 font-semibold text-base mb-1">
              Stunting
            </h4>
            <p className="text-red-700 font-extrabold text-3xl">
              {stuntingData.stunting}%
            </p>
            <Progress
              value={stuntingData.stunting}
              className="h-2 w-full mt-4 rounded"
              indicatorClassName="bg-red-600"
            />
          </Card>

          {/* Total Anak */}
          <Card className="bg-blue-50 shadow-md rounded-xl p-4 flex flex-col justify-center items-center text-center">
            <Users className="w-10 h-10 text-blue-600 mb-2" />
            <h4 className="text-blue-700 font-semibold text-base mb-1">
              Total Anak
            </h4>
            <p className="text-blue-700 font-extrabold text-3xl">
              {stuntingData.totalChildren.toLocaleString()}
            </p>
            <p className="text-blue-600 text-sm mt-1">anak</p>
          </Card>
        </>
      ) : (
        <div className="md:col-span-4 flex items-center justify-center text-gray-500 italic">
          Silakan pilih provinsi untuk melihat data.
        </div>
      )}
    </div>
  );
}
