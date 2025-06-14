-- Jika tabel educations ada, tambahkan kolom recomended_education secara manual
DO $$ 
BEGIN
    -- Cek apakah enum sudah ada
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recommended_education_type') THEN
        CREATE TYPE "recommended_education_type" AS ENUM ('normal', 'stunting', 'severly_stunting');
    END IF;
    
    -- Cek apakah kolom sudah ada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'educations' 
                   AND column_name = 'recomended_education') THEN
        ALTER TABLE "educations" 
        ADD COLUMN "recomended_education" "recommended_education_type" NOT NULL DEFAULT 'normal';
    END IF;
END $$;
