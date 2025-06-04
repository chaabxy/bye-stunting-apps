"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, CheckCircle, CalendarIcon, Info, ChevronDown, Share2, Printer } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { predictStunting, validateInputRanges } from "@/lib/ml-integration"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subYears, setYear, setMonth } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages } from "@/lib/location-data"
import { getWeightForAgeData, getWeightStatus, getHeightStatus } from "@/lib/who-chart-data"
import { generatePdf, downloadPdf, shareViaWhatsApp } from "@/lib/pdf-generator"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Import fungsi dari ml-integration
import { calculateAgeInMonths } from "@/lib/ml-integration"

export interface PredictionResult {
  status: "normal" | "stunting" | "stunting berat"
  message: string
  recommendations: string[]
  score: number
  recommendedArticles: {
    id: number
    title: string
    category: string
  }[]
}

export default function CekStunting() {
  const [formData, setFormData] = useState({
    nama: "",
    namaIbu: "",
    tanggalLahir: undefined as Date | undefined,
    usia: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
    provinsiId: "",
    kabupatenId: "",
    kecamatanId: "",
    desaId: "",
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">("days")
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 2)
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())

  // State untuk dropdown lokasi
  const [provinsis, setProvinsis] = useState<any[]>([])
  const [kabupatens, setKabupatens] = useState<any[]>([])
  const [kecamatans, setKecamatans] = useState<any[]>([])
  const [desas, setDesas] = useState<any[]>([])

  // State untuk chart
  const [chartData, setChartData] = useState<any[]>([])
  const [weightPercentile, setWeightPercentile] = useState<number>(0)
  const [heightPercentile, setHeightPercentile] = useState<number>(0)

  // Menghitung usia dalam bulan saat tanggal lahir berubah
  useEffect(() => {
    if (formData.tanggalLahir) {
      const usiaBulan = calculateAgeInMonths(formData.tanggalLahir)

      // Validasi usia harus antara 0-60 bulan
      if (usiaBulan > 60) {
        alert("Usia anak harus antara 0-60 bulan (0-5 tahun) untuk pemeriksaan stunting.")
        setFormData((prev) => ({ ...prev, tanggalLahir: undefined }))
        return
      }

      setFormData((prev) => ({ ...prev, usia: usiaBulan.toString() }))
    }
  }, [formData.tanggalLahir])

  // Fetch provinsi saat komponen pertama kali mount
  useEffect(() => {
    async function loadProvinces() {
      try {
        const provincesList = await fetchProvinces() // Fungsi fetch yang harus kamu buat
        setProvinsis(provincesList)
      } catch (error) {
        console.error("Gagal fetch provinsi:", error)
      }
    }
    loadProvinces()
  }, [])

  // Update kabupaten saat provinsi berubah
  useEffect(() => {
    if (formData.provinsiId) {
      async function loadRegencies() {
        try {
          const kabupatenList = await fetchRegencies(formData.provinsiId)
          setKabupatens(kabupatenList)
          setFormData((prev) => ({
            ...prev,
            kabupatenId: "",
            kecamatanId: "",
            desaId: "",
          }))
          setKecamatans([])
          setDesas([])
        } catch (error) {
          console.error("Gagal fetch kabupaten:", error)
        }
      }
      loadRegencies()
    }
  }, [formData.provinsiId])

  // Update kecamatan saat kabupaten berubah
  useEffect(() => {
    if (formData.kabupatenId) {
      async function loadDistricts() {
        try {
          const kecamatanList = await fetchDistricts(formData.kabupatenId)
          setKecamatans(kecamatanList)
          setFormData((prev) => ({ ...prev, kecamatanId: "", desaId: "" }))
          setDesas([])
        } catch (error) {
          console.error("Gagal fetch kecamatan:", error)
        }
      }
      loadDistricts()
    }
  }, [formData.kabupatenId])

  // Update desa saat kecamatan berubah
  useEffect(() => {
    if (formData.kecamatanId) {
      async function loadVillages() {
        try {
          const desaList = await fetchVillages(formData.kecamatanId)
          setDesas(desaList)
          setFormData((prev) => ({ ...prev, desaId: "" }))
        } catch (error) {
          console.error("Gagal fetch desa:", error)
        }
      }
      loadVillages()
    }
  }, [formData.kecamatanId])

  // Persiapkan data chart WHO saat hasil prediksi tersedia
  useEffect(() => {
    if (result && formData.jenisKelamin && formData.usia) {
      prepareWHOChartData()
    }
  }, [result, formData.jenisKelamin, formData.usia])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, tanggalLahir: date }))
    setCalendarView("days")
  }

  const handleMonthSelect = (month: number) => {
    if (formData.tanggalLahir) {
      const newDate = setMonth(formData.tanggalLahir, month)
      setFormData((prev) => ({ ...prev, tanggalLahir: newDate }))
    } else {
      const newDate = setMonth(new Date(), month)
      setFormData((prev) => ({ ...prev, tanggalLahir: newDate }))
    }
    setSelectedMonth(month)
    setCalendarView("days")
  }

  const handleYearSelect = (year: number) => {
    if (formData.tanggalLahir) {
      const newDate = setYear(formData.tanggalLahir, year)
      setFormData((prev) => ({ ...prev, tanggalLahir: newDate }))
    } else {
      const newDate = setYear(new Date(), year)
      setFormData((prev) => ({ ...prev, tanggalLahir: newDate }))
    }
    setSelectedYear(year)
    setCalendarView("months")
  }

  const prepareWHOChartData = () => {
    if (!formData.jenisKelamin || !formData.usia) return

    const gender = formData.jenisKelamin as "laki-laki" | "perempuan"
    const ageInMonths = Number.parseInt(formData.usia)
    const weight = Number.parseFloat(formData.beratBadan)
    const height = Number.parseFloat(formData.tinggiBadan)

    // Dapatkan data WHO untuk usia yang relevan
    const relevantAges = [0, 3, 6, 9, 12, 15, 18, 21, 24, 30, 36, 42, 48, 54, 60]
      .filter((age) => age <= 60)
      .sort((a, b) => Math.abs(a - ageInMonths) - Math.abs(b - ageInMonths))
      .slice(0, 7)
      .sort((a, b) => a - b)

    // Tambahkan usia anak saat ini jika belum ada dalam daftar
    if (!relevantAges.includes(ageInMonths)) {
      relevantAges.push(ageInMonths)
      relevantAges.sort((a, b) => a - b)
    }

    // Buat data chart
    const chartData = relevantAges.map((age) => {
      const whoData = getWeightForAgeData(age, gender)
      return {
        age,
        p3: whoData.p3,
        p15: whoData.p15,
        p50: whoData.p50,
        p85: whoData.p85,
        p97: whoData.p97,
        childWeight: age === ageInMonths ? weight : undefined,
      }
    })

    setChartData(chartData)

    // Hitung persentil untuk berat dan tinggi
    const weightResult = getWeightStatus(weight, ageInMonths, gender)
    const heightResult = getHeightStatus(height, ageInMonths, gender)

    setWeightPercentile(weightResult.percentile)
    setHeightPercentile(heightResult.percentile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validasi input sebelum mengirim ke backend
      const validation = validateInputRanges({
        nama: formData.nama,
        usia: Number.parseFloat(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
      })

      if (!validation.isValid) {
        // Tampilkan error validasi
        alert(`Validasi gagal:\n${validation.errors.join("\n")}`)
        return
      }

      const predictionResult = await predictStunting({
        nama: formData.nama,
        usia: Number.parseFloat(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
      })

      // Check if result is an error
      if ("isError" in predictionResult && predictionResult.isError) {
        alert(predictionResult.message)
        return
      }

      setResult(predictionResult as PredictionResult)
      setActiveTab("result")
    } catch (error) {
      console.error("Error predicting stunting:", error)
      alert(
        "Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintReport = async () => {
    if (!result || !formData.tanggalLahir) return

    try {
      const childData = {
        nama: formData.nama,
        namaIbu: formData.namaIbu,
        tanggalLahir: formData.tanggalLahir,
        usia: Number.parseInt(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
        alamat: {
          provinsi: provinsis.find((p) => p.id === formData.provinsiId)?.name || "",
          kabupaten: kabupatens.find((k) => k.id === formData.kabupatenId)?.name || "",
          kecamatan: kecamatans.find((k) => k.id === formData.kecamatanId)?.name || "",
          desa: desas.find((d) => d.id === formData.desaId)?.name || "",
        },
      }

      const pdfBlob = await generatePdf(childData, result)
      downloadPdf(pdfBlob, `laporan-stunting-${formData.nama}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const handleShareWhatsApp = () => {
    if (!result || !formData.tanggalLahir) return

    try {
      const childData = {
        nama: formData.nama,
        namaIbu: formData.namaIbu,
        tanggalLahir: formData.tanggalLahir,
        usia: Number.parseInt(formData.usia),
        jenisKelamin: formData.jenisKelamin,
        beratBadan: Number.parseFloat(formData.beratBadan),
        tinggiBadan: Number.parseFloat(formData.tinggiBadan),
        alamat: {
          provinsi: provinsis.find((p) => p.id === formData.provinsiId)?.name || "",
          kabupaten: kabupatens.find((k) => k.id === formData.kabupatenId)?.name || "",
          kecamatan: kecamatans.find((k) => k.id === formData.kecamatanId)?.name || "",
          desa: desas.find((d) => d.id === formData.desaId)?.name || "",
        },
      }

      shareViaWhatsApp(childData, result)
    } catch (error) {
      console.error("Error sharing via WhatsApp:", error)
    }
  }

  // Tanggal maksimal adalah hari ini
  const maxDate = new Date()
  // Tanggal minimal adalah 5 tahun yang lalu dari hari ini
  const minDate = subYears(new Date(), 5)

  // Buat array tahun untuk pemilihan tahun
  const years = Array.from({ length: 6 }, (_, i) => maxDate.getFullYear() - 5 + i)

  // Buat array bulan untuk pemilihan bulan
  const months = Array.from({ length: 12 }, (_, i) => i)

  const isFormValid = () => {
    // Validasi semua field wajib termasuk lokasi
    if (
      !formData.nama ||
      !formData.namaIbu ||
      !formData.usia ||
      !formData.jenisKelamin ||
      !formData.beratBadan ||
      !formData.tinggiBadan ||
      !formData.provinsiId ||
      !formData.kabupatenId ||
      !formData.kecamatanId ||
      !formData.desaId
    ) {
      return false
    }

    const validation = validateInputRanges({
      nama: formData.nama,
      usia: Number.parseFloat(formData.usia),
      jenisKelamin: formData.jenisKelamin,
      beratBadan: Number.parseFloat(formData.beratBadan),
      tinggiBadan: Number.parseFloat(formData.tinggiBadan),
    })

    return validation.isValid
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 bg-text from-blue-600 to-cyan-500 bg-clip-text text-primary">
          Cek Risiko <span className="text-secondary">Stunting</span>
        </h1>
        <p className="text-md text-muted-foreground -400 max-w-2xl mx-auto">
          Masukkan data anak Anda untuk memeriksa risiko stunting dan dapatkan rekomendasi yang sesuai untuk tumbuh
          kembang optimal
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {result && (
          <TabsList className="grid w-full grid-cols-2 mb-8 text-text">
            <TabsTrigger value="form">Form Pemeriksaan</TabsTrigger>
            <TabsTrigger value="result">Hasil Analisis</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="form">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden shadow-md border-blue-100 -900">
                <CardHeader className="text-center bg-input from-blue-50 to-cyan-50 -950/50 -950/50 border-b border-blue-100 -900">
                  <CardTitle className="text-primary -300">
                    Input Data <span className="text-secondary">Anak</span>
                  </CardTitle>
                  <CardDescription>
                    Masukkan data anak dengan lengkap untuk mendapatkan hasil yang akurat
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Anak</Label>
                        <Input
                          id="nama"
                          name="nama"
                          placeholder="Masukkan nama anak"
                          value={formData.nama}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="namaIbu">Nama Ibu Kandung</Label>
                        <Input
                          id="namaIbu"
                          name="namaIbu"
                          placeholder="Masukkan nama ibu kandung"
                          value={formData.namaIbu}
                          onChange={handleChange}
                          className="border-blue-200 focus:border-blue-400"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tanggalLahir">Tanggal Lahir Anak</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50 -blue-950/50 bg-input",
                                !formData.tanggalLahir ? "text-black" : "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.tanggalLahir ? (
                                format(formData.tanggalLahir, "dd MMMM yyyy", {
                                  locale: id,
                                })
                              ) : (
                                <span>Pilih tanggal lahir</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            {calendarView === "days" && (
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Button variant="ghost" size="sm" onClick={() => setCalendarView("months")}>
                                    {formData.tanggalLahir
                                      ? format(formData.tanggalLahir, "MMMM yyyy", { locale: id })
                                      : format(new Date(), "MMMM yyyy", {
                                          locale: id,
                                        })}
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                                <Calendar
                                  mode="single"
                                  selected={formData.tanggalLahir}
                                  onSelect={handleDateSelect}
                                  disabled={(date) => date > maxDate || date < minDate}
                                  initialFocus
                                  locale={id}
                                />
                              </div>
                            )}

                            {calendarView === "months" && (
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Button variant="ghost" size="sm" onClick={() => setCalendarView("years")}>
                                    {selectedYear}
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {months.map((month) => (
                                    <Button
                                      key={month}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleMonthSelect(month)}
                                      className={cn("h-10", selectedMonth === month && "bg-input ")}
                                    >
                                      {format(new Date(2000, month, 1), "MMM", {
                                        locale: id,
                                      })}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {calendarView === "years" && (
                              <div className="p-3">
                                <div className="grid grid-cols-3 gap-2">
                                  {years.map((year) => (
                                    <Button
                                      key={year}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleYearSelect(year)}
                                      className={cn("h-10", selectedYear === year && "bg-input -800")}
                                    >
                                      {year}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                        {formData.usia && <p className="text-xs text-text mt-1">Usia: {formData.usia} bulan</p>}
                      </div>

                      <div className="space-y-2">
                        <Label>Jenis Kelamin Anak</Label>
                        <RadioGroup
                          value={formData.jenisKelamin}
                          onValueChange={(value) => handleSelectChange("jenisKelamin", value)}
                          className="flex flex-col space-y-1"
                          required
                        >
                          {/* Laki-laki */}
                          <div className="bg-input flex items-center space-x-2 rounded-md border border-blue-200 p-2 hover:bg-blue-50 -blue-950/30">
                            <RadioGroupItem value="laki-laki" id="laki-laki" />
                            <Label htmlFor="laki-laki" className="flex-grow cursor-pointer">
                              Laki-laki
                            </Label>
                          </div>

                          {/* Perempuan */}
                          <div className="bg-input flex items-center space-x-2 rounded-md border border-blue-200 p-2 hover:bg-blue-50 -blue-950/30">
                            <RadioGroupItem value="perempuan" id="perempuan" />
                            <Label htmlFor="perempuan" className="flex-grow cursor-pointer">
                              Perempuan
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="beratBadan">Berat Badan (kg)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-secondary" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {formData.jenisKelamin === "laki-laki"
                                    ? "Berat badan untuk anak laki-laki: 1,5 - 22,07 kg"
                                    : formData.jenisKelamin === "perempuan"
                                      ? "Berat badan untuk anak perempuan: 1,5 - 21,42 kg"
                                      : "Masukkan berat badan anak dalam kilogram (kg)"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="beratBadan"
                          name="beratBadan"
                          type="number"
                          placeholder="Masukkan berat dalam kg (contoh: 10.5)"
                          step="0.01"
                          min="1.5"
                          max={formData.jenisKelamin === "laki-laki" ? "22.07" : "21.42"}
                          value={formData.beratBadan}
                          onChange={handleChange}
                          className={cn(
                            "border-blue-200 focus:border-blue-400",
                            formData.beratBadan &&
                              formData.jenisKelamin &&
                              ((formData.jenisKelamin === "laki-laki" &&
                                (Number.parseFloat(formData.beratBadan) < 1.5 ||
                                  Number.parseFloat(formData.beratBadan) > 22.07)) ||
                                (formData.jenisKelamin === "perempuan" &&
                                  (Number.parseFloat(formData.beratBadan) < 1.5 ||
                                    Number.parseFloat(formData.beratBadan) > 21.42))) &&
                              "border-red-500 focus:border-red-500",
                          )}
                          required
                        />
                        {formData.beratBadan &&
                          formData.jenisKelamin &&
                          ((formData.jenisKelamin === "laki-laki" &&
                            (Number.parseFloat(formData.beratBadan) < 1.5 ||
                              Number.parseFloat(formData.beratBadan) > 22.07)) ||
                            (formData.jenisKelamin === "perempuan" &&
                              (Number.parseFloat(formData.beratBadan) < 1.5 ||
                                Number.parseFloat(formData.beratBadan) > 21.42))) && (
                            <p className="text-xs text-red-500 mt-1">
                              {formData.jenisKelamin === "laki-laki"
                                ? "Berat badan untuk anak laki-laki harus antara 1,5 - 22,07 kg"
                                : "Berat badan untuk anak perempuan harus antara 1,5 - 21,42 kg"}
                            </p>
                          )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-secondary" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  {formData.jenisKelamin === "laki-laki"
                                    ? "Tinggi badan untuk anak laki-laki: 41,02 - 127,0 cm"
                                    : formData.jenisKelamin === "perempuan"
                                      ? "Tinggi badan untuk anak perempuan: 40,01 - 128,0 cm"
                                      : "Masukkan tinggi badan anak dalam sentimeter (cm)"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="tinggiBadan"
                          name="tinggiBadan"
                          type="number"
                          placeholder="Masukkan tinggi dalam cm (contoh: 85.5)"
                          step="0.01"
                          min={formData.jenisKelamin === "laki-laki" ? "41.02" : "40.01"}
                          max={formData.jenisKelamin === "laki-laki" ? "127.0" : "128.0"}
                          value={formData.tinggiBadan}
                          onChange={handleChange}
                          className={cn(
                            "border-blue-200 focus:border-blue-400",
                            formData.tinggiBadan &&
                              formData.jenisKelamin &&
                              ((formData.jenisKelamin === "laki-laki" &&
                                (Number.parseFloat(formData.tinggiBadan) < 41.02 ||
                                  Number.parseFloat(formData.tinggiBadan) > 127.0)) ||
                                (formData.jenisKelamin === "perempuan" &&
                                  (Number.parseFloat(formData.tinggiBadan) < 40.01 ||
                                    Number.parseFloat(formData.tinggiBadan) > 128.0))) &&
                              "border-red-500 focus:border-red-500",
                          )}
                          required
                        />
                        {formData.tinggiBadan &&
                          formData.jenisKelamin &&
                          ((formData.jenisKelamin === "laki-laki" &&
                            (Number.parseFloat(formData.tinggiBadan) < 41.02 ||
                              Number.parseFloat(formData.tinggiBadan) > 127.0)) ||
                            (formData.jenisKelamin === "perempuan" &&
                              (Number.parseFloat(formData.tinggiBadan) < 40.01 ||
                                Number.parseFloat(formData.tinggiBadan) > 128.0))) && (
                            <p className="text-xs text-red-500 mt-1">
                              {formData.jenisKelamin === "laki-laki"
                                ? "Tinggi badan untuk anak laki-laki harus antara 41,02 - 127,0 cm"
                                : "Tinggi badan untuk anak perempuan harus antara 40,01 - 128,0 cm"}
                            </p>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provinsi">Provinsi</Label>
                        <Select
                          value={formData.provinsiId}
                          onValueChange={(value) => handleSelectChange("provinsiId", value)}
                          required
                        >
                          <SelectTrigger className="border-blue-200 bg-input text-black">
                            <SelectValue placeholder="Pilih provinsi" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinsis.map((province) => (
                              <SelectItem key={province.id} value={province.id} className="text-black">
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kabupaten">Kabupaten/Kota</Label>
                        <Select
                          value={formData.kabupatenId}
                          onValueChange={(value) => handleSelectChange("kabupatenId", value)}
                          disabled={!formData.provinsiId}
                          required
                        >
                          <SelectTrigger className="text-text border-blue-200 bg-input">
                            <SelectValue placeholder="Pilih kabupaten/kota" />
                          </SelectTrigger>
                          <SelectContent>
                            {kabupatens.map((kabupaten) => (
                              <SelectItem key={kabupaten.id} value={kabupaten.id}>
                                {kabupaten.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kecamatan">Kecamatan</Label>
                        <Select
                          value={formData.kecamatanId}
                          onValueChange={(value) => handleSelectChange("kecamatanId", value)}
                          disabled={!formData.kabupatenId}
                          required
                        >
                          <SelectTrigger className="text-text border-blue-200 bg-input">
                            <SelectValue placeholder="Pilih kecamatan" />
                          </SelectTrigger>
                          <SelectContent>
                            {kecamatans.map((kecamatan) => (
                              <SelectItem key={kecamatan.id} value={kecamatan.id}>
                                {kecamatan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="desa">Desa/Kelurahan</Label>
                        <Select
                          value={formData.desaId}
                          onValueChange={(value) => handleSelectChange("desaId", value)}
                          disabled={!formData.kecamatanId}
                          required
                        >
                          <SelectTrigger className="text-text border-blue-200 bg-input">
                            <SelectValue placeholder="Pilih desa/kelurahan" />
                          </SelectTrigger>
                          <SelectContent>
                            {desas.map((desa) => (
                              <SelectItem key={desa.id} value={desa.id}>
                                {desa.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="rounded-xl w-full bg-secondary from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all"
                      disabled={isLoading || !isFormValid()}
                    >
                      {isLoading ? "Memproses..." : "Cek Status Stunting"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-input from-blue-50 to-cyan-50 -950/30 -950/30 border-blue-100 -900 shadow-md h-full">
                <CardHeader>
                  <CardTitle className=" text-center text-lg text-primary -300">
                    Mengapa Cek Stunting <span className="text-secondary">Penting?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-secondary -400 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Deteksi Dini:</span> Mengenali tanda-tanda stunting sejak awal
                        memungkinkan intervensi yang lebih efektif.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-secondary -400 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Mencegah Dampak Jangka Panjang:</span> Stunting dapat mempengaruhi
                        perkembangan kognitif dan kesehatan di masa depan.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-secondary -400 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Rekomendasi Tepat:</span> Dapatkan saran nutrisi dan perawatan
                        yang sesuai dengan kondisi anak Anda.
                      </p>
                    </div>
                  </div>
                  <div className="mt-14">
                    <Image
                      src="/cek-stunting.png"
                      alt="Cek Stunting"
                      width={300}
                      height={200}
                      className="rounded-lg mx-auto shadow-md"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="result">
          {result && (
            <div className="space-y-8">
              <Card className="shadow-lg border-blue-100 -900 overflow-hidden">
                <CardHeader
                  className={cn(
                    "border-b",
                    result.status === "normal"
                      ? "bg-foreground from-green-50 to-green-100 -950/30 -900/30 border-green-100 -800"
                      : result.status === "stunting berat"
                        ? "bg-foreground from-red-50 to-red-100 -950/30 -900/30 border-red-100 -800"
                        : "bg-foreground from-red-50 to-red-100 -950/30 -900/30 border-red-100 -800",
                  )}
                >
                  <CardTitle className={result.status === "normal" ? "text-green-700 -400" : "text-red-700 -400"}>
                    ✅ Status:{" "}
                    {result.status === "normal"
                      ? "Normal"
                      : result.status === "stunting berat"
                        ? "Stunting Berat"
                        : "Stunting"}
                  </CardTitle>
                  <CardDescription>Hasil analisis berdasarkan data yang Anda masukkan</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-2 text-secondary -300">Hasil Analisis</h3>
                        <p className="mb-4">{result.message}</p>
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Tingkat Risiko</span>
                            <span className={result.status === "normal" ? "text-green-600 -400" : "text-red-600 -400"}>
                              {result.score}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 -700 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                result.status === "normal" ? "bg-green-600" : "bg-red-600"
                              }`}
                              style={{ width: `${result.score}%` }}
                            ></div>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2 text-secondary -300">Rekomendasi :</h3>
                        <ul className="space-y-2 border border-gray-200 -800 rounded-md p-1 -950/20">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2 bg-white -950/30 p-3 rounded-md">
                              <span className="h-5 w-5 flex items-center justify-center font-semibold text-text -400 mt-0.5 flex-shrink-0">
                                {index + 1}.
                              </span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-secondary -300">Artikel Rekomendasi</h3>
                      <div className="space-y-5">
                        {result.recommendedArticles.map((article) => (
                          <Link href={`/edukasi/${article.id}`} key={article.id}>
                            <div className="bg-foreground p-3 border border-blue-100 -800 rounded-lg hover:bg-blue-50 -blue-900/20 transition-colors cursor-pointer shadow-sm hover:shadow-md mb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-text -400">{article.title}</h4>
                                <ArrowRight className="h-6 w-6 text-secondary -400" />
                              </div>
                              <p className="text-xs text-gray-500 -400 mt-1">{article.category}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 -900/50 border-t border-gray-100 -800 p-4 flex flex-wrap gap-2 justify-center mb-5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("form")}
                    className="bg-secondary border-blue-200 text-white hover:bg-blue-50 -blue-950/50"
                  >
                    Kembali ke Form
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintReport}
                    className="bg-white border-blue-200 text-secondary hover:bg-blue-50 -blue-950/50"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak Laporan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareWhatsApp}
                    className="bg-green-500 border-green-200 text-white hover:bg-green-50 -green-950/50"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan via WhatsApp
                  </Button>
                </CardFooter>
              </Card>

              {/* WHO Chart */}
              <Card className="shadow-lg border-blue-100 -900 overflow-hidden">
                <CardHeader className="bg-foreground from-blue-50 to-cyan-50 -950/50 -950/50 border-b border-blue-100 -900">
                  <CardTitle className="text-text -300">
                    Kurva Pertumbuhan <span className="text-secondary">WHO</span>
                  </CardTitle>
                  <CardDescription>Posisi anak Anda pada kurva pertumbuhan standar WHO</CardDescription>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Berat Badan menurut Usia</h3>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="age"
                              label={{
                                value: "Usia (bulan)",
                                position: "insideBottomRight",
                                offset: -10,
                              }}
                            />
                            <YAxis
                              label={{
                                value: "Berat (kg)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                            />
                            <XAxis />
                            <YAxis />
                            <Legend
                              layout="horizontal"
                              verticalAlign="bottom"
                              align="center"
                              wrapperStyle={{
                                paddingTop: 20,
                                lineHeight: "24px",
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: "12px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="p3"
                              stroke="#ef4444"
                              name="Persentil 3"
                              dot={false}
                              strokeWidth={1}
                            />
                            <Line
                              type="monotone"
                              dataKey="p15"
                              stroke="#f97316"
                              name="Persentil 15"
                              dot={false}
                              strokeWidth={1}
                            />
                            <Line
                              type="monotone"
                              dataKey="p50"
                              stroke="#3b82f6"
                              name="Persentil 50 (Median)"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="p85"
                              stroke="#f97316"
                              name="Persentil 85"
                              dot={false}
                              strokeWidth={1}
                            />
                            <Line
                              type="monotone"
                              dataKey="p97"
                              stroke="#ef4444"
                              name="Persentil 97"
                              dot={false}
                              strokeWidth={1}
                            />
                            <Line
                              type="monotone"
                              dataKey="childWeight"
                              stroke="#10b981"
                              name="Berat Anak"
                              strokeWidth={3}
                              dot={{ r: 6 }}
                              label={{
                                position: "bottom",
                                fill: "#10b981",
                                fontSize: 12,
                                formatter: () => "Anak Anda",
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 -950/30 rounded-md text-sm space-y-2">
                        <h4 className="font-semibold mb-2">Keterangan Kurva Persentil:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <span className="text-red-600 font-medium">Persentil 3</span> – Berat badan sangat rendah.
                            Anak lebih ringan dari 97% anak seusianya. Indikasi gizi buruk dan risiko stunting berat.
                          </li>
                          <li>
                            <span className="text-orange-600 font-medium">Persentil 15</span> – Berat badan rendah.
                            Masih dalam kategori aman tapi perlu dipantau. Bisa menjadi tanda awal kekurangan gizi.
                          </li>
                          <li>
                            <span className="text-secondary font-medium">Persentil 50</span> – Berat badan rata-rata
                            (median). Anak tumbuh sesuai rata-rata populasi WHO.
                          </li>
                          <li>
                            <span className="text-orange-600 font-medium">Persentil 85</span> – Berat badan lebih tinggi
                            dari rata-rata. Waspadai potensi kelebihan berat atau gizi berlebih.
                          </li>
                          <li>
                            <span className="text-red-600 font-medium">Persentil 97</span> – Berat badan sangat tinggi.
                            Anak lebih berat dari 97% anak seusianya. Bisa menjadi indikasi obesitas.
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 -950/30 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Persentil Berat Badan:</span> {weightPercentile.toFixed(1)}
                          <br />
                          <span className="text-xs text-muted-foreground -400">
                            Persentil menunjukkan posisi anak Anda dibandingkan dengan anak-anak lain seusianya.
                            Persentil 50 adalah median (rata-rata).
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2 text-center">Interpretasi Hasil</h3>
                      <div className="p-4 rounded-md bg-blue-50 -900/50 text-sm leading-relaxed">
                        <p>
                          Berdasarkan kurva pertumbuhan WHO:
                          <br />
                          <strong>• Berat badan:</strong> Persentil <strong>{weightPercentile.toFixed(1)}</strong> –{" "}
                          {weightPercentile < 3 ? (
                            <>
                              <span className="text-red-600 font-medium">sangat kurang</span>. Anak berada dalam
                              kategori berat badan sangat rendah.
                            </>
                          ) : weightPercentile < 15 ? (
                            <>
                              <span className="text-orange-600 font-medium">kurang</span>. Anak berada dalam kategori
                              berat badan rendah.
                            </>
                          ) : weightPercentile > 85 && weightPercentile < 97 ? (
                            <>
                              <span className="text-orange-600 font-medium">di atas normal</span>. Anak berada dalam
                              kategori berat badan tinggi.
                            </>
                          ) : weightPercentile >= 97 ? (
                            <>
                              <span className="text-red-600 font-medium">sangat tinggi</span>. Anak berada dalam
                              kategori berat badan sangat tinggi.
                            </>
                          ) : (
                            <>
                              <span className="text-green-600 font-medium">normal</span>. Berat badan anak berada dalam
                              batas sehat.
                            </>
                          )}
                        </p>

                        <p className="mt-3">
                          <strong>• Tinggi badan:</strong> Persentil <strong>{heightPercentile.toFixed(1)}</strong> –{" "}
                          {heightPercentile < 3 ? (
                            <>
                              <span className="text-red-600 font-medium">sangat pendek</span>. Anak berada dalam
                              kategori tinggi badan sangat rendah.
                            </>
                          ) : heightPercentile < 15 ? (
                            <>
                              <span className="text-orange-600 font-medium">di bawah normal</span>. Anak berada dalam
                              kategori tinggi badan rendah.
                            </>
                          ) : (
                            <>
                              <span className="text-green-600 font-medium">normal</span>. Tinggi badan anak sesuai
                              dengan standar WHO.
                            </>
                          )}
                        </p>

                        <hr className="my-4 border-t border-gray-300 -700" />

                        <p className="text-base font-semibold">
                          ✅ <span className="text-secondary -300">Kesimpulan:</span> Berdasarkan hasil analisis, anak{" "}
                          {formData.nama} berada dalam kondisi{" "}
                          {result.status === "normal"
                            ? "normal"
                            : result.status === "stunting berat"
                              ? "stunting berat"
                              : result.status === "stunting"
                                ? "stunting"
                                : "berisiko stunting"}
                          . Kami harap informasi ini dapat membantu Anda memahami kondisi tumbuh kembang anak dengan
                          lebih baik. Jika diperlukan, jangan ragu untuk berkonsultasi dengan tenaga medis atau ahli
                          gizi guna mendapatkan dukungan dan penanganan yang tepat.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
