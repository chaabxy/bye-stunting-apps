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
    <div className="space-y-6 h-fit text-left">
      <div className="flex items-start gap-3 mt-5">
        <MapPin className="h-5 w-5 flex-shrink-0 text-white" />
        <div>
          <h3 className="font-medium text-white">Alamat</h3>
          <p className="text-sm text-blue-100 mt-1">{contactInfo.alamat}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Phone className="h-5 w-5 flex-shrink-0 text-white" />
        <div>
          <h3 className="font-medium text-white">Telepon</h3>
          <p className="text-sm text-blue-100 mt-1">{contactInfo.telepon}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="h-5 w-5 flex-shrink-0 text-white" />
        <div>
          <h3 className="font-medium text-white">Email</h3>
          <p className="text-sm text-blue-100 mt-1">{contactInfo.email}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="h-5 w-5 flex-shrink-0 text-white" />
        <div>
          <h3 className="font-medium text-white">Jam Operasional</h3>
          <div className="text-sm text-blue-100 mt-1">
            <p className="mb-2">Senin : 08:00 - 21.00 WIB</p>
            <p  className="mb-2">
              Sabtu : 08:00 - 13.00 WIB
            </p>
            <p className="mb-2">Minggu : 08:00 - 10.00 WIB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
