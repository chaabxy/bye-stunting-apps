const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Base URL untuk API data Indonesia
const BASE_URL = "https://ibnux.github.io/data-indonesia";

// Fungsi untuk fetch data dengan error handling
async function fetchData(url) {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

// Fungsi untuk delay (menghindari rate limiting)
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function seedProvinces() {
  console.log("🏛️  Seeding provinces...");

  const provincesData = await fetchData(`${BASE_URL}/provinsi.json`);
  if (!provincesData) {
    console.error("❌ Failed to fetch provinces data");
    return [];
  }

  const provinces = [];
  for (const province of provincesData) {
    try {
      const createdProvince = await prisma.province.upsert({
        where: { id: province.id },
        update: { name: province.nama },
        create: {
          id: province.id,
          name: province.nama,
        },
      });
      provinces.push(createdProvince);
      console.log(`✅ Province: ${province.nama}`);
    } catch (error) {
      console.error(
        `❌ Error creating province ${province.nama}:`,
        error.message
      );
    }
  }

  console.log(`📊 Total provinces seeded: ${provinces.length}`);
  return provinces;
}

async function seedRegencies(provinces) {
  console.log("🏘️  Seeding regencies...");

  let totalRegencies = 0;

  for (const province of provinces) {
    console.log(`\n📍 Processing regencies for: ${province.name}`);

    const regenciesData = await fetchData(
      `${BASE_URL}/kabupaten/${province.id}.json`
    );
    if (!regenciesData) {
      console.error(
        `❌ Failed to fetch regencies for province ${province.name}`
      );
      continue;
    }

    for (const regency of regenciesData) {
      try {
        await prisma.regency.upsert({
          where: { id: regency.id },
          update: {
            name: regency.nama,
            provinceId: province.id,
          },
          create: {
            id: regency.id,
            name: regency.nama,
            provinceId: province.id,
          },
        });
        totalRegencies++;
        console.log(`  ✅ Regency: ${regency.nama}`);
      } catch (error) {
        console.error(
          `  ❌ Error creating regency ${regency.nama}:`,
          error.message
        );
      }
    }

    // Delay untuk menghindari rate limiting
    await delay(100);
  }

  console.log(`📊 Total regencies seeded: ${totalRegencies}`);
}

async function seedDistricts() {
  console.log("🏫 Seeding districts...");

  const regencies = await prisma.regency.findMany({
    include: { province: true },
  });

  let totalDistricts = 0;

  for (const regency of regencies) {
    console.log(
      `\n📍 Processing districts for: ${regency.name}, ${regency.province.name}`
    );

    const districtsData = await fetchData(
      `${BASE_URL}/kecamatan/${regency.id}.json`
    );
    if (!districtsData) {
      console.error(`❌ Failed to fetch districts for regency ${regency.name}`);
      continue;
    }

    for (const district of districtsData) {
      try {
        await prisma.district.upsert({
          where: { id: district.id },
          update: {
            name: district.nama,
            regencyId: regency.id,
          },
          create: {
            id: district.id,
            name: district.nama,
            regencyId: regency.id,
          },
        });
        totalDistricts++;
        console.log(`  ✅ District: ${district.nama}`);
      } catch (error) {
        console.error(
          `  ❌ Error creating district ${district.nama}:`,
          error.message
        );
      }
    }

    // Delay untuk menghindari rate limiting
    await delay(100);
  }

  console.log(`📊 Total districts seeded: ${totalDistricts}`);
}

async function seedVillages() {
  console.log("🏠 Seeding villages...");

  const districts = await prisma.district.findMany({
    include: {
      regency: {
        include: { province: true },
      },
    },
  });

  let totalVillages = 0;

  for (const district of districts) {
    console.log(
      `\n📍 Processing villages for: ${district.name}, ${district.regency.name}, ${district.regency.province.name}`
    );

    const villagesData = await fetchData(
      `${BASE_URL}/kelurahan/${district.id}.json`
    );
    if (!villagesData) {
      console.error(
        `❌ Failed to fetch villages for district ${district.name}`
      );
      continue;
    }

    // Process villages in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < villagesData.length; i += batchSize) {
      const batch = villagesData.slice(i, i + batchSize);

      for (const village of batch) {
        try {
          await prisma.village.upsert({
            where: { id: village.id },
            update: {
              name: village.nama,
              districtId: district.id,
            },
            create: {
              id: village.id,
              name: village.nama,
              districtId: district.id,
            },
          });
          totalVillages++;

          // Log setiap 10 villages untuk mengurangi spam
          if (totalVillages % 10 === 0) {
            console.log(`  ✅ Villages processed: ${totalVillages}`);
          }
        } catch (error) {
          console.error(
            `  ❌ Error creating village ${village.nama}:`,
            error.message
          );
        }
      }

      // Delay setiap batch
      await delay(50);
    }

    console.log(`  📊 Villages in ${district.name}: ${villagesData.length}`);

    // Delay antar district
    await delay(100);
  }

  console.log(`📊 Total villages seeded: ${totalVillages}`);
}

async function main() {
  console.log("🌱 Starting Indonesia location data seeding...");
  console.log(
    "⚠️  This process may take a while due to the large amount of data"
  );

  try {
    // Step 1: Seed provinces
    const provinces = await seedProvinces();
    if (provinces.length === 0) {
      console.error("❌ No provinces were seeded. Stopping process.");
      return;
    }

    // Step 2: Seed regencies
    await seedRegencies(provinces);

    // Step 3: Seed districts
    await seedDistricts();

    // Step 4: Seed villages
    await seedVillages();

    // Final statistics
    const stats = await prisma.$transaction([
      prisma.province.count(),
      prisma.regency.count(),
      prisma.district.count(),
      prisma.village.count(),
    ]);

    console.log("\n🎉 Seeding completed successfully!");
    console.log("📊 Final Statistics:");
    console.log(`   Provinces: ${stats[0]}`);
    console.log(`   Regencies: ${stats[1]}`);
    console.log(`   Districts: ${stats[2]}`);
    console.log(`   Villages: ${stats[3]}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("❌ Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
