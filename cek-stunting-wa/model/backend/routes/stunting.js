// perubahan Caca: API endpoint untuk CRUD operations stunting records di backend
const Hapi = require("@hapi/hapi");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// perubahan Caca: Handler untuk POST - Menyimpan data stunting record baru dengan lokasi
const createStuntingRecord = async (request, h) => {
  try {
    const body = request.payload;
    console.log("🔍 Data yang diterima backend:", body);

    // perubahan Caca: Validasi data yang diperlukan sesuai schema baru (kolom bahasa Inggris)
    const requiredFields = [
      "childName",
      "motherName",
      "birthDate",
      "gender",
      "weight",
      "height",
      "ageInMonths",
      "provinceId",
      "regencyId",
      "districtId",
      "villageId",
      "status",
      "riskPercentage",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        console.error(`❌ Missing field: ${field}`);
        return h
          .response({
            success: false,
            error: `Field ${field} is required`,
          })
          .code(400);
      }
    }

    // 1. Pastikan data lokasi tersimpan ke database dengan nama yang benar dari API
    console.log(
      "🔍 Memastikan data lokasi tersimpan untuk villageId:",
      body.villageId
    );

    try {
      await ensureLocationDataExists(
        body.villageId,
        body.districtId,
        body.regencyId,
        body.provinceId
      );
      console.log("✅ Data lokasi berhasil dipastikan tersimpan");
    } catch (locationError) {
      console.error("❌ Error ensuring location data:", locationError);
      return h
        .response({
          success: false,
          error: `Gagal mengambil data lokasi untuk village ID ${body.villageId}. ${locationError.message}`,
        })
        .code(400);
    }

    // 2. Cek apakah village sudah ada setelah dipastikan tersimpan
    const village = await prisma.village.findUnique({
      where: { id: body.villageId },
      include: {
        district: {
          include: {
            regency: {
              include: {
                province: true,
              },
            },
          },
        },
      },
    });

    if (!village) {
      console.error(
        "❌ Village masih tidak ditemukan setelah dipastikan tersimpan:",
        body.villageId
      );
      return h
        .response({
          success: false,
          error: `Village dengan ID ${body.villageId} tidak dapat dibuat atau ditemukan`,
        })
        .code(400);
    }

    console.log("✅ Village ditemukan:", {
      village: village.name,
      district: village.district.name,
      regency: village.district.regency.name,
      province: village.district.regency.province.name,
    });

    // 3. Cari suggested action yang sesuai dengan status
    let suggestedActionId = body.suggestedActionId;

    if (!suggestedActionId) {
      try {
        const suggestedActions = await prisma.$queryRaw`
          SELECT * FROM suggestion_actions 
          WHERE status = ${body.status}
        `;

        if (suggestedActions && suggestedActions.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * suggestedActions.length
          );
          suggestedActionId = suggestedActions[randomIndex].id;
          console.log(
            `✅ Dipilih suggested action: ${suggestedActions[randomIndex].suggestion}`
          );
        }
      } catch (error) {
        console.log(
          "⚠️ Tabel suggestion_actions mungkin belum ada:",
          error.message
        );
      }
    }

    // 4. Simpan stunting record dengan semua ID lokasi menggunakan nama kolom bahasa Inggris
    const stuntingRecord = await prisma.stuntingRecord.create({
      data: {
        childName: body.childName,
        motherName: body.motherName,
        birthDate: new Date(body.birthDate),
        gender: body.gender,
        weight: Number.parseFloat(body.weight),
        height: Number.parseFloat(body.height),
        ageInMonths: Number.parseInt(body.ageInMonths),
        provinceId: body.provinceId,
        regencyId: body.regencyId,
        districtId: body.districtId,
        villageId: body.villageId,
        status: body.status,
        riskPercentage: Number.parseFloat(body.riskPercentage),
        heightPercentile: body.heightPercentile
          ? Number.parseFloat(body.heightPercentile)
          : null,
        weightPercentile: body.weightPercentile
          ? Number.parseFloat(body.weightPercentile)
          : null,
        heightCategory: body.heightCategory || null,
        weightCategory: body.weightCategory || null,
        suggestedActionId: suggestedActionId || null,
        recommendedEducationId: body.recommendedEducationId || null,
      },
      include: {
        province: true,
        regency: true,
        district: true,
        village: true,
        suggestedAction: true,
      },
    });

    console.log(
      "✅ Record berhasil disimpan dengan kolom bahasa Inggris:",
      stuntingRecord.id
    );

    return h
      .response({
        success: true,
        data: stuntingRecord,
        message: "Record saved successfully",
      })
      .code(201);
  } catch (error) {
    console.error("❌ Error saving stunting record:", error);
    return h
      .response({
        success: false,
        error: "Failed to save record",
        details: error.message,
      })
      .code(500);
  }
};

// perubahan Caca: Fungsi untuk memastikan data lokasi tersimpan menggunakan API yang sama dengan frontend
async function ensureLocationDataExists(
  villageId,
  districtId,
  regencyId,
  provinceId
) {
  try {
    console.log("🔍 Memastikan data lokasi untuk:", {
      villageId,
      districtId,
      regencyId,
      provinceId,
    });

    // Cek apakah village sudah ada
    const existingVillage = await prisma.village.findUnique({
      where: { id: villageId },
      include: {
        district: {
          include: {
            regency: {
              include: {
                province: true,
              },
            },
          },
        },
      },
    });

    if (existingVillage) {
      console.log("✅ Data lokasi sudah ada:", {
        village: existingVillage.name,
        district: existingVillage.district.name,
        regency: existingVillage.district.regency.name,
        province: existingVillage.district.regency.province.name,
      });
      return existingVillage;
    }

    console.log("🔍 Data lokasi belum ada, akan mengambil dari API...");

    // Ambil data dari API menggunakan struktur yang sama dengan frontend
    const locationData = await getLocationDataFromAPI(
      villageId,
      districtId,
      regencyId,
      provinceId
    );

    if (!locationData) {
      throw new Error(
        `Data lokasi untuk village ID ${villageId} tidak ditemukan di API wilayah Indonesia`
      );
    }

    console.log("✅ Data lokasi dari API:", locationData);

    // Buat data lokasi secara berurutan dengan nama yang benar dari API
    console.log("🔍 Membuat province:", locationData.provinceName);
    const province = await prisma.province.upsert({
      where: { id: locationData.provinceId },
      update: {
        name: locationData.provinceName,
      },
      create: {
        id: locationData.provinceId,
        name: locationData.provinceName,
      },
    });
    console.log("✅ Province berhasil dibuat/diupdate:", province.name);

    console.log("🔍 Membuat regency:", locationData.regencyName);
    const regency = await prisma.regency.upsert({
      where: { id: locationData.regencyId },
      update: {
        name: locationData.regencyName,
        provinceId: locationData.provinceId,
      },
      create: {
        id: locationData.regencyId,
        provinceId: locationData.provinceId,
        name: locationData.regencyName,
      },
    });
    console.log("✅ Regency berhasil dibuat/diupdate:", regency.name);

    console.log("🔍 Membuat district:", locationData.districtName);
    const district = await prisma.district.upsert({
      where: { id: locationData.districtId },
      update: {
        name: locationData.districtName,
        regencyId: locationData.regencyId,
      },
      create: {
        id: locationData.districtId,
        regencyId: locationData.regencyId,
        name: locationData.districtName,
      },
    });
    console.log("✅ District berhasil dibuat/diupdate:", district.name);

    console.log("🔍 Membuat village:", locationData.villageName);
    const village = await prisma.village.upsert({
      where: { id: locationData.villageId },
      update: {
        name: locationData.villageName,
        districtId: locationData.districtId,
      },
      create: {
        id: locationData.villageId,
        districtId: locationData.districtId,
        name: locationData.villageName,
      },
      include: {
        district: {
          include: {
            regency: {
              include: {
                province: true,
              },
            },
          },
        },
      },
    });
    console.log("✅ Village berhasil dibuat/diupdate:", village.name);

    return village;
  } catch (error) {
    console.error("❌ Error ensuring location data exists:", error);
    throw error;
  }
}

// perubahan Caca: Fungsi untuk mengambil data lokasi menggunakan API yang sama dengan frontend
async function getLocationDataFromAPI(
  villageId,
  districtId,
  regencyId,
  provinceId
) {
  try {
    console.log("🔍 Mengambil data dari API ibnux.github.io untuk:", {
      villageId,
      districtId,
      regencyId,
      provinceId,
    });

    // 1. Ambil data province
    console.log("🔍 Mengambil data province...");
    const provinceResponse = await Promise.race([
      fetch(`https://ibnux.github.io/data-indonesia/provinsi.json`),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("API Timeout setelah 15 detik")),
          15000
        )
      ),
    ]);

    if (!provinceResponse.ok) {
      throw new Error(
        `API tidak dapat mengambil data provinsi. Status: ${provinceResponse.status}`
      );
    }

    const provincesData = await provinceResponse.json();
    const provinceData = provincesData.find((p) => p.id === provinceId);

    if (!provinceData) {
      throw new Error(`Province dengan ID ${provinceId} tidak ditemukan`);
    }

    console.log("✅ Data province dari API:", provinceData);

    // 2. Ambil data regency
    console.log("🔍 Mengambil data regency...");
    const regencyResponse = await Promise.race([
      fetch(
        `https://ibnux.github.io/data-indonesia/kabupaten/${provinceId}.json`
      ),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("API Timeout setelah 15 detik")),
          15000
        )
      ),
    ]);

    if (!regencyResponse.ok) {
      throw new Error(
        `API tidak dapat mengambil data kabupaten untuk provinsi ${provinceId}. Status: ${regencyResponse.status}`
      );
    }

    const regenciesData = await regencyResponse.json();
    const regencyData = regenciesData.find((r) => r.id === regencyId);

    if (!regencyData) {
      throw new Error(`Regency dengan ID ${regencyId} tidak ditemukan`);
    }

    console.log("✅ Data regency dari API:", regencyData);

    // 3. Ambil data district
    console.log("🔍 Mengambil data district...");
    const districtResponse = await Promise.race([
      fetch(
        `https://ibnux.github.io/data-indonesia/kecamatan/${regencyId}.json`
      ),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("API Timeout setelah 15 detik")),
          15000
        )
      ),
    ]);

    if (!districtResponse.ok) {
      throw new Error(
        `API tidak dapat mengambil data kecamatan untuk kabupaten ${regencyId}. Status: ${districtResponse.status}`
      );
    }

    const districtsData = await districtResponse.json();
    const districtData = districtsData.find((d) => d.id === districtId);

    if (!districtData) {
      throw new Error(`District dengan ID ${districtId} tidak ditemukan`);
    }

    console.log("✅ Data district dari API:", districtData);

    // 4. Ambil data village
    console.log("🔍 Mengambil data village...");
    const villageResponse = await Promise.race([
      fetch(
        `https://ibnux.github.io/data-indonesia/kelurahan/${districtId}.json`
      ),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("API Timeout setelah 15 detik")),
          15000
        )
      ),
    ]);

    if (!villageResponse.ok) {
      throw new Error(
        `API tidak dapat mengambil data kelurahan untuk kecamatan ${districtId}. Status: ${villageResponse.status}`
      );
    }

    const villagesData = await villageResponse.json();
    const villageData = villagesData.find((v) => v.id === villageId);

    if (!villageData) {
      throw new Error(`Village dengan ID ${villageId} tidak ditemukan`);
    }

    console.log("✅ Data village dari API:", villageData);

    // Return data dengan nama ASLI dari API ibnux
    const result = {
      villageId: villageData.id,
      villageName: villageData.nama, // Nama ASLI desa dari API
      districtId: districtData.id,
      districtName: districtData.nama, // Nama ASLI kecamatan dari API
      regencyId: regencyData.id,
      regencyName: regencyData.nama, // Nama ASLI kabupaten dari API
      provinceId: provinceData.id,
      provinceName: provinceData.nama, // Nama ASLI provinsi dari API
    };

    console.log("✅ Data lengkap dari API:", result);
    return result;
  } catch (error) {
    console.error("❌ Error mengambil data dari API:", error.message);
    throw new Error(`Gagal mengambil data lokasi dari API: ${error.message}`);
  }
}

// Handler lainnya tetap sama...
const getStuntingRecords = async (request, h) => {
  try {
    const { limit = 50, offset = 0, search = "", status = "" } = request.query;

    const where = {};

    if (search) {
      where.OR = [
        { childName: { contains: search, mode: "insensitive" } },
        { motherName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    const records = await prisma.stuntingRecord.findMany({
      where,
      include: {
        village: {
          include: {
            district: {
              include: {
                regency: {
                  include: {
                    province: true,
                  },
                },
              },
            },
          },
        },
        suggestedAction: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number.parseInt(limit),
      skip: Number.parseInt(offset),
    });

    const total = await prisma.stuntingRecord.count({ where });

    return h
      .response({
        success: true,
        data: records,
        pagination: {
          total,
          limit: Number.parseInt(limit),
          offset: Number.parseInt(offset),
          hasMore: Number.parseInt(offset) + Number.parseInt(limit) < total,
        },
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching stunting records:", error);
    return h
      .response({
        success: false,
        error: "Failed to fetch records",
      })
      .code(500);
  }
};

const getStuntingRecordById = async (request, h) => {
  try {
    const { id } = request.params;

    const record = await prisma.stuntingRecord.findUnique({
      where: { id: id },
      include: {
        village: {
          include: {
            district: {
              include: {
                regency: {
                  include: {
                    province: true,
                  },
                },
              },
            },
          },
        },
        suggestedAction: true,
      },
    });

    if (!record) {
      return h
        .response({
          success: false,
          error: "Record not found",
        })
        .code(404);
    }

    return h
      .response({
        success: true,
        data: record,
      })
      .code(200);
  } catch (error) {
    console.error("Error fetching stunting record:", error);
    return h
      .response({
        success: false,
        error: "Failed to fetch record",
      })
      .code(500);
  }
};

// Update handler lainnya untuk menggunakan nama kolom yang baru
const updateStuntingRecord = async (request, h) => {
  try {
    const { id } = request.params;
    const body = request.payload;

    const record = await prisma.stuntingRecord.update({
      where: { id: id },
      data: {
        childName: body.childName,
        motherName: body.motherName,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        gender: body.gender,
        weight: body.weight ? Number.parseFloat(body.weight) : undefined,
        height: body.height ? Number.parseFloat(body.height) : undefined,
        ageInMonths: body.ageInMonths
          ? Number.parseInt(body.ageInMonths)
          : undefined,
        villageId: body.villageId,
        status: body.status,
        riskPercentage: body.riskPercentage
          ? Number.parseFloat(body.riskPercentage)
          : undefined,
        heightPercentile: body.heightPercentile
          ? Number.parseFloat(body.heightPercentile)
          : undefined,
        weightPercentile: body.weightPercentile
          ? Number.parseFloat(body.weightPercentile)
          : undefined,
        heightCategory: body.heightCategory,
        weightCategory: body.weightCategory,
        suggestedActionId: body.suggestedActionId,
        recommendedEducationId: body.recommendedEducationId,
      },
      include: {
        village: {
          include: {
            district: {
              include: {
                regency: {
                  include: {
                    province: true,
                  },
                },
              },
            },
          },
        },
        suggestedAction: true,
      },
    });

    return h
      .response({
        success: true,
        data: record,
        message: "Record updated successfully",
      })
      .code(200);
  } catch (error) {
    console.error("Error updating stunting record:", error);
    return h
      .response({
        success: false,
        error: "Failed to update record",
      })
      .code(500);
  }
};

const deleteStuntingRecord = async (request, h) => {
  try {
    const { id } = request.params;

    await prisma.stuntingRecord.delete({
      where: { id: id },
    });

    return h
      .response({
        success: true,
        message: "Record deleted successfully",
      })
      .code(200);
  } catch (error) {
    console.error("Error deleting stunting record:", error);
    return h
      .response({
        success: false,
        error: "Failed to delete record",
      })
      .code(500);
  }
};

const routes = [
  {
    method: "GET",
    path: "/stunting",
    handler: getStuntingRecords,
  },
  {
    method: "POST",
    path: "/stunting",
    handler: createStuntingRecord,
  },
  {
    method: "GET",
    path: "/stunting/{id}",
    handler: getStuntingRecordById,
  },
  {
    method: "PUT",
    path: "/stunting/{id}",
    handler: updateStuntingRecord,
  },
  {
    method: "DELETE",
    path: "/stunting/{id}",
    handler: deleteStuntingRecord,
  },
];

module.exports = {
  getStuntingRecords,
  createStuntingRecord,
  getStuntingRecordById,
  updateStuntingRecord,
  deleteStuntingRecord,
  routes,
};
