const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@stunting.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@stunting.com",
      password: hashedPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log("👤 Admin user created:", admin.email);

  // Seed articles
  const articles = [
    {
      title: "Mengenal Stunting dan Dampaknya pada Anak",
      content:
        "Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis...",
      category: "Pengetahuan Dasar",
      imageUrl: "/images/stunting-basic.jpg",
    },
    {
      title: "Nutrisi Penting untuk Mencegah Stunting",
      content:
        "Nutrisi yang tepat sangat penting dalam 1000 hari pertama kehidupan...",
      category: "Nutrisi",
      imageUrl: "/images/nutrition.jpg",
    },
    {
      title: "Pentingnya 1000 Hari Pertama Kehidupan",
      content:
        "1000 hari pertama kehidupan adalah periode emas untuk pertumbuhan anak...",
      category: "Pengetahuan Dasar",
      imageUrl: "/images/1000-days.jpg",
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { title: article.title },
      update: {},
      create: article,
    });
  }

  console.log("📚 Articles seeded");

  // Seed recommendations
  const recommendations = [
    {
      title: "Berikan ASI Eksklusif",
      description:
        "ASI eksklusif selama 6 bulan pertama sangat penting untuk pertumbuhan optimal",
      category: "Nutrisi",
      targetAge: "0-6",
      targetGender: null,
    },
    {
      title: "Makanan Pendamping ASI yang Bergizi",
      description: "Mulai berikan MPASI bergizi seimbang setelah usia 6 bulan",
      category: "Nutrisi",
      targetAge: "6-12",
      targetGender: null,
    },
    {
      title: "Stimulasi untuk Perkembangan Otak",
      description:
        "Berikan stimulasi yang tepat untuk mendukung perkembangan kognitif anak",
      category: "Perkembangan Anak",
      targetAge: "12-24",
      targetGender: null,
    },
  ];

  for (const rec of recommendations) {
    await prisma.recommendation.upsert({
      where: { title: rec.title },
      update: {},
      create: rec,
    });
  }

  console.log("💡 Recommendations seeded");
  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
