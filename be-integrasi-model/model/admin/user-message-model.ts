// Model: Defines data structure and business logic

export interface UserMessage {
  id: string;
  namaLengkap: string;
  email: string;
  subjek: string;
  pesan: string;
  tanggalKirim: string;
  status: "Belum Dibaca" | "Dibaca" | "Dibalas";
  balasan?: string;
  tanggalBalas?: string;
}

export interface MessageStats {
  total: number;
  baru: number;
  dibaca: number;
  dibalas: number;
}

// Sample data
export const sampleMessages: UserMessage[] = [
  {
    id: "1",
    namaLengkap: "Rina Ayu",
    email: "rina@gmail.com",
    subjek: "Permintaan info",
    pesan:
      "Halo, saya ingin mengetahui lebih lanjut tentang cara menggunakan aplikasi ini untuk mengecek stunting pada anak saya. Apakah ada panduan lengkap yang bisa saya dapatkan?",
    tanggalKirim: "2025-05-24 13:42",
    status: "Belum Dibaca",
  },
  {
    id: "2",
    namaLengkap: "Dedi Supriadi",
    email: "dedi@mail.com",
    subjek: "Saran aplikasi",
    pesan:
      "Aplikasi ini sangat membantu, namun saya berharap ada fitur untuk menyimpan riwayat pemeriksaan anak dalam jangka waktu yang lebih lama. Terima kasih.",
    tanggalKirim: "2025-05-23 09:15",
    status: "Dibaca",
  },
  {
    id: "3",
    namaLengkap: "Maya Sari",
    email: "maya.sari@email.com",
    subjek: "Konsultasi hasil",
    pesan:
      "Hasil pemeriksaan anak saya menunjukkan risiko tinggi stunting. Apa langkah yang harus saya ambil selanjutnya? Mohon bantuannya.",
    tanggalKirim: "2025-05-22 16:30",
    status: "Dibalas",
    balasan:
      "Terima kasih atas pertanyaannya. Untuk kasus risiko tinggi stunting, kami sarankan untuk segera berkonsultasi dengan dokter anak atau ahli gizi terdekat. Kami juga telah mengirimkan panduan nutrisi ke email Anda.",
    tanggalBalas: "2025-05-22 17:15",
  },
];
