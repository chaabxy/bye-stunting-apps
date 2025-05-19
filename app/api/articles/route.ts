import { NextResponse } from "next/server"

// Data artikel
const articles = [
  {
    id: 1,
    title: "Mengenal Stunting dan Dampaknya pada Anak",
    excerpt:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Ketahui dampak jangka panjangnya pada perkembangan anak.",
    content:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis terutama dalam 1.000 hari pertama kehidupan. Kondisi ini ditandai dengan tinggi badan anak yang lebih pendek dibandingkan anak seusianya. Stunting tidak hanya berdampak pada fisik anak, tetapi juga pada perkembangan otak, yang dapat memengaruhi kemampuan kognitif dan prestasi belajar di masa depan. Selain itu, anak yang mengalami stunting juga berisiko lebih tinggi terkena penyakit tidak menular seperti diabetes dan penyakit jantung di masa dewasa.",
    image: "/placeholder.svg?height=200&width=400",
    date: "10 Mei 2025",
    category: "Pengetahuan Dasar",
  },
  {
    id: 2,
    title: "Nutrisi Penting untuk Mencegah Stunting",
    excerpt:
      "Pelajari nutrisi-nutrisi penting yang harus diberikan pada anak untuk mencegah stunting dan mendukung pertumbuhan optimal.",
    content:
      "Untuk mencegah stunting, anak membutuhkan asupan nutrisi yang lengkap dan seimbang. Beberapa nutrisi penting yang harus diperhatikan antara lain protein, kalsium, zat besi, zinc, vitamin A, vitamin D, dan asam folat. Protein berperan penting dalam pembentukan sel-sel tubuh dan pertumbuhan. Kalsium dan vitamin D diperlukan untuk pertumbuhan tulang dan gigi yang kuat. Zat besi mencegah anemia yang dapat menghambat pertumbuhan dan perkembangan kognitif. Zinc berperan dalam sistem kekebalan tubuh dan pertumbuhan. Vitamin A penting untuk penglihatan dan sistem kekebalan tubuh. Asam folat diperlukan untuk pembentukan sel-sel baru dan pertumbuhan jaringan.",
    image: "/placeholder.svg?height=200&width=400",
    date: "5 Mei 2025",
    category: "Nutrisi",
  },
  {
    id: 3,
    title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun",
    excerpt:
      "Panduan lengkap menyusun menu seimbang untuk anak usia 1-3 tahun yang mendukung pertumbuhan dan mencegah stunting.",
    content:
      "Pola makan seimbang untuk anak usia 1-3 tahun harus mencakup berbagai kelompok makanan, termasuk karbohidrat, protein, lemak, serta buah dan sayuran. Porsi makan untuk anak usia ini biasanya sekitar 3/4 hingga 1 cangkir makanan per waktu makan, dengan frekuensi 3 kali makan utama dan 2-3 kali makanan selingan. Pastikan untuk memberikan sumber protein seperti daging, ikan, telur, atau tahu/tempe setiap hari. Berikan juga produk susu seperti susu, keju, atau yogurt untuk memenuhi kebutuhan kalsium. Buah dan sayuran berwarna-warni akan memberikan berbagai vitamin dan mineral penting. Batasi makanan manis, asin, dan berlemak tinggi.",
    image: "/placeholder.svg?height=200&width=400",
    date: "1 Mei 2025",
    category: "Nutrisi",
  },
  {
    id: 4,
    title: "Pentingnya 1000 Hari Pertama Kehidupan",
    excerpt:
      "1000 hari pertama kehidupan adalah periode kritis untuk pertumbuhan dan perkembangan anak. Ketahui mengapa periode ini sangat penting.",
    content:
      "1000 hari pertama kehidupan, mulai dari masa kehamilan hingga anak berusia 2 tahun, merupakan periode emas yang menentukan kualitas kesehatan, pertumbuhan, dan perkembangan anak di masa depan. Pada periode ini, otak dan organ tubuh lainnya berkembang dengan sangat pesat. Kekurangan gizi pada periode ini dapat menyebabkan kerusakan permanen pada pertumbuhan dan perkembangan anak, termasuk stunting. Oleh karena itu, asupan gizi yang cukup dan seimbang sangat penting, baik bagi ibu hamil maupun anak. Selain gizi, stimulasi yang tepat dan lingkungan yang sehat juga berperan penting dalam mendukung tumbuh kembang optimal anak pada 1000 hari pertama kehidupan.",
    image: "/placeholder.svg?height=200&width=400",
    date: "25 April 2025",
    category: "Pengetahuan Dasar",
  },
  {
    id: 5,
    title: "Cara Memantau Pertumbuhan Anak dengan Benar",
    excerpt:
      "Panduan praktis untuk memantau pertumbuhan anak secara berkala dan mengenali tanda-tanda stunting sejak dini.",
    content:
      "Memantau pertumbuhan anak secara berkala sangat penting untuk mendeteksi masalah pertumbuhan, termasuk stunting, sejak dini. Cara yang paling efektif adalah dengan rutin mengukur berat dan tinggi badan anak, kemudian memplotnya pada kurva pertumbuhan WHO. Untuk bayi dan anak di bawah 2 tahun, pengukuran panjang badan dilakukan dengan posisi berbaring, sementara untuk anak di atas 2 tahun, pengukuran tinggi badan dilakukan dengan posisi berdiri. Pemantauan sebaiknya dilakukan setiap bulan untuk bayi hingga usia 1 tahun, setiap 3 bulan untuk anak usia 1-2 tahun, dan setiap 6 bulan untuk anak di atas 2 tahun. Perhatikan juga tanda-tanda lain seperti perkembangan motorik, bahasa, dan sosial anak.",
    image: "/placeholder.svg?height=200&width=400",
    date: "20 April 2025",
    category: "Tips Praktis",
  },
  {
    id: 6,
    title: "Resep Makanan Bergizi untuk Balita",
    excerpt:
      "Kumpulan resep makanan bergizi yang mudah dibuat dan disukai anak-anak untuk mendukung pertumbuhan optimal.",
    content:
      "Berikut adalah beberapa resep makanan bergizi yang mudah dibuat dan umumnya disukai anak-anak: 1) Bubur Ayam Sayuran: Kombinasi nasi, ayam cincang, wortel, dan bayam yang kaya protein dan vitamin. 2) Pancake Pisang: Menggunakan tepung gandum utuh, pisang matang, dan sedikit madu sebagai pemanis alami. 3) Nugget Ikan Homemade: Terbuat dari ikan giling, wortel parut, dan sedikit tepung, kemudian dipanggang bukan digoreng. 4) Smoothie Buah dan Sayur: Campuran buah-buahan seperti pisang dan stroberi dengan sayuran seperti bayam, ditambah yogurt untuk kalsium. 5) Sup Bola-bola Daging: Berisi bola-bola daging sapi atau ayam dengan berbagai sayuran seperti wortel, kentang, dan brokoli. Variasikan menu anak setiap hari untuk memastikan ia mendapatkan berbagai nutrisi penting.",
    image: "/placeholder.svg?height=200&width=400",
    date: "15 April 2025",
    category: "Resep",
  },
]

// GET /api/articles - Mendapatkan semua artikel
export async function GET(request: Request) {
  // Mendapatkan parameter query
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  let filteredArticles = [...articles]

  // Filter berdasarkan kategori jika ada
  if (category && category !== "all") {
    filteredArticles = filteredArticles.filter((article) => article.category === category)
  }

  // Filter berdasarkan pencarian jika ada
  if (search) {
    const searchLower = search.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) || article.excerpt.toLowerCase().includes(searchLower),
    )
  }

  return NextResponse.json(filteredArticles)
}

// POST /api/articles - Menambahkan artikel baru
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Buat artikel baru
    const newArticle = {
      id: articles.length > 0 ? Math.max(...articles.map((article) => article.id)) + 1 : 1,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image || "/placeholder.svg?height=200&width=400",
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      category: body.category,
    }

    // Tambahkan ke array (dalam implementasi nyata, ini akan disimpan ke database)
    articles.unshift(newArticle)

    return NextResponse.json(newArticle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}
