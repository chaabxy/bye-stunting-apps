import { NextResponse } from "next/server";

// Data dummy yang sama dengan route utama
const articles = [
  {
    id: 1,
    title:
      "Mengenal Stunting dan Dampaknya pada Anak dan pencegahan dan stunting dan tumbuh dan agar dan sayang dan cinta",
    excerpt:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Ketahui dampak jangka panjangnya pada perkembangan anak.",
    content:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis terutama dalam 1.000 hari pertama kehidupan. Kondisi ini ditandai dengan tinggi badan anak yang lebih pendek dibandingkan anak seusianya.\n\nStunting tidak hanya berdampak pada fisik anak, tetapi juga pada perkembangan otak, yang dapat memengaruhi kemampuan kognitif dan prestasi belajar di masa depan. Selain itu, anak yang mengalami stunting juga berisiko lebih tinggi terkena penyakit tidak menular seperti diabetes dan penyakit jantung di masa dewasa.\n\nPencegahan stunting harus dilakukan sejak dini, mulai dari masa kehamilan hingga anak berusia 2 tahun. Ibu hamil perlu mendapatkan asupan gizi yang cukup, memberikan ASI eksklusif selama 6 bulan pertama, dan memberikan MPASI yang bergizi seimbang setelah anak berusia 6 bulan.\n\nDengan mengenali tanda-tanda stunting sejak dini dan melakukan upaya pencegahan yang tepat, kita dapat membantu anak-anak Indonesia tumbuh dan berkembang secara optimal.",
    image: "/mengenal stunting.jpg",
    date: "15 Januari 2025",
    category: "Pengetahuan Umum",
    likes: 45,
    views: 1250,
    isPopular: true,
  },
  {
    id: 2,
    title: "Nutrisi Penting untuk Mencegah Stunting",
    excerpt:
      "Pelajari nutrisi-nutrisi penting yang harus diberikan pada anak untuk mencegah stunting dan mendukung pertumbuhan optimal.",
    content:
      "Nutrisi yang tepat sangat penting untuk mencegah stunting pada anak. Protein merupakan zat gizi yang sangat penting untuk pertumbuhan anak. Sumber protein yang baik antara lain daging, ikan, telur, dan kacang-kacangan.\n\nVitamin A, D, dan zat besi sangat penting untuk mencegah stunting. Pastikan anak mendapat asupan yang cukup dari makanan bergizi atau suplemen jika diperlukan.\n\nASI eksklusif selama 6 bulan pertama memberikan nutrisi terbaik untuk bayi dan membantu mencegah stunting. Setelah usia 6 bulan, berikan MPASI yang bergizi dan bervariasi.\n\nDengan memberikan nutrisi yang tepat sejak dini, kita dapat membantu anak tumbuh dengan optimal dan terhindar dari stunting.",
    image: "/mengenal stunting.png",
    date: "12 Januari 2025",
    category: "Nutrisi",
    likes: 32,
    views: 890,
    isPopular: true,
  },
  {
    id: 3,
    title: "Resep MPASI Bergizi untuk Bayi 6-12 Bulan",
    excerpt:
      "Kumpulan resep MPASI bergizi yang mudah dibuat dan aman untuk bayi usia 6-12 bulan sebagai makanan pendamping ASI.",
    content:
      "MPASI yang bergizi sangat penting untuk mencegah stunting. Bubur ayam wortel kaya protein dan vitamin A, cocok untuk bayi usia 6-8 bulan sebagai MPASI pertama.\n\nKombinasi alpukat dan pisang memberikan lemak sehat dan energi yang dibutuhkan bayi untuk pertumbuhan optimal. Pure ini mudah dicerna dan disukai bayi.\n\nIkan salmon kaya omega-3 yang baik untuk perkembangan otak bayi. Olah dengan cara dikukus untuk mempertahankan nutrisi.\n\nPastikan selalu menjaga kebersihan saat menyiapkan MPASI dan perkenalkan makanan baru secara bertahap.",
    image: "/mengenal stunting.jpg",
    date: "10 Januari 2025",
    category: "Resep Makanan",
    likes: 28,
    views: 756,
    isPopular: false,
  },
  {
    id: 4,
    title: "Tips Praktis Mencegah Stunting di Rumah",
    excerpt:
      "Tips praktis yang dapat diterapkan sehari-hari di rumah untuk mencegah stunting dan mendukung tumbuh kembang anak yang optimal.",
    content:
      "Mencegah stunting dapat dilakukan dengan tips praktis sehari-hari. Berikan makanan bergizi seimbang dengan porsi yang cukup sesuai usia anak.\n\nPantau pertumbuhan anak secara rutin dengan mengukur tinggi dan berat badan. Bawa anak ke posyandu atau puskesmas untuk pemeriksaan berkala.\n\nJaga kebersihan lingkungan dan personal hygiene untuk mencegah infeksi yang dapat menghambat pertumbuhan.\n\nBerikan stimulasi yang tepat untuk perkembangan motorik dan kognitif anak melalui permainan edukatif.",
    image: "/mengenal stunting.png",
    date: "8 Januari 2025",
    category: "Tips Praktis",
    likes: 19,
    views: 543,
    isPopular: false,
  },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    const article = articles.find((article) => article.id === id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Increment views count
    article.views += 1;

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    const body = await request.json();

    const itemIndex = articles.findIndex((e) => e.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update likes
    if (body.action === "like") {
      articles[itemIndex].likes += 1;
    } else if (body.action === "unlike") {
      articles[itemIndex].likes = Math.max(0, articles[itemIndex].likes - 1);
    }

    // Update status populer berdasarkan jumlah likes
    articles[itemIndex].isPopular = articles[itemIndex].likes >= 30;

    return NextResponse.json(articles[itemIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number.parseInt(params.id);
    const index = articles.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    articles.splice(index, 1);
    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
