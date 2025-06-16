"use client";

import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarIcon, Info, ChevronDown } from "lucide-react";
import { format, addMonths } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/presenter/lib/utils";
import type {
  FormData,
  FormErrors,
  LocationData,
} from "@/model/user/cek-stunting-model";

interface FormSectionProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  provinsis: LocationData[];
  kabupatens: LocationData[];
  kecamatans: LocationData[];
  desas: LocationData[];
  calendarView: "days" | "months" | "years";
  selectedYear: number;
  selectedMonth: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCalendarViewChange: (view: "days" | "months" | "years") => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

export function FormSection({
  formData,
  errors,
  isLoading,
  provinsis,
  kabupatens,
  kecamatans,
  desas,
  calendarView,
  selectedYear,
  selectedMonth,
  onInputChange,
  onSelectChange,
  onDateSelect,
  onSubmit,
  onCalendarViewChange,
  onYearChange,
  onMonthChange,
}: FormSectionProps) {
  const maxDate = new Date();
  const minDate = addMonths(new Date(), -60);
  const exactSixtyMonthsDate = addMonths(new Date(), -60);
  const years = Array.from(
    { length: 6 },
    (_, i) => maxDate.getFullYear() - 5 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleMonthSelect = (month: number) => {
    onMonthChange(month);
    onCalendarViewChange("days");
  };

  const handleYearSelect = (year: number) => {
    onYearChange(year);
    onCalendarViewChange("months");
  };

  return (
    <Card className="overflow-hidden shadow-md border-blue-100">
      <CardHeader className="text-center bg-input from-blue-50 to-cyan-50 border-b border-blue-100">
        <CardTitle className="text-primary">
          Input Data <span className="text-secondary">Anak</span>
        </CardTitle>
        <CardDescription>
          Masukkan data anak dengan lengkap untuk mendapatkan hasil yang akurat
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Anak */}
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Anak *</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama anak (minimal 2 huruf)"
                value={formData.nama}
                onChange={onInputChange}
                className={`border-blue-200 focus:border-blue-400 ${
                  errors.nama ? "border-red-500 focus:border-red-500" : ""
                }`}
                required
              />
              {errors.nama && (
                <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
              )}
            </div>

            {/* Nama Ibu */}
            <div className="space-y-2">
              <Label htmlFor="namaIbu">Nama Ibu Kandung *</Label>
              <Input
                id="namaIbu"
                name="namaIbu"
                placeholder="Masukkan nama ibu kandung (minimal 2 huruf)"
                value={formData.namaIbu}
                onChange={onInputChange}
                className={`border-blue-200 focus:border-blue-400 ${
                  errors.namaIbu ? "border-red-500 focus:border-red-500" : ""
                }`}
                required
              />
              {errors.namaIbu && (
                <p className="text-red-500 text-xs mt-1">{errors.namaIbu}</p>
              )}
            </div>

            {/* Tanggal Lahir */}
            <div className="space-y-2">
              <Label htmlFor="tanggalLahir">Tanggal Lahir Anak *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50 bg-input",
                      !formData.tanggalLahir
                        ? "text-black"
                        : "text-muted-foreground",
                      errors.tanggalLahir ? "border-red-500" : ""
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
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCalendarViewChange("months")}
                        >
                          {format(
                            new Date(selectedYear, selectedMonth),
                            "MMMM yyyy",
                            { locale: id }
                          )}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={formData.tanggalLahir}
                        onSelect={onDateSelect}
                        disabled={(date) => date > maxDate || date < minDate}
                        initialFocus
                        locale={id}
                        month={new Date(selectedYear, selectedMonth)}
                        className="w-fit"
                        classNames={{
                          months: "flex flex-col space-y-2",
                          month: "space-y-2",
                          caption: "hidden", // Hide the default caption since we have our own
                          table: "w-full border-collapse",
                          head_row: "flex",
                          head_cell:
                            "text-muted-foreground rounded-md w-8 font-normal text-xs",
                          row: "flex w-full mt-1",
                          cell: "h-8 w-8 text-center text-sm p-0 relative",
                          day: "h-8 w-8 p-0 font-normal text-sm hover:bg-accent hover:text-accent-foreground",
                          day_selected:
                            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                          day_today: "bg-accent text-accent-foreground",
                          day_outside: "text-muted-foreground opacity-50",
                          day_disabled: "text-muted-foreground opacity-30",
                        }}
                      />
                    </div>
                  )}

                  {calendarView === "months" && (
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCalendarViewChange("years")}
                        >
                          {selectedYear}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {months.map((month) => (
                          <Button
                            key={month}
                            variant="outline"
                            size="sm"
                            onClick={() => handleMonthSelect(month)}
                            className={cn(
                              "h-8 text-xs",
                              selectedMonth === month &&
                                "bg-primary text-primary-foreground"
                            )}
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
                    <div className="p-2">
                      <div className="grid grid-cols-3 gap-1">
                        {years.map((year) => (
                          <Button
                            key={year}
                            variant="outline"
                            size="sm"
                            onClick={() => handleYearSelect(year)}
                            className={cn(
                              "h-8 text-xs",
                              selectedYear === year &&
                                "bg-primary text-primary-foreground"
                            )}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              {errors.tanggalLahir && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tanggalLahir}
                </p>
              )}
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-700">
                  <strong>ℹ️ Informasi:</strong> Aplikasi ini dirancang untuk
                  anak usia 0-60 bulan (0-5 tahun).
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>Tanggal untuk usia tepat 60 bulan:</strong>{" "}
                  {format(exactSixtyMonthsDate, "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
              {formData.usia && (
                <div className="text-xs mt-1">
                  <p className="text-text">
                    Usia:{" "}
                    <span className="inline-flex items-center gap-2">
                      {formData.usia} bulan
                      {Number.parseInt(formData.usia) <= 60 &&
                        Number.parseInt(formData.usia) >= 0 && (
                          <span className="text-green-600 text-xs">
                            ✅ Termasuk usia valid
                          </span>
                        )}
                    </span>
                  </p>
                  {Number.parseInt(formData.usia) > 60 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-1">
                      <p className="text-red-600 font-medium text-xs">
                        ⚠️ Peringatan: Usia {formData.usia} bulan melebihi batas
                        maksimal 60 bulan (5 tahun)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Jenis Kelamin */}
            <div className="space-y-2">
              <Label>Jenis Kelamin Anak</Label>
              <RadioGroup
                value={formData.jenisKelamin}
                onValueChange={(value) => onSelectChange("jenisKelamin", value)}
                className="flex flex-col space-y-1"
                required
              >
                <div className="bg-input flex items-center space-x-2 rounded-md border border-blue-200 p-2 hover:bg-blue-50">
                  <RadioGroupItem value="laki-laki" id="laki-laki" />
                  <Label
                    htmlFor="laki-laki"
                    className="flex-grow cursor-pointer"
                  >
                    Laki-laki
                  </Label>
                </div>
                <div className="bg-input flex items-center space-x-2 rounded-md border border-blue-200 p-2 hover:bg-blue-50">
                  <RadioGroupItem value="perempuan" id="perempuan" />
                  <Label
                    htmlFor="perempuan"
                    className="flex-grow cursor-pointer"
                  >
                    Perempuan
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Berat Badan */}
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
                onChange={onInputChange}
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
                    "border-red-500 focus:border-red-500"
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

            {/* Tinggi Badan */}
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
                onChange={onInputChange}
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
                    "border-red-500 focus:border-red-500"
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

            {/* Location Fields */}
            <div className="space-y-2">
              <Label htmlFor="provinsi">Provinsi *</Label>
              <Select
                value={formData.provinsiId}
                onValueChange={(value) => onSelectChange("provinsiId", value)}
                required
              >
                <SelectTrigger
                  className={`border-blue-200 bg-input text-black ${
                    errors.provinsiId ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Pilih provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinsis.map((province) => (
                    <SelectItem
                      key={province.id}
                      value={province.id}
                      className="text-black"
                    >
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.provinsiId && (
                <p className="text-red-500 text-xs mt-1">{errors.provinsiId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kabupaten">Kabupaten/Kota *</Label>
              <Select
                value={formData.kabupatenId}
                onValueChange={(value) => onSelectChange("kabupatenId", value)}
                disabled={!formData.provinsiId}
                required
              >
                <SelectTrigger
                  className={`text-text border-blue-200 bg-input ${
                    errors.kabupatenId ? "border-red-500" : ""
                  }`}
                >
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
              {errors.kabupatenId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kabupatenId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kecamatan">Kecamatan *</Label>
              <Select
                value={formData.kecamatanId}
                onValueChange={(value) => onSelectChange("kecamatanId", value)}
                disabled={!formData.kabupatenId}
                required
              >
                <SelectTrigger
                  className={`text-text border-blue-200 bg-input ${
                    errors.kecamatanId ? "border-red-500" : ""
                  }`}
                >
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
              {errors.kecamatanId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.kecamatanId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="desa">Desa/Kelurahan *</Label>
              <Select
                value={formData.desaId}
                onValueChange={(value) => onSelectChange("desaId", value)}
                disabled={!formData.kecamatanId}
                required
              >
                <SelectTrigger
                  className={`text-text border-blue-200 bg-input ${
                    errors.desaId ? "border-red-500" : ""
                  }`}
                >
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
              {errors.desaId && (
                <p className="text-red-500 text-xs mt-1">{errors.desaId}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="rounded-xl w-full bg-secondary from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
            disabled={
              isLoading || Object.values(errors).some((error) => error !== "")
            }
          >
            {isLoading ? "Memproses..." : "Cek Status Stunting"}
          </Button>
          {Object.values(errors).some((error) => error !== "") && (
            <p className="text-red-500 text-sm text-center mt-2">
              Mohon lengkapi semua field yang wajib diisi dengan benar
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
