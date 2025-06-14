// Backend route handler untuk contact messages
const Joi = require("joi");
const { PrismaClient } = require("@prisma/client");

// Fungsi untuk mendapatkan Prisma client
const getPrismaClient = () => {
  try {
    return new PrismaClient();
  } catch (error) {
    console.error("❌ Prisma client error:", error);
    return null;
  }
};

// Fungsi untuk memastikan tabel contact_messages ada
const ensureContactMessagesTable = async (prisma) => {
  if (!prisma) return false;

  try {
    console.log("🔍 Memeriksa keberadaan tabel contact_messages...");

    // Coba cek apakah tabel sudah ada
    try {
      await prisma.$queryRaw`SELECT 1 FROM contact_messages LIMIT 1`;
      console.log("✅ Tabel contact_messages sudah ada");
      return true;
    } catch (error) {
      console.log("⚠️ Tabel contact_messages belum ada, mencoba membuat...");

      // Buat tabel jika belum ada
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          nama_lengkap VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subjek VARCHAR(255) NOT NULL,
          pesan TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'BelumDibaca',
          tanggal_kirim TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          tanggal_balas TIMESTAMP NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Buat enum type jika belum ada
      await prisma.$executeRaw`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageStatus') THEN
            CREATE TYPE "MessageStatus" AS ENUM ('BelumDibaca', 'Dibalas', 'Ditolak');
          END IF;
        EXCEPTION
          WHEN duplicate_object THEN
            NULL;
        END$$;
      `;

      console.log("✅ Tabel contact_messages berhasil dibuat");
      return true;
    }
  } catch (error) {
    console.error("❌ Gagal memeriksa/membuat tabel contact_messages:", error);
    return false;
  }
};

const messagesRoutes = [
  // Create new message (public route untuk contact form)
  {
    method: "POST",
    path: "/api/messages",
    options: { auth: false },
    handler: async (request, h) => {
      try {
        console.log("📨 Menerima pesan kontak baru:");
        console.log("   - Data:", request.payload);

        // Validate input - perbaiki untuk menerima 'nama' sebagai 'nama_lengkap'
        const { error, value } = Joi.object({
          nama_lengkap: Joi.string().optional(),
          nama: Joi.string().optional(),
          email: Joi.string().email().required(),
          subjek: Joi.string().required(),
          pesan: Joi.string().required(),
        }).validate(request.payload);

        if (error) {
          console.log("❌ Validation error:", error.details[0].message);
          return h
            .response({
              isError: true,
              message: error.details[0].message,
            })
            .code(400);
        }

        // Custom validation untuk memastikan salah satu nama field ada
        if (!value.nama_lengkap && !value.nama) {
          return h
            .response({
              isError: true,
              message: "Nama lengkap harus diisi",
            })
            .code(400);
        }

        // Gunakan nama_lengkap atau fallback ke nama
        const nama_lengkap = value.nama_lengkap || value.nama;
        const { email, subjek, pesan } = value;

        console.log(`   - Nama: ${nama_lengkap}`);
        console.log(`   - Email: ${email}`);
        console.log(`   - Subjek: ${subjek}`);

        // Coba dapatkan prisma client
        const prisma = getPrismaClient();
        if (!prisma) {
          console.log("❌ Prisma client tidak tersedia");
          return h
            .response({
              isError: true,
              message: "Database tidak tersedia",
            })
            .code(500);
        }

        // Pastikan tabel contact_messages ada
        const tableExists = await ensureContactMessagesTable(prisma);
        if (!tableExists) {
          console.log("❌ Tabel contact_messages tidak dapat dibuat");
          return h
            .response({
              isError: true,
              message: "Tidak dapat membuat tabel di database",
            })
            .code(500);
        }

        try {
          // Coba gunakan raw SQL sebagai fallback yang lebih aman
          const result = await prisma.$executeRaw`
            INSERT INTO contact_messages (nama_lengkap, email, subjek, pesan, status, tanggal_kirim, updated_at)
            VALUES (${nama_lengkap}, ${email}, ${subjek}, ${pesan}, 'BelumDibaca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id, nama_lengkap, email, subjek, status, tanggal_kirim
          `;

          console.log("✅ PESAN BERHASIL DISIMPAN KE DATABASE!");
          console.log("📊 Detail pesan yang disimpan:");
          console.log(`   - Nama: ${nama_lengkap}`);
          console.log(`   - Email: ${email}`);
          console.log(`   - Subjek: ${subjek}`);
          console.log(`   - Status: BelumDibaca`);
          console.log("💾 Data tersimpan di tabel: contact_messages");

          return h
            .response({
              isError: false,
              message: "Pesan berhasil dikirim",
              data: {
                nama_lengkap,
                email,
                subjek,
                pesan,
                status: "BelumDibaca",
                tanggal_kirim: new Date().toISOString(),
              },
            })
            .code(201);
        } catch (dbError) {
          console.error("❌ Database error:", dbError);
          console.error("❌ Error details:", dbError.message);
          console.error("❌ Error code:", dbError.code);

          // Coba metode alternatif dengan SQL biasa
          try {
            console.log("🔄 Mencoba metode alternatif dengan SQL biasa...");

            // Gunakan pool.query jika tersedia di server.app
            if (request.server.app.pool) {
              const result = await request.server.app.pool.query(
                `INSERT INTO contact_messages (nama_lengkap, email, subjek, pesan, status, tanggal_kirim, updated_at)
                VALUES ($1, $2, $3, $4, 'BelumDibaca', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
                [nama_lengkap, email, subjek, pesan]
              );

              console.log(
                "✅ PESAN BERHASIL DISIMPAN KE DATABASE DENGAN METODE ALTERNATIF!"
              );

              return h
                .response({
                  isError: false,
                  message: "Pesan berhasil dikirim",
                  data: {
                    id: result.rows[0].id,
                    nama_lengkap,
                    email,
                    subjek,
                    pesan,
                    status: "BelumDibaca",
                    tanggal_kirim: new Date().toISOString(),
                  },
                })
                .code(201);
            }
          } catch (altError) {
            console.error("❌ Alternative method also failed:", altError);
          }

          return h
            .response({
              isError: true,
              message: "Gagal menyimpan pesan ke database",
              detail: dbError.message || "Unknown database error",
              errorCode: dbError.code || "UNKNOWN",
            })
            .code(500);
        }
      } catch (error) {
        console.error("❌ Error saving message:", error);
        return h
          .response({
            isError: true,
            message: "Gagal menyimpan pesan",
            detail: error.message || "Unknown error",
          })
          .code(500);
      }
    },
  },

  // Get all messages from database
  {
    method: "GET",
    path: "/api/messages",
    options: { auth: false },
    handler: async (request, h) => {
      try {
        console.log("📥 Request untuk mengambil pesan dari database...");

        // Coba dapatkan prisma client
        const prisma = getPrismaClient();
        if (!prisma) {
          console.log("❌ Prisma client tidak tersedia");
          return h
            .response({
              isError: false,
              message: "Database tidak tersedia",
              data: [],
            })
            .code(200);
        }

        // Pastikan tabel contact_messages ada
        const tableExists = await ensureContactMessagesTable(prisma);
        if (!tableExists) {
          console.log("❌ Tabel contact_messages tidak dapat dibuat/ditemukan");
          return h
            .response({
              isError: false,
              message: "Tabel contact_messages tidak tersedia",
              data: [],
            })
            .code(200);
        }

        try {
          const messages = await prisma.$queryRaw`
            SELECT id, nama_lengkap, email, subjek, pesan, status, tanggal_kirim, tanggal_balas, updated_at
            FROM contact_messages
            ORDER BY tanggal_kirim DESC
          `;

          console.log("✅ Data pesan dari database:", messages.length, "pesan");

          // Ensure consistent data format
          const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            nama_lengkap: msg.nama_lengkap,
            email: msg.email,
            subjek: msg.subjek,
            pesan: msg.pesan,
            status: msg.status,
            tanggal_kirim: msg.tanggal_kirim,
            tanggal_balas: msg.tanggal_balas,
            updated_at: msg.updated_at,
          }));

          return h
            .response({
              isError: false,
              message: "Data pesan berhasil diambil dari database",
              data: formattedMessages,
            })
            .code(200);
        } catch (dbError) {
          console.log("❌ Database query failed:", dbError.message);
          return h
            .response({
              isError: false,
              message: "Gagal mengambil data dari database",
              data: [],
              detail: dbError.message || "Unknown database error",
            })
            .code(200);
        }
      } catch (error) {
        console.error("❌ Error fetching messages from database:", error);
        return h
          .response({
            isError: false,
            message: "Error mengambil data",
            data: [],
            detail: error.message || "Unknown error",
          })
          .code(200);
      }
    },
  },

  // Get message statistics from database
  {
    method: "GET",
    path: "/api/messages/stats",
    options: { auth: false },
    handler: async (request, h) => {
      try {
        console.log(
          "📊 Request untuk mengambil statistik pesan dari database..."
        );

        // Coba dapatkan prisma client
        const prisma = getPrismaClient();
        if (!prisma) {
          console.log("❌ Prisma client tidak tersedia");
          return h
            .response({
              isError: false,
              message: "Database tidak tersedia",
              data: { total: 0, baru: 0, ditolak: 0, dibalas: 0 },
            })
            .code(200);
        }

        // Pastikan tabel contact_messages ada
        const tableExists = await ensureContactMessagesTable(prisma);
        if (!tableExists) {
          console.log("❌ Tabel contact_messages tidak dapat dibuat/ditemukan");
          return h
            .response({
              isError: false,
              message: "Tabel contact_messages tidak tersedia",
              data: { total: 0, baru: 0, ditolak: 0, dibalas: 0 },
            })
            .code(200);
        }

        try {
          // Use more reliable count queries
          const [totalResult, baruResult, ditolakResult, dibalasResult] =
            await Promise.all([
              prisma.$queryRaw`SELECT COUNT(*)::int as count FROM contact_messages`,
              prisma.$queryRaw`SELECT COUNT(*)::int as count FROM contact_messages WHERE status = 'BelumDibaca'`,
              prisma.$queryRaw`SELECT COUNT(*)::int as count FROM contact_messages WHERE status = 'Ditolak'`,
              prisma.$queryRaw`SELECT COUNT(*)::int as count FROM contact_messages WHERE status = 'Dibalas'`,
            ]);

          const stats = {
            total: Number(totalResult[0]?.count || 0),
            baru: Number(baruResult[0]?.count || 0),
            ditolak: Number(ditolakResult[0]?.count || 0),
            dibalas: Number(dibalasResult[0]?.count || 0),
          };

          console.log("✅ Statistik dari database:", stats);

          return h
            .response({
              isError: false,
              message: "Statistik pesan berhasil diambil dari database",
              data: stats,
            })
            .code(200);
        } catch (dbError) {
          console.log("❌ Database stats query failed:", dbError.message);
          return h
            .response({
              isError: false,
              message: "Gagal mengambil statistik dari database",
              data: { total: 0, baru: 0, ditolak: 0, dibalas: 0 },
              detail: dbError.message || "Unknown database error",
            })
            .code(200);
        }
      } catch (error) {
        console.error("❌ Error fetching message stats from database:", error);
        return h
          .response({
            isError: false,
            message: "Error mengambil statistik",
            data: { total: 0, baru: 0, ditolak: 0, dibalas: 0 },
            detail: error.message || "Unknown error",
          })
          .code(200);
      }
    },
  },

  // Update message status
  {
    method: "PUT",
    path: "/api/messages/{id}/status",
    options: { auth: false },
    handler: async (request, h) => {
      try {
        const messageId = request.params.id;
        const { status, tanggal_balas } = request.payload;

        console.log(
          `📝 Update status pesan ID: ${messageId} ke status: ${status}`
        );
        console.log(`📝 Payload received:`, request.payload);

        // Validate status dengan enum yang benar
        const validStatuses = ["BelumDibaca", "Ditolak", "Dibalas"];
        if (!validStatuses.includes(status)) {
          return h
            .response({
              isError: true,
              message:
                "Status tidak valid. Harus: BelumDibaca, Ditolak, atau Dibalas",
            })
            .code(400);
        }

        // Check if database is available
        if (!request.server.app.prisma) {
          console.log("❌ Database not available");
          return h
            .response({
              isError: true,
              message: "Database tidak tersedia",
            })
            .code(500);
        }

        try {
          // Use raw SQL for better compatibility
          if (status === "Dibalas") {
            const balas_date = tanggal_balas
              ? new Date(tanggal_balas)
              : new Date();
            await request.server.app.prisma.$executeRaw`
              UPDATE contact_messages 
              SET status = ${status}::\"MessageStatus\", 
                  tanggal_balas = ${balas_date},
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${Number.parseInt(messageId)}
            `;
          } else {
            await request.server.app.prisma.$executeRaw`
              UPDATE contact_messages 
              SET status = ${status}::\"MessageStatus\", 
                  tanggal_balas = NULL,
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${Number.parseInt(messageId)}
            `;
          }

          // Get updated message
          const updatedMessages = await request.server.app.prisma.$queryRaw`
            SELECT id, status, tanggal_balas FROM contact_messages WHERE id = ${Number.parseInt(
              messageId
            )}
          `;
          const updatedMessage = updatedMessages[0];

          console.log(
            `✅ Status pesan ID ${messageId} berhasil diubah ke: ${status}`
          );

          return h
            .response({
              isError: false,
              message: `Status berhasil diubah ke ${status}`,
              data: {
                id: messageId,
                status: updatedMessage.status,
                tanggal_balas:
                  updatedMessage.tanggal_balas?.toISOString() || null,
              },
            })
            .code(200);
        } catch (dbError) {
          console.error("❌ Database error:", dbError);

          // Try alternative method
          try {
            if (request.server.app.pool) {
              if (status === "Dibalas") {
                const balas_date = tanggal_balas
                  ? new Date(tanggal_balas)
                  : new Date();
                await request.server.app.pool.query(
                  `UPDATE contact_messages 
                  SET status = $1::\"MessageStatus\", 
                      tanggal_balas = $2,
                      updated_at = CURRENT_TIMESTAMP
                  WHERE id = $3`,
                  [status, balas_date, Number.parseInt(messageId)]
                );
              } else {
                await request.server.app.pool.query(
                  `UPDATE contact_messages 
                  SET status = $1::\"MessageStatus\", 
                      tanggal_balas = NULL,
                      updated_at = CURRENT_TIMESTAMP
                  WHERE id = $2`,
                  [status, Number.parseInt(messageId)]
                );
              }

              // Get updated message
              const result = await request.server.app.pool.query(
                "SELECT id, status, tanggal_balas FROM contact_messages WHERE id = $1",
                [Number.parseInt(messageId)]
              );

              return h
                .response({
                  isError: false,
                  message: `Status berhasil diubah ke ${status}`,
                  data: {
                    id: messageId,
                    status: result.rows[0].status,
                    tanggal_balas:
                      result.rows[0].tanggal_balas?.toISOString() || null,
                  },
                })
                .code(200);
            }
          } catch (altError) {
            console.error("❌ Alternative method also failed:", altError);
          }

          return h
            .response({
              isError: true,
              message: "Gagal mengubah status pesan",
              detail: dbError.message || "Unknown database error",
            })
            .code(500);
        }
      } catch (error) {
        console.error("❌ Error updating message status:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengubah status",
            detail: error.message || "Unknown error",
          })
          .code(500);
      }
    },
  },

  // Delete message (optional - bisa dihapus jika tidak diperlukan)
  {
    method: "DELETE",
    path: "/api/messages/{id}",
    options: { auth: false },
    handler: async (request, h) => {
      try {
        const messageId = request.params.id;

        console.log(`🗑️ Delete pesan ID: ${messageId}`);

        // Check if database is available
        if (!request.server.app.prisma) {
          console.log("❌ Database not available");
          return h
            .response({
              isError: true,
              message: "Database tidak tersedia",
            })
            .code(500);
        }

        try {
          // Use raw SQL for better compatibility
          await request.server.app.prisma.$executeRaw`
            DELETE FROM contact_messages WHERE id = ${Number.parseInt(
              messageId
            )}
          `;

          console.log(`✅ Pesan ID ${messageId} berhasil dihapus`);

          return h
            .response({
              isError: false,
              message: "Pesan berhasil dihapus",
              data: {
                id: messageId,
              },
            })
            .code(200);
        } catch (dbError) {
          console.error("❌ Database error:", dbError);

          // Try alternative method
          try {
            if (request.server.app.pool) {
              await request.server.app.pool.query(
                "DELETE FROM contact_messages WHERE id = $1",
                [Number.parseInt(messageId)]
              );

              return h
                .response({
                  isError: false,
                  message: "Pesan berhasil dihapus",
                  data: {
                    id: messageId,
                  },
                })
                .code(200);
            }
          } catch (altError) {
            console.error("❌ Alternative method also failed:", altError);
          }

          return h
            .response({
              isError: true,
              message: "Gagal menghapus pesan",
              detail: dbError.message || "Unknown database error",
            })
            .code(500);
        }
      } catch (error) {
        console.error("❌ Error deleting message:", error);
        return h
          .response({
            isError: true,
            message: "Gagal menghapus pesan",
            detail: error.message || "Unknown error",
          })
          .code(500);
      }
    },
  },
];

console.log("✉️ Messages API endpoints loaded successfully");
console.log(`📋 Total message endpoints: ${messagesRoutes.length}`);
console.log("📍 Available message API endpoints:");
messagesRoutes.forEach((route) => {
  console.log(`   ${route.method} ${route.path}`);
});

module.exports = messagesRoutes;
