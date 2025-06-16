// Model: Defines data structure and business logic

export interface UserMessage {
  id: string;
  namaLengkap: string;
  email: string;
  subjek: string;
  pesan: string;
  tanggalKirim: string;
  status: "BelumDibaca" | "Ditolak" | "Dibalas";
  tanggalBalas?: string;
}

export interface MessageStats {
  total: number;
  baru: number;
  ditolak: number;
  dibalas: number;
}
