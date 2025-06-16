import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export function InfoSection() {
  return (
    <Card className="bg-input from-blue-50 to-cyan-50 border-blue-100 shadow-md h-full">
      <CardHeader>
        <CardTitle className="text-center text-lg text-primary">
          Mengapa Cek Stunting <span className="text-secondary">Penting?</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">Deteksi Dini:</span> Mengenali
              tanda-tanda stunting sejak awal memungkinkan intervensi yang lebih
              efektif.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">
                Mencegah Dampak Jangka Panjang:
              </span>{" "}
              Stunting dapat mempengaruhi perkembangan kognitif dan kesehatan di
              masa depan.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />
            <p className="text-sm">
              <span className="font-medium">Rekomendasi Tepat:</span> Dapatkan
              saran nutrisi dan perawatan yang sesuai dengan kondisi anak Anda.
            </p>
          </div>
        </div>
        <div className="mt-14">
          <Image
            src="/cek-stunting.png"
            alt="Cek Stunting"
            width={300}
            height={200}
            className="rounded-lg mx-auto shadow-md"
          />
        </div>
      </CardContent>
    </Card>
  );
}
