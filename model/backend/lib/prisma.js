// perubahan Ihsan: Memastikan Prisma client dikonfigurasi dengan benar untuk production
const { PrismaClient } = require("@prisma/client")

let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    })
  }
  prisma = global.__prisma
}

// Test database connection
prisma
  .$connect()
  .then(() => {
    console.log("✅ Database connected successfully")
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error)
  })

module.exports = prisma
