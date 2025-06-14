export interface ContactFormData {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
}

export interface ContactInfo {
  alamat: string;
  telepon: string;
  email: string;
  jamOperasional: {
    senin_jumat: string;
    sabtu: string;
    minggu: string;
  };
}

export class ContactModel {
  private formData: ContactFormData = {
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  };

  private contactInfo: ContactInfo = {
    alamat:
      "Jl. Otista, Tarogong, Kec. Tarogong Kidul, Kabupaten Garut, Jawa Barat 44151",
    telepon: "+62 8532 331 0772",
    email: "byestunting@gmail.com",
    jamOperasional: {
      senin_jumat: "Senin - Jumat: 08.00 - 17.00",
      sabtu: "Sabtu: 09.00 - 14.00",
      minggu: "Minggu: Tutup",
    },
  };

  getFormData(): ContactFormData {
    return { ...this.formData };
  }

  setFormData(data: Partial<ContactFormData>): void {
    this.formData = { ...this.formData, ...data };
  }

  getContactInfo(): ContactInfo {
    return { ...this.contactInfo };
  }

  validateForm(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.formData.nama.trim()) {
      errors.push("Nama lengkap harus diisi");
    }

    if (!this.formData.email.trim()) {
      errors.push("Email harus diisi");
    } else if (!/\S+@\S+\.\S+/.test(this.formData.email)) {
      errors.push("Format email tidak valid");
    }

    if (!this.formData.subjek.trim()) {
      errors.push("Subjek harus diisi");
    }

    if (!this.formData.pesan.trim()) {
      errors.push("Pesan harus diisi");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  resetForm(): void {
    this.formData = {
      nama: "",
      email: "",
      subjek: "",
      pesan: "",
    };
  }
}
