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

      console.log(`✅ Successfully fetched ${unreadMessages.length} unread messages`);
      console.log(`📊 Message summary: Total=${summary[0].total}, Unread=${summary[0].unread}`);

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
];

module.exports = routes;
