import Image from "next/image";
import Link from "next/link";
import {
  Calculator,
  Brain,
  BookOpen,
  BarChartIcon as ChartSpline,
  Notebook,
  EarthLock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DataChart from "@/components/home/data-chart";
import CampaignCard from "@/components/home/campaign-card";
import EducationCard from "@/components/home/education-card";
import type { HomeData } from "@/model/user/home-model";

interface HomeViewProps {
  data: HomeData;
}

export default function HomeView({ data }: HomeViewProps) {
  console.log("=== HOME VIEW RENDER ===");
  console.log("Popular education data:", data.popularEducation);
  console.log("Popular education count:", data.popularEducation?.length || 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section>
        <div className="bg-background w-full max-w-screen-2xl mx-auto flex items-center justify-center md:-mt-16  h-[600px] md:h-[470px] lg:min-h-screen">
          <div className="w-full max-w-screen-2xl px-4 md:px-8">
            <div className="bg-white/20 rounded-lg p-6 md:p-8 shadow-md ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                {/* Teks */}
                <div className="order-2 md:order-1 space-y-4 md:space-y-7">
                  <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-text max-sm:text-center">
                    Kawan Cerdas Bunda,
                    <span className="block mt-2">
                      Cegah Stunting Sejak Dini.
                    </span>
                  </h1>
                  <p className="text-sm md:text-md text-text">
                    Periksa tumbuh kembang anak, dapatkan rekomendasi gizi, dan
                    cegah stunting sejak dini dengan dilengkapi prediksi dari
                    AI.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Link href="/cek-stunting">
                      <button className="text-md md:text-xs lg:text-lg bg-secondary text-white font-semibold px-4 py-2 rounded-xl border shadow hover:bg-[#1f5b94] transition flex items-center justify-center gap-2 w-full sm:w-auto">
                        Cek Sekarang
                        <ChevronRight className="w-6 h-6 md:w-4 md:h-4 lg:w-6 lg:h-6" />
                      </button>
                    </Link>
                    <Link href="/tentang-kami">
                      <button className="text-md md:text-xs lg:text-lg bg-white text-text font-semibold px-4 py-2 rounded-xl border shadow hover:bg-gray-100 transition w-full sm:w-auto">
                        Pelajari Lebih Lanjut
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Gambar */}
                <div className="order-1 md:order-2 flex justify-center">
                  <img
                    src="/Hero.png"
                    alt="Ibu dan Anak"
                    className="max-w-[200px] md:max-w-md w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow py-8 md:py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:px-5 lg:mr-10">
            {/* Konten utama */}
            <div className="lg:col-span-3 space-y-6 lg:px-10">
              <div className="space-y-2 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-text font-poppins">
                  Data Stunting <span className="text-secondary">Nasional</span>
                </h2>
                <h3 className="text-xs font-medium text-muted-foreground font-poppins">
                  Data ini diambil dari Data Resmi Stunting Nasional
                </h3>
              </div>
              <div className="gap-6 bg-card p-4 md:p-6 rounded-lg shadow">
                <div className="h-[500px]">
                  <DataChart
                    title="Stunting Berdasarkan Provinsi"
                    data={data.stuntingByProvince || []}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl md:text-2xl font-bold text-text font-poppins">
                  Edukasi <span className="text-secondary">Populer</span>
                </h2>
                <h3 className="text-xs font-medium text-muted-foreground font-poppins ">
                  Edukasi yang populer dikunjungi pengguna
                </h3>
              </div>
              <div className="bg-card p-4 md:p-6 rounded-lg shadow h-[550px] flex flex-col ">
                <div className="flex-1 space-y-4">
                  {data.popularEducation && data.popularEducation.length > 0 ? (
                    <>
                      {data.popularEducation.map((item, index) => (
                        <EducationCard
                          key={item.id || index}
                          title={item.title}
                          id={item.id}
                          slug={item.slug}
                          viewCount={item.views}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm ">
                        Belum ada artikel edukasi tersedia
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        Debug:{" "}
                        {data.popularEducation
                          ? `Array kosong (${data.popularEducation.length})`
                          : "Data null/undefined"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 border-t">
                  <Link href="/edukasi">
                    <Button className="bg-secondary hover:bg-[#2A6CB0] text-white w-full font-poppins rounded-xl">
                      Lihat Semua Artikel
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Campaign Section - Zigzag Layout untuk Mobile/Tablet */}
        <div className="pt-8 px-4 md:px-8 lg:px-20 max-w-screen-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-text mb-6 font-poppins text-center">
            Kenapa <span className="text-secondary">Memilih</span> Kami ?
          </h2>

          {/* Desktop Layout (3 kolom sejajar) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <CampaignCard
              title="Analisis Risiko Stunting"
              description="Aplikasi ini membantu orang tua mendeteksi sejak dini apakah anak berisiko mengalami stunting dengan membandingkan data pertumbuhan anak terhadap standar WHO. Deteksi ini penting sebagai langkah awal pencegahan."
              icon={Calculator}
            />
            <CampaignCard
              title="Model AI Terintegrasi"
              description="Sistem prediksi risiko stunting kami didukung oleh machine learning yang telah dilatih dengan data antropometri anak. Teknologi ini memungkinkan analisis yang lebih cepat, akurat, dan personal untuk tiap anak tanpa harus menunggu konsultasi langsung."
              icon={Brain}
            />
            <CampaignCard
              title="Dilengkapi Edukasi Lengkap"
              description="ByeStunting menyajikan artikel dan video edukatif yang bersumber dari lembaga resmi seperti Kementerian Kesehatan RI dan beberapa edukasi di youtube yang disusun agar mudah dipahami oleh semua kalangan orang tua."
              icon={BookOpen}
            />
            <CampaignCard
              title="Grafik Hasil Prediksi Anak"
              description="Aplikasi akan menampilkan grafik visual hasil prediksi anak berdasarkan data yang dimasukkan, kemudian dibandingkan dengan kurva pertumbuhan WHO. Hal ini membantu orang tua memahami apakah anak tumbuh dalam jalur sehat atau perlu perhatian khusus."
              icon={ChartSpline}
            />
            <CampaignCard
              title="Laporan & Rekomendasi"
              description="Setiap hasil prediksi disertai laporan yang dapat diunduh dalam format PDF. Laporan ini dilengkapi dengan status gizi anak, interpretasi hasil, serta rekomendasi tindak lanjut sebagai panduan bagi orang tua untuk menjaga pertumbuhan anak secara optimal."
              icon={Notebook}
            />
            <CampaignCard
              title="Privasi Data Terjamin"
              description="Data anak yang dimasukkan ke dalam sistem kami dijaga dengan baik. ByeStunting berkomitmen untuk menjaga privasi dan kerahasiaan informasi setiap pengguna dan tidak disalahgunakan."
              icon={EarthLock}
            />
          </div>
        </div>

        {/* CTA Section - Responsive */}
        <div className="mt-10 mb-10 px-4 md:px-8 max-w-screen-xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex relative flex-row items-center justify-center gap-10">
            <div className="bg-card rounded-2xl p-6 md:p-5 shadow-md w-full md:w-[40%] relative mr-20 mt-20">
              <div className="text-left space-y-6">
                <h3 className="text-xl md:text-xl font-bold text-text font-poppins mb-3">
                  CEK STATUS <span className="font-extrabold">STUNTING</span>{" "}
                  ANAK ANDA?
                </h3>
                <Link href="/cek-stunting">
                  <button className="bg-secondary hover:bg-[#2A6CB0] text-white font-bold rounded-xl px-6 py-2 font-poppins text-sm shadow">
                    MARI CEK
                  </button>
                </Link>
              </div>
            </div>
            <div className="absolute w-[250px] h-[250px] ml-[20rem] mt-5">
              <Image
                src="/cek.png"
                alt="Cek Stunting"
                fill
                className="object-contain relative"
              />
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            <div className="bg-foreground rounded-2xl p-6 shadow-md mx-auto max-w-md relative overflow-hidden">
              <div className="text-center space-y-4 relative z-10">
                <h3 className="text-xl font-bold text-text font-poppins mr-10 mb-2">
                  CEK STATUS <span className="font-extrabold">STUNTING</span>{" "}
                  ANAK ANDA?
                </h3>
                <Link href="/cek-stunting">
                  <button className="bg-secondary hover:bg-[#2A6CB0] text-white font-bold rounded-md px-6 py-3 font-poppins text-sm shadow w-full">
                    MARI CEK
                  </button>
                </Link>
              </div>
              {/* Background Image untuk Mobile */}
              <div className="absolute right-0 top-2 w-24 h-24 z-10">
                <Image
                  src="/cek.png"
                  alt="Cek Stunting"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
