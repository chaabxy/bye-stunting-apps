import type { EducationWithDetails } from "@/lib/types/education";

export const articlesData: EducationWithDetails[] = [
  {
    id: "1",
    title: "Mengenal Stunting: Penyebab, Dampak, dan Pencegahan",
    slug: "mengenal-stunting-penyebab-dampak-pencegahan",
    excerpt:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Pelajari penyebab, dampak, dan cara pencegahannya.",
    featured_image: "/mengenal stunting.jpg?height=600&width=800",
    category: "Pengetahuan Dasar",
    tags: ["stunting", "gizi", "anak", "kesehatan"],
    author_id: "admin-1",
    status: "edukasi populer",
    view_count: 1250,
    like_count: 89,
    reading_time: 8,
    published_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    content_sections: [
      {
        id: "section-1",
        education_id: "1",
        section_order: 1,
        heading: "Apa itu Stunting?",
        paragraph:
          "Stunting adalah kondisi gagal tumbuh pada anak yang disebabkan oleh kekurangan gizi kronis, terutama dalam 1.000 hari pertama kehidupan. Anak yang mengalami stunting memiliki tinggi badan yang lebih pendek dibandingkan dengan standar usia mereka.\n\nKondisi ini tidak hanya mempengaruhi pertumbuhan fisik, tetapi juga perkembangan kognitif dan kemampuan belajar anak. Stunting merupakan masalah kesehatan masyarakat yang serius dan memerlukan perhatian khusus.",
        slug: "apa-itu-stunting",
        illustration: {
          id: "ill-1",
          content_section_id: "section-1",
          type: "image",
          url: "/mengenal stunting.png?height=400&width=600",
          caption:
            "Ilustrasi perbandingan tinggi badan anak normal dan stunting",
        },
      },
      {
        id: "section-2",
        education_id: "1",
        section_order: 2,
        heading: "Penyebab Utama Stunting",
        paragraph:
          "Stunting disebabkan oleh berbagai faktor yang saling berkaitan:\n\n1. Kekurangan Gizi Kronis: Asupan nutrisi yang tidak memadai dalam jangka panjang\n2. Infeksi Berulang: Diare, ISPA, dan infeksi lainnya yang mengganggu penyerapan nutrisi\n3. Sanitasi Buruk: Lingkungan yang tidak bersih meningkatkan risiko infeksi\n4. Akses Terbatas ke Pelayanan Kesehatan: Kurangnya pemantauan pertumbuhan dan pelayanan kesehatan\n5. Faktor Sosial Ekonomi: Kemiskinan yang membatasi akses terhadap makanan bergizi",
        slug: "penyebab-utama-stunting",
      },
      {
        id: "section-3",
        education_id: "1",
        section_order: 3,
        heading: "Dampak Jangka Panjang Stunting",
        paragraph:
          "Stunting memiliki dampak yang berlangsung seumur hidup:\n\nDampak Fisik:\n- Tinggi badan yang tidak optimal\n- Sistem imun yang lemah\n- Risiko penyakit degeneratif di masa dewasa\n\nDampak Kognitif:\n- Kemampuan belajar yang terbatas\n- Prestasi akademik yang rendah\n- Produktivitas kerja yang menurun\n\nDampak Ekonomi:\n- Potensi penghasilan yang lebih rendah\n- Beban ekonomi keluarga dan negara\n- Siklus kemiskinan yang berkelanjutan",
        slug: "dampak-jangka-panjang-stunting",
      },
      {
        id: "section-4",
        education_id: "1",
        section_order: 4,
        heading: "Strategi Pencegahan Stunting",
        paragraph:
          "Pencegahan stunting harus dilakukan secara komprehensif:\n\nPeriode Kehamilan:\n- Asupan gizi seimbang untuk ibu hamil\n- Pemeriksaan kehamilan rutin\n- Suplementasi zat besi dan asam folat\n\nPeriode 0-6 Bulan:\n- ASI eksklusif tanpa makanan/minuman lain\n- Inisiasi menyusu dini (IMD)\n- Pemantauan pertumbuhan rutin\n\nPeriode 6-24 Bulan:\n- MPASI yang bergizi dan beragam\n- Lanjutkan pemberian ASI\n- Imunisasi lengkap\n- Stimulasi tumbuh kembang",
        slug: "strategi-pencegahan-stunting",
      },
    ],
    important_points: [
      {
        id: "point-1",
        education_id: "1",
        point_order: 1,
        content:
          "Stunting dapat dicegah dengan asupan gizi yang cukup dan seimbang sejak masa kehamilan",
      },
      {
        id: "point-2",
        education_id: "1",
        point_order: 2,
        content:
          "1.000 hari pertama kehidupan adalah periode emas untuk mencegah stunting",
      },
      {
        id: "point-3",
        education_id: "1",
        point_order: 3,
        content:
          "ASI eksklusif selama 6 bulan pertama sangat penting untuk mencegah stunting",
      },
      {
        id: "point-4",
        education_id: "1",
        point_order: 4,
        content:
          "Pemantauan pertumbuhan anak secara rutin membantu deteksi dini stunting",
      },
    ],
    conclusion: {
      id: "conclusion-1",
      education_id: "1",
      heading: "Kesimpulan",
      paragraph:
        "Stunting merupakan masalah kesehatan masyarakat yang kompleks dan memerlukan upaya pencegahan yang komprehensif. Dengan pemahaman yang baik tentang penyebab dan dampaknya, serta implementasi strategi pencegahan yang tepat, stunting dapat dicegah.\n\nPeran keluarga, masyarakat, dan pemerintah sangat penting dalam upaya pencegahan stunting. Mari bersama-sama ciptakan generasi Indonesia yang sehat, cerdas, dan produktif dengan mencegah stunting sejak dini.",
    },
    table_of_contents: [
      {
        id: "toc-1",
        education_id: "1",
        item_order: 1,
        title: "Apa itu Stunting?",
        slug: "apa-itu-stunting",
      },
      {
        id: "toc-2",
        education_id: "1",
        item_order: 2,
        title: "Penyebab Utama Stunting",
        slug: "penyebab-utama-stunting",
      },
      {
        id: "toc-3",
        education_id: "1",
        item_order: 3,
        title: "Dampak Jangka Panjang Stunting",
        slug: "dampak-jangka-panjang-stunting",
      },
      {
        id: "toc-4",
        education_id: "1",
        item_order: 4,
        title: "Strategi Pencegahan Stunting",
        slug: "strategi-pencegahan-stunting",
      },
      {
        id: "toc-5",
        education_id: "1",
        item_order: 5,
        title: "Kesimpulan",
        slug: "kesimpulan",
      },
    ],
    author: {
      name: "Tim ByeStunting",
      avatar: "/caca.jpg?height=200&width=200",
    },
  },
  {
    id: "2",
    title: "Gizi Seimbang untuk Mencegah Stunting",
    slug: "gizi-seimbang-mencegah-stunting",
    excerpt:
      "Panduan lengkap tentang gizi seimbang yang dibutuhkan untuk mencegah stunting pada anak.",
    featured_image: "/gizi-seimbang.png?height=600&width=800",
    category: "Nutrisi",
    tags: ["gizi", "nutrisi", "makanan", "anak"],
    author_id: "admin-2",
    status: "edukasi biasa",
    view_count: 890,
    like_count: 67,
    reading_time: 6,
    published_at: "2024-01-20T14:30:00Z",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    content_sections: [
      {
        id: "section-2-1",
        education_id: "2",
        section_order: 1,
        heading: "Prinsip Gizi Seimbang",
        paragraph:
          "Gizi seimbang adalah susunan makanan sehari-hari yang mengandung zat-zat gizi dalam jenis dan jumlah yang sesuai dengan kebutuhan tubuh. Untuk mencegah stunting, anak memerlukan asupan gizi yang lengkap dan seimbang.\n\nPrinsip gizi seimbang meliputi: karbohidrat sebagai sumber energi, protein untuk pertumbuhan, lemak untuk perkembangan otak, vitamin dan mineral untuk metabolisme tubuh, serta air untuk hidrasi.",
        slug: "prinsip-gizi-seimbang",
      },
      {
        id: "section-2-2",
        education_id: "2",
        section_order: 2,
        heading: "Zat Gizi Penting untuk Pertumbuhan",
        paragraph:
          "Beberapa zat gizi yang sangat penting untuk mencegah stunting:\n\nProtein: Diperlukan untuk pertumbuhan dan perbaikan jaringan tubuh. Sumber: daging, ikan, telur, kacang-kacangan.\n\nZat Besi: Mencegah anemia dan mendukung perkembangan kognitif. Sumber: daging merah, hati, sayuran hijau.\n\nZinc: Penting untuk pertumbuhan dan sistem imun. Sumber: daging, seafood, kacang-kacangan.\n\nKalsium: Untuk pertumbuhan tulang dan gigi. Sumber: susu, keju, ikan teri.\n\nVitamin A: Untuk penglihatan dan sistem imun. Sumber: wortel, bayam, hati.",
        slug: "zat-gizi-penting-pertumbuhan",
      },
    ],
    important_points: [
      {
        id: "point-2-1",
        education_id: "2",
        point_order: 1,
        content:
          "Variasi makanan memastikan anak mendapat semua zat gizi yang dibutuhkan",
      },
      {
        id: "point-2-2",
        education_id: "2",
        point_order: 2,
        content: "Protein hewani lebih mudah diserap dibanding protein nabati",
      },
    ],
    conclusion: {
      id: "conclusion-2",
      education_id: "2",
      heading: "Kesimpulan",
      paragraph:
        "Gizi seimbang adalah kunci utama dalam mencegah stunting. Dengan memberikan makanan yang beragam dan bergizi, kita dapat memastikan anak tumbuh optimal dan terhindar dari stunting.",
    },
    table_of_contents: [
      {
        id: "toc-2-1",
        education_id: "2",
        item_order: 1,
        title: "Prinsip Gizi Seimbang",
        slug: "prinsip-gizi-seimbang",
      },
      {
        id: "toc-2-2",
        education_id: "2",
        item_order: 2,
        title: "Zat Gizi Penting untuk Pertumbuhan",
        slug: "zat-gizi-penting-pertumbuhan",
      },
      {
        id: "toc-2-3",
        education_id: "2",
        item_order: 3,
        title: "Kesimpulan",
        slug: "kesimpulan",
      },
    ],
    author: {
      name: "Tim ByeStunting",
      avatar: "/ihsan.jpg?height=200&width=200",
    },
  },
  {
    id: "3",
    title: "ASI Eksklusif: Fondasi Pencegahan Stunting",
    slug: "asi-eksklusif-fondasi-pencegahan-stunting",
    excerpt:
      "Pentingnya ASI eksklusif dalam 6 bulan pertama kehidupan untuk mencegah stunting.",
    featured_image: "/asi.jpg?height=600&width=800",
    category: "ASI & Menyusui",
    tags: ["ASI", "menyusui", "bayi", "nutrisi"],
    author_id: "admin-3",
    status: "edukasi populer",
    view_count: 1100,
    like_count: 95,
    reading_time: 7,
    published_at: "2024-01-25T09:15:00Z",
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
    content_sections: [
      {
        id: "section-3-1",
        education_id: "3",
        section_order: 1,
        heading: "Mengapa ASI Eksklusif Penting?",
        paragraph:
          "ASI eksklusif adalah pemberian ASI saja tanpa makanan atau minuman lain selama 6 bulan pertama kehidupan bayi. ASI mengandung semua nutrisi yang dibutuhkan bayi untuk tumbuh optimal.\n\nASI memiliki komposisi yang sempurna dan mudah dicerna oleh sistem pencernaan bayi yang masih berkembang. Selain itu, ASI juga mengandung antibodi yang melindungi bayi dari berbagai penyakit.",
        slug: "mengapa-asi-eksklusif-penting",
      },
      {
        id: "section-3-2",
        education_id: "3",
        section_order: 2,
        heading: "Kandungan Nutrisi dalam ASI",
        paragraph:
          "ASI mengandung nutrisi lengkap yang dibutuhkan bayi:\n\nProtein: Mudah dicerna dan mengandung asam amino esensial\nLemak: Mengandung DHA dan ARA untuk perkembangan otak\nKarbohidrat: Laktosa sebagai sumber energi utama\nVitamin dan Mineral: Dalam proporsi yang tepat untuk bayi\nAntibodi: Immunoglobulin yang melindungi dari infeksi\nPrebiotik: Mendukung pertumbuhan bakteri baik di usus",
        slug: "kandungan-nutrisi-asi",
      },
    ],
    important_points: [
      {
        id: "point-3-1",
        education_id: "3",
        point_order: 1,
        content:
          "ASI eksklusif selama 6 bulan menurunkan risiko stunting hingga 40%",
      },
      {
        id: "point-3-2",
        education_id: "3",
        point_order: 2,
        content:
          "Komposisi ASI berubah sesuai kebutuhan bayi di setiap tahap perkembangan",
      },
    ],
    conclusion: {
      id: "conclusion-3",
      education_id: "3",
      heading: "Kesimpulan",
      paragraph:
        "ASI eksklusif adalah investasi terbaik untuk masa depan anak. Dengan memberikan ASI eksklusif selama 6 bulan pertama, kita memberikan fondasi yang kuat untuk mencegah stunting dan mendukung tumbuh kembang optimal.",
    },
    table_of_contents: [
      {
        id: "toc-3-1",
        education_id: "3",
        item_order: 1,
        title: "Mengapa ASI Eksklusif Penting?",
        slug: "mengapa-asi-eksklusif-penting",
      },
      {
        id: "toc-3-2",
        education_id: "3",
        item_order: 2,
        title: "Kandungan Nutrisi dalam ASI",
        slug: "kandungan-nutrisi-asi",
      },
      {
        id: "toc-3-3",
        education_id: "3",
        item_order: 3,
        title: "Kesimpulan",
        slug: "kesimpulan",
      },
    ],
    author: {
      name: "Tim ByeStunting",
      avatar: "/alya.jpg?height=200&width=200",
    },
  },
];

// Helper functions - EXPORT SEMUA YANG DIBUTUHKAN
export function getArticleById(id: string): EducationWithDetails | null {
  return articlesData.find((article) => article.id === id) || null;
}

export function getArticleBySlug(slug: string): EducationWithDetails | null {
  return articlesData.find((article) => article.slug === slug) || null;
}

export function getArticlesByCategory(
  category: string
): EducationWithDetails[] {
  return articlesData.filter((article) => article.category === category);
}

export function getRelatedArticles(
  category: string,
  currentId: string,
  limit = 3
): EducationWithDetails[] {
  return articlesData
    .filter(
      (article) => article.category === category && article.id !== currentId
    )
    .slice(0, limit);
}

export function getPopularArticles(): EducationWithDetails[] {
  return articlesData.filter((article) => article.status === "edukasi populer");
}

export function getAllCategories(): string[] {
  const categories = articlesData.map((article) => article.category);
  return Array.from(new Set(categories));
}

export function updateArticleViews(id: string): void {
  const article = articlesData.find((a) => a.id === id);
  if (article) {
    article.view_count += 1;
  }
}

export function updateArticleLikes(id: string, increment: number): void {
  const article = articlesData.find((a) => a.id === id);
  if (article) {
    article.like_count = Math.max(0, article.like_count + increment);
  }
}

export function deleteArticle(id: string): boolean {
  const index = articlesData.findIndex((a) => a.id === id);
  if (index !== -1) {
    articlesData.splice(index, 1);
    return true;
  }
  return false;
}
