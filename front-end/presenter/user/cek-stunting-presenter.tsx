"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { differenceInMonths } from "date-fns";
import {
  CekStuntingModel,
  type FormData,
  type FormErrors,
  type PredictionResult,
  type LocationData,
  type ChartData,
} from "@/model/user/cek-stunting-model";
import { predictStunting } from "@/presenter/lib/ml-integration";
import {
  fetchProvinces,
  fetchRegencies,
  fetchDistricts,
  fetchVillages,
} from "@/presenter/lib/location-data";
import {
  getWeightForAgeData,
  getHeightForAgeData,
} from "@/presenter/lib/who-chart-data";
import { shareViaWhatsApp } from "@/presenter/lib/laporan-wa";

export class CekStuntingPresenter {
  private model: CekStuntingModel;
  private setFormData: (data: FormData) => void;
  private setErrors: (errors: FormErrors) => void;
  private setResult: (result: PredictionResult | null) => void;
  private setIsLoading: (loading: boolean) => void;
  private setActiveTab: (tab: string) => void;
  private setProvinsis: (data: LocationData[]) => void;
  private setKabupatens: (data: LocationData[]) => void;
  private setKecamatans: (data: LocationData[]) => void;
  private setDesas: (data: LocationData[]) => void;
  private setChartData: (data: ChartData[]) => void;
  private setHeightChartData: (data: ChartData[]) => void;
  private setWeightPercentile: (percentile: number) => void;
  private setHeightPercentile: (percentile: number) => void;
  // perubahan Caca: Simpan data chart untuk keperluan save ke database
  private chartData: ChartData[] = [];
  private heightChartData: ChartData[] = [];
  private weightPercentile = 0;
  private heightPercentile = 0;
  private weightStatus = "";
  private heightStatus = "";
  // perubahan Caca: Simpan data lokasi untuk keperluan save ke database
  private provinsis: LocationData[] = [];
  private kabupatens: LocationData[] = [];
  private kecamatans: LocationData[] = [];
  private desas: LocationData[] = [];

  constructor(
    model: CekStuntingModel,
    setters: {
      setFormData: (data: FormData) => void;
      setErrors: (errors: FormErrors) => void;
      setResult: (result: PredictionResult | null) => void;
      setIsLoading: (loading: boolean) => void;
      setActiveTab: (tab: string) => void;
      setProvinsis: (data: LocationData[]) => void;
      setKabupatens: (data: LocationData[]) => void;
      setKecamatans: (data: LocationData[]) => void;
      setDesas: (data: LocationData[]) => void;
      setChartData: (data: ChartData[]) => void;
      setHeightChartData: (data: ChartData[]) => void;
      setWeightPercentile: (percentile: number) => void;
      setHeightPercentile: (percentile: number) => void;
    }
  ) {
    this.model = model;
    this.setFormData = setters.setFormData;
    this.setErrors = setters.setErrors;
    this.setResult = setters.setResult;
    this.setIsLoading = setters.setIsLoading;
    this.setActiveTab = setters.setActiveTab;
    this.setProvinsis = setters.setProvinsis;
    this.setKabupatens = setters.setKabupatens;
    this.setKecamatans = setters.setKecamatans;
    this.setDesas = setters.setDesas;
    this.setChartData = setters.setChartData;
    this.setHeightChartData = setters.setHeightChartData;
    this.setWeightPercentile = setters.setWeightPercentile;
    this.setHeightPercentile = setters.setHeightPercentile;
  }

  calculateAgeInMonths(birthDate: Date): number {
    return differenceInMonths(new Date(), birthDate);
  }

  isValidAge(ageInMonths: number): boolean {
    return ageInMonths >= 0 && ageInMonths <= 60;
  }

  // Fungsi untuk menghitung percentile berdasarkan WHO data
  private calculatePercentile(value: number, whoData: any): number {
    if (value <= whoData.p3) return 3;
    if (value <= whoData.p15) return 15;
    if (value <= whoData.p50) return 50;
    if (value <= whoData.p85) return 85;
    if (value <= whoData.p97) return 97;
    return 99;
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.model.updateFormData(name as keyof FormData, value);
    this.setFormData(this.model.getFormData());

    setTimeout(() => {
      this.model.validateField(name as keyof FormData, value);
      this.setErrors(this.model.getErrors());
    }, 300);
  };

  handleSelectChange = (name: string, value: string) => {
    this.model.updateFormData(name as keyof FormData, value);
    this.setFormData(this.model.getFormData());

    setTimeout(() => {
      this.model.validateField(name as keyof FormData, value);
      this.setErrors(this.model.getErrors());
    }, 100);
  };

  handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date selected:", date);
        return;
      }

      const ageInMonths = this.calculateAgeInMonths(date);

      if (ageInMonths > 60) {
        this.model.updateErrors(
          "tanggalLahir",
          "Usia maksimal 60 bulan (5 tahun)"
        );
        this.setErrors(this.model.getErrors());
        return;
      }

      if (ageInMonths < 0) {
        this.model.updateErrors(
          "tanggalLahir",
          "Tanggal lahir tidak boleh di masa depan"
        );
        this.setErrors(this.model.getErrors());
        return;
      }

      // Clear any previous errors
      this.model.updateErrors("tanggalLahir", "");

      // Update the form data with valid date
      this.model.updateFormData("tanggalLahir", date);
      this.model.updateFormData("usia", ageInMonths.toString());

      this.setFormData(this.model.getFormData());
      this.setErrors(this.model.getErrors());
    } else {
      // Handle case when date is cleared
      this.model.updateFormData("tanggalLahir", undefined);
      this.model.updateFormData("usia", "");
      this.model.validateField("tanggalLahir", undefined);

      this.setFormData(this.model.getFormData());
      this.setErrors(this.model.getErrors());
    }
  };

  async loadProvinces() {
    try {
      const provincesList = await fetchProvinces();
      this.provinsis = provincesList; // perubahan Caca: Simpan ke class property
      this.setProvinsis(provincesList);
    } catch (error) {
      console.error("Gagal fetch provinsi:", error);
    }
  }

  async loadRegencies(provinsiId: string) {
    try {
      const kabupatenList = await fetchRegencies(provinsiId);
      this.kabupatens = kabupatenList; // perubahan Caca: Simpan ke class property
      this.setKabupatens(kabupatenList);
      this.model.updateFormData("kabupatenId", "");
      this.model.updateFormData("kecamatanId", "");
      this.model.updateFormData("desaId", "");
      this.setFormData(this.model.getFormData());
      this.setKecamatans([]);
      this.setDesas([]);
    } catch (error) {
      console.error("Gagal fetch kabupaten:", error);
    }
  }

  async loadDistricts(kabupatenId: string) {
    try {
      const kecamatanList = await fetchDistricts(kabupatenId);
      this.kecamatans = kecamatanList; // perubahan Caca: Simpan ke class property
      this.setKecamatans(kecamatanList);
      this.model.updateFormData("kecamatanId", "");
      this.model.updateFormData("desaId", "");
      this.setFormData(this.model.getFormData());
      this.setDesas([]);
    } catch (error) {
      console.error("Gagal fetch kecamatan:", error);
    }
  }

  async loadVillages(kecamatanId: string) {
    try {
      const desaList = await fetchVillages(kecamatanId);
      this.desas = desaList; // perubahan Caca: Simpan ke class property
      this.setDesas(desaList);
      this.model.updateFormData("desaId", "");
      this.setFormData(this.model.getFormData());
    } catch (error) {
      console.error("Gagal fetch desa:", error);
    }
  }

  prepareWHOChartData(
    jenisKelamin: string,
    usia: string,
    beratBadan: string,
    tinggiBadan: string
  ) {
    if (!jenisKelamin || !usia) return;

    const gender = jenisKelamin as "laki-laki" | "perempuan";
    const ageInMonths = Number.parseInt(usia);
    const weight = Number.parseFloat(beratBadan);
    const height = Number.parseFloat(tinggiBadan);

    const relevantAges = [
      0, 3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60,
    ]
      .filter((age) => age <= 60)
      .sort((a, b) => Math.abs(a - ageInMonths) - Math.abs(b - ageInMonths))
      .slice(0, 7)
      .sort((a, b) => a - b);

    if (!relevantAges.includes(ageInMonths)) {
      relevantAges.push(ageInMonths);
      relevantAges.sort((a, b) => a - b);
    }

    const chartData = relevantAges.map((age) => {
      const whoData = getWeightForAgeData(age, gender);
      return {
        age,
        p3: whoData.p3,
        p15: whoData.p15,
        p50: whoData.p50,
        p85: whoData.p85,
        p97: whoData.p97,
        childWeight: age === ageInMonths ? weight : undefined,
      };
    });

    // perubahan Caca: Simpan chart data untuk keperluan save ke database
    this.chartData = chartData;
    this.setChartData(chartData);

    const heightChartData = relevantAges.map((age) => {
      const whoHeightData = getHeightForAgeData(age, gender);
      return {
        age,
        p3: whoHeightData.p3,
        p15: whoHeightData.p15,
        p50: whoHeightData.p50,
        p85: whoHeightData.p85,
        p97: whoHeightData.p97,
        childHeight: age === ageInMonths ? height : undefined,
      };
    });

    // perubahan Caca: Simpan height chart data untuk keperluan save ke database
    this.heightChartData = heightChartData;
    this.setHeightChartData(heightChartData);

    // Hitung percentile berdasarkan WHO data untuk usia anak
    const currentAgeWeightData = getWeightForAgeData(ageInMonths, gender);
    const currentAgeHeightData = getHeightForAgeData(ageInMonths, gender);

    // Hitung percentile weight
    const calculatedWeightPercentile = this.calculatePercentile(
      weight,
      currentAgeWeightData
    );

    // Hitung percentile height
    const calculatedHeightPercentile = this.calculatePercentile(
      height,
      currentAgeHeightData
    );

    // Tentukan status berdasarkan percentile - PERBAIKAN: Logika yang sama untuk weight dan height
    let weightStatus = "normal";
    if (calculatedWeightPercentile <= 3) weightStatus = "sangat kurang";
    else if (calculatedWeightPercentile <= 15) weightStatus = "kurang";
    else if (calculatedWeightPercentile >= 97) weightStatus = "sangat tinggi";
    else if (calculatedWeightPercentile >= 85) weightStatus = "tinggi";
    else weightStatus = "normal";

    let heightStatus = "normal";
    if (calculatedHeightPercentile <= 3) heightStatus = "sangat pendek";
    else if (calculatedHeightPercentile <= 15) heightStatus = "pendek";
    else if (calculatedHeightPercentile >= 97) heightStatus = "sangat tinggi";
    else if (calculatedHeightPercentile >= 85) heightStatus = "tinggi";
    else heightStatus = "normal";

    // perubahan Caca: Simpan percentile dan status data untuk keperluan save ke database
    this.weightPercentile = calculatedWeightPercentile;
    this.heightPercentile = calculatedHeightPercentile;
    this.weightStatus = weightStatus;
    this.heightStatus = heightStatus;
    this.setWeightPercentile(calculatedWeightPercentile);
    this.setHeightPercentile(calculatedHeightPercentile);

    console.log("🔍 Percentile calculation:", {
      weight,
      height,
      ageInMonths,
      gender,
      weightPercentile: calculatedWeightPercentile,
      heightPercentile: calculatedHeightPercentile,
      weightStatus,
      heightStatus,
    });
  }

  // perubahan Caca: Method untuk mengambil suggested actions dari database
  async getSuggestedActions(status: string): Promise<string[]> {
    try {
      console.log(`🔍 Mengambil suggested actions untuk status: ${status}`);

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "be-byestunting-production.up.railway.app";
      const response = await fetch(
        `${backendUrl}/suggested-actions?status=${encodeURIComponent(status)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && Array.isArray(result.data)) {
        console.log(
          `✅ Berhasil mengambil ${result.data.length} suggested actions dari database`
        );
        return result.data.map((item: any) => item.suggestion);
      } else {
        console.warn("⚠️ Tidak ada suggested actions ditemukan di database");
        return [];
      }
    } catch (error) {
      console.error(
        "❌ Error mengambil suggested actions dari database:",
        error
      );
      return [];
    }
  }

  async handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const isValid = this.model.validateAllFields();
    this.setErrors(this.model.getErrors());

    if (!isValid) {
      const firstErrorField = Object.keys(this.model.getErrors()).find(
        (key) => this.model.getErrors()[key as keyof FormErrors]
      );
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      return;
    }

    this.setIsLoading(true);

    try {
      const formData = this.model.getFormData();

      // perubahan Caca: Pastikan usia dihitung ulang dari tanggal lahir sebelum submit
      let calculatedAge = 0;
      if (formData.tanggalLahir) {
        calculatedAge = this.calculateAgeInMonths(formData.tanggalLahir);
        // Update usia di model
        this.model.updateFormData("usia", calculatedAge.toString());
        this.setFormData(this.model.getFormData());
        console.log("🔍 Usia dihitung ulang:", calculatedAge, "bulan");
      }

      // Pastikan WHO chart data sudah disiapkan sebelum prediksi
      this.prepareWHOChartData(
        formData.jenisKelamin,
        calculatedAge.toString(),
        formData.beratBadan,
        formData.tinggiBadan
      );

      const predictionResult = await predictStunting({
        nama: formData.nama,
        usia: calculatedAge, // perubahan Caca: Gunakan usia yang sudah dihitung
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
      });

      // perubahan Caca: Ambil suggested actions dari database berdasarkan status
      const suggestedActions = await this.getSuggestedActions(
        predictionResult.status
      );

      // perubahan Caca: Update recommendations dengan data dari database
      const updatedResult = {
        ...predictionResult,
        recommendations: suggestedActions,
      } as PredictionResult;

      this.setResult(updatedResult);
      this.setActiveTab("result");

      // perubahan Caca: Simpan data ke database setelah prediksi berhasil
      try {
        await this.saveStuntingRecord(updatedResult, formData, calculatedAge);
        // perubahan Caca: Tampilkan feedback sukses
        alert("✅ Proses prediksi telah selesai, dan data disimpan dengan aman guna menjaga kerahasiaan serta integritas informasi");
      } catch (saveError) {
        console.error("Error saving to database:", saveError);
        // perubahan Caca: Tampilkan feedback error untuk database
        alert(
          "⚠️ Prediksi berhasil, namun data gagal disimpan ke database. Silakan coba coba lagi atau hubungi administrator."
        );
      }
    } catch (error) {
      console.error("Error predicting stunting:", error);
      alert(
        "❌ Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya."
      );
    } finally {
      this.setIsLoading(false);
    }
  }

  // perubahan Caca: Method baru untuk menyimpan data stunting ke database dengan usia yang benar
  private async saveStuntingRecord(
    result: PredictionResult,
    formData: FormData,
    calculatedAge: number
  ) {
    try {
      // Siapkan WHO chart data
      const whoChartData = {
        weightChartData: this.chartData || [],
        heightChartData: this.heightChartData || [],
        weightPercentile: this.weightPercentile || 0,
        heightPercentile: this.heightPercentile || 0,
      };

      // Dapatkan nama-nama lokasi dari data yang dipilih user
      const selectedProvince = this.provinsis.find(
        (p) => p.id === formData.provinsiId
      );
      const selectedRegency = this.kabupatens.find(
        (k) => k.id === formData.kabupatenId
      );
      const selectedDistrict = this.kecamatans.find(
        (d) => d.id === formData.kecamatanId
      );
      const selectedVillage = this.desas.find((v) => v.id === formData.desaId);

      console.log("🔍 Data lokasi yang dipilih user:", {
        provinsi: selectedProvince?.name,
        kabupaten: selectedRegency?.name,
        kecamatan: selectedDistrict?.name,
        desa: selectedVillage?.name,
        provinsiId: formData.provinsiId,
        kabupatenId: formData.kabupatenId,
        kecamatanId: formData.kecamatanId,
        desaId: formData.desaId,
      });

      // Sesuaikan nama field dengan skema database yang baru (bahasa Inggris)
      const saveData = {
        childName: formData.nama, // child_name di database
        motherName: formData.namaIbu, // mother_name di database
        birthDate: formData.tanggalLahir?.toISOString(), // birth_date di database
        gender: formData.jenisKelamin, // gender di database
        weight: Number.parseFloat(formData.beratBadan), // weight di database
        height: Number.parseFloat(formData.tinggiBadan), // height di database
        ageInMonths: calculatedAge, // age_in_months di database
        // Gunakan ID yang dipilih user, bukan nama
        provinceId: formData.provinsiId,
        regencyId: formData.kabupatenId,
        districtId: formData.kecamatanId,
        villageId: formData.desaId,
        status: result.status,
        riskPercentage: result.score, // risk_percentage di database
        heightPercentile: this.heightPercentile || 0,
        weightPercentile: this.weightPercentile || 0,
        heightCategory: this.heightStatus || "normal",
        weightCategory: this.weightStatus || "normal",
        whoChartData: JSON.stringify(whoChartData),
        predictionMessage: result.message || "",
        recommendations: Array.isArray(result.recommendations)
          ? result.recommendations.join("\n")
          : result.recommendations,
        recommendedEducationId: result.recommendedArticles?.[0]?.id || null,
        modelUsed: "tensorflow-js",
      };

      console.log("🔍 Data yang akan dikirim (dengan kolom bahasa Inggris):", {
        ...saveData,
        ageInMonths: calculatedAge,
        birthDate: formData.tanggalLahir?.toISOString(),
      });

      // Kirim data ke backend API yang sudah ada
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://be-byestunting-production.up.railway.app";
      console.log(`🔍 Mengirim data ke ${backendUrl}/stunting`);

      try {
        // Gunakan Axios jika tersedia, atau fallback ke fetch
        let responseData;

        if (typeof window !== "undefined" && window.axios) {
          console.log("🔍 Menggunakan Axios untuk request");
          const axiosResponse = await window.axios.post(
            `${backendUrl}/stunting`,
            saveData
          );
          responseData = axiosResponse.data;
        } else {
          console.log("🔍 Menggunakan fetch untuk request");
          const response = await fetch(`${backendUrl}/stunting`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(saveData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `❌ Backend error status: ${response.status}`,
              errorText
            );
            throw new Error(
              `HTTP ${response.status}: ${response.statusText}. ${errorText}`
            );
          }

          responseData = await response.json();
        }

        console.log(
          "✅ Data berhasil disimpan dengan kolom bahasa Inggris:",
          responseData
        );
        return responseData;
      } catch (error) {
        console.error("❌ Error saving stunting record:", error);

        // Log more detailed information about the error
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }

        throw error;
      }
    } catch (error) {
      console.error("❌ Error saving stunting record:", error);
      throw error;
    }
  }

  handleShareWhatsApp(
    result: PredictionResult,
    chartData: ChartData[],
    heightChartData: ChartData[],
    weightPercentile: number,
    heightPercentile: number,
    provinsis: LocationData[],
    kabupatens: LocationData[],
    kecamatans: LocationData[],
    desas: LocationData[]
  ) {
    console.log("🔍 handleShareWhatsApp called with result:", result);

    if (!result) {
      console.error("❌ No result data available");
      alert("Data hasil tidak tersedia untuk dibagikan.");
      return;
    }

    try {
      const formData = this.model.getFormData();
      console.log("🔍 Form data:", formData);

      if (!formData.tanggalLahir) {
        console.error("❌ No birth date available");
        alert("Data tanggal lahir tidak tersedia.");
        return;
      }

      const childData = {
        nama: formData.nama,
        namaIbu: formData.namaIbu,
        tanggalLahir: formData.tanggalLahir,
        usia: Number.parseInt(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
        alamat: {
          provinsi:
            provinsis.find((p) => p.id === formData.provinsiId)?.name ||
            "Tidak diketahui",
          kabupaten:
            kabupatens.find((k) => k.id === formData.kabupatenId)?.name ||
            "Tidak diketahui",
          kecamatan:
            kecamatans.find((k) => k.id === formData.kecamatanId)?.name ||
            "Tidak diketahui",
          desa:
            desas.find((d) => d.id === formData.desaId)?.name ||
            "Tidak diketahui",
        },
      };

      const whoChartData = {
        weightChartData: chartData || [],
        heightChartData: heightChartData || [],
        weightPercentile: weightPercentile || 0,
        heightPercentile: heightPercentile || 0,
      };

      console.log("🔍 Calling shareViaWhatsApp with:", {
        childData: childData.nama,
        resultStatus: result.status,
        whoChartData: !!whoChartData,
      });

      shareViaWhatsApp(childData, result, whoChartData);
    } catch (error) {
      console.error("❌ Error in handleShareWhatsApp:", error);
      alert(
        "Terjadi kesalahan saat menyiapkan data untuk WhatsApp. Silakan coba lagi."
      );
    }
  }
}

export function useCekStuntingPresenter() {
  const [model] = useState(() => new CekStuntingModel());
  const [formData, setFormData] = useState<FormData>(model.getFormData());
  const [errors, setErrors] = useState<FormErrors>(model.getErrors());
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [provinsis, setProvinsis] = useState<LocationData[]>([]);
  const [kabupatens, setKabupatens] = useState<LocationData[]>([]);
  const [kecamatans, setKecamatans] = useState<LocationData[]>([]);
  const [desas, setDesas] = useState<LocationData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [heightChartData, setHeightChartData] = useState<ChartData[]>([]);
  const [weightPercentile, setWeightPercentile] = useState<number>(0);
  const [heightPercentile, setHeightPercentile] = useState<number>(0);
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">(
    "days"
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const [presenter] = useState(
    () =>
      new CekStuntingPresenter(model, {
        setFormData,
        setErrors,
        setResult,
        setIsLoading,
        setActiveTab,
        setProvinsis,
        setKabupatens,
        setKecamatans,
        setDesas,
        setChartData,
        setHeightChartData,
        setWeightPercentile,
        setHeightPercentile,
      })
  );

  // Load provinces on mount
  useEffect(() => {
    presenter.loadProvinces();
  }, [presenter]);

  // Update regencies when province changes
  useEffect(() => {
    if (formData.provinsiId) {
      presenter.loadRegencies(formData.provinsiId);
    }
  }, [formData.provinsiId, presenter]);

  // Update districts when regency changes
  useEffect(() => {
    if (formData.kabupatenId) {
      presenter.loadDistricts(formData.kabupatenId);
    }
  }, [formData.kabupatenId, presenter]);

  // Update villages when district changes
  useEffect(() => {
    if (formData.kecamatanId) {
      presenter.loadVillages(formData.kecamatanId);
    }
  }, [formData.kecamatanId, presenter]);

  // Calculate age when birth date changes
  useEffect(() => {
    if (formData.tanggalLahir && !isNaN(formData.tanggalLahir.getTime())) {
      const usiaBulan = presenter.calculateAgeInMonths(formData.tanggalLahir);

      if (usiaBulan < 0) {
        model.updateFormData("tanggalLahir", undefined);
        model.updateFormData("usia", "");
        setFormData(model.getFormData());
        alert("Tanggal lahir tidak boleh di masa depan!");
        return;
      }

      if (usiaBulan > 60) {
        model.updateFormData("tanggalLahir", undefined);
        model.updateFormData("usia", "");
        setFormData(model.getFormData());
        alert(
          "Usia anak tidak boleh lebih dari 60 bulan (5 tahun)! Maksimal usia yang diperbolehkan adalah 60 bulan."
        );
        return;
      }

      model.updateFormData("usia", usiaBulan.toString());
      setFormData(model.getFormData());
    } else if (formData.tanggalLahir === undefined) {
      model.updateFormData("usia", "");
      setFormData(model.getFormData());
    }
  }, [formData.tanggalLahir, model, presenter]);

  // Prepare WHO chart data when result is available
  useEffect(() => {
    if (result && formData.jenisKelamin && formData.usia) {
      presenter.prepareWHOChartData(
        formData.jenisKelamin,
        formData.usia,
        formData.beratBadan,
        formData.tinggiBadan
      );
    }
  }, [
    result,
    formData.jenisKelamin,
    formData.usia,
    formData.beratBadan,
    formData.tinggiBadan,
    presenter,
  ]);

  return {
    // State
    formData,
    errors,
    result,
    isLoading,
    activeTab,
    provinsis,
    kabupatens,
    kecamatans,
    desas,
    chartData,
    heightChartData,
    weightPercentile,
    heightPercentile,
    calendarView,
    selectedYear,
    selectedMonth,

    // Setters
    setActiveTab,
    setCalendarView,
    setSelectedYear,
    setSelectedMonth,

    // Presenter methods
    presenter,
    model,
  };
}
