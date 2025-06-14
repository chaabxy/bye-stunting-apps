-- Buat tabel suggestion_actions jika belum ada
CREATE TABLE IF NOT EXISTS suggestion_actions (
  id SERIAL PRIMARY KEY,
  suggestion TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tambahkan data awal untuk suggestion_actions
INSERT INTO suggestion_actions (suggestion, status) VALUES
('Konsultasi dengan dokter anak atau ahli gizi untuk evaluasi lebih lanjut', 'stunting'),
('Berikan makanan bergizi seimbang dengan porsi yang tepat', 'stunting'),
('Pastikan asupan protein hewani dan nabati yang cukup', 'stunting'),
('Berikan suplemen vitamin dan mineral sesuai anjuran dokter', 'stunting'),
('Lakukan pemeriksaan kesehatan rutin untuk memantau pertumbuhan', 'stunting'),
('Pastikan anak mendapatkan ASI eksklusif selama 6 bulan pertama', 'normal'),
('Berikan MPASI yang bergizi dan bervariasi setelah usia 6 bulan', 'normal'),
('Jaga kebersihan lingkungan dan personal hygiene', 'normal'),
('Lakukan stimulasi tumbuh kembang secara rutin', 'normal'),
('Pastikan anak mendapatkan imunisasi lengkap sesuai jadwal', 'normal'),
('Segera konsultasi dengan dokter spesialis anak', 'stunting berat'),
('Ikuti program pemulihan gizi intensif sesuai anjuran tenaga kesehatan', 'stunting berat'),
('Berikan makanan tinggi kalori dan protein dalam porsi kecil tapi sering', 'stunting berat'),
('Pantau berat dan tinggi badan secara ketat setiap minggu', 'stunting berat'),
('Ikuti program suplementasi gizi dari puskesmas atau posyandu', 'stunting berat');

-- Tambahkan kolom suggested_action_id ke stunting_records jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stunting_records' AND column_name = 'suggested_action_id'
  ) THEN
    ALTER TABLE stunting_records ADD COLUMN suggested_action_id INTEGER REFERENCES suggestion_actions(id);
  END IF;
END $$;
