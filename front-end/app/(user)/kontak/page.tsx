import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from "lucide-react";

export default function Kontak() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-primary from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Kontak <span className="text-secondary">Kami</span>
        </h1>
        <p className="text-muted-foreground -400 text-sm mx-auto px-5">
          Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Tim
          kami siap membantu Anda dalam upaya pencegahan stunting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-md border-blue-100 -900">
          <CardHeader className="bg-input from-blue-50 to-cyan-50 -950/50 -950/50 border-b border-blue-100 -900">
            <CardTitle className=" text-primary -300 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Kirim{" "}
              <span className="text-secondary">Pesan</span>
            </CardTitle>
            <CardDescription>
              Isi formulir di bawah ini dan tim kami akan merespons dalam 1-2
              hari kerja
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    placeholder="Masukkan nama lengkap"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subjek">Subjek</Label>
                <Input
                  id="subjek"
                  placeholder="Masukkan subjek pesan"
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan</Label>
                <Textarea
                  id="pesan"
                  placeholder="Tulis pesan Anda di sini"
                  rows={5}
                  className="bg-input border-blue-200 focus:border-blue-400 resize-none"
                />
              </div>

              <Button className=" w-full bg-secondary from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all">
                <Send className="h-4 w-4 mr-2" /> Kirim Pesan
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-md border-blue-100 -900 overflow-hidden ">
            <div className="h-16 lg:h-24 bg-secondary from-secondary to-cyan-500 relative">
              <div className="absolute inset-0 opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">
                  Informasi Kontak
                </h3>
              </div>
            </div>
            <CardContent className="p-6 space-y-6 mb-10 bg-input">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 -900/50 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-secondary -400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-secondary -300">
                    Alamat
                  </h3>
                  <p className="text-muted-foreground -400 text-sm">
                    Jl. Otista, Tarogong, Kec. Tarogong Kidul, Kabupaten Garut,
                    Jawa Barat 44151
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 -900/50 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-secondary -400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-secondary -300">
                    Telepon
                  </h3>
                  <p className="text-muted-foreground -400 text-sm">
                    +62 8532 331 0772
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 -900/50 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-secondary -400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-secondary -300">
                    Email
                  </h3>
                  <p className="text-muted-foreground -400 text-sm">
                    byestunting@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 -900/50 p-3 rounded-full">
                  <Clock className="h-5 w-5 text-secondary -400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-secondary -300">
                    Jam Operasional
                  </h3>
                  <p className="text-muted-foreground -400 text-sm">
                    Senin - Jumat: 08.00 - 17.00
                    <br />
                    Sabtu: 09.00 - 14.00
                    <br />
                    Minggu: Tutup
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary -300 mb-4 text-center">
          Lokasi <span className="text-secondary">Kami</span>
        </h1>
        <p className="text-muted-foreground -400 text-sm md:text-lg text-center mx-auto px-5 mb-10">
          Kunjungi lokasi kami untuk mengetahui lebih lanjut tentang upaya
          pencegahan stunting yang kami lakukan.
        </p>
        <div className="rounded-lg overflow-hidden shadow-md border border-blue-100 -900">
          <iframe
          src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3958.405019954178!2d107.88682700000001!3d-7.194542999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMTEnNDAuNCJTIDEwN8KwNTMnMTIuNiJF!5e0!3m2!1sid!2sid!4v1748594030096!5m2!1sid!2sid"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi ByeStunting"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
