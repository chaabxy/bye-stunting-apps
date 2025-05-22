"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { predictStunting } from "@/lib/ml-integration";

interface PredictionResult {
  status: "normal" | "berisiko" | "stunting";
  message: string;
  recommendations: string[];
  score: number;
  recommendedArticles: {
    id: number;
    title: string;
    category: string;
  }[];
}

export default function CekStunting() {
  const [formData, setFormData] = useState({
    nama: "",
    usia: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const predictionResult = await predictStunting({
        nama: formData.nama,
        usia: Number.parseFloat(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
      });

      setResult(predictionResult);
    } catch (error) {
      console.error("Error predicting stunting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Cek Risiko Stunting</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Masukkan data anak Anda untuk memeriksa risiko stunting dan dapatkan
          rekomendasi yang sesuai
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-10">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className=" border-b text-center">
              <CardTitle>Input Data Anak</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Anak</Label>
                    <Input
                      id="nama"
                      name="nama"
                      placeholder="Masukkan nama anak"
                      value={formData.nama}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usia">Usia (bulan)</Label>
                    <Input
                      id="usia"
                      name="usia"
                      type="number"
                      placeholder="Masukkan usia dalam bulan"
                      min="0"
                      max="60"
                      value={formData.usia}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <RadioGroup
                      value={formData.jenisKelamin}
                      onValueChange={(value) =>
                        handleSelectChange("jenisKelamin", value)
                      }
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="laki-laki" id="laki-laki" />
                        <Label htmlFor="laki-laki">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="perempuan" id="perempuan" />
                        <Label htmlFor="perempuan">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
                    <Input
                      id="beratBadan"
                      name="beratBadan"
                      type="number"
                      placeholder="Masukkan berat badan"
                      step="0.1"
                      min="0"
                      value={formData.beratBadan}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
                    <Input
                      id="tinggiBadan"
                      name="tinggiBadan"
                      type="number"
                      placeholder="Masukkan tinggi badan"
                      step="0.1"
                      min="0"
                      value={formData.tinggiBadan}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Cek Status Stunting"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">
                Mengapa Cek Stunting Penting?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">Deteksi Dini:</span> Mengenali
                    tanda-tanda stunting sejak awal memungkinkan intervensi yang
                    lebih efektif.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">
                      Mencegah Dampak Jangka Panjang:
                    </span>{" "}
                    Stunting dapat mempengaruhi perkembangan kognitif dan
                    kesehatan di masa depan.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium">Rekomendasi Tepat:</span>{" "}
                    Dapatkan saran nutrisi dan perawatan yang sesuai dengan
                    kondisi anak Anda.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Cek Stunting"
                  width={300}
                  height={200}
                  className="rounded-lg mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {result && (
        <div className="mt-8">
          <Card>
            <CardHeader
              className={
                result.status === "normal"
                  ? "bg-green-50 dark:bg-green-900/30 border-b border-green-100 dark:border-green-800"
                  : result.status === "berisiko"
                  ? "bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-100 dark:border-yellow-800"
                  : "bg-red-50 dark:bg-red-900/30 border-b border-red-100 dark:border-red-800"
              }
            >
              <CardTitle
                className={
                  result.status === "normal"
                    ? "text-green-700 dark:text-green-400"
                    : result.status === "berisiko"
                    ? "text-yellow-700 dark:text-yellow-400"
                    : "text-red-700 dark:text-red-400"
                }
              >
                {result.status === "normal"
                  ? "Status: Normal"
                  : result.status === "berisiko"
                  ? "Status: Berisiko Stunting"
                  : "Status: Stunting"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Hasil Analisis
                    </h3>
                    <p className="mb-4">{result.message}</p>
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Tingkat Risiko
                        </span>
                        <span
                          className={
                            result.status === "normal"
                              ? "text-green-600 dark:text-green-400"
                              : result.status === "berisiko"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {result.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            result.status === "normal"
                              ? "bg-green-600"
                              : result.status === "berisiko"
                              ? "bg-yellow-500"
                              : "bg-red-600"
                          }`}
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">Rekomendasi:</h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Artikel Rekomendasi
                  </h3>
                  <div className="space-y-3">
                    {result.recommendedArticles.map((article) => (
                      <Link href={`/edukasi/${article.id}`} key={article.id}>
                        <div className="p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600 dark:text-blue-400">
                              {article.title}
                            </h4>
                            <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {article.category}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
