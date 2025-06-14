-- Script untuk mengisi tabel education_conclusions
-- Setiap artikel edukasi akan memiliki 2-3 kesimpulan

-- Kesimpulan untuk artikel ID 1: Memahami Pertumbuhan dan Perkembangan Anak yang Sehat
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(1, 'Pentingnya Pemantauan Rutin', 'Pemantauan pertumbuhan dan perkembangan anak secara rutin sangat penting untuk mendeteksi dini adanya gangguan atau keterlambatan. Orang tua perlu memahami milestone perkembangan sesuai usia anak.', NOW(), NOW()),
(1, 'Peran Nutrisi dalam Pertumbuhan', 'Nutrisi yang adequate dan seimbang menjadi fondasi utama untuk pertumbuhan dan perkembangan anak yang optimal. Kekurangan nutrisi dapat berdampak jangka panjang pada kesehatan anak.', NOW(), NOW()),
(1, 'Stimulasi dan Lingkungan Mendukung', 'Selain nutrisi, stimulasi yang tepat dan lingkungan yang mendukung juga berperan penting dalam mengoptimalkan potensi tumbuh kembang anak secara menyeluruh.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 2: Mengenal Stunting
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(2, 'Stunting Dapat Dicegah', 'Stunting merupakan kondisi yang dapat dicegah melalui intervensi gizi yang tepat, terutama pada 1000 hari pertama kehidupan. Pencegahan lebih efektif daripada pengobatan.', NOW(), NOW()),
(2, 'Dampak Jangka Panjang', 'Stunting tidak hanya mempengaruhi tinggi badan, tetapi juga perkembangan kognitif, produktivitas, dan kualitas hidup anak di masa depan. Penanganan dini sangat krusial.', NOW(), NOW()),
(2, 'Pendekatan Multisektoral', 'Pencegahan stunting memerlukan pendekatan multisektoral yang melibatkan sektor kesehatan, pendidikan, sosial, dan ekonomi untuk hasil yang optimal.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 3: Stunting Berat
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(3, 'Penanganan Intensif Diperlukan', 'Kasus stunting berat memerlukan penanganan medis dan gizi yang intensif dengan monitoring ketat dari tenaga kesehatan profesional untuk mencegah komplikasi lebih lanjut.', NOW(), NOW()),
(3, 'Rehabilitasi Jangka Panjang', 'Proses rehabilitasi untuk stunting berat membutuhkan waktu yang panjang dan konsistensi dalam penerapan protokol terapi gizi yang telah ditetapkan.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 4: 1000 Hari Pertama Kehidupan
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(4, 'Window of Opportunity', '1000 hari pertama kehidupan merupakan window of opportunity yang tidak dapat diulang untuk mengoptimalkan pertumbuhan dan perkembangan anak secara maksimal.', NOW(), NOW()),
(4, 'Investasi Masa Depan', 'Investasi pada 1000 hari pertama kehidupan akan memberikan return yang sangat besar bagi masa depan anak, keluarga, dan bangsa secara keseluruhan.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 5: Panduan Gizi Seimbang
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(5, 'Keseimbangan Nutrisi Kunci Utama', 'Gizi seimbang dengan proporsi karbohidrat, protein, lemak, vitamin, dan mineral yang tepat menjadi kunci utama untuk mendukung pertumbuhan optimal anak usia 0-5 tahun.', NOW(), NOW()),
(5, 'Adaptasi Sesuai Usia', 'Kebutuhan gizi anak berubah seiring bertambahnya usia, sehingga menu dan porsi makanan perlu disesuaikan dengan tahapan perkembangan dan aktivitas anak.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 6: Strategi Perbaikan Gizi Stunting
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(6, 'Intervensi Gizi Berkelanjutan', 'Perbaikan status gizi anak stunting memerlukan intervensi yang berkelanjutan dan konsisten, tidak dapat dilakukan secara instan atau sporadis.', NOW(), NOW()),
(6, 'Monitoring dan Evaluasi', 'Monitoring dan evaluasi secara berkala diperlukan untuk memastikan efektivitas intervensi gizi dan melakukan penyesuaian strategi jika diperlukan.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 7: Terapi Gizi Intensif
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(7, 'Protokol Medis Ketat', 'Terapi gizi intensif untuk stunting berat harus mengikuti protokol medis yang ketat dengan supervisi langsung dari tenaga medis spesialis gizi klinik.', NOW(), NOW()),
(7, 'Monitoring Komplikasi', 'Selama terapi intensif, monitoring terhadap kemungkinan komplikasi seperti refeeding syndrome sangat penting untuk keselamatan pasien.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 8: Makronutrien dan Mikronutrien
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(8, 'Sinergi Makro dan Mikro', 'Makronutrien dan mikronutrien bekerja secara sinergis dalam mendukung pertumbuhan anak. Kekurangan salah satu dapat mengganggu fungsi yang lain.', NOW(), NOW()),
(8, 'Sumber Alami Terbaik', 'Sumber nutrisi dari makanan alami umumnya lebih baik diserap tubuh dibandingkan suplemen, sehingga variasi makanan sangat penting.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 9: Tips Makan Sayur dan Buah
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(9, 'Konsistensi dan Kesabaran', 'Membiasakan anak makan sayur dan buah memerlukan konsistensi dan kesabaran dari orang tua. Penolakan awal adalah hal yang normal.', NOW(), NOW()),
(9, 'Kreativitas dalam Penyajian', 'Kreativitas dalam penyajian dan pengolahan sayur buah dapat meningkatkan minat anak untuk mengonsumsinya secara rutin.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 10: Meningkatkan Nafsu Makan Stunting
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(10, 'Pendekatan Individual', 'Setiap anak dengan stunting memiliki karakteristik yang berbeda, sehingga pendekatan untuk meningkatkan nafsu makan perlu disesuaikan secara individual.', NOW(), NOW()),
(10, 'Lingkungan Makan Positif', 'Menciptakan lingkungan makan yang positif dan menyenangkan dapat membantu meningkatkan nafsu makan anak dengan stunting.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 11: Pemberian Makan Gizi Buruk
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(11, 'Protokol WHO Standar', 'Pemberian makan pada anak gizi buruk harus mengikuti protokol WHO yang telah terbukti efektif dan aman untuk mencegah komplikasi.', NOW(), NOW()),
(11, 'Monitoring Ketat', 'Monitoring yang ketat selama proses feeding sangat penting untuk mendeteksi dini adanya komplikasi dan memastikan toleransi anak terhadap makanan.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 12: Jadwal Makan Balita
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(12, 'Rutinitas Penting', 'Rutinitas jadwal makan yang konsisten membantu mengatur metabolisme anak dan memastikan asupan nutrisi yang adequate sepanjang hari.', NOW(), NOW()),
(12, 'Fleksibilitas Sesuai Kebutuhan', 'Meskipun perlu konsisten, jadwal makan juga harus fleksibel untuk menyesuaikan dengan kebutuhan individual dan kondisi khusus anak.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 13: Resep MPASI
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(13, 'Tekstur Bertahap', 'Pengenalan tekstur makanan secara bertahap sesuai usia membantu perkembangan kemampuan mengunyah dan menelan anak dengan baik.', NOW(), NOW()),
(13, 'Variasi Rasa dan Nutrisi', 'Variasi dalam resep MPASI penting untuk memperkenalkan berbagai rasa dan memastikan kecukupan nutrisi yang beragam.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 14: Resep Protein Tinggi Stunting
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(14, 'Protein Berkualitas Tinggi', 'Pemilihan sumber protein berkualitas tinggi dengan asam amino lengkap sangat penting untuk mendukung catch-up growth pada anak stunting.', NOW(), NOW()),
(14, 'Kombinasi Protein Nabati-Hewani', 'Kombinasi protein nabati dan hewani dalam menu harian dapat mengoptimalkan kualitas protein yang dikonsumsi anak.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 15: Resep F-75 dan F-100
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(15, 'Formula Terapi Standar', 'F-75 dan F-100 merupakan formula terapi standar internasional yang telah terbukti efektif untuk penanganan gizi buruk akut.', NOW(), NOW()),
(15, 'Tahapan Pemberian Bertahap', 'Pemberian F-75 dan F-100 harus dilakukan secara bertahap sesuai protokol untuk mencegah refeeding syndrome dan komplikasi lainnya.', NOW(), NOW());

-- Kesimpulan untuk artikel ID 16: Bekal Sehat Anak Sekolah
INSERT INTO education_conclusions (education_id, heading, paragraph, created_at, updated_at) VALUES
(16, 'Nutrisi Seimbang Portable', 'Bekal sehat harus tetap memenuhi prinsip gizi seimbang meskipun dalam bentuk yang portable dan praktis untuk dibawa ke sekolah.', NOW(), NOW()),
(16, 'Keterlibatan Anak', 'Melibatkan anak dalam pemilihan dan persiapan bekal dapat meningkatkan minat mereka untuk menghabiskan makanan yang dibawa.', NOW(), NOW());
