// /**
//  * Service untuk memberikan rekomendasi artikel berdasarkan hasil prediksi
//  */

// /**
//  * Mendapatkan rekomendasi artikel berdasarkan status stunting
//  */
// async function getRecommendedArticles(status, usia, jenisKelamin) {
//   try {
//     console.log(`🔄 Generating recommendations for: ${status}, age: ${usia} months, gender: ${jenisKelamin}`)

//     let recommendations = []

//     // Rekomendasi berdasarkan status
//     if (status === "stunting") {
//       recommendations = [
//         {
//           id: 1,
//           title: "Mengenal Stunting dan Dampaknya pada Anak",
//           category: "Pengetahuan Dasar",
//           relevanceScore: 0.95,
//         },
//         {
//           id: 2,
//           title: "Nutrisi Penting untuk Mencegah Stunting",
//           category: "Nutrisi",
//           relevanceScore: 0.9,
//         },
//         {
//           id: 6,
//           title: "Resep Makanan Bergizi untuk Balita",
//           category: "Resep",
//           relevanceScore: 0.85,
//         },
//         {
//           id: 9,
//           title: "Peran ASI dalam Mencegah Stunting",
//           category: "Nutrisi",
//           relevanceScore: 0.8,
//         },
//         {
//           id: 10,
//           title: "Suplemen Gizi untuk Anak: Kapan Dibutuhkan?",
//           category: "Nutrisi",
//           relevanceScore: 0.75,
//         },
//       ]
//     } else if (status === "berisiko") {
//       recommendations = [
//         {
//           id: 3,
//           title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun",
//           category: "Nutrisi",
//           relevanceScore: 0.9,
//         },
//         {
//           id: 5,
//           title: "Cara Memantau Pertumbuhan Anak dengan Benar",
//           category: "Tips Praktis",
//           relevanceScore: 0.85,
//         },
//         {
//           id: 2,
//           title: "Nutrisi Penting untuk Mencegah Stunting",
//           category: "Nutrisi",
//           relevanceScore: 0.8,
//         },
//         {
//           id: 8,
//           title: "Mengatasi Anak Susah Makan",
//           category: "Tips Praktis",
//           relevanceScore: 0.75,
//         },
//         {
//           id: 7,
//           title: "Stimulasi untuk Perkembangan Otak Anak",
//           category: "Perkembangan Anak",
//           relevanceScore: 0.7,
//         },
//       ]
//     } else {
//       // Normal
//       recommendations = [
//         {
//           id: 4,
//           title: "Pentingnya 1000 Hari Pertama Kehidupan",
//           category: "Pengetahuan Dasar",
//           relevanceScore: 0.85,
//         },
//         {
//           id: 7,
//           title: "Stimulasi untuk Perkembangan Otak Anak",
//           category: "Perkembangan Anak",
//           relevanceScore: 0.8,
//         },
//         {
//           id: 3,
//           title: "Pola Makan Seimbang untuk Anak Usia 1-3 Tahun",
//           category: "Nutrisi",
//           relevanceScore: 0.75,
//         },
//         {
//           id: 5,
//           title: "Cara Memantau Pertumbuhan Anak dengan Benar",
//           category: "Tips Praktis",
//           relevanceScore: 0.7,
//         },
//         {
//           id: 6,
//           title: "Resep Makanan Bergizi untuk Balita",
//           category: "Resep",
//           relevanceScore: 0.65,
//         },
//       ]
//     }

//     // Filter berdasarkan usia jika diperlukan
//     if (usia < 12) {
//       // Bayi di bawah 1 tahun
//       recommendations = recommendations.filter(
//         (article) =>
//           article.category === "Nutrisi" || article.title.includes("ASI") || article.title.includes("1000 Hari"),
//       )
//     }

//     // Urutkan berdasarkan relevance score
//     recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)

//     // Ambil maksimal 5 artikel teratas
//     const topRecommendations = recommendations.slice(0, 5)

//     console.log(`✅ Generated ${topRecommendations.length} recommendations`)
//     return topRecommendations
//   } catch (error) {
//     console.error("❌ Error generating recommendations:", error)
//     throw new Error("Failed to generate recommendations")
//   }
// }

// module.exports = {
//   getRecommendedArticles,
// }
