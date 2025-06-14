"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import type { ContactFormData } from "@/model/user/kontak-model";

interface ContactFormProps {
  formData: ContactFormData;
  loading: boolean;
  onInputChange: (field: keyof ContactFormData, value: string) => void;
  onSubmit: () => void;
}

export function ContactForm({
  formData,
  loading,
  onInputChange,
  onSubmit,
}: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Lengkap
          </label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => onInputChange("nama", e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            placeholder="Masukkan email"
            className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subjek"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Subjek
        </label>
        <Input
          id="subjek"
          value={formData.subjek}
          onChange={(e) => onInputChange("subjek", e.target.value)}
          placeholder="Masukkan subjek pesan"
          className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label
          htmlFor="pesan"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Pesan
        </label>
        <Textarea
          id="pesan"
          value={formData.pesan}
          onChange={(e) => onInputChange("pesan", e.target.value)}
          placeholder="Tulis pesan Anda di sini"
          className="w-full min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
          disabled={loading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-base font-medium"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
