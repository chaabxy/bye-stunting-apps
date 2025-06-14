const Joi = require("joi")

const predictionValidator = Joi.object({
  nama: Joi.string().optional().allow("").messages({
    "string.base": "Nama harus berupa teks",
  }),

  usia: Joi.number().min(0).max(60).required().messages({
    "number.base": "Usia harus berupa angka",
    "number.min": "Usia minimal 0 bulan",
    "number.max": "Usia maksimal 60 bulan",
    "any.required": "Usia wajib diisi",
  }),

  jenisKelamin: Joi.string().valid("laki-laki", "perempuan").required().messages({
    "string.base": "Jenis kelamin harus berupa teks",
    "any.only": 'Jenis kelamin harus "laki-laki" atau "perempuan"',
    "any.required": "Jenis kelamin wajib diisi",
  }),

  beratBadan: Joi.number().min(0.5).max(30).required().messages({
    "number.base": "Berat badan harus berupa angka",
    "number.min": "Berat badan minimal 0.5 kg",
    "number.max": "Berat badan maksimal 30 kg",
    "any.required": "Berat badan wajib diisi",
  }),

  tinggiBadan: Joi.number().min(30).max(120).required().messages({
    "number.base": "Tinggi badan harus berupa angka",
    "number.min": "Tinggi badan minimal 30 cm",
    "number.max": "Tinggi badan maksimal 120 cm",
    "any.required": "Tinggi badan wajib diisi",
  }),
})

module.exports = predictionValidator
