import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Award,
  Heart,
  BookOpen,
  Target,
  Contact,
  Users,
  NotepadText,
  ArchiveRestore,
} from "lucide-react";

const teamMembers = [
  {
    name: "Adelia Cesar",
    role: "Machine Learning Engineer",
    university: "Universitas Tadulako",
    image: "/adel.jpg?height=200&width=200",
  },
  {
    name: "Olifiana",
    role: "Machine Learning Engineer",
    university: "Universitas Tadulako",
    image: "/olif.jpg?height=200&width=200",
  },
  {
    name: "Hairul",
    role: "Project Manager",
    university: "Universitas Tadulako",
    image: "/hairul.jpg?height=200&width=200",
  },
  {
    name: "Ihsan Nurdin",
    role: "Front-End & Back-End Developer",
    university: "Institut Teknologi Garut",
    image: "/ihsan.jpg?height=200&width=200",
  },
  {
    name: "Cha Cha Nisya Asyah",
    role: "Front-End Developer",
    university: "Institut Teknologi Garut",
    image: "/caca.jpg?height=200&width=200",
  },
  {
    name: "Alya Siti Rahmah",
    role: "Backend Developer",
    university: "Institut Teknologi Garut",
    image: "/alya.jpg?height=200&width=200",
  },
];

export default function TentangKami() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="text-center mb-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-primary from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Tentang <span className="text-secondary">Kami</span>
        </h1>
        <p className="text-muted-foreground -400 text-sm md:text-xl mx-auto">
          ByeStunting adalah platform inovatif yang didedikasikan untuk membantu
          orang tua mencegah stunting pada anak sejak dini.
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-16 shadow-xl h-[160px]">
        {/* Gradient latar belakang */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-500/90 z-10"></div>

        {/* Kotak div pengganti gambar */}
        <div className="absolute inset-0 z-0 bg-blue-200 -900"></div>

        {/* Konten teks */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-4">
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-center">
            Bersama Melawan Stunting
          </h2>
          <p className="text-sm md:text-lg max-w-xl text-center">
            Kami berkomitmen untuk menurunkan angka stunting di Indonesia
            melalui teknologi dan edukasi
          </p>
        </div>
      </div>

      {/* Misi dan Visi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className=" bg-blue-100 -900/50 p-2 rounded-full ">
              <Target className="h-6 w-6 text-secondary -400" />
            </div>
            <h2 className="text-2xl font-bold text-primary -300">
              Misi <span className="text-secondary">Kami</span>
            </h2>
          </div>

          <p className="text-muted-foreground -400 text-sm max-sm:text-justify">
            ByeStunting hadir dengan misi untuk menurunkan angka stunting di
            Indonesia melalui teknologi dan edukasi. Kami berkomitmen untuk
            mendukung program nasional dalam menurunkan angka stunting menjadi
            18% pada akhir tahun 2025.
          </p>

          <div className="flex items-center gap-3 mt-8 mb-4">
            <div className="bg-blue-100 -900/50 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-secondary -400" />
            </div>
            <h2 className=" text-2xl font-bold text-primary -300">
              Apa yang <span className="text-secondary">Kami Lakukan?</span>
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
              <CheckCircle className="mt-1 h-5 w-5 text-secondary -400 flex-shrink-0" />
              <span className="text-gray-700 -300">
                Menyediakan alat prediksi risiko stunting berbasis AI yang
                akurat dan mudah digunakan
              </span>
            </li>
            <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
              <ArchiveRestore className="mt-1 h-5 w-5 text-secondary -400 flex-shrink-0" />
              <span className=" text-gray-700 -300">
                Memberikan rekomendasi edukasi sesuai dengan tingkat persentase
                dari hasil prediksi
              </span>
            </li>
            <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
              <NotepadText className="mt-1 h-5 w-5 text-secondary -400 flex-shrink-0" />
              <span className="text-gray-700 -300">
                Menyediakan konten edukasi berkualitas tentang pencegahan
                stunting dan gizi anak
              </span>
            </li>
            <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
              <Users className="mt-1 h-5 w-5 text-secondary -400 flex-shrink-0" />
              <span className="text-gray-700 -300">
                Membantu orang tua melakukan deteksi sejak dini terhadap
                pertumbuhan anak mereka
              </span>
            </li>
            <li className="flex items-start space-x-3 bg-input -950/30 p-4 rounded-lg">
              <Contact className="h-5 w-5 text-secondary -400 mt-1 flex-shrink-0" />
              <span className="text-gray-700 -300">
                Menyediakan Kontak untuk pertanyaan dan saran yang ingin
                diberikan
              </span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-input from-blue-50 to-cyan-50 -950/30 -950/30 rounded-xl p-6 shadow-md border border-blue-100 -900 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-100 -900/50 p-3 rounded-lg mb-4">
              <Award className="h-8 w-8 text-secondary -400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-primary -300">
              Keunggulan
            </h3>
            <p className="text-muted-foreground -400 text-sm">
              Teknologi AI terdepan untuk prediksi stunting yang akurat dengan
              mengintegrasikan Machine Learning Dalam Pengolahan Data Stunting
            </p>
          </div>

          <div className="bg-input from-blue-50 to-cyan-50 -950/30 -950/30 rounded-xl p-6 shadow-md border border-blue-100 -900 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-100 -900/50 p-3 rounded-lg mb-4">
              <Heart className="h-8 w-8 text-secondary -400" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-primary -300">
              Komitmen
            </h3>
            <p className="text-muted-foreground -400 text-sm">
              Kami mendedikasikan penuh untuk menurunkan angka stunting di
              Indonesia menjadi 18% pada tahun 2025
            </p>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Image
              src="/tentang-kami.png"
              alt="Komitmen ByeStunting"
              width={600}
              height={600}
              className="rounded-lg shadow-md object-cover w-full md:h-[500px] lg:h-[390px]"
            />
          </div>
        </div>
      </div>

      {/* Tim Kami */}
      <div className="mb-16 px-5 -mt-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-primary -300">
            Tim <span className="text-secondary">Kami</span>
          </h2>
          <p className="text-muted-foreground -400 max-w-2xl mx-auto">
            Kenali para profesional berbakat yang berdedikasi untuk mewujudkan
            Indonesia bebas stunting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-100 -900 group"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-transparent opacity-0  transition-opacity duration-300 z-10"></div>
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center relative bg-white -950 mb-5">
                <h3 className="text-xl font-semibold mb-1 text-secondary -300">
                  {member.name}
                </h3>
                <p className="text-primary -400 font-medium mb-1">
                  {member.role}
                </p>
                <p className="text-muted-foreground -400 text-sm">
                  {member.university}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
