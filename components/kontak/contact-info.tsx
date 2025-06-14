import { Mail, Phone, Clock, MapPin } from "lucide-react";

interface ContactInfo {
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

interface ContactInfoCardProps {
  contactInfo: ContactInfo;
}

export function ContactInfoCard({ contactInfo }: ContactInfoCardProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <MapPin className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-500 text-lg mb-1">Alamat</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Jl. Otista, Tarogong, Kec. Tarogong Kidul, Kabupaten Garut, Jawa
            Barat 44151
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Phone className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-500 text-lg mb-1">Telepon</h3>
          <p className="text-gray-600 text-sm">+62 8532 331 0772</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Mail className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-500 text-lg mb-1">Email</h3>
          <p className="text-gray-600 text-sm">byestunting@gmail.com</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Clock className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-500 text-lg mb-1">
            Jam Operasional
          </h3>
          <div className="text-gray-600 text-sm space-y-1">
            <p>Senin - Jumat: 08.00 - 17.00</p>
            <p>Sabtu: 09.00 - 14.00</p>
            <p>Minggu: Tutup</p>
          </div>
        </div>
      </div>
    </div>
  );
}
