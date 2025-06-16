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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Kontak <span className="text-blue-500">Kami</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami. Tim
          kami siap membantu Anda dalam upaya pencegahan stunting.
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="mb-8 max-w-2xl mx-auto border-green-200 bg-green-50">
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
        <Alert variant="destructive" className="mb-8 max-w-2xl mx-auto">
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-8 h-full">
            <div className="flex items-center gap-3 mb-2">
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Kirim <span className="text-blue-500">Pesan</span>
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
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

        {/* Contact Info Section - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg overflow-hidden h-full">
            <div className="bg-blue-500 text-white text-center py-6">
              <h2 className="text-xl font-semibold">Informasi Kontak</h2>
            </div>
            <div className="p-6">
              <ContactInfoCard contactInfo={contactInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
