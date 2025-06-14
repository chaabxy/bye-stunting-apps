-- perubahan Caca: Script untuk membuat tabel stunting_records
CREATE TABLE IF NOT EXISTS stunting_records (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    
    -- Data anak
    nama_anak TEXT NOT NULL,
    nama_ibu TEXT NOT NULL,
    tanggal_lahir TIMESTAMP NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    berat_badan DECIMAL(5,2) NOT NULL,
    tinggi_badan DECIMAL(5,2) NOT NULL,
    usia INTEGER NOT NULL,
    
    -- Lokasi (foreign keys)
    province_id TEXT NOT NULL,
    regency_id TEXT NOT NULL,
    district_id TEXT NOT NULL,
    village_id TEXT NOT NULL,
    
    -- Hasil prediksi
    status TEXT NOT NULL,
    risiko_persentase DECIMAL(5,2) NOT NULL,
    model_used TEXT NOT NULL,
    prediction_message TEXT NOT NULL,
    
    -- WHO Chart data (JSON)
    who_chart_data JSONB,
    
    -- Rekomendasi
    recommendations JSONB,
    recommended_education_id INTEGER,
    
    -- Metadata
    tanggal_pemeriksaan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (regency_id) REFERENCES regencies(id),
    FOREIGN KEY (district_id) REFERENCES districts(id),
    FOREIGN KEY (village_id) REFERENCES villages(id)
);

-- perubahan Caca: Index untuk performa
CREATE INDEX IF NOT EXISTS idx_stunting_records_created_at ON stunting_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stunting_records_status ON stunting_records(status);
CREATE INDEX IF NOT EXISTS idx_stunting_records_province ON stunting_records(province_id);
CREATE INDEX IF NOT EXISTS idx_stunting_records_regency ON stunting_records(regency_id);

-- perubahan Caca: Update trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_stunting_records_updated_at 
    BEFORE UPDATE ON stunting_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
