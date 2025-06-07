import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import type { ContactInfo } from "@/model/user/kontak-model";

interface ContactInfoProps {
  contactInfo: ContactInfo;
}

export function ContactInfoCard({ contactInfo }: ContactInfoProps) {
  return (
    <Card className="shadow-md border border-blue-100 overflow-hidden h-full">
      <CardContent className="p-6 space-y-6 mb-10 bg-white h-[90%]">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <MapPin className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-secondary">Alamat</h3>
            <p className="text-gray-600 text-sm">{contactInfo.alamat}</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 -900/50 p-3 rounded-full">
            <Phone className="h-5 w-5 text-secondary -400" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-secondary -300">Telepon</h3>
            <p className="text-muted-foreground -400 text-sm">
              {contactInfo.telepon}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-blue-100 -900/50 p-3 rounded-full">
            <Mail className="h-5 w-5 text-secondary -400" />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-secondary -300">Email</h3>
            <p className="text-muted-foreground -400 text-sm">
              {contactInfo.email}
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
              {contactInfo.jamOperasional.senin_jumat}
              <br />
              {contactInfo.jamOperasional.sabtu}
              <br />
              {contactInfo.jamOperasional.minggu}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
