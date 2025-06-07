"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import {
  ContactPresenter,
  type ContactView,
} from "@/presenter/user/kontak-presenter";
import type { ContactFormData } from "@/model/user/kontak-model";
import { ContactForm } from "@/components/kontak/contact-form";
import { ContactInfoCard } from "@/components/kontak/contact-info";
import { LocationMap } from "@/components/kontak/location-maps";
import { useToast } from "@/presenter/hooks/use-toast";

export default function Kontak() {
  const [presenter] = useState(() => new ContactPresenter());
  const [formData, setFormData] = useState<ContactFormData>({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const view: ContactView = {
      showLoading: (loading: boolean) => setLoading(loading),
      showSuccess: (message: string) => {
        toast({
          title: "Berhasil!",
          description: message,
          variant: "default",
        });
      },
      showError: (message: string) => {
        toast({
          title: "Error!",
          description: message,
          variant: "destructive",
        });
      },
      updateFormData: (data: ContactFormData) => setFormData(data),
    };

    presenter.setView(view);
  }, [presenter, toast]);

  const contactInfo = presenter.getContactInfo();

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    presenter.handleInputChange(field, value);
  };

  const handleSubmit = () => {
    presenter.handleSubmit();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 from-blue-600 to-cyan-500 bg-clip-text text-primary">
          Kontak <span className="text-secondary">Kami</span>
        </h1>
        <p className="text-muted-foreground -400 text-sm mx-auto px-5">
          Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Tim
          kami siap membantu Anda dalam upaya pencegahan stunting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Kolom Formulir: mengambil 2 kolom saat layar besar */}
        <Card className="lg:col-span-2 shadow-md border-blue-100 flex flex-col">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-blue-100">
            <CardTitle className="text-primary flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Kirim <span className="text-secondary">Pesan</span>
            </CardTitle>
            <CardDescription>
              Isi formulir di bawah ini dan tim kami akan merespons dalam 1–2
              hari kerja
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white flex-1">
            <ContactForm
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        {/* Kolom Informasi Kontak */}
        <Card className="shadow-md border border-blue-100 overflow-hidden flex flex-col">
          <div className="h-16 lg:h-24 bg-gradient-to-r from-secondary to-cyan-500 relative">
            <div className="absolute inset-0 opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">Informasi Kontak</h3>
            </div>
          </div>
          <div className="flex-1">
            <ContactInfoCard contactInfo={contactInfo} />
          </div>
        </Card>
      </div>

      <div className="px-5 md:px-10">
        <LocationMap />
      </div>
    </div>
  );
}
