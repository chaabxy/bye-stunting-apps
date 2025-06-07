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
  getWeightStatus,
  getHeightStatus,
  getHeightForAgeData,
} from "@/presenter/lib/who-chart-data";
import {
  generatePdf,
  downloadPdf,
  shareViaWhatsApp,
} from "@/presenter/lib/pdf-generator";

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

      this.model.updateFormData("tanggalLahir", date);
      this.model.validateField("tanggalLahir", date);
    } else {
      this.model.updateFormData("tanggalLahir", date);
      this.model.validateField("tanggalLahir", date);
    }
    this.setFormData(this.model.getFormData());
    this.setErrors(this.model.getErrors());
  };

  async loadProvinces() {
    try {
      const provincesList = await fetchProvinces();
      this.setProvinsis(provincesList);
    } catch (error) {
      console.error("Gagal fetch provinsi:", error);
    }
  }

  async loadRegencies(provinsiId: string) {
    try {
      const kabupatenList = await fetchRegencies(provinsiId);
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

    this.setHeightChartData(heightChartData);

    const weightResult = getWeightStatus(weight, ageInMonths, gender);
    const heightResult = getHeightStatus(height, ageInMonths, gender);

    this.setWeightPercentile(weightResult.percentile);
    this.setHeightPercentile(heightResult.percentile);
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
      const predictionResult = await predictStunting({
        nama: formData.nama,
        usia: Number.parseFloat(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
      });

      this.setResult(predictionResult as PredictionResult);
      this.setActiveTab("result");
    } catch (error) {
      console.error("Error predicting stunting:", error);
      alert(
        "Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya."
      );
    } finally {
      this.setIsLoading(false);
    }
  }

  async handlePrintReport(
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
    if (!result) return;

    try {
      const formData = this.model.getFormData();
      if (!formData.tanggalLahir) return;

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
            provinsis.find((p) => p.id === formData.provinsiId)?.name || "",
          kabupaten:
            kabupatens.find((k) => k.id === formData.kabupatenId)?.name || "",
          kecamatan:
            kecamatans.find((k) => k.id === formData.kecamatanId)?.name || "",
          desa: desas.find((d) => d.id === formData.desaId)?.name || "",
        },
      };

      const whoChartData = {
        weightChartData: chartData,
        heightChartData: heightChartData,
        weightPercentile: weightPercentile,
        heightPercentile: heightPercentile,
      };

      const pdfBlob = await generatePdf(childData, result, whoChartData);
      downloadPdf(pdfBlob, `laporan-stunting-${formData.nama}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal menghasilkan PDF. Silakan coba lagi.");
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
    if (!result) return;

    try {
      const formData = this.model.getFormData();
      if (!formData.tanggalLahir) return;

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
            provinsis.find((p) => p.id === formData.provinsiId)?.name || "",
          kabupaten:
            kabupatens.find((k) => k.id === formData.kabupatenId)?.name || "",
          kecamatan:
            kecamatans.find((k) => k.id === formData.kecamatanId)?.name || "",
          desa: desas.find((d) => d.id === formData.desaId)?.name || "",
        },
      };

      const whoChartData = {
        weightChartData: chartData,
        heightChartData: heightChartData,
        weightPercentile: weightPercentile,
        heightPercentile: heightPercentile,
      };

      shareViaWhatsApp(childData, result, whoChartData);
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error);
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
    new Date().getFullYear() - 2
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
    if (formData.tanggalLahir) {
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
