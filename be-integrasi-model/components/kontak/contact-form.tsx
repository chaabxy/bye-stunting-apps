"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            id="nama"
            value={formData.nama}
            onChange={(e) => onInputChange("nama", e.target.value)}
            placeholder="Masukkan nama lengkap"
            className="border-blue-200 focus:border-blue-400"
            disabled={loading}
          />
        </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          placeholder="Masukkan email"
          className="border-blue-200 focus:border-blue-400"
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subjek">Subjek</Label>
        <Input
          id="subjek"
          value={formData.subjek}
          onChange={(e) => onInputChange("subjek", e.target.value)}
          placeholder="Masukkan subjek pesan"
          className="border-blue-200 focus:border-blue-400"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pesan">Pesan</Label>
        <Textarea
          id="pesan"
          value={formData.pesan}
          onChange={(e) => onInputChange("pesan", e.target.value)}
          placeholder="Tulis pesan Anda di sini"
          rows={5}
          className="bg-input border-blue-200 focus:border-blue-400 resize-none"
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-secondary from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all"
        disabled={loading}
      >
        <Send className="h-4 w-4 mr-2" />
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}
