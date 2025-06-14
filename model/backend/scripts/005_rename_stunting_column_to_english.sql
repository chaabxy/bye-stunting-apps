-- Migration: Rename stunting_records columns from Indonesian to English
-- File: 005_rename_stunting_columns_to_english.sql
-- Date: 2025-01-11

BEGIN;

-- Backup existing data (optional, for safety)
-- CREATE TABLE stunting_records_backup AS SELECT * FROM stunting_records;

-- Rename columns in stunting_records table from Indonesian to English
ALTER TABLE stunting_records 
RENAME COLUMN nama_anak TO child_name;

ALTER TABLE stunting_records 
RENAME COLUMN nama_ibu TO mother_name;

ALTER TABLE stunting_records 
RENAME COLUMN tanggal_lahir TO birth_date;

ALTER TABLE stunting_records 
RENAME COLUMN jenis_kelamin TO gender;

ALTER TABLE stunting_records 
RENAME COLUMN berat_badan TO weight;

ALTER TABLE stunting_records 
RENAME COLUMN tinggi_badan TO height;

ALTER TABLE stunting_records 
RENAME COLUMN usia TO age_in_months;

ALTER TABLE stunting_records 
RENAME COLUMN risiko_persentase TO risk_percentage;

-- Update any existing indexes if they reference the old column names
-- Note: PostgreSQL automatically updates index names when columns are renamed

-- Add comments to document the changes
COMMENT ON COLUMN stunting_records.child_name IS 'Child name (formerly nama_anak)';
COMMENT ON COLUMN stunting_records.mother_name IS 'Mother name (formerly nama_ibu)';
COMMENT ON COLUMN stunting_records.birth_date IS 'Birth date (formerly tanggal_lahir)';
COMMENT ON COLUMN stunting_records.gender IS 'Gender (formerly jenis_kelamin)';
COMMENT ON COLUMN stunting_records.weight IS 'Weight in kg (formerly berat_badan)';
COMMENT ON COLUMN stunting_records.height IS 'Height in cm (formerly tinggi_badan)';
COMMENT ON COLUMN stunting_records.age_in_months IS 'Age in months (formerly usia)';
COMMENT ON COLUMN stunting_records.risk_percentage IS 'Risk percentage (formerly risiko_persentase)';

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'stunting_records' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Log the migration
INSERT INTO migration_log (migration_name, executed_at, description) 
VALUES (
    '005_rename_stunting_columns_to_english', 
    NOW(), 
    'Renamed stunting_records columns from Indonesian to English for consistency'
) ON CONFLICT DO NOTHING;

COMMIT;

-- Display success message
SELECT 'Migration 005: Column renaming completed successfully' as status;