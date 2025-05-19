import { NextResponse } from "next/server"

// Data artikel (sama dengan yang di route.ts)
let articles = [
  {
    id: 1,
    title: "Mengenal Stunting dan Dampaknya pada Anak",
    excerpt:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis. Ketahui dampak jangka panjangnya pada perkembangan anak.",
    content:
      "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis terutama dalam 1.000 hari pertama kehidupan. Kondisi ini ditandai dengan tinggi badan anak yang lebih pendek dibandingkan anak seusianya. Stunting tidak hanya berdampak pada fisik anak, tetapi juga pada perkembangan otak, yang dapat memengaruhi kemampuan kognitif dan prestasi belajar di masa depan. Selain itu, anak yang mengalami stunting juga berisiko lebih tinggi terkena penyakit tidak menular seperti diabetes dan penyakit jantung di masa dewasa.\n\nStunting disebabkan oleh berbagai faktor, termasuk kurangnya asupan gizi selama kehamilan dan masa pertumbuhan anak, infeksi berulang, praktik pemberian makan yang tidak tepat, dan akses terbatas ke layanan kesehatan dan sanitasi yang baik. Di Indonesia, stunting masih menjadi masalah kesehatan masyarakat yang serius dengan prevalensi yang cukup tinggi.\n\nDampak stunting pada anak sangat luas dan dapat bertahan hingga dewasa. Beberapa dampak jangka panjang stunting meliputi:\n\n1. Penurunan perkembangan kognitif dan kapasitas belajar\n2. Penurunan produktivitas dan pendapatan di masa dewasa\n3. Peningkatan risiko penyakit metabolik seperti diabetes dan obesitas\n4. Penurunan fungsi kekebalan tubuh dan peningkatan risiko infeksi\n5. Dampak pada generasi berikutnya, karena ibu yang mengalami stunting berisiko melahirkan bayi dengan berat lahir rendah\n\nPencegahan stunting harus dimulai sejak 1.000 hari pertama kehidupan, yaitu dari masa kehamilan hingga anak berusia 2 tahun. Beberapa upaya pencegahan stunting meliputi:\n\n1. Memastikan ibu hamil mendapatkan gizi yang cukup\n2. Memberikan ASI eksklusif selama 6 bulan pertama\n3. Memberikan makanan pendamping ASI yang bergizi seimbang setelah usia 6 bulan\n4. Memastikan anak mendapatkan imunisasi lengkap\n5. Menjaga kebersihan dan sanitasi lingkungan\n6. Pemantauan pertumbuhan anak secara rutin\n\nDengan mengenali tanda-tanda stunting sejak dini dan melakukan upaya pencegahan yang tepat, kita dapat membantu anak-anak Indonesia tumbuh dan berkembang secara optimal.",
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
      "Untuk mencegah stunting, anak membutuhkan asupan nutrisi yang lengkap dan seimbang. Beberapa nutrisi penting yang harus diperhatikan antara lain protein, kalsium, zat besi, zinc, vitamin A, vitamin D, dan asam folat. Protein berperan penting dalam pembentukan sel-sel tubuh dan pertumbuhan. Kalsium dan vitamin D diperlukan untuk pertumbuhan tulang dan gigi yang kuat. Zat besi mencegah anemia yang dapat menghambat pertumbuhan dan perkembangan kognitif. Zinc berperan dalam sistem kekebalan tubuh dan pertumbuhan. Vitamin A penting untuk penglihatan dan sistem kekebalan tubuh. Asam folat diperlukan untuk pembentukan sel-sel baru dan pertumbuhan jaringan.\n\nSumber protein yang baik untuk anak antara lain daging, ikan, telur, susu, kacang-kacangan, dan produk kedelai seperti tahu dan tempe. Kalsium banyak terdapat dalam susu dan produk susu, ikan teri, dan sayuran hijau. Zat besi dapat diperoleh dari daging merah, hati, bayam, dan kacang-kacangan. Zinc banyak terdapat dalam daging, seafood, dan biji-bijian. Vitamin A dapat diperoleh dari sayuran dan buah berwarna oranye seperti wortel dan pepaya, serta hati. Vitamin D dapat diperoleh dari paparan sinar matahari pagi dan makanan seperti ikan berlemak dan kuning telur. Asam folat banyak terdapat dalam sayuran hijau, kacang-kacangan, dan biji-bijian.\n\nSelain memperhatikan jenis nutrisi, penting juga untuk memperhatikan pola makan anak. Anak sebaiknya mendapatkan makanan dengan gizi seimbang yang terdiri dari karbohidrat, protein, lemak, vitamin, dan mineral dalam jumlah yang cukup. Porsi makan anak juga perlu disesuaikan dengan usianya. Frekuensi makan yang dianjurkan adalah 3 kali makan utama dan 2-3 kali makanan selingan setiap hari.\n\nBerikut adalah beberapa tips untuk memastikan anak mendapatkan nutrisi yang cukup:\n\n1. Berikan makanan yang bervariasi untuk memastikan anak mendapatkan berbagai jenis nutrisi\n2. Sajikan makanan dengan warna-warni yang menarik untuk meningkatkan selera makan anak\n3. Libatkan anak dalam proses persiapan makanan untuk meningkatkan minat mereka terhadap makanan\n4. Jadilah contoh yang baik dengan mengonsumsi makanan bergizi\n5. Batasi makanan dan minuman yang tinggi gula, garam, dan lemak\n6. Pastikan anak mendapatkan cukup cairan, terutama air putih\n\nJika anak mengalami kesulitan makan atau memiliki kondisi kesehatan tertentu, konsultasikan dengan dokter atau ahli gizi untuk mendapatkan saran yang sesuai. Dengan memastikan anak mendapatkan nutrisi yang cukup dan seimbang, kita dapat membantu mencegah stunting dan mendukung pertumbuhan optimal mereka.",
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
      "Pola makan seimbang untuk anak usia 1-3 tahun harus mencakup berbagai kelompok makanan, termasuk karbohidrat, protein, lemak, serta buah dan sayuran. Porsi makan untuk anak usia ini biasanya sekitar 3/4 hingga 1 cangkir makanan per waktu makan, dengan frekuensi 3 kali makan utama dan 2-3 kali makanan selingan. Pastikan untuk memberikan sumber protein seperti daging, ikan, telur, atau tahu/tempe setiap hari. Berikan juga produk susu seperti susu, keju, atau yogurt untuk memenuhi kebutuhan kalsium. Buah dan sayuran berwarna-warni akan memberikan berbagai vitamin dan mineral penting. Batasi makanan manis, asin, dan berlemak tinggi.\n\nBerikut adalah contoh menu seimbang untuk anak usia 1-3 tahun:\n\nSarapan:\n- 1/2 cangkir sereal gandum utuh dengan susu\n- 1/2 buah pisang, dipotong kecil\n- 1/4 cangkir yogurt plain\n\nSelingan Pagi:\n- 1/2 buah apel, dipotong kecil\n- 1 keping biskuit gandum utuh\n\nMakan Siang:\n- 1/4 cangkir nasi\n- 30 gram ikan, dihaluskan atau dipotong kecil\n- 1/4 cangkir sayuran hijau yang dimasak\n- 1/4 buah tomat, dipotong kecil\n\nSelingan Sore:\n- 1/4 cangkir puding susu buatan sendiri\n- 1/2 buah jeruk, dipotong kecil\n\nMakan Malam:\n- 1/4 cangkir nasi\n- 30 gram ayam, dipotong kecil\n- 1/4 cangkir wortel yang dimasak\n- 1/4 cangkir brokoli yang dimasak\n\nSelingan Malam (opsional):\n- 1 gelas susu (120-180 ml)\n\nBeberapa tips untuk menyusun menu seimbang:\n\n1. Variasikan jenis makanan untuk memastikan anak mendapatkan berbagai nutrisi\n2. Perhatikan tekstur makanan sesuai kemampuan mengunyah anak\n3. Sajikan makanan dalam porsi kecil dan tambahkan jika anak masih lapar\n4. Hindari memberikan makanan yang berisiko tersedak seperti kacang utuh, buah anggur utuh, atau permen keras\n5. Batasi jus buah maksimal 120 ml per hari dan utamakan buah utuh\n6. Hindari memberikan minuman manis dan minuman bersoda\n\nPenting untuk diingat bahwa setiap anak memiliki kebutuhan dan preferensi yang berbeda. Beberapa anak mungkin makan lebih banyak atau lebih sedikit dari porsi yang disarankan. Yang terpenting adalah memastikan anak mendapatkan berbagai jenis makanan bergizi dan tumbuh dengan baik. Jika anak mengalami kesulitan makan atau ada kekhawatiran tentang pertumbuhannya, konsultasikan dengan dokter atau ahli gizi.",
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
      "1000 hari pertama kehidupan, mulai dari masa kehamilan hingga anak berusia 2 tahun, merupakan periode emas yang menentukan kualitas kesehatan, pertumbuhan, dan perkembangan anak di masa depan. Pada periode ini, otak dan organ tubuh lainnya berkembang dengan sangat pesat. Kekurangan gizi pada periode ini dapat menyebabkan kerusakan permanen pada pertumbuhan dan perkembangan anak, termasuk stunting. Oleh karena itu, asupan gizi yang cukup dan seimbang sangat penting, baik bagi ibu hamil maupun anak. Selain gizi, stimulasi yang tepat dan lingkungan yang sehat juga berperan penting dalam mendukung tumbuh kembang optimal anak pada 1000 hari pertama kehidupan.\n\nPada masa kehamilan, perkembangan janin sangat dipengaruhi oleh status gizi ibu. Ibu hamil membutuhkan tambahan kalori, protein, zat besi, asam folat, kalsium, dan berbagai vitamin dan mineral lainnya untuk mendukung pertumbuhan janin. Kekurangan gizi pada masa kehamilan dapat menyebabkan bayi lahir dengan berat badan rendah, yang merupakan salah satu faktor risiko stunting.\n\nSetelah lahir, ASI eksklusif selama 6 bulan pertama merupakan makanan terbaik untuk bayi. ASI mengandung semua nutrisi yang dibutuhkan bayi dan memiliki manfaat jangka panjang untuk kesehatan dan perkembangan anak. Setelah usia 6 bulan, bayi mulai membutuhkan makanan pendamping ASI (MPASI) untuk memenuhi kebutuhan nutrisinya yang meningkat. MPASI harus mengandung berbagai nutrisi penting seperti protein, zat besi, zinc, vitamin A, dan kalsium.\n\nSelain gizi, stimulasi dan interaksi yang tepat juga sangat penting untuk perkembangan otak anak. Berbicara, bernyanyi, membaca, dan bermain dengan anak dapat merangsang perkembangan kognitif, bahasa, dan sosial-emosional mereka. Lingkungan yang aman, bersih, dan sehat juga diperlukan untuk mencegah infeksi dan penyakit yang dapat menghambat pertumbuhan anak.\n\nBeberapa langkah penting untuk mengoptimalkan 1000 hari pertama kehidupan:\n\n1. Memastikan ibu hamil mendapatkan perawatan antenatal yang berkualitas dan gizi yang cukup\n2. Memberikan ASI eksklusif selama 6 bulan pertama\n3. Memberikan MPASI yang bergizi seimbang setelah usia 6 bulan, sambil melanjutkan pemberian ASI hingga usia 2 tahun atau lebih\n4. Memastikan anak mendapatkan imunisasi lengkap\n5. Memberikan stimulasi yang tepat sesuai tahap perkembangan anak\n6. Menjaga kebersihan dan sanitasi lingkungan\n7. Memantau pertumbuhan dan perkembangan anak secara rutin\n\nDengan memberikan perhatian khusus pada 1000 hari pertama kehidupan, kita dapat membantu anak mencapai potensi pertumbuhan dan perkembangan mereka secara optimal, serta mencegah stunting dan masalah kesehatan lainnya di masa depan.",
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
      "Memantau pertumbuhan anak secara berkala sangat penting untuk mendeteksi masalah pertumbuhan, termasuk stunting, sejak dini. Cara yang paling efektif adalah dengan rutin mengukur berat dan tinggi badan anak, kemudian memplotnya pada kurva pertumbuhan WHO. Untuk bayi dan anak di bawah 2 tahun, pengukuran panjang badan dilakukan dengan posisi berbaring, sementara untuk anak di atas 2 tahun, pengukuran tinggi badan dilakukan dengan posisi berdiri. Pemantauan sebaiknya dilakukan setiap bulan untuk bayi hingga usia 1 tahun, setiap 3 bulan untuk anak usia 1-2 tahun, dan setiap 6 bulan untuk anak di atas 2 tahun. Perhatikan juga tanda-tanda lain seperti perkembangan motorik, bahasa, dan sosial anak.\n\nBerikut adalah langkah-langkah untuk memantau pertumbuhan anak dengan benar:\n\n1. Pengukuran Berat Badan\n   - Gunakan timbangan yang akurat dan terkalibrasi\n   - Untuk bayi, gunakan timbangan bayi dengan ketelitian 10 gram\n   - Untuk anak yang sudah bisa berdiri, gunakan timbangan berdiri dengan ketelitian 100 gram\n   - Pastikan anak menggunakan pakaian minimal saat ditimbang\n   - Catat berat badan dengan tepat\n\n2. Pengukuran Panjang/Tinggi Badan\n   - Untuk anak usia < 2 tahun: Ukur panjang badan dengan posisi berbaring menggunakan alat pengukur panjang bayi\n   - Untuk anak usia ≥ 2 tahun: Ukur tinggi badan dengan posisi berdiri menggunakan stadiometer atau pita pengukur yang ditempel di dinding\n   - Pastikan posisi kepala, punggung, bokong, dan tumit (untuk pengukuran berdiri) atau kepala, punggung, bokong, dan tumit (untuk pengukuran berbaring) berada pada posisi yang benar\n   - Catat panjang/tinggi badan dengan tepat\n\n3. Plotting pada Kurva Pertumbuhan WHO\n   - Gunakan kurva pertumbuhan WHO yang sesuai dengan jenis kelamin dan usia anak\n   - Plot berat badan menurut usia (BB/U)\n   - Plot panjang/tinggi badan menurut usia (PB/U atau TB/U)\n   - Plot berat badan menurut panjang/tinggi badan (BB/PB atau BB/TB)\n   - Perhatikan tren pertumbuhan anak dari waktu ke waktu\n\n4. Interpretasi Hasil\n   - Pertumbuhan normal: Kurva pertumbuhan anak berada dalam kisaran normal (-2 SD hingga +2 SD) dan mengikuti pola kurva pertumbuhan\n   - Risiko stunting: Kurva tinggi badan menurut usia berada di bawah -1 SD hingga -2 SD\n   - Stunting: Kurva tinggi badan menurut usia berada di bawah -2 SD\n   - Stunting berat: Kurva tinggi badan menurut usia berada di bawah -3 SD\n\n5. Tindak Lanjut\n   - Jika pertumbuhan normal: Lanjutkan pemantauan rutin dan berikan pujian kepada orangtua\n   - Jika berisiko stunting: Tingkatkan asupan gizi anak dan pantau lebih sering\n   - Jika stunting: Konsultasikan dengan tenaga kesehatan untuk mendapatkan penanganan yang tepat\n\nSelain memantau pertumbuhan fisik, penting juga untuk memperhatikan perkembangan anak, termasuk kemampuan motorik, bahasa, kognitif, dan sosial-emosional. Gunakan alat skrining perkembangan seperti Kuesioner Pra Skrining Perkembangan (KPSP) untuk memantau perkembangan anak sesuai usianya.\n\nDengan memantau pertumbuhan dan perkembangan anak secara rutin, masalah seperti stunting dapat dideteksi sejak dini, sehingga intervensi dapat diberikan tepat waktu untuk mencegah dampak jangka panjang.",
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
      "Berikut adalah beberapa resep makanan bergizi yang mudah dibuat dan umumnya disukai anak-anak: 1) Bubur Ayam Sayuran: Kombinasi nasi, ayam cincang, wortel, dan bayam yang kaya protein dan vitamin. 2) Pancake Pisang: Menggunakan tepung gandum utuh, pisang matang, dan sedikit madu sebagai pemanis alami. 3) Nugget Ikan Homemade: Terbuat dari ikan giling, wortel parut, dan sedikit tepung, kemudian dipanggang bukan digoreng. 4) Smoothie Buah dan Sayur: Campuran buah-buahan seperti pisang dan stroberi dengan sayuran seperti bayam, ditambah yogurt untuk kalsium. 5) Sup Bola-bola Daging: Berisi bola-bola daging sapi atau ayam dengan berbagai sayuran seperti wortel, kentang, dan brokoli. Variasikan menu anak setiap hari untuk memastikan ia mendapatkan berbagai nutrisi penting.\n\nBerikut adalah resep lengkap untuk beberapa makanan tersebut:\n\n1. Bubur Ayam Sayuran\n   Bahan:\n   - 100 gram beras, dicuci bersih\n   - 50 gram daging ayam, dipotong kecil atau dicincang\n   - 1 buah wortel kecil, diparut atau dipotong kecil\n   - 25 gram bayam, dipotong halus\n   - 1 siung bawang putih, dicincang halus\n   - 1/2 cm jahe, dimemarkan\n   - 500-600 ml air kaldu ayam atau air biasa\n   - 1 sendok teh minyak zaitun\n   - Garam secukupnya (untuk anak di atas 1 tahun)\n\n   Cara Membuat:\n   - Panaskan minyak, tumis bawang putih dan jahe hingga harum\n   - Masukkan daging ayam, aduk hingga berubah warna\n   - Tambahkan beras, aduk sebentar\n   - Tuang air kaldu, masak dengan api kecil hingga beras menjadi bubur\n   - Masukkan wortel saat bubur setengah matang\n   - Tambahkan bayam 2-3 menit sebelum bubur matang\n   - Tambahkan garam secukupnya (untuk anak di atas 1 tahun)\n   - Aduk rata dan sajikan hangat\n\n2. Pancake Pisang\n   Bahan:\n   - 100 gram tepung gandum utuh\n   - 1 butir telur\n   - 1 buah pisang matang, dihaluskan\n   - 120 ml susu\n   - 1/2 sendok teh baking powder\n   - 1/4 sendok teh kayu manis bubuk (opsional)\n   - 1 sendok teh madu (untuk anak di atas 1 tahun) atau 1 sendok teh gula pasir\n   - 1 sendok teh minyak zaitun untuk mengoles wajan\n\n   Cara Membuat:\n   - Campurkan tepung, baking powder, dan kayu manis dalam mangkuk\n   - Di mangkuk terpisah, kocok telur, tambahkan pisang yang sudah dihaluskan, susu, dan madu/gula\n   - Tuang campuran basah ke dalam campuran kering, aduk hingga rata\n   - Panaskan wajan anti lengket, oles dengan sedikit minyak zaitun\n   - Tuang adonan 2 sendok makan untuk setiap pancake\n   - Masak hingga muncul gelembung di permukaan, balik dan masak sisi lainnya\n   - Sajikan dengan potongan buah segar\n\n3. Nugget Ikan Homemade\n   Bahan:\n   - 200 gram ikan fillet tanpa duri (kakap, nila, atau salmon)\n   - 1 buah wortel kecil, diparut halus\n   - 1 butir telur\n   - 2 sendok makan tepung terigu\n   - 1 sendok makan tepung maizena\n   - 1 siung bawang putih, dihaluskan\n   - 1 sendok teh parsley cincang (opsional)\n   - Garam secukupnya (untuk anak di atas 1 tahun)\n   - Tepung panir secukupnya\n   - Minyak zaitun untuk olesan\n\n   Cara Membuat:\n   - Haluskan ikan menggunakan food processor atau blender\n   - Campurkan ikan halus dengan wortel parut, telur, tepung terigu, tepung maizena, bawang putih, parsley, dan garam\n   - Aduk hingga rata\n   - Bentuk adonan menjadi nugget sesuai selera\n   - Gulingkan nugget ke dalam tepung panir hingga rata\n   - Letakkan nugget di atas loyang yang sudah diolesi minyak zaitun\n   - Panggang dalam oven dengan suhu 180°C selama 15-20 menit atau hingga matang dan kecokelatan\n   - Sajikan dengan saus tomat buatan sendiri\n\nVariasikan menu anak setiap hari dan pastikan untuk menyajikan makanan dengan warna-warni yang menarik untuk meningkatkan selera makan anak. Selalu perhatikan alergi atau intoleransi makanan yang mungkin dimiliki anak, dan konsultasikan dengan dokter atau ahli gizi jika anak memiliki kebutuhan gizi khusus.",
    image: "/placeholder.svg?height=200&width=400",
    date: "15 April 2025",
    category: "Resep",
  },
]

// GET /api/articles/[id] - Mendapatkan artikel berdasarkan ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari artikel berdasarkan ID
  const article = articles.find((article) => article.id === id)

  if (!article) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })
  }

  return NextResponse.json(article)
}

// PUT /api/articles/[id] - Memperbarui artikel berdasarkan ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // Validasi data
    if (!body.title || !body.excerpt || !body.content || !body.category) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
    }

    // Cari indeks artikel
    const index = articles.findIndex((article) => article.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })
    }

    // Perbarui artikel
    const updatedArticle = {
      ...articles[index],
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image || articles[index].image,
      category: body.category,
    }

    articles[index] = updatedArticle

    return NextResponse.json(updatedArticle)
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan" }, { status: 500 })
  }
}

// DELETE /api/articles/[id] - Menghapus artikel berdasarkan ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  // Cari indeks artikel
  const index = articles.findIndex((article) => article.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })
  }

  // Hapus artikel
  const deletedArticle = articles[index]
  articles = articles.filter((article) => article.id !== id)

  return NextResponse.json(deletedArticle)
}
