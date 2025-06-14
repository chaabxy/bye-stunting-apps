"use client";

import { useState, useEffect } from "react";
import { ContactForm } from "@/components/kontak/contact-form";
import { ContactInfoCard } from "@/components/kontak/contact-info";
import { KontakPresenter } from "@/presenter/user/kontak-presenter";
import type { ContactFormData } from "@/model/user/kontak-model";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Kontak() {
  const [formData, setFormData] = useState<ContactFormData>({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const [presenter] = useState(
    () =>
      new KontakPresenter({
        updateFormData: setFormData,
        updateLoading: setLoading,
        updateErrors: setErrors,
      })
  );

  const contactInfo = presenter.getContactInfo();

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    presenter.handleInputChange(field, value);
    // Reset success state when user starts typing
    if (success) setSuccess(false);
  };

  const handleSubmit = async () => {
    setErrors([]);
    setSuccess(false);

    const result = await presenter.handleSubmit();

    // Check if submission was successful
    if (result?.success) {
      setSuccess(true);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">
          Kontak <span className="text-blue-500">Kami</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Tim
          kami siap membantu Anda dalam upaya pencegahan stunting.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="mb-6 max-w-md mx-auto border-green-200 bg-green-50">
          <svg
            className="h-4 w-4 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <AlertDescription className="text-green-800">
            Pesan berhasil dikirim! Tim kami akan merespons dalam 1-2 hari
            kerja.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
        <div className="md:col-span-2 h-full">
          <div className="bg-gray-50 rounded-lg p-6 h-full">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="h-5 w-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-lg font-medium text-blue-500">Kirim Pesan</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Isi formulir di bawah ini dan tim kami akan merespons dalam 1-2
              hari kerja
            </p>
            <ContactForm
              formData={formData}
              loading={loading}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <div className="md:col-span-1 h-full">
          <div className="bg-blue-500 text-white text-center rounded-lg p-6 h-[95%]">
            <h2 className="text-lg font-bold mb-6">Informasi Kontak</h2>
            <ContactInfoCard contactInfo={contactInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
