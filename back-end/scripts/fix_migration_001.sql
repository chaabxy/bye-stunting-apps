-- Cek apakah tabel educations sudah ada
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'educations';
