-- perubahan Ihsan: Seed data untuk testing artikel edukasi dengan data yang realistis
/*
INSERT INTO articles (
  title, 
  excerpt, 
  category, 
  headerImage, 
  publishDate, 
  readingTime, 
  isPublished,
  isPopular,
  viewCount,
  likeCount
) VALUES 
(
  'Mengenal Stunting: Penyebab dan Dampaknya pada Anak',
  'Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Pelajari penyebab, dampak, dan cara pencegahannya.',
  'Pengetahuan Umum',
  '/placeholder.svg?height=400&width=600',
  '2024-01-15',
  8,
  true,
  true,
  150,
  25
),
(
  'Nutrisi Penting untuk Mencegah Stunting',
  'Asupan nutrisi yang tepat sangat penting untuk mencegah stunting. Ketahui nutrisi apa saja yang dibutuhkan anak.',
  'Nutrisi',
  '/placeholder.svg?height=400&width=600',
  '2024-01-20',
  6,
  true,
  false,
  89,
  12
),
(
  'Tips Praktis Memberikan MPASI yang Bergizi',
  'Panduan lengkap memberikan makanan pendamping ASI yang bergizi untuk mendukung pertumbuhan optimal anak.',
  'Tips Praktis',
  '/placeholder.svg?height=400&width=600',
  '2024-01-25',
  10,
  true,
  true,
  203,
  38
);

-- perubahan Ihsan: Insert content sections untuk artikel pertama dengan struktur yang lengkap
INSERT INTO article_sections (
  articleId,
  heading,
  paragraph,
  sectionOrder,
  illustrationType,
  illustrationUrl,
  illustrationCaption
) VALUES 
(1, 'Apa itu Stunting?', 'Stunting adalah kondisi gagal tumbuh pada anak yang disebabkan oleh kekurangan gizi kronis, terutama dalam 1000 hari pertama kehidupan. Kondisi ini ditandai dengan tinggi badan anak yang berada di bawah standar WHO untuk usianya.', 1, 'image', '/placeholder.svg?height=300&width=500', 'Ilustrasi anak dengan stunting'),
(1, 'Penyebab Utama Stunting', 'Penyebab stunting sangat kompleks dan multifaktorial. Faktor utama meliputi kekurangan gizi pada ibu hamil, praktik pemberian makan yang tidak tepat, infeksi berulang, dan akses terbatas terhadap layanan kesehatan.', 2, null, null, null),
(1, 'Dampak Jangka Panjang', 'Stunting tidak hanya mempengaruhi pertumbuhan fisik, tetapi juga perkembangan kognitif anak. Anak yang mengalami stunting berisiko mengalami kesulitan belajar, produktivitas rendah di masa dewasa, dan rentan terhadap penyakit tidak menular.', 3, null, null, null);

-- perubahan Ihsan: Insert conclusions untuk setiap artikel
INSERT INTO article_conclusions (
  articleId,
  heading,
  paragraph
) VALUES 
(1, 'Kesimpulan', 'Stunting adalah masalah serius yang memerlukan perhatian khusus. Pencegahan stunting harus dimulai sejak masa kehamilan dengan memastikan asupan gizi yang adequate dan praktik pengasuhan yang tepat.'),
(2, 'Kesimpulan', 'Nutrisi yang tepat adalah kunci utama dalam mencegah stunting. Pastikan anak mendapat asupan protein, vitamin, dan mineral yang cukup sesuai dengan usianya.'),
(3, 'Kesimpulan', 'MPASI yang bergizi dan diberikan dengan cara yang tepat akan mendukung pertumbuhan optimal anak dan mencegah terjadinya stunting.');

-- perubahan Ihsan: Insert important points untuk highlight key information
INSERT INTO article_important_points (
  articleId,
  content,
  pointOrder
) VALUES 
(1, 'Stunting dapat dicegah dengan intervensi yang tepat pada 1000 hari pertama kehidupan', 1),
(1, 'Pemantauan pertumbuhan anak secara rutin sangat penting untuk deteksi dini', 2),
(1, 'Edukasi orang tua tentang gizi dan pola asuh yang baik adalah kunci pencegahan', 3),
(2, 'Protein hewani sangat penting untuk pertumbuhan anak', 1),
(2, 'xxxx Zat besi dan zinc adalah mikronutrien kritis untuk mencegah stunting', 2),
(3, 'MPASI harus mulai diberikan pada usia 6 bulan', 1),
(3, 'Tekstur makanan harus disesuaikan dengan kemampuan anak', 2);
*/