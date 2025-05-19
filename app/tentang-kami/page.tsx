import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

const teamMembers = [
  {
    name: "Adelia Cesar",
    role: "Machine Learning Engineer",
    university: "Universitas Tadulako",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Olifiana",
    role: "Machine Learning Engineer",
    university: "Universitas Tadulako",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Hairul",
    role: "Project Manager",
    university: "Universitas Tadulako",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Ihsan Nurdin",
    role: "Frontend Developer",
    university: "Institut Teknologi Garut",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Cha Cha Nisya Asyah",
    role: "Backend Developer",
    university: "Institut Teknologi Garut",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Alya Siti Rahmah",
    role: "Frontend Developer",
    university: "Institut Teknologi Garut",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function TentangKami() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Tentang Kami</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        ByeStunting adalah platform inovatif yang didedikasikan untuk membantu orang tua mencegah stunting pada anak
        sejak dini.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Misi Kami</h2>
          <p className="text-gray-600">
            ByeStunting hadir dengan misi untuk menurunkan angka stunting di Indonesia melalui teknologi dan edukasi.
            Kami berkomitmen untuk mendukung program nasional dalam menurunkan angka stunting menjadi 18% pada akhir
            tahun 2025.
          </p>

          <h2 className="text-2xl font-bold">Apa yang Kami Lakukan</h2>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Menyediakan alat prediksi risiko stunting berbasis AI yang akurat dan mudah digunakan
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Memberikan rekomendasi nutrisi dan pola asuh yang sesuai dengan kondisi anak
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Menyediakan konten edukasi berkualitas tentang pencegahan stunting dan gizi anak
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">Membantu orang tua memantau pertumbuhan anak secara berkala</span>
            </li>
          </ul>
        </div>

        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=600" alt="Tim ByeStunting" fill className="object-cover" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">Tim Kami</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64 w-full">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-1">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.university}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
