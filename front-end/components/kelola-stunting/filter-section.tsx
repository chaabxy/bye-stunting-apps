"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { FilterState, LocationOptions } from "@/types/stunting";

type FilterSectionProps = {
  filters: FilterState;
  locationOptions: LocationOptions;
  uniqueProvinsis: string[];
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
};

export function FilterSection({
  filters,
  locationOptions,
  uniqueProvinsis,
  onFilterChange,
  onResetFilters,
}: FilterSectionProps) {
  const handleInputChange = (field: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Card className="shadow-lg border-0 bg-white mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Filter className="h-4 w-4 text-slate-600" />
            </div>
            <span className="font-semibold text-slate-700">Filter Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama anak/ibu..."
                className="pl-10 focus:ring-2 focus:ring-purple-500"
                value={filters.searchTerm}
                onChange={(e) =>
                  handleInputChange("searchTerm", e.target.value)
                }
              />
            </div>

            <Select
              value={filters.selectedProvinsi}
              onValueChange={(value) =>
                handleInputChange("selectedProvinsi", value)
              }
            >
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                <SelectValue placeholder="Semua Provinsi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Provinsi</SelectItem>
                {uniqueProvinsis
                  .filter((provinsi) => provinsi && provinsi.trim() !== "")
                  .map((provinsi) => (
                    <SelectItem key={provinsi} value={provinsi}>
                      {provinsi}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.selectedKabupaten}
              onValueChange={(value) =>
                handleInputChange("selectedKabupaten", value)
              }
              disabled={filters.selectedProvinsi === "all"}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                <SelectValue placeholder="Semua Kabupaten" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kabupaten</SelectItem>
                {locationOptions.kabupatens
                  .filter((kabupaten) => kabupaten && kabupaten.trim() !== "")
                  .map((kabupaten) => (
                    <SelectItem key={kabupaten} value={kabupaten}>
                      {kabupaten}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.selectedKecamatan}
              onValueChange={(value) =>
                handleInputChange("selectedKecamatan", value)
              }
              disabled={filters.selectedKabupaten === "all"}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                <SelectValue placeholder="Semua Kecamatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kecamatan</SelectItem>
                {locationOptions.kecamatans
                  .filter((kecamatan) => kecamatan && kecamatan.trim() !== "")
                  .map((kecamatan) => (
                    <SelectItem key={kecamatan} value={kecamatan}>
                      {kecamatan}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.selectedDesa}
              onValueChange={(value) =>
                handleInputChange("selectedDesa", value)
              }
              disabled={filters.selectedKecamatan === "all"}
            >
              <SelectTrigger className="focus:ring-2 focus:ring-purple-500 rounded-xl">
                <SelectValue placeholder="Semua Desa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Desa</SelectItem>
                {locationOptions.desas
                  .filter((desa) => desa && desa.trim() !== "")
                  .map((desa) => (
                    <SelectItem key={desa} value={desa}>
                      {desa}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={onResetFilters}
              className="w-full rounded-xl"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
