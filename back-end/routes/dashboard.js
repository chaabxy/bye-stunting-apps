/**
 * Dashboard Routes
 * Berisi endpoint-endpoint untuk dashboard admin
 */

const routes = [
  // 1. Endpoint edukasiPopuler - Mengambil data edukasi populer
  {
    method: "GET",
    path: "/api/dashboard/edukasi-populer",
    handler: async (request, h) => {
      console.log("📊 Fetching popular education data for dashboard");

      // Ambil prisma client dari server
      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for popular education query");
        return h
          .response({
            isError: false,
            message: "Database tidak tersedia",
            data: [],
          })
          .code(200);
      }

      try {
        // Cek apakah tabel educations ada
        try {
          await prisma.$queryRaw`SELECT 1 FROM educations LIMIT 1`;
        } catch (error) {
          console.log("⚠️ Educations table not found:", error.message);
          return h
            .response({
              isError: false,
              message: "Tabel edukasi belum tersedia",
              data: [],
            })
            .code(200);
        }

        // Query untuk mendapatkan edukasi populer
        const edukasiPopuler = await prisma.$queryRaw`
          SELECT id, title, view_count 
          FROM educations 
          ORDER BY view_count DESC 
          LIMIT 5
        `;

        console.log(
          `✅ Successfully fetched ${edukasiPopuler.length} popular education items`
        );

        return h
          .response({
            isError: false,
            message: "Data edukasi populer berhasil diambil",
            data: edukasiPopuler,
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching popular education:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil data edukasi populer",
            error: error.message,
          })
          .code(500);
      }
    },
  },

  // 2. Endpoint unreadMessages - Mengambil data pesan yang belum dibaca
  {
    method: "GET",
    path: "/api/dashboard/unread-messages",
    handler: async (request, h) => {
      console.log("📊 Fetching unread messages for dashboard");

      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for unread messages query");
        return h
          .response({
            isError: false,
            message: "Database tidak tersedia",
            data: {
              messages: [],
              summary: {
                total: 0,
                unread: 0,
              },
            },
          })
          .code(200);
      }

      try {
        // Cek apakah tabel contact_messages ada
        try {
          await prisma.$queryRaw`SELECT 1 FROM contact_messages LIMIT 1`;
        } catch (error) {
          console.log("⚠️ Contact_messages table not found:", error.message);
          return h
            .response({
              isError: false,
              message: "Tabel pesan kontak belum tersedia",
              data: {
                messages: [],
                summary: {
                  total: 0,
                  unread: 0,
                },
              },
            })
            .code(200);
        }

        // ✅ Query untuk mendapatkan pesan yang belum dibaca (nama kolom disesuaikan)
        const unreadMessages = await prisma.$queryRaw`
        SELECT 
          id, 
          nama_lengkap AS name, 
          email, 
          subjek AS subject, 
          status, 
          created_at 
        FROM contact_messages 
        WHERE status = 'BelumDibaca' 
        ORDER BY created_at DESC 
        LIMIT 5
      `;

        // ✅ Query untuk mendapatkan summary (pastikan status cocok)
        const summary = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'BelumDibaca' THEN 1 ELSE 0 END) as unread
        FROM contact_messages
      `;

        console.log(
          `✅ Successfully fetched ${unreadMessages.length} unread messages`
        );
        console.log(
          `📊 Message summary: Total=${summary[0].total}, Unread=${summary[0].unread}`
        );

        return h
          .response({
            isError: false,
            message: "Data pesan yang belum dibaca berhasil diambil",
            data: {
              messages: unreadMessages,
              summary: {
                total: Number(summary[0].total) || 0,
                unread: Number(summary[0].unread) || 0,
              },
            },
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching unread messages:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil data pesan yang belum dibaca",
            error: error.message,
          })
          .code(500);
      }
    },
  },

  // 3. Endpoint lastStuntingRecords - Mengambil data rekaman stunting terakhir
  {
    method: "GET",
    path: "/api/dashboard/last-stunting-records",
    handler: async (request, h) => {
      console.log("📊 Fetching last stunting records for dashboard");

      // Ambil prisma client dari server
      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for stunting records query");
        return h
          .response({
            isError: false,
            message: "Database tidak tersedia",
            data: [],
          })
          .code(200);
      }

      try {
        // Cek apakah tabel stunting_records ada
        try {
          await prisma.$queryRaw`SELECT 1 FROM stunting_records LIMIT 1`;
        } catch (error) {
          console.log("⚠️ Stunting_records table not found:", error.message);
          return h
            .response({
              isError: false,
              message: "Tabel rekaman stunting belum tersedia",
              data: [],
            })
            .code(200);
        }

        // Query untuk mendapatkan rekaman stunting terakhir
        const lastStuntingRecords = await prisma.$queryRaw`
        SELECT id, child_name AS name, created_at
        FROM stunting_records
        ORDER BY created_at DESC
        LIMIT 5
        `;

        console.log(
          `✅ Successfully fetched ${lastStuntingRecords.length} last stunting records`
        );

        return h
          .response({
            isError: false,
            message: "Data rekaman stunting terakhir berhasil diambil",
            data: lastStuntingRecords,
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching last stunting records:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil data rekaman stunting terakhir",
            error: error.message,
          })
          .code(500);
      }
    },
  },

  // Endpoint untuk mendapatkan semua data dashboard sekaligus
  {
    method: "GET",
    path: "/api/dashboard/summary",
    handler: async (request, h) => {
      console.log("📊 Fetching dashboard summary");

      // Ambil prisma client dari server
      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for dashboard summary");
        return h
          .response({
            isError: false,
            message: "Database tidak tersedia",
            data: {
              edukasiPopuler: [],
              unreadMessages: {
                messages: [],
                summary: { total: 0, unread: 0 },
              },
              lastStuntingRecords: [],
            },
          })
          .code(200);
      }

      try {
        // Inisialisasi data default
        let edukasiPopuler = [];
        let unreadMessages = [];
        let messageSummary = { total: 0, unread: 0 };
        let lastStuntingRecords = [];

        // 1. Coba ambil data edukasi populer
        try {
          edukasiPopuler = await prisma.$queryRaw`
            SELECT id, title, view_count 
            FROM educations 
            ORDER BY view_count DESC 
            LIMIT 5
          `;
          console.log(
            `✅ Successfully fetched ${edukasiPopuler.length} popular education items`
          );
        } catch (error) {
          console.log("⚠️ Could not fetch popular education:", error.message);
        }

        // 2. Coba ambil data pesan yang belum dibaca
        try {
          unreadMessages = await prisma.$queryRaw`
            SELECT id, name, email, subject, status, created_at
            FROM contact_messages 
            WHERE status = 'baru' 
            ORDER BY created_at DESC 
            LIMIT 5
          `;

          const summary = await prisma.$queryRaw`
            SELECT 
              COUNT(*) as total,
              SUM(CASE WHEN status = 'baru' THEN 1 ELSE 0 END) as unread
            FROM contact_messages
          `;

          messageSummary = {
            total: Number(summary[0].total) || 0,
            unread: Number(summary[0].unread) || 0,
          };

          console.log(
            `✅ Successfully fetched ${unreadMessages.length} unread messages`
          );
          console.log(
            `📊 Message summary: Total=${messageSummary.total}, Unread=${messageSummary.unread}`
          );
        } catch (error) {
          console.log("⚠️ Could not fetch unread messages:", error.message);
        }

        // 3. Coba ambil data rekaman stunting terakhir
        try {
          lastStuntingRecords = await prisma.$queryRaw`
            SELECT id, name, age, gender, height, weight, status, created_at
            FROM stunting_records 
            ORDER BY created_at DESC 
            LIMIT 5
          `;
          console.log(
            `✅ Successfully fetched ${lastStuntingRecords.length} last stunting records`
          );
        } catch (error) {
          console.log(
            "⚠️ Could not fetch last stunting records:",
            error.message
          );
        }

        return h
          .response({
            isError: false,
            message: "Data dashboard berhasil diambil",
            data: {
              edukasiPopuler,
              unreadMessages: {
                messages: unreadMessages,
                summary: messageSummary,
              },
              lastStuntingRecords,
            },
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching dashboard summary:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil data dashboard",
            error: error.message,
          })
          .code(500);
      }
    },
  },

  // 4. Endpoint untuk mendapatkan daftar provinsi yang memiliki data stunting
  {
    method: "GET",
    path: "/api/provinces-with-data",
    handler: async (request, h) => {
      console.log("🌍 Fetching provinces with stunting data");

      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for provinces query");
        return h
          .response({
            success: false,
            message: "Database tidak tersedia",
            data: [],
          })
          .code(200);
      }

      try {
        // Cek apakah tabel stunting_records dan provinces ada
        try {
          await prisma.$queryRaw`SELECT 1 FROM stunting_records LIMIT 1`;
          await prisma.$queryRaw`SELECT 1 FROM provinces LIMIT 1`;
        } catch (error) {
          console.log("⚠️ Required tables not found:", error.message);
          return h
            .response({
              success: false,
              message: "Tabel yang diperlukan belum tersedia",
              data: [],
            })
            .code(200);
        }

        // Query untuk mendapatkan provinsi yang memiliki data stunting
        // First, let's check what columns exist in stunting_records
        console.log("🔍 Checking stunting_records table structure...");
        try {
          const tableInfo = await prisma.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'stunting_records'
          `;
          console.log(
            "📋 Available columns in stunting_records:",
            tableInfo.map((col) => col.column_name).join(", ")
          );
        } catch (error) {
          console.log("⚠️ Could not check table structure:", error.message);
        }

        // Query untuk mendapatkan provinsi yang memiliki data stunting
        // Menggunakan kolom provinceId yang sudah dikonfirmasi ada
        const provincesWithData = await prisma.$queryRaw`
          SELECT DISTINCT p.id, p.name
          FROM provinces p
          INNER JOIN stunting_records sr ON sr."provinceId" = p.id
          ORDER BY p.name ASC
        `;

        console.log(
          `✅ Successfully fetched ${provincesWithData.length} provinces with stunting data`
        );
        console.log(
          "📋 Provinces found:",
          provincesWithData.map((p) => p.name).join(", ")
        );

        return h
          .response({
            success: true,
            message: "Data provinsi berhasil diambil",
            data: provincesWithData,
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching provinces with data:", error);
        return h
          .response({
            success: false,
            message: "Gagal mengambil data provinsi",
            error: error.message,
          })
          .code(500);
      }
    },
  },

  // 5. Endpoint untuk mendapatkan detail statistik stunting per provinsi - DIPERBAIKI
  {
    method: "GET",
    path: "/api/health-data/province-detail",
    handler: async (request, h) => {
      const { provinceId } = request.query;

      console.log(
        `📊 Fetching stunting statistics for province ID: ${provinceId}`
      );

      if (!provinceId) {
        console.log("⚠️ Province ID not provided");
        return h
          .response({
            success: false,
            message: "Province ID diperlukan",
          })
          .code(400);
      }

      const prisma = request.server.app.prisma;

      if (!prisma) {
        console.log("⚠️ Database not available for province detail query");
        return h
          .response({
            success: false,
            message: "Database tidak tersedia",
            normal: 0,
            stunting: 0,
            stuntingBerat: 0,
            totalChildren: 0,
          })
          .code(200);
      }

      try {
        // Cek apakah tabel stunting_records ada
        try {
          await prisma.$queryRaw`SELECT 1 FROM stunting_records LIMIT 1`;
        } catch (error) {
          console.log("⚠️ Stunting_records table not found:", error.message);
          return h
            .response({
              success: false,
              message: "Tabel stunting_records belum tersedia",
              normal: 0,
              stunting: 0,
              stuntingBerat: 0,
              totalChildren: 0,
            })
            .code(200);
        }

        // PERTAMA: Lihat semua status yang ada di database untuk provinsi ini
        console.log(
          "🔍 Checking all available status values for this province..."
        );
        const allStatuses = await prisma.$queryRaw`
          SELECT DISTINCT status, COUNT(*) as count
          FROM stunting_records 
          WHERE "provinceId" = ${provinceId}
          GROUP BY status
          ORDER BY status
        `;

        console.log("📋 All status values found in database:", allStatuses);

        // KEDUA: Hitung total anak
        const totalResult = await prisma.$queryRaw`
          SELECT COUNT(*) as total_children
          FROM stunting_records 
          WHERE "provinceId" = ${provinceId}
        `;

        const totalChildren = Number(totalResult[0].total_children) || 0;
        console.log(
          `📊 Total children in province ${provinceId}: ${totalChildren}`
        );

        if (totalChildren === 0) {
          console.log("⚠️ No children found for this province");
          return h
            .response({
              normal: 0,
              stunting: 0,
              stuntingBerat: 0,
              totalChildren: 0,
            })
            .code(200);
        }

        // KETIGA: Kategorisasi yang lebih komprehensif
        let normalCount = 0;
        let stuntingCount = 0;
        let stuntingBeratCount = 0;

        allStatuses.forEach((record) => {
          const count = Number(record.count) || 0;
          const status = (record.status || "").toLowerCase().trim();

          console.log(
            `🔍 Processing status: "${record.status}" (normalized: "${status}") with count: ${count}`
          );

          // Kategorisasi berdasarkan semua kemungkinan status
          if (status === "normal" || status === "sehat" || status === "baik") {
            normalCount += count;
            console.log(
              `  ✅ Added ${count} to NORMAL (total normal: ${normalCount})`
            );
          } else if (status === "stunting" || status === "pendek") {
            stuntingCount += count;
            console.log(
              `  ⚠️ Added ${count} to STUNTING (total stunting: ${stuntingCount})`
            );
          } else if (
            status === "stunting berat" ||
            status === "severe stunting" ||
            status === "severely stunted" ||
            status === "sangat pendek" ||
            status === "stunted severely" ||
            status.includes("berat") ||
            status.includes("severe")
          ) {
            stuntingBeratCount += count;
            console.log(
              `  🔴 Added ${count} to STUNTING BERAT (total stunting berat: ${stuntingBeratCount})`
            );
          } else {
            // Status tidak dikenal, log untuk investigasi
            console.log(
              `  ❓ UNKNOWN STATUS: "${record.status}" - adding to NORMAL as fallback`
            );
            normalCount += count;
          }
        });

        // KEEMPAT: Hitung persentase
        const normalPercentage =
          totalChildren > 0
            ? Math.round((normalCount / totalChildren) * 100)
            : 0;
        const stuntingPercentage =
          totalChildren > 0
            ? Math.round((stuntingCount / totalChildren) * 100)
            : 0;
        const stuntingBeratPercentage =
          totalChildren > 0
            ? Math.round((stuntingBeratCount / totalChildren) * 100)
            : 0;

        const result = {
          normal: normalPercentage,
          stunting: stuntingPercentage,
          stuntingBerat: stuntingBeratPercentage,
          totalChildren: totalChildren,
        };

        // KELIMA: Validasi dan logging
        const totalPercentage =
          normalPercentage + stuntingPercentage + stuntingBeratPercentage;

        console.log(`✅ Province ${provinceId} FINAL statistics:`);
        console.log(`   📈 Total Children: ${totalChildren}`);
        console.log(
          `   🟢 Normal: ${normalCount} children (${normalPercentage}%)`
        );
        console.log(
          `   🟡 Stunting: ${stuntingCount} children (${stuntingPercentage}%)`
        );
        console.log(
          `   🔴 Stunting Berat: ${stuntingBeratCount} children (${stuntingBeratPercentage}%)`
        );
        console.log(
          `   📊 Total Percentage: ${totalPercentage}% (should be ~100%)`
        );

        if (Math.abs(totalPercentage - 100) > 5) {
          console.log(
            `⚠️ WARNING: Total percentage is ${totalPercentage}%, not close to 100%`
          );
        }

        return h.response(result).code(200);
      } catch (error) {
        console.error("❌ Error fetching province detail:", error);
        return h
          .response({
            success: false,
            message: "Gagal mengambil detail provinsi",
            error: error.message,
            normal: 0,
            stunting: 0,
            stuntingBerat: 0,
            totalChildren: 0,
          })
          .code(500);
      }
    },
  },
];

module.exports = routes;
