/**
 * Backend Server untuk Prediksi Stunting
 * Menggunakan Hapi.js dan TensorFlow.js
 */

// perubahan Ihsan: Memastikan dotenv dimuat dengan path yang benar
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const Hapi = require("@hapi/hapi");
const { predictStunting } = require("./services/ml-service");

// perubahan Caca: Import Prisma untuk database operations
let prisma;
try {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  console.log("✅ Prisma client initialized with DATABASE_URL");
} catch (error) {
  console.log("⚠️ Prisma not available, using fallback database operations");
  prisma = null;
}

// perubahan Caca: Function to initialize suggestion_actions table if it doesn't exist
async function initializeSuggestionActions() {
  if (!prisma) {
    console.log(
      "⚠️ Prisma not available, skipping suggestion_actions initialization"
    );
    return;
  }

  try {
    console.log("🔄 Checking suggestion_actions table...");

    // Check if suggestion_actions table exists and has data
    try {
      const existingData =
        await prisma.$queryRaw`SELECT COUNT(*) as count FROM suggestion_actions`;
      const count = Number(existingData[0].count);

      if (count > 0) {
        console.log(`✅ suggestion_actions table already has ${count} records`);
        return;
      }

      console.log("⚠️ suggestion_actions table is empty, inserting data...");
    } catch (error) {
      console.log("⚠️ suggestion_actions table doesn't exist, creating it...");

      // Create suggestion_actions table
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS suggestion_actions (
          id SERIAL PRIMARY KEY,
          suggestion TEXT NOT NULL,
          status VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log("✅ suggestion_actions table created");
    }

    // Insert initial data using individual INSERT statements
    const suggestions = [
      {
        suggestion: "Berikan ASI eksklusif selama 6 bulan pertama",
        status: "normal",
      },
      {
        suggestion:
          "Berikan makanan pendamping ASI yang bergizi setelah 6 bulan",
        status: "normal",
      },
      {
        suggestion: "Lakukan pemantauan pertumbuhan secara rutin",
        status: "normal",
      },
      {
        suggestion: "Pastikan anak mendapatkan imunisasi lengkap",
        status: "normal",
      },
      { suggestion: "Berikan makanan dengan gizi seimbang", status: "normal" },
      {
        suggestion:
          "Konsultasikan dengan dokter atau ahli gizi untuk pola makan khusus",
        status: "stunting",
      },
      {
        suggestion: "Berikan makanan tinggi protein dan kalsium",
        status: "stunting",
      },
      {
        suggestion:
          "Tambahkan suplemen vitamin A dan zink sesuai anjuran dokter",
        status: "stunting",
      },
      {
        suggestion: "Lakukan pemeriksaan kesehatan secara rutin setiap bulan",
        status: "stunting",
      },
      {
        suggestion:
          "Pastikan anak mendapatkan makanan bergizi dalam porsi kecil tapi sering",
        status: "stunting",
      },
      {
        suggestion: "Segera konsultasikan ke dokter spesialis anak",
        status: "stunting berat",
      },
      {
        suggestion:
          "Ikuti program pemulihan gizi di puskesmas atau rumah sakit",
        status: "stunting berat",
      },
      {
        suggestion: "Berikan makanan terapi khusus sesuai anjuran dokter",
        status: "stunting berat",
      },
      {
        suggestion: "Lakukan pemantauan intensif dengan tenaga kesehatan",
        status: "stunting berat",
      },
      {
        suggestion: "Pastikan anak mendapatkan perawatan medis yang tepat",
        status: "stunting berat",
      },
    ];

    // Insert each suggestion individually
    for (const item of suggestions) {
      try {
        await prisma.$executeRaw`
          INSERT INTO suggestion_actions (suggestion, status) 
          VALUES (${item.suggestion}, ${item.status})
        `;
        console.log(`✅ Inserted: ${item.suggestion.substring(0, 50)}...`);
      } catch (error) {
        console.log(`⚠️ Failed to insert suggestion: ${error.message}`);
      }
    }

    // Add foreign key to stunting_records if needed
    try {
      await prisma.$executeRaw`
        ALTER TABLE stunting_records 
        ADD COLUMN IF NOT EXISTS suggested_action_id INTEGER
      `;

      // Check if foreign key constraint exists
      const constraintExists = await prisma.$queryRaw`
        SELECT constraint_name 
        FROM information_schema.table_constraints 
        WHERE table_name = 'stunting_records' 
        AND constraint_name = 'fk_stunting_suggested_action'
      `;

      if (constraintExists.length === 0) {
        await prisma.$executeRaw`
          ALTER TABLE stunting_records 
          ADD CONSTRAINT fk_stunting_suggested_action
          FOREIGN KEY (suggested_action_id) 
          REFERENCES suggestion_actions(id)
        `;
        console.log("✅ Added foreign key constraint to stunting_records");
      }
    } catch (error) {
      console.log("⚠️ Error adding foreign key:", error.message);
    }

    // Verify data was inserted
    const finalCount =
      await prisma.$queryRaw`SELECT COUNT(*) as count FROM suggestion_actions`;
    console.log(
      `✅ suggestion_actions table now has ${finalCount[0].count} records`
    );
  } catch (error) {
    console.error("❌ Error initializing suggestion_actions table:", error);
  }
}

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3001,
    host: "0.0.0.0", // Listen on all interfaces
    routes: {
      cors: {
        origin: ["*"], // Use wildcard only
        headers: [
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Origin",
          "X-Requested-With",
        ],
        additionalHeaders: [
          "cache-control",
          "x-requested-with",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
          "Access-Control-Allow-Headers",
        ],
        credentials: false,
      },
    },
  });

  // Sediakan prisma client ke request handler
  server.app.prisma = prisma;

  // Tambahkan extension untuk menyediakan prisma client ke request
  server.ext("onRequest", (request, h) => {
    request.server.app.prisma = prisma;
    return h.continue;
  });

  // Add CORS headers manually for all responses
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      response.output.headers["Access-Control-Allow-Origin"] = "*";
      response.output.headers["Access-Control-Allow-Methods"] =
        "GET, POST, PUT, DELETE, OPTIONS";
      response.output.headers["Access-Control-Allow-Headers"] =
        "Origin, X-Requested-With, Content-Type, Accept, Authorization";
      response.output.headers["Access-Control-Allow-Credentials"] = "false";
    } else {
      response.header("Access-Control-Allow-Origin", "*");
      response.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      response.header("Access-Control-Allow-Credentials", "false");
    }

    return h.continue;
  });

  // Handle preflight OPTIONS requests
  server.route({
    method: "OPTIONS",
    path: "/{any*}",
    handler: (request, h) => {
      return h
        .response()
        .header("Access-Control-Allow-Origin", "*")
        .header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        )
        .header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        )
        .header("Access-Control-Allow-Credentials", "false")
        .code(200);
    },
  });

  // Health check endpoint
  server.route({
    method: "GET",
    path: "/health",
    handler: (request, h) => {
      return {
        status: "OK",
        message: "Backend server is running",
        timestamp: new Date().toISOString(),
        host: request.info.host,
        remoteAddress: request.info.remoteAddress,
        environment: process.env.NODE_ENV || "development",
        database: process.env.DATABASE_URL
          ? "Connected to Neon"
          : "Not configured",
      };
    },
  });

  // Prediction endpoint
  server.route({
    method: "POST",
    path: "/api/predict",
    handler: async (request, h) => {
      try {
        const input = request.payload;
        console.log(
          "📥 Received prediction request from:",
          request.info.remoteAddress
        );
        console.log("📥 Request data:", input);

        // Validasi input payload
        if (
          !input ||
          !input.nama ||
          input.usia === undefined ||
          !input.jenisKelamin ||
          !input.beratBadan ||
          !input.tinggiBadan
        ) {
          console.error("❌ Invalid input payload");
          return h
            .response({
              isError: true,
              message:
                "Data input tidak lengkap. Pastikan semua field telah diisi.",
            })
            .code(400);
        }

        // Lakukan prediksi
        const result = await predictStunting(input);

        // Check if result is error
        if (result.isError) {
          console.error("❌ Prediction failed:", result.message);
          return h.response(result).code(500);
        }

        console.log("✅ Prediction successful:", {
          status: result.status,
          score: result.score,
        });

        return h.response(result).code(200);
      } catch (error) {
        console.error("❌ Prediction error:", error);

        // Return error sesuai ketentuan - TIDAK ADA FALLBACK
        return h
          .response({
            isError: true,
            message:
              "Prediksi tidak dapat dilakukan saat ini karena model sedang tidak dapat diakses. Silakan coba kembali dalam beberapa saat. Terima kasih atas pengertiannya.",
          })
          .code(500);
      }
    },
  });

  // Recommendation endpoint
  server.route({
    method: "POST",
    path: "/api/recommend",
    handler: async (request, h) => {
      try {
        const { status, usia, jenisKelamin } = request.payload;

        // Simple recommendation logic
        const recommendations = [];

        if (status === "normal") {
          recommendations.push(
            {
              id: 4,
              title: "Pentingnya 1000 Hari Pertama Kehidupan",
              category: "Pengetahuan Dasar",
            },
            {
              id: 7,
              title: "Stimulasi untuk Perkembangan Otak Anak",
              category: "Perkembangan Anak",
            }
          );
        } else if (status === "stunting") {
          recommendations.push(
            {
              id: 1,
              title: "Mengenal Stunting dan Dampaknya pada Anak",
              category: "Pengetahuan Dasar",
            },
            {
              id: 2,
              title: "Nutrisi Penting untuk Mencegah Stunting",
              category: "Nutrisi",
            },
            {
              id: 6,
              title: "Resep Makanan Bergizi untuk Balita",
              category: "Resep",
            }
          );
        }

        return h.response(recommendations).code(200);
      } catch (error) {
        console.error("❌ Recommendation error:", error);
        return h.response([]).code(200); // Return empty array on error
      }
    },
  });

  // perubahan Caca: Add route for suggested actions
  server.route({
    method: "GET",
    path: "/suggested-actions",
    handler: async (request, h) => {
      if (!prisma) {
        return h
          .response({
            success: false,
            error: "Database not available",
          })
          .code(500);
      }

      try {
        const { status } = request.query;

        // Query suggestion_actions table
        let suggestions;
        if (status) {
          suggestions = await prisma.$queryRaw`
            SELECT * FROM suggestion_actions 
            WHERE status = ${status}
            ORDER BY id ASC
          `;
        } else {
          suggestions = await prisma.$queryRaw`
            SELECT * FROM suggestion_actions 
            ORDER BY id ASC
          `;
        }

        return h
          .response({
            success: true,
            data: suggestions,
          })
          .code(200);
      } catch (error) {
        console.error("❌ Error fetching suggested actions:", error);
        return h
          .response({
            success: false,
            error: "Failed to fetch suggested actions",
          })
          .code(500);
      }
    },
  });

  // perubahan Ihsan: Menggabungkan semua routes dalam satu tempat untuk menghindari konflik
  // Load dan register routes dengan error handling
  const allRoutes = [];

  // Load article routes
  try {
    const articleRoutes = require("./routes/articles");
    if (articleRoutes && Array.isArray(articleRoutes)) {
      allRoutes.push(...articleRoutes);
      console.log("📚 Article routes loaded successfully");
    }
  } catch (error) {
    console.log("⚠️ Article routes not found:", error.message);
  }

  // Load public routes (tapi skip yang sudah ada di article routes)
  try {
    const publicRoutes = require("./routes/public");
    if (publicRoutes && Array.isArray(publicRoutes)) {
      // Filter out routes yang sudah ada di article routes
      const filteredPublicRoutes = publicRoutes.filter((publicRoute) => {
        return !allRoutes.some(
          (existingRoute) =>
            existingRoute.method === publicRoute.method &&
            existingRoute.path === publicRoute.path
        );
      });
      allRoutes.push(...filteredPublicRoutes);
      console.log("🌐 Public routes loaded successfully");
    }
  } catch (error) {
    console.log("⚠️ Public routes not found:", error.message);
  }

  // perubahan Caca: Load stunting routes
  try {
    const { routes: stuntingRoutes } = require("./routes/stunting");
    if (stuntingRoutes && Array.isArray(stuntingRoutes)) {
      // Register stunting routes langsung dari file
      stuntingRoutes.forEach((route) => {
        try {
          server.route(route);
          console.log(
            `✅ Registered stunting route: ${route.method} ${route.path}`
          );
        } catch (error) {
          console.log(
            `⚠️ Failed to register stunting route ${route.method} ${route.path}:`,
            error.message
          );
        }
      });
      console.log("🩺 Stunting routes loaded successfully");
    } else {
      console.log("⚠️ No stunting routes found in array format");
    }
  } catch (error) {
    console.log("⚠️ Stunting routes not found:", error.message);
  }

  // perubahan: Load messages routes
  try {
    const messagesRoutes = require("./routes/messages");
    if (messagesRoutes && Array.isArray(messagesRoutes)) {
      // Filter out routes yang sudah ada di allRoutes
      const filteredMessagesRoutes = messagesRoutes.filter((messageRoute) => {
        return !allRoutes.some(
          (existingRoute) =>
            existingRoute.method === messageRoute.method &&
            existingRoute.path === messageRoute.path
        );
      });
      allRoutes.push(...filteredMessagesRoutes);
      console.log("✉️ Messages routes loaded successfully");
      console.log(`📋 Total message endpoints: ${messagesRoutes.length}`);
      console.log("📍 Available message API endpoints:");
      messagesRoutes.forEach((route) => {
        console.log(`   ${route.method} ${route.path}`);
      });
    }
  } catch (error) {
    console.log("⚠️ Messages routes not found:", error.message);
  }

  // perubahan: Load dashboard routes
  try {
    const dashboardRoutes = require("./routes/dashboard");
    if (dashboardRoutes && Array.isArray(dashboardRoutes)) {
      // Filter out routes yang sudah ada di allRoutes
      const filteredDashboardRoutes = dashboardRoutes.filter(
        (dashboardRoute) => {
          return !allRoutes.some(
            (existingRoute) =>
              existingRoute.method === dashboardRoute.method &&
              existingRoute.path === dashboardRoute.path
          );
        }
      );
      allRoutes.push(...filteredDashboardRoutes);
      console.log("📊 Dashboard routes loaded successfully");
      console.log(`📋 Total dashboard endpoints: ${dashboardRoutes.length}`);
      console.log("📍 Available dashboard API endpoints:");
      dashboardRoutes.forEach((route) => {
        console.log(`   ${route.method} ${route.path}`);
      });
    }
  } catch (error) {
    console.log("⚠️ Dashboard routes not found:", error.message);
  }

  // Register all routes
  allRoutes.forEach((route) => {
    try {
      server.route(route);
    } catch (error) {
      console.log(
        `⚠️ Failed to register route ${route.method} ${route.path}:`,
        error.message
      );
    }
  });

  // Test route untuk memastikan server berjalan
  server.route({
    method: "GET",
    path: "/test",
    handler: (request, h) => {
      return {
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        availableRoutes: server
          .table()
          .map((route) => `${route.method.toUpperCase()} ${route.path}`),
      };
    },
  });

  console.log("🔍 Registering all routes...");

  // perubahan Caca: Initialize suggestion_actions table
  await initializeSuggestionActions();

  await server.start();
  console.log("🚀 Server running on %s", server.info.uri);

  console.log("📋 Available routes:");
  server.table().forEach((route) => {
    console.log(`   ${route.method.toUpperCase()} ${route.path}`);
  });
  console.log("🌐 Test your server at: http://localhost:3001/test");

  console.log("📊 ML Prediction API ready");
  console.log(`📚 Total routes registered: ${allRoutes.length}`);
  console.log("🔗 CORS enabled for all origins");
  console.log("🌐 Server accessible from:");
  console.log("   - http://localhost:3001");
  console.log("   - http://127.0.0.1:3001");
  console.log(`   - Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `   - Database: ${
      process.env.DATABASE_URL ? "Connected to Neon" : "Not configured"
    }`
  );
};

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled rejection:", err);
  process.exit(1);
});

init();
