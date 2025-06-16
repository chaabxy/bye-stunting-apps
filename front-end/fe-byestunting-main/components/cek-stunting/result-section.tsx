"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Share2, Users } from "lucide-react";
import { cn } from "@/presenter/lib/utils";
import type { PredictionResult } from "@/model/user/cek-stunting-model";

interface ResultSectionProps {
  result: PredictionResult;
  onBackToForm: () => void;
  onShareWhatsApp: () => void;
}

export function ResultSection({
  result,
  onBackToForm,
  onShareWhatsApp,
}: ResultSectionProps) {
  return (
    <Card className="shadow-lg border-blue-100 overflow-hidden">
      <CardHeader
        className={cn(
          "border-b",
          result.status === "normal"
            ? "bg-input from-green-50 to-green-100 border-green-100"
            : "bg-input from-red-50 to-red-100 border-red-100"
        )}
      >
        <CardTitle
          className={
            result.status === "normal" ? "text-green-700" : "text-red-700"
          }
        >
          ✅ Status:{" "}
          {result.status === "normal"
            ? "Normal"
            : result.status === "stunting berat"
            ? "Stunting Berat"
            : "Stunting"}
        </CardTitle>
        <CardDescription>
          Hasil analisis berdasarkan data yang Anda masukkan
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-secondary">
                Hasil Analisis
              </h3>
              <p className="mb-4">{result.message}</p>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Tingkat Risiko</span>
                  <span
                    className={
                      result.status === "normal"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {result.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      result.status === "normal" ? "bg-green-600" : "bg-red-600"
                    }`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Saran Tindakan dari Database */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    Saran Tindakan untuk Orang Tua
                  </h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {result.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {/* Rekomendasi dari Database */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 text-secondary">
                    Rekomendasi :
                  </h3>
                  <ul className="space-y-2 border border-gray-200 rounded-md p-1">
                    {result.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 bg-white p-3 rounded-md"
                      >
                        <span className="h-5 w-5 flex items-center justify-center font-semibold text-text mt-0.5 flex-shrink-0">
                          {index + 1}.
                        </span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-secondary ">
              Artikel Rekomendasi
            </h3>
            <div className="space-y-5">
              {result.recommendedArticles &&
              result.recommendedArticles.length > 0 ? (
                (() => {
                  console.log(
                    "Recommended articles:",
                    result.recommendedArticles
                  );
                  return result.recommendedArticles.map((article) => (
                    <Link
                      href={`/edukasi/${
                        article.slug ? article.slug : article.id
                      }`}
                      key={article.id}
                    >
                      <div className=" p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer shadow-sm hover:shadow-md mb-3 bg-input">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-text">
                            {article.title}
                          </h4>
                          <ArrowRight className="h-6 w-6 text-secondary" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {article.category}
                        </p>
                      </div>
                    </Link>
                  ));
                })()
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm">
                    Tidak ada artikel rekomendasi tersedia
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t border-gray-100 p-4 flex flex-wrap gap-2 justify-center mb-5">
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToForm}
          className="bg-secondary border-blue-200 text-white hover:bg-blue-50"
        >
          Kembali ke Form
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("🔍 Share WhatsApp button clicked");
            try {
              onShareWhatsApp();
            } catch (error) {
              console.error("❌ Error calling onShareWhatsApp:", error);
              alert(
                "Terjadi kesalahan saat membagikan ke WhatsApp. Silakan coba lagi."
              );
            }
          }}
          className="bg-green-500 border-green-200 text-white hover:bg-green-50"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Bagikan via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ResultSection;
