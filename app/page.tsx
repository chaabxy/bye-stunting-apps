import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart2, Brain, FileText, PieChart, Shield, CheckCircle, Users } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-blue-100 dark:bg-blue-950 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                SOLUSI TERBAIK
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                Partner Anda dalam
                <br />
                <span className="text-blue-600 dark:text-blue-400">Kesehatan dan Pencegahan Stunting</span>
              </h1>
              <p className="text-gray-700 dark:text-gray-300 md:text-lg">
                Pantau tumbuh kembang anak, dapatkan rekomendasi gizi dan cegah stunting sejak dini dengan dukungan
                prediksi dari AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cek-stunting">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md px-6 py-2 flex items-center gap-2 w-full sm:w-auto">
                    Cek Sekarang <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/edukasi">
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 rounded-md px-6 py-2 w-full sm:w-auto"
                  >
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white dark:border-gray-800"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white dark:border-gray-800"
                  />
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white dark:border-gray-800"
                  />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-blue-600 dark:text-blue-400">150+</span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">pengguna aktif</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-200 dark:bg-blue-800 rounded-full absolute top-0 right-0"></div>
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Ibu dan anak"
                  width={400}
                  height={400}
                  className="relative z-10"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">24%</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Prevalensi Stunting</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Hari Pertama Kehidupan</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">18%</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Target 2025</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">95%</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Akurasi Prediksi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Departemen <span className="text-blue-600 dark:text-blue-400">Layanan</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan untuk membantu Anda memantau dan mencegah stunting pada anak
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Konsultasi</h3>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Pemantauan</h3>
              </CardContent>
            </Card>

            <Card className="bg-blue-600 dark:bg-blue-700 text-white hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-medium">Prediksi AI</h3>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Edukasi</h3>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Nutrisi</h3>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-shadow text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium">Pencegahan</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Doctor Profiles Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Tim <span className="text-blue-600 dark:text-blue-400">Ahli</span> Kami
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Didukung oleh tim ahli kesehatan dan gizi yang berpengalaman dalam penanganan dan pencegahan stunting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-blue-100 dark:bg-blue-900">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Dr. Michael Johnson"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">Dr. Michael Johnson, MD</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Dokter Anak Spesialis Gizi</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Spesialis dalam penanganan masalah gizi dan pertumbuhan anak dengan pengalaman lebih dari 15 tahun.
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-blue-100 dark:bg-blue-900">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Dr. Sarah Williams"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">Dr. Sarah Williams, MD</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Ahli Gizi Klinis</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Ahli dalam perencanaan nutrisi untuk anak dengan fokus pada pencegahan stunting dan malnutrisi.
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-blue-100 dark:bg-blue-900">
                <Image src="/placeholder.svg?height=200&width=300" alt="Dr. David Chen" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">Dr. David Chen, PhD</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Peneliti Kesehatan Anak</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Peneliti dengan fokus pada intervensi berbasis komunitas untuk pencegahan stunting di Indonesia.
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Kenapa <span className="text-blue-600 dark:text-blue-400">Pilih Kami?</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Analisis Risiko Stunting</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Aplikasi ini menyediakan analisis berat dan tinggi badan anak berdasarkan standar WHO untuk
                      mendeteksi risiko stunting secara dini.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Model AI Terintegrasi</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Dilengkapi dengan model machine learning yang dapat memprediksi risiko stunting berdasarkan data
                      pertumbuhan anak dengan tingkat akurasi yang tinggi.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Dilengkapi Edukasi Lengkap</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Menyediakan informasi lengkap tentang gizi dan kesehatan anak yang disusun oleh pakar, membantu
                      orang tua memahami pentingnya nutrisi seimbang.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Integrasi Data Kesehatan</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Terintegrasi dengan data dari Kementerian Kesehatan dan lembaga terkait untuk memberikan informasi
                      yang akurat dan terkini.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/cek-stunting">
                  <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-md px-6 py-2">
                    Cek Sekarang
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-blue-200 dark:bg-blue-800 rounded-full absolute -top-10 -right-10"></div>
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Ibu dan anak"
                width={500}
                height={400}
                className="relative z-10 rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Jangan Biarkan Kesehatan Anak Anda Terabaikan</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Cegah stunting sejak dini dengan pemantauan rutin dan edukasi yang tepat. Mulai langkah pencegahan sekarang
            juga!
          </p>
          <Link href="/cek-stunting">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 rounded-md px-6 py-2">Mulai Sekarang</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
