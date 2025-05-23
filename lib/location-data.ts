// Data lokasi Indonesia (contoh data, dalam implementasi nyata akan lebih lengkap)
export interface LocationData {
  id: string;
  name: string;
}

export interface Province extends LocationData {}

export interface Regency extends LocationData {
  provinceId: string;
}

export interface District extends LocationData {
  regencyId: string;
}

export interface Village extends LocationData {
  districtId: string;
}

// Data provinsi
export const provinces: Province[] = [
  { id: "11", name: "Aceh" },
  { id: "12", name: "Sumatera Utara" },
  { id: "13", name: "Sumatera Barat" },
  { id: "14", name: "Riau" },
  { id: "15", name: "Jambi" },
  { id: "16", name: "Sumatera Selatan" },
  { id: "17", name: "Bengkulu" },
  { id: "18", name: "Lampung" },
  { id: "19", name: "Kepulauan Bangka Belitung" },
  { id: "21", name: "Kepulauan Riau" },
  { id: "31", name: "DKI Jakarta" },
  { id: "32", name: "Jawa Barat" },
  { id: "33", name: "Jawa Tengah" },
  { id: "34", name: "DI Yogyakarta" },
  { id: "35", name: "Jawa Timur" },
  { id: "36", name: "Banten" },
  { id: "51", name: "Bali" },
  { id: "52", name: "Nusa Tenggara Barat" },
  { id: "53", name: "Nusa Tenggara Timur" },
  { id: "61", name: "Kalimantan Barat" },
  { id: "62", name: "Kalimantan Tengah" },
  { id: "63", name: "Kalimantan Selatan" },
  { id: "64", name: "Kalimantan Timur" },
  { id: "65", name: "Kalimantan Utara" },
  { id: "71", name: "Sulawesi Utara" },
  { id: "72", name: "Sulawesi Tengah" },
  { id: "73", name: "Sulawesi Selatan" },
  { id: "74", name: "Sulawesi Tenggara" },
  { id: "75", name: "Gorontalo" },
  { id: "76", name: "Sulawesi Barat" },
  { id: "81", name: "Maluku" },
  { id: "82", name: "Maluku Utara" },
  { id: "91", name: "Papua Barat" },
  { id: "94", name: "Papua" },
];

// Data kabupaten (contoh untuk beberapa provinsi)
export const regencies: Regency[] = [
  // Jawa Barat
  { id: "3201", name: "Kabupaten Bogor", provinceId: "32" },
  { id: "3202", name: "Kabupaten Sukabumi", provinceId: "32" },
  { id: "3203", name: "Kabupaten Cianjur", provinceId: "32" },
  { id: "3204", name: "Kabupaten Bandung", provinceId: "32" },
  { id: "3205", name: "Kabupaten Garut", provinceId: "32" },
  { id: "3271", name: "Kota Bogor", provinceId: "32" },
  { id: "3272", name: "Kota Sukabumi", provinceId: "32" },
  { id: "3273", name: "Kota Bandung", provinceId: "32" },
  { id: "3274", name: "Kota Cirebon", provinceId: "32" },

  // Jawa Tengah
  { id: "3301", name: "Kabupaten Cilacap", provinceId: "33" },
  { id: "3302", name: "Kabupaten Banyumas", provinceId: "33" },
  { id: "3303", name: "Kabupaten Purbalingga", provinceId: "33" },
  { id: "3304", name: "Kabupaten Banjarnegara", provinceId: "33" },
  { id: "3371", name: "Kota Magelang", provinceId: "33" },
  { id: "3372", name: "Kota Surakarta", provinceId: "33" },
  { id: "3373", name: "Kota Salatiga", provinceId: "33" },
  { id: "3374", name: "Kota Semarang", provinceId: "33" },

  // DKI Jakarta
  { id: "3171", name: "Kota Jakarta Pusat", provinceId: "31" },
  { id: "3172", name: "Kota Jakarta Utara", provinceId: "31" },
  { id: "3173", name: "Kota Jakarta Barat", provinceId: "31" },
  { id: "3174", name: "Kota Jakarta Selatan", provinceId: "31" },
  { id: "3175", name: "Kota Jakarta Timur", provinceId: "31" },
];

// Data kecamatan (contoh untuk beberapa kabupaten)
export const districts: District[] = [
  // Kota Bandung
  { id: "327301", name: "Kecamatan Sukasari", regencyId: "3273" },
  { id: "327302", name: "Kecamatan Coblong", regencyId: "3273" },
  { id: "327303", name: "Kecamatan Babakan Ciparay", regencyId: "3273" },
  { id: "327304", name: "Kecamatan Bojongloa Kaler", regencyId: "3273" },
  { id: "327305", name: "Kecamatan Andir", regencyId: "3273" },
  { id: "327306", name: "Kecamatan Cicendo", regencyId: "3273" },

  // Kota Jakarta Selatan
  { id: "317401", name: "Kecamatan Kebayoran Baru", regencyId: "3174" },
  { id: "317402", name: "Kecamatan Kebayoran Lama", regencyId: "3174" },
  { id: "317403", name: "Kecamatan Pesanggrahan", regencyId: "3174" },
  { id: "317404", name: "Kecamatan Cilandak", regencyId: "3174" },
  { id: "317405", name: "Kecamatan Jagakarsa", regencyId: "3174" },
];

// Data desa/kelurahan (contoh untuk beberapa kecamatan)
export const villages: Village[] = [
  // Kecamatan Coblong, Bandung
  { id: "3273021001", name: "Kelurahan Cipaganti", districtId: "327302" },
  { id: "3273021002", name: "Kelurahan Lebak Gede", districtId: "327302" },
  { id: "3273021003", name: "Kelurahan Sadang Serang", districtId: "327302" },
  { id: "3273021004", name: "Kelurahan Dago", districtId: "327302" },
  { id: "3273021005", name: "Kelurahan Sekeloa", districtId: "327302" },

  // Kecamatan Kebayoran Baru, Jakarta Selatan
  { id: "3174021001", name: "Kelurahan Selong", districtId: "317401" },
  { id: "3174021002", name: "Kelurahan Gunung", districtId: "317401" },
  { id: "3174021003", name: "Kelurahan Kramat Pela", districtId: "317401" },
  { id: "3174021004", name: "Kelurahan Gandaria Utara", districtId: "317401" },
  { id: "3174021005", name: "Kelurahan Pulo", districtId: "317401" },
];

// Fungsi untuk mendapatkan data berdasarkan ID
export function getProvinceById(id: string): Province | undefined {
  return provinces.find((province) => province.id === id);
}

export function getRegenciesByProvinceId(provinceId: string): Regency[] {
  return regencies.filter((regency) => regency.provinceId === provinceId);
}

export function getDistrictsByRegencyId(regencyId: string): District[] {
  return districts.filter((district) => district.regencyId === regencyId);
}

export function getVillagesByDistrictId(districtId: string): Village[] {
  return villages.filter((village) => village.districtId === districtId);
}
