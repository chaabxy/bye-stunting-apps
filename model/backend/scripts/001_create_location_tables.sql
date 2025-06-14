-- Script untuk membuat tabel wilayah Indonesia
-- Jalankan setelah push schema Prisma

-- Tabel sudah dibuat otomatis oleh Prisma, script ini hanya untuk dokumentasi
-- dan bisa digunakan jika ingin membuat manual

-- CREATE TABLE provinces (
--     id VARCHAR(10) PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE regencies (
--     id VARCHAR(10) PRIMARY KEY,
--     province_id VARCHAR(10) NOT NULL,
--     name VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
-- );

-- CREATE TABLE districts (
--     id VARCHAR(10) PRIMARY KEY,
--     regency_id VARCHAR(10) NOT NULL,
--     name VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (regency_id) REFERENCES regencies(id) ON DELETE CASCADE
-- );

-- CREATE TABLE villages (
--     id VARCHAR(10) PRIMARY KEY,
--     district_id VARCHAR(10) NOT NULL,
--     name VARCHAR(100) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
-- );

-- CREATE TABLE province_stunting_stats (
--     id VARCHAR(50) PRIMARY KEY,
--     province_id VARCHAR(10) NOT NULL,
--     normal DECIMAL(5,2) NOT NULL,
--     risk DECIMAL(5,2) NOT NULL,
--     stunting DECIMAL(5,2) NOT NULL,
--     total_children INTEGER NOT NULL,
--     year INTEGER DEFAULT 2024,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     UNIQUE(province_id, year)
-- );

SELECT 'Location tables structure ready!' as message;
