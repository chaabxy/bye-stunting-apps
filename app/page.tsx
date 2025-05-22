import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Brain,
  BookOpen,
  ChartSpline,
  Notebook,
  EarthLock,
  ArrowRight,
} from "lucide-react";
import DataChart from "@/components/data-chart";
import EducationCard from "@/components/education-card";
import CampaignCard from "@/components/campaign-card";
import {
  fetchStuntingByAge,
  fetchStuntingByProvince,
  fetchPopularEducation,
} from "@/lib/api";

export default async function Home() {
  // Mengambil data dari API
  const stuntingByAge = await fetchStuntingByAge();
  const stuntingByProvince = await fetchStuntingByProvince();
  const popularEducation = await fetchPopularEducation();

  return (
    <div className="min-h-screen flex flex-col ">
      {/* Hero Section */}
      <section className="bg-background h-screen w-full flex items-center justify-center -mt-16">
        <div className="w-full max-w-screen-xl px-4 md:px-8">
          <div className="bg-foreground rounded-xl p-8 md:p-12 shadow-md h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Kiri: Teks */}
              <div className="space-y-7">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Kawan Cerdas Bunda, Cegah Stunting Sejak Dini.
                </h1>
                <p className="text-gray-700">
                  Periksa tumbuh kembang anak, dapatkan rekomendasi gizi, dan
                  cegah stunting sejak dini dengan dilengkapi prediksi dari AI.
                </p>
                <div className="flex gap-4">
                  <button className="bg-[#317BC4] text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-[#1f5b94] transition flex items-center gap-2">
                    Cek Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-xl border shadow hover:bg-gray-100 transition">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>

              {/* Kanan: Gambar */}
              <div className="flex justify-center">
                <img
                  src="/Hero.png"
                  alt="Ibu dan Anak"
                  className="max-w-md w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-12">
        <div className="container px-4 md:px-5 ">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-5 mr-10">
            {/* Konten utama (span 3 kolom) */}
            <div className="lg:col-span-3 space-y-6 px-10">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Data Stunting <span className="text-[#317BC4]">Nasional</span>
                </h2>
                <h3 className="text-xs font-medium text-gray-400 font-poppins">
                  Data ini diambil dari Data Resmi Stunting Nasional
                </h3>
              </div>

              <div className="flex flex-col lg:flex-row gap-6 bg-foreground p-6 rounded-lg shadow">
                <DataChart
                  title="Prevalensi Stunting Berdasarkan Umur"
                  data={stuntingByAge}
                  type="age"
                />
                <DataChart
                  title="Prevalensi Stunting 5 Provinsi Tertinggi"
                  data={stuntingByProvince}
                  type="province"
                />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Edukasi <span className="text-[#317BC4]">Populer</span>
                </h2>
                <h3 className="text-xs font-medium text-gray-400 font-poppins">
                  Edukasi yang populer dikunjungi pengguna
                </h3>
              </div>
              <div className="bg-foreground p-6 rounded-lg shadow h-fit space-y-4">
                {popularEducation.map((item) => (
                  <EducationCard
                    key={item.id}
                    title={item.title}
                    id={item.id}
                  />
                ))}
                <Link href="/edukasi">
                  <Button className="bg-[#317BC4] hover:bg-[#2A6CB0] text-white w-full font-poppins mt-2">
                    Lihat Semua Artikel
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Campaign Section */}
        <div className="pt-8 items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins text-center">
            Kenapa <span className="text-[#317BC4]">Memilih</span> Kami ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-20">
            <div className="ml-auto">
              <CampaignCard
                title="Analisis Risiko Stunting"
                description="Aplikasi ini membantu orang tua mendeteksi sejak dini apakah anak berisiko mengalami stunting dengan membandingkan data pertumbuhan anak terhadap standar WHO. Deteksi ini penting sebagai langkah awal pencegahan."
                icon={Calculator}
              />
            </div>

            {/* 2 */}
            <CampaignCard
              title="Model AI Terintegrasi"
              description="Sistem prediksi risiko stunting kami didukung oleh machine learning yang telah dilatih dengan data antropometri anak. Teknologi ini memungkinkan analisis yang lebih cepat, akurat, dan personal untuk tiap anak tanpa harus menunggu konsultasi langsung."
              icon={Brain}
            />

            {/* 3 - geser ke kiri */}
            <div className="mr-auto">
              <CampaignCard
                title="Dilengkapi Edukasi Lengkap"
                description="ByeStunting menyajikan artikel dan video edukatif yang bersumber dari lembaga resmi seperti Kementerian Kesehatan RI dan beberapa edukasi di youtube yang disusun agar mudah dipahami oleh semua kalangan orang tua."
                icon={BookOpen}
              />
            </div>

            {/* 4 - geser ke kanan */}
            <div className="ml-auto">
              <CampaignCard
                title="Grafik Hasil Prediksi Anak"
                description="Aplikasi akan menampilkan grafik visual hasil prediksi anak berdasarkan data yang dimasukkan, kemudian dibandingkan dengan kurva pertumbuhan WHO. Hal ini membantu orang tua memahami apakah anak tumbuh dalam jalur sehat atau perlu perhatian khusus."
                icon={ChartSpline}
              />
            </div>

            {/* 5 */}
            <CampaignCard
              title="Laporan & Rekomendasi"
              description="Setiap hasil prediksi disertai laporan yang dapat diunduh dalam format PDF. Laporan ini dilengkapi dengan status gizi anak, interpretasi hasil, serta rekomendasi tindak lanjut sebagai panduan bagi orang tua untuk menjaga pertumbuhan anak secara optimal."
              icon={Notebook}
            />

            {/* 6 - geser ke kiri */}
            <div className="mr-auto">
              <CampaignCard
                title="Privasi Data Terjamin"
                description="Data anak yang dimasukkan ke dalam sistem kami dijaga dengan baik. ByeStunting berkomitmen untuk menjaga privasi dan kerahasiaan informasi setiap pengguna dan tidak disalahgunakan."
                icon={EarthLock}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-10 mt-10 mb-20">
          {/* Kiri: Teks dan Tombol */}
          <div className="bg-[#D7EBFC] rounded-2xl p-6 md:p-5 shadow-md w-full md:w-[40%] relative mr-20 mt-20">
            <div className="text-left space-y-6">
              <h3 className="text-xl md:text-xl font-bold text-black font-poppins mb-3">
                CEK STATUS <span className="font-extrabold">STUNTING</span> ANAK
                ANDA?
              </h3>
              <Link href="/cek-stunting">
                <button className="bg-[#317BC4] hover:bg-[#2A6CB0] text-white font-bold rounded-md px-6 py-2 font-poppins text-sm shadow">
                  MARI CEK
                </button>
              </Link>
            </div>
          </div>

          {/* Kanan: Gambar dengan posisi relatif */}
          <div className="absolute w-[250px] h-[250px] ml-[20rem] mt-5">
            <Image
              src="/cek.png"
              alt="Cek Stunting"
              fill
              className="object-contain relative"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
