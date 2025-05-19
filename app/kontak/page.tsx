import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function Kontak() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Kontak Kami</h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kirim Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" placeholder="Masukkan nama lengkap" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Masukkan email" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjek">Subjek</Label>
                <Input id="subjek" placeholder="Masukkan subjek pesan" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan</Label>
                <Textarea id="pesan" placeholder="Tulis pesan Anda di sini" rows={5} />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">Kirim Pesan</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Alamat</h3>
                  <p className="text-gray-600 text-sm">
                    Jl. Kesehatan No. 123
                    <br />
                    Jakarta Pusat, 10110
                    <br />
                    Indonesia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Telepon</h3>
                  <p className="text-gray-600 text-sm">
                    +62 123 4567 890
                    <br />
                    Senin - Jumat: 08.00 - 17.00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600 text-sm">
                    info@byestunting.id
                    <br />
                    support@byestunting.id
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
