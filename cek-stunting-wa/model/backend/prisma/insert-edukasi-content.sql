-- Script untuk mengisi konten edukasi
-- 4 kategori × 4 konten = 16 total konten
-- Distribusi rekomendasi: Normal, Stunting, Severely Stunting

-- ========================================
-- KATEGORI: PENGETAHUAN UMUM
-- ========================================

-- 1. Pengetahuan Umum - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date, 
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Memahami Pertumbuhan dan Perkembangan Anak yang Sehat',
    'memahami-pertumbuhan-perkembangan-anak-sehat',
    'Panduan lengkap untuk memahami tahapan pertumbuhan dan perkembangan anak yang normal serta cara memantau kesehatan anak secara optimal.',
    'Pengetahuan Umum',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['pertumbuhan', 'perkembangan', 'anak sehat', 'pemantauan', 'kesehatan'],
    'Kementerian Kesehatan RI, WHO Child Growth Standards',
    'Dr. Sari Pediatri',
    NOW(),
    NOW(),
    NOW(),
    8,
    245,
    true,
    false,
    false,
    'normal'
);

-- 2. Pengetahuan Umum - Stunting  
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Mengenal Stunting: Penyebab, Dampak, dan Cara Pencegahannya',
    'mengenal-stunting-penyebab-dampak-pencegahan',
    'Informasi komprehensif tentang stunting, mulai dari definisi, penyebab utama, dampak jangka panjang, hingga strategi pencegahan yang efektif.',
    'Pengetahuan Umum',
    'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['stunting', 'pencegahan', 'gizi buruk', 'pertumbuhan', 'kesehatan'],
    'Kementerian Kesehatan RI, UNICEF Indonesia',
    'Dr. Gizi Klinik',
    NOW(),
    NOW(),
    NOW(),
    10,
    892,
    true,
    false,
    true,
    'stunting'
);

-- 3. Pengetahuan Umum - Severely Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Stunting Berat: Penanganan Intensif dan Rehabilitasi Gizi',
    'stunting-berat-penanganan-intensif-rehabilitasi',
    'Panduan khusus untuk menangani kasus stunting berat dengan pendekatan medis dan gizi yang intensif serta program rehabilitasi jangka panjang.',
    'Pengetahuan Umum',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    ARRAY['stunting berat', 'rehabilitasi', 'penanganan intensif', 'medis', 'gizi'],
    'Rumah Sakit Gizi Nasional, Kemenkes RI',
    'Prof. Dr. Rehabilitasi Gizi',
    NOW(),
    NOW(),
    NOW(),
    12,
    567,
    true,
    false,
    false,
    'severly_stunting'
);

-- 4. Pengetahuan Umum - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Pentingnya 1000 Hari Pertama Kehidupan untuk Masa Depan Anak',
    'pentingnya-1000-hari-pertama-kehidupan',
    'Mengapa 1000 hari pertama kehidupan sangat krusial bagi perkembangan anak dan bagaimana mengoptimalkan periode emas ini untuk pertumbuhan fisik dan kognitif yang optimal.',
    'Pengetahuan Umum',
    'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['1000 hari', 'periode emas', 'perkembangan', 'kehamilan', 'bayi'],
    'Kementerian Kesehatan RI, Lancet Series',
    'Dr. Maternal Child Health',
    NOW(),
    NOW(),
    NOW(),
    9,
    334,
    true,
    false,
    false,
    'normal'
);

-- ========================================
-- KATEGORI: NUTRISI
-- ========================================

-- 5. Nutrisi - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Panduan Gizi Seimbang untuk Anak Usia 0-5 Tahun',
    'panduan-gizi-seimbang-anak-0-5-tahun',
    'Pedoman lengkap tentang kebutuhan gizi seimbang untuk anak usia 0-5 tahun, termasuk porsi, jenis makanan, dan jadwal makan yang optimal untuk pertumbuhan dan perkembangan.',
    'Nutrisi',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    ARRAY['gizi seimbang', 'nutrisi anak', 'makanan sehat', 'porsi', 'jadwal makan'],
    'Pedoman Gizi Seimbang Kemenkes RI',
    'Ahli Gizi Anak',
    NOW(),
    NOW(),
    NOW(),
    11,
    456,
    true,
    false,
    true,
    'normal'
);

-- 6. Nutrisi - Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Strategi Perbaikan Gizi untuk Anak dengan Stunting',
    'strategi-perbaikan-gizi-anak-stunting',
    'Panduan khusus untuk memperbaiki status gizi anak dengan stunting melalui intervensi gizi yang tepat dan berkelanjutan, termasuk menu harian dan suplementasi yang direkomendasikan.',
    'Nutrisi',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    ARRAY['perbaikan gizi', 'intervensi', 'stunting', 'nutrisi', 'pemulihan'],
    'WHO Nutrition Guidelines, Kemenkes RI',
    'Nutritionist Klinik',
    NOW(),
    NOW(),
    NOW(),
    13,
    723,
    true,
    false,
    true,
    'stunting'
);

-- 7. Nutrisi - Severely Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Terapi Gizi Intensif untuk Stunting Berat dan Gizi Buruk',
    'terapi-gizi-intensif-stunting-berat',
    'Protokol terapi gizi intensif untuk menangani kasus stunting berat dan gizi buruk dengan pendekatan medis dan nutrisi yang komprehensif, termasuk formula khusus dan monitoring ketat.',
    'Nutrisi',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['terapi gizi', 'intensif', 'gizi buruk', 'protokol', 'medis'],
    'Protokol Tatalaksana Gizi Buruk Kemenkes',
    'Dr. Spesialis Gizi Klinik',
    NOW(),
    NOW(),
    NOW(),
    15,
    289,
    true,
    false,
    false,
    'severly_stunting'
);

-- 8. Nutrisi - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Makronutrien dan Mikronutrien Penting untuk Pertumbuhan Anak',
    'makronutrien-mikronutrien-pertumbuhan-anak',
    'Penjelasan lengkap tentang peran makronutrien dan mikronutrien dalam mendukung pertumbuhan dan perkembangan anak yang optimal, serta sumber makanan terbaik untuk mendapatkannya.',
    'Nutrisi',
    'https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1806&q=80',
    ARRAY['makronutrien', 'mikronutrien', 'vitamin', 'mineral', 'protein'],
    'Journal of Pediatric Nutrition, Kemenkes RI',
    'Prof. Nutrisi Pediatrik',
    NOW(),
    NOW(),
    NOW(),
    10,
    378,
    true,
    false,
    false,
    'normal'
);

-- ========================================
-- KATEGORI: TIPS PRAKTIS
-- ========================================

-- 9. Tips Praktis - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Tips Praktis Membiasakan Anak Makan Sayur dan Buah',
    'tips-praktis-anak-makan-sayur-buah',
    'Strategi efektif dan tips praktis untuk membiasakan anak menyukai dan rutin mengonsumsi sayur dan buah dalam kehidupan sehari-hari, termasuk resep kreatif dan cara penyajian menarik.',
    'Tips Praktis',
    'https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1742&q=80',
    ARRAY['tips praktis', 'sayur', 'buah', 'kebiasaan makan', 'anak'],
    'Panduan Praktis Gizi Anak, IDAI',
    'Praktisi Gizi Anak',
    NOW(),
    NOW(),
    NOW(),
    7,
    612,
    true,
    false,
    true,
    'normal'
);

-- 10. Tips Praktis - Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Cara Praktis Meningkatkan Nafsu Makan Anak dengan Stunting',
    'cara-praktis-tingkatkan-nafsu-makan-stunting',
    'Tips dan trik praktis untuk meningkatkan nafsu makan anak dengan stunting agar dapat memenuhi kebutuhan gizi hariannya, termasuk teknik penyajian dan pengolahan makanan yang tepat.',
    'Tips Praktis',
    'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['nafsu makan', 'stunting', 'tips praktis', 'feeding', 'nutrisi'],
    'Panduan Feeding Anak Stunting, Kemenkes',
    'Konselor Gizi',
    NOW(),
    NOW(),
    NOW(),
    8,
    445,
    true,
    false,
    false,
    'stunting'
);

-- 11. Tips Praktis - Severely Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Panduan Praktis Pemberian Makan pada Anak Gizi Buruk',
    'panduan-praktis-pemberian-makan-gizi-buruk',
    'Panduan step-by-step untuk pemberian makan pada anak dengan gizi buruk, termasuk teknik feeding dan monitoring yang tepat untuk memastikan penyerapan nutrisi optimal.',
    'Tips Praktis',
    'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['pemberian makan', 'gizi buruk', 'feeding', 'monitoring', 'praktis'],
    'Protokol Feeding Gizi Buruk WHO-UNICEF',
    'Perawat Gizi Spesialis',
    NOW(),
    NOW(),
    NOW(),
    12,
    198,
    true,
    false,
    false,
    'severly_stunting'
);

-- 12. Tips Praktis - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Membuat Jadwal Makan yang Tepat untuk Balita',
    'membuat-jadwal-makan-tepat-balita',
    'Panduan praktis untuk menyusun jadwal makan yang sesuai dengan kebutuhan dan pola tidur balita agar nutrisi optimal tercapai, termasuk contoh jadwal untuk berbagai usia.',
    'Tips Praktis',
    'https://images.unsplash.com/photo-1544703432-78fe9ba48d4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['jadwal makan', 'balita', 'pola makan', 'nutrisi', 'rutinitas'],
    'Pedoman Feeding Balita IDAI',
    'Dokter Anak Konsultan',
    NOW(),
    NOW(),
    NOW(),
    6,
    523,
    true,
    false,
    false,
    'normal'
);

-- ========================================
-- KATEGORI: RESEP MAKANAN
-- ========================================

-- 13. Resep Makanan - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Resep MPASI Bergizi untuk Bayi 6-12 Bulan',
    'resep-mpasi-bergizi-bayi-6-12-bulan',
    'Kumpulan resep MPASI yang bergizi dan mudah dibuat untuk bayi usia 6-12 bulan, lengkap dengan panduan tekstur dan porsi sesuai tahapan usia dan perkembangan.',
    'Resep Makanan',
    'https://images.unsplash.com/photo-1569289522127-c0452f372d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    ARRAY['resep MPASI', 'bayi', 'bergizi', 'tekstur', 'porsi'],
    'Panduan MPASI WHO, Kemenkes RI',
    'Chef Nutrisi Anak',
    NOW(),
    NOW(),
    NOW(),
    9,
    789,
    true,
    false,
    true,
    'normal'
);

-- 14. Resep Makanan - Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Resep Makanan Tinggi Protein untuk Anak Stunting',
    'resep-makanan-tinggi-protein-anak-stunting',
    'Koleksi resep makanan dengan kandungan protein tinggi yang dirancang khusus untuk membantu pemulihan anak dengan stunting, mudah dibuat dengan bahan lokal dan terjangkau.',
    'Resep Makanan',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['resep', 'protein tinggi', 'stunting', 'pemulihan', 'makanan'],
    'Resep Therapeutic Food, Kemenkes RI',
    'Nutritionist Chef',
    NOW(),
    NOW(),
    NOW(),
    11,
    656,
    true,
    false,
    true,
    'stunting'
);

-- 15. Resep Makanan - Severely Stunting
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Resep F-75 dan F-100: Makanan Terapi untuk Gizi Buruk',
    'resep-f75-f100-makanan-terapi-gizi-buruk',
    'Panduan lengkap pembuatan F-75 dan F-100 sebagai makanan terapi standar WHO untuk penanganan anak dengan gizi buruk berat, termasuk cara pembuatan dan pemberian yang tepat.',
    'Resep Makanan',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['F-75', 'F-100', 'makanan terapi', 'gizi buruk', 'WHO'],
    'WHO Guidelines Severe Malnutrition',
    'Spesialis Gizi Klinik',
    NOW(),
    NOW(),
    NOW(),
    14,
    234,
    true,
    false,
    false,
    'severly_stunting'
);

-- 16. Resep Makanan - Normal
INSERT INTO educations (
    title, 
    slug, 
    excerpt, 
    category, 
    header_image, 
    tags, 
    source, 
    author, 
    publish_date,
    created_at,
    updated_at,
    reading_time, 
    view_count, 
    is_published, 
    is_draft, 
    is_popular, 
    recomended_education
) VALUES (
    'Resep Bekal Sehat untuk Anak Sekolah',
    'resep-bekal-sehat-anak-sekolah',
    'Ide-ide kreatif dan resep praktis untuk membuat bekal sekolah yang sehat, bergizi, dan disukai anak-anak, dengan variasi menu untuk seminggu penuh.',
    'Resep Makanan',
    'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    ARRAY['bekal sehat', 'anak sekolah', 'resep praktis', 'bergizi', 'kreatif'],
    'Panduan Gizi Anak Sekolah, Kemenkes RI',
    'Ahli Gizi Komunitas',
    NOW(),
    NOW(),
    NOW(),
    8,
    467,
    true,
    false,
    false,
    'normal'
);

-- Tampilkan ringkasan data yang telah diinsert
SELECT 
    category,
    recomended_education,
    COUNT(*) as jumlah_konten
FROM educations 
GROUP BY category, recomended_education 
ORDER BY category, recomended_education;
