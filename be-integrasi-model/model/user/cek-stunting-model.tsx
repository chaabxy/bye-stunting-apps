export interface FormData {
  nama: string;
  namaIbu: string;
  tanggalLahir: Date | undefined;
  usia: string;
  jenisKelamin: string;
  beratBadan: string;
  tinggiBadan: string;
  provinsiId: string;
  kabupatenId: string;
  kecamatanId: string;
  desaId: string;
}

export interface FormErrors {
  nama: string;
  namaIbu: string;
  tanggalLahir: string;
  jenisKelamin: string;
  beratBadan: string;
  tinggiBadan: string;
  provinsiId: string;
  kabupatenId: string;
  kecamatanId: string;
  desaId: string;
}

export interface PredictionResult {
  status: "normal" | "stunting" | "stunting berat";
  message: string;
  recommendations: string[];
  score: number;
  recommendedArticles: {
    id: number;
    title: string;
    category: string;
  }[];
}

export interface LocationData {
  id: string;
  name: string;
}

export interface ChartData {
  age: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
  childWeight?: number;
  childHeight?: number;
}

export interface ChildData {
  nama: string;
  namaIbu: string;
  tanggalLahir: Date;
  usia: number;
  jenisKelamin: string;
  beratBadan: number;
  tinggiBadan: number;
  alamat: {
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    desa: string;
  };
}

export interface WHOChartData {
  weightChartData: ChartData[];
  heightChartData: ChartData[];
  weightPercentile: number;
  heightPercentile: number;
}

export class CekStuntingModel {
  private formData: FormData = {
    nama: "",
    namaIbu: "",
    tanggalLahir: undefined,
    usia: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
    provinsiId: "",
    kabupatenId: "",
    kecamatanId: "",
    desaId: "",
  };

  private errors: FormErrors = {
    nama: "",
    namaIbu: "",
    tanggalLahir: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
    provinsiId: "",
    kabupatenId: "",
    kecamatanId: "",
    desaId: "",
  };

  getFormData(): FormData {
    return { ...this.formData };
  }

  getErrors(): FormErrors {
    return { ...this.errors };
  }

  updateFormData(field: keyof FormData, value: any): void {
    this.formData = { ...this.formData, [field]: value };
  }

  updateErrors(field: keyof FormErrors, error: string): void {
    this.errors = { ...this.errors, [field]: error };
  }

  resetForm(): void {
    this.formData = {
      nama: "",
      namaIbu: "",
      tanggalLahir: undefined,
      usia: "",
      jenisKelamin: "",
      beratBadan: "",
      tinggiBadan: "",
      provinsiId: "",
      kabupatenId: "",
      kecamatanId: "",
      desaId: "",
    };
    this.errors = {
      nama: "",
      namaIbu: "",
      tanggalLahir: "",
      jenisKelamin: "",
      beratBadan: "",
      tinggiBadan: "",
      provinsiId: "",
      kabupatenId: "",
      kecamatanId: "",
      desaId: "",
    };
  }

  validateField(
    name: keyof FormData,
    value: string | Date | undefined
  ): boolean {
    let error = "";

    switch (name) {
      case "nama":
      case "namaIbu":
        if (!value || (typeof value === "string" && value.trim().length < 2)) {
          error = `${
            name === "nama" ? "Nama anak" : "Nama ibu"
          } minimal 2 huruf`;
        }
        break;
      case "tanggalLahir":
        if (!value) {
          error = "Tanggal lahir wajib dipilih";
        }
        break;
      case "jenisKelamin":
        if (!value) {
          error = "Jenis kelamin wajib dipilih";
        }
        break;
      case "beratBadan":
        if (
          !value ||
          (typeof value === "string" &&
            (!value.trim() || Number.parseFloat(value) <= 0))
        ) {
          error = "Berat badan wajib diisi dengan nilai yang valid";
        }
        break;
      case "tinggiBadan":
        if (
          !value ||
          (typeof value === "string" &&
            (!value.trim() || Number.parseFloat(value) <= 0))
        ) {
          error = "Tinggi badan wajib diisi dengan nilai yang valid";
        }
        break;
      case "provinsiId":
        if (!value) {
          error = "Provinsi wajib dipilih";
        }
        break;
      case "kabupatenId":
        if (!value) {
          error = "Kabupaten/Kota wajib dipilih";
        }
        break;
      case "kecamatanId":
        if (!value) {
          error = "Kecamatan wajib dipilih";
        }
        break;
      case "desaId":
        if (!value) {
          error = "Desa/Kelurahan wajib dipilih";
        }
        break;
    }

    this.updateErrors(name, error);
    return error === "";
  }

  validateAllFields(): boolean {
    const fields = [
      { name: "nama" as keyof FormData, value: this.formData.nama },
      { name: "namaIbu" as keyof FormData, value: this.formData.namaIbu },
      {
        name: "tanggalLahir" as keyof FormData,
        value: this.formData.tanggalLahir,
      },
      {
        name: "jenisKelamin" as keyof FormData,
        value: this.formData.jenisKelamin,
      },
      { name: "beratBadan" as keyof FormData, value: this.formData.beratBadan },
      {
        name: "tinggiBadan" as keyof FormData,
        value: this.formData.tinggiBadan,
      },
      { name: "provinsiId" as keyof FormData, value: this.formData.provinsiId },
      {
        name: "kabupatenId" as keyof FormData,
        value: this.formData.kabupatenId,
      },
      {
        name: "kecamatanId" as keyof FormData,
        value: this.formData.kecamatanId,
      },
      { name: "desaId" as keyof FormData, value: this.formData.desaId },
    ];

    let isValid = true;
    fields.forEach((field) => {
      const fieldValid = this.validateField(field.name, field.value);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  }
}
