// Tipe data tetap bisa dipakai seperti interface yang kamu punya
export interface LocationData {
  id: string;
  name: string;
}

export interface Province extends LocationData {}
export interface Regency extends LocationData {}
export interface District extends LocationData {}
export interface Village extends LocationData {}

// Ambil data provinsi dari API
export async function fetchProvinces(): Promise<Province[]> {
  const response = await fetch(
    "https://ibnux.github.io/data-indonesia/provinsi.json"
  );
  if (!response.ok) throw new Error("Gagal fetch provinsi");
  const data = await response.json();
  // Data sudah array, properti namanya 'nama' dan 'id'
  return data.map((item: any) => ({
    id: item.id,
    name: item.nama,
  }));
}

// Ambil data kabupaten berdasarkan ID provinsi
export async function fetchRegencies(provinceId: string): Promise<Regency[]> {
  const url = `https://ibnux.github.io/data-indonesia/kabupaten/${provinceId}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal fetch kabupaten");
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.id,
    name: item.nama,
  }));
}

// Ambil data kecamatan berdasarkan ID kabupaten
export async function fetchDistricts(regencyId: string): Promise<District[]> {
  const url = `https://ibnux.github.io/data-indonesia/kecamatan/${regencyId}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal fetch kecamatan");
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.id,
    name: item.nama,
  }));
}

// Ambil data kelurahan berdasarkan ID kecamatan
export async function fetchVillages(districtId: string): Promise<Village[]> {
  const url = `https://ibnux.github.io/data-indonesia/kelurahan/${districtId}.json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Gagal fetch kelurahan");
  const data = await response.json();
  return data.map((item: any) => ({
    id: item.id,
    name: item.nama,
  }));
}
