// perubahan Ihsan: Menghapus route artikel yang duplikat dan hanya menyisakan routes yang tidak ada di articles.js
const Joi = require("joi")
const prisma = require("../lib/prisma")

const publicRoutes = [
  // Save prediction result
  {
    method: "POST",
    path: "/api/predictions/save",
    options: {
      validate: {
        payload: Joi.object({
          nama: Joi.string().required(),
          usia: Joi.number().integer().min(0).required(),
          jenisKelamin: Joi.string().valid("L", "P").required(),
          beratBadan: Joi.number().positive().required(),
          tinggiBadan: Joi.number().positive().required(),
          status: Joi.string().required(),
          score: Joi.number().required(),
          userId: Joi.string().optional(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const prediction = await prisma.prediction.create({
          data: request.payload,
        })

        return h
          .response({
            isError: false,
            message: "Hasil prediksi berhasil disimpan",
            data: prediction,
          })
          .code(201)
      } catch (error) {
        console.error("Save prediction error:", error)
        return h
          .response({
            isError: true,
            message: "Gagal menyimpan hasil prediksi",
          })
          .code(500)
      }
    },
  },

  // Get recommendations
  {
    method: "GET",
    path: "/api/recommendations",
    handler: async (request, h) => {
      try {
        const { status, usia, jenisKelamin } = request.query

        // Determine age group
        let targetAge = "24+"
        if (usia <= 6) targetAge = "0-6"
        else if (usia <= 12) targetAge = "6-12"
        else if (usia <= 24) targetAge = "12-24"

        const recommendations = await prisma.recommendation.findMany({
          where: {
            isActive: true,
            OR: [{ targetAge }, { targetAge: null }],
            AND: [
              {
                OR: [{ targetGender: jenisKelamin }, { targetGender: null }],
              },
            ],
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        })

        return h
          .response({
            isError: false,
            data: recommendations,
          })
          .code(200)
      } catch (error) {
        console.error("Get recommendations error:", error)
        return h
          .response({
            isError: true,
            message: "Gagal mengambil rekomendasi",
          })
          .code(500)
      }
    },
  },
]

module.exports = publicRoutes
