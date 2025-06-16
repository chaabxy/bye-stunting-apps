// perubahan caca: Backend API Routes untuk Educations dengan field tambahan dan validasi realtime
const Joi = require("joi");
const prisma = require("../lib/prisma");

const educationRoutes = [
  // perubahan caca: Get all educations dengan filter publish status
  {
    method: "GET",
    path: "/api/educations",
    handler: async (request, h) => {
      try {
        const {
          category,
          limit = 50,
          offset = 0,
          admin = false,
        } = request.query;

        console.log("Fetching educations with params:", {
          category,
          limit,
          offset,
          admin,
        });

        const where = {
          // perubahan caca: Filter berdasarkan status publikasi untuk user
          ...(admin !== "true" && { isPublished: true }),
          ...(category && category !== "all" && { category }),
        };

        // perubahan caca: Query ke tabel educations dengan relasi baru
        const educations = await prisma.education.findMany({
          where,
          include: {
            sections: {
              orderBy: { sectionOrder: "asc" },
            },
            conclusions: true,
            importantPoints: {
              orderBy: { pointOrder: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
          take: Number.parseInt(limit),
          skip: Number.parseInt(offset),
        });

        console.log(`Found ${educations.length} educations`);

        // perubahan caca: Transform data dengan field tambahan dan slug
        const transformedEducations = educations.map((education) => ({
          id: education.id,
          title: education.title,
          slug: education.slug, // Include slug field
          excerpt: education.excerpt,
          category: education.category,
          tags: education.tags, // perubahan caca: Include tags
          source: education.source, // perubahan caca: Include source
          author: education.author, // perubahan caca: Include author
          header_image: education.headerImage,
          publish_date: education.publishDate, // perubahan caca: Include publish date
          created_at: education.createdAt, // perubahan caca: Include created date
          reading_time: education.readingTime,
          view_count: education.viewCount,
          like_count: education.likeCount,
          is_published: education.isPublished, // perubahan caca: Include publish status
          is_draft: education.isDraft, // perubahan caca: Include draft status
          is_popular: education.isPopular,
          updated_at: education.updatedAt,
          recommended_education: education.recommendedEducation || "normal", // Fix: use correct Prisma field name
          content_sections: education.sections.map((section) => ({
            id: section.id,
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.sectionOrder,
            slug: section.heading
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim(),
            illustration: section.illustrationType
              ? {
                  type: section.illustrationType,
                  url: section.illustrationUrl,
                  caption: section.illustrationCaption,
                }
              : null,
          })),
          conclusion: education.conclusions.map((conclusion) => ({
            heading: conclusion.heading,
            paragraph: conclusion.paragraph,
          })),
          important_points: education.importantPoints.map((point) => ({
            id: point.id,
            content: point.content,
            point_order: point.pointOrder,
          })),
        }));

        return h
          .response({
            isError: false,
            data: transformedEducations,
            message: "Educations fetched successfully",
          })
          .code(200);
      } catch (error) {
        console.error("Get educations error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // NEW: Get education by slug - PINDAH KE ATAS
  {
    method: "GET",
    path: "/api/educations/slug/{slug}",
    handler: async (request, h) => {
      try {
        const { slug } = request.params;
        const userIp = request.info.remoteAddress;

        console.log(`Fetching education with slug: ${slug}`);

        // Fix: Pastikan field slug ada di database dan query benar
        const education = await prisma.education.findFirst({
          where: {
            slug: slug,
            isPublished: true,
          },
          include: {
            sections: {
              orderBy: { sectionOrder: "asc" },
            },
            conclusions: true,
            importantPoints: {
              orderBy: { pointOrder: "asc" },
            },
          },
        });

        if (!education) {
          console.log(`Education with slug ${slug} not found`);
          return h
            .response({
              isError: true,
              message: "Edukasi tidak ditemukan",
            })
            .code(404);
        }

        // Auto increment view count - wrap in try-catch to prevent errors
        try {
          await prisma.$transaction([
            prisma.education.update({
              where: { id: education.id },
              data: { viewCount: { increment: 1 } },
            }),
            prisma.educationView.create({
              data: {
                educationId: education.id,
                userIp: userIp,
              },
            }),
          ]);
        } catch (viewError) {
          console.log("View tracking error (non-critical):", viewError.message);
        }

        console.log(`Education found by slug: ${education.title}`);

        // Transform data
        const transformedEducation = {
          id: education.id,
          title: education.title,
          slug: education.slug,
          excerpt: education.excerpt,
          category: education.category,
          tags: education.tags || [],
          source: education.source,
          author: education.author,
          header_image: education.headerImage,
          publish_date: education.publishDate,
          created_at: education.createdAt,
          reading_time: education.readingTime,
          view_count: education.viewCount + 1,
          like_count: education.likeCount,
          is_published: education.isPublished,
          is_draft: education.isDraft,
          is_popular: education.isPopular,
          updated_at: education.updatedAt,
          recommended_education: education.recommendedEducation || "normal", // Fix: use correct Prisma field name
          content_sections: education.sections.map((section) => ({
            id: section.id,
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.sectionOrder,
            slug: section.heading
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim(),
            illustration: section.illustrationType
              ? {
                  type: section.illustrationType,
                  url: section.illustrationUrl,
                  caption: section.illustrationCaption,
                }
              : null,
          })),
          conclusion: education.conclusions.map((conclusion) => ({
            heading: conclusion.heading,
            paragraph: conclusion.paragraph,
          })),
          important_points: education.importantPoints.map((point) => ({
            id: point.id,
            content: point.content,
            point_order: point.pointOrder,
          })),
        };

        return h
          .response({
            isError: false,
            data: transformedEducation,
          })
          .code(200);
      } catch (error) {
        console.error("Get education by slug error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // perubahan caca: Get single education by ID dengan auto increment view
  {
    method: "GET",
    path: "/api/educations/{id}",
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const userIp = request.info.remoteAddress;

        console.log(`Fetching education with ID: ${id}`);

        const education = await prisma.education.findFirst({
          where: {
            id: Number.parseInt(id),
            isPublished: true, // perubahan caca: Hanya tampilkan yang sudah publish
          },
          include: {
            sections: {
              orderBy: { sectionOrder: "asc" },
            },
            conclusions: true,
            importantPoints: {
              orderBy: { pointOrder: "asc" },
            },
          },
        });

        if (!education) {
          console.log(`Education with ID ${id} not found`);
          return h
            .response({
              isError: true,
              message: "Edukasi tidak ditemukan",
            })
            .code(404);
        }

        // perubahan caca: Auto increment view count dan track individual view
        await prisma.$transaction([
          prisma.education.update({
            where: { id: Number.parseInt(id) },
            data: { viewCount: { increment: 1 } },
          }),
          prisma.educationView.create({
            data: {
              educationId: Number.parseInt(id),
              userIp: userIp,
            },
          }),
        ]);

        console.log(
          `Education found and view count updated: ${education.title}`
        );

        // perubahan caca: Transform data dengan field tambahan dan slug
        const transformedEducation = {
          id: education.id,
          title: education.title,
          slug: education.slug, // Include slug field
          excerpt: education.excerpt,
          category: education.category,
          tags: education.tags, // perubahan caca: Include tags
          source: education.source, // perubahan caca: Include source
          author: education.author, // perubahan caca: Include author
          header_image: education.headerImage,
          publish_date: education.publishDate, // perubahan caca: Include publish date
          created_at: education.createdAt, // perubahan caca: Include created date
          reading_time: education.readingTime,
          view_count: education.viewCount + 1,
          like_count: education.likeCount,
          is_published: education.isPublished,
          is_draft: education.isDraft,
          is_popular: education.isPopular,
          updated_at: education.updatedAt,
          recommended_education: education.recommendedEducation || "normal", // Fix: use correct Prisma field name
          content_sections: education.sections.map((section) => ({
            id: section.id,
            heading: section.heading,
            paragraph: section.paragraph,
            section_order: section.sectionOrder,
            slug: section.heading
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim(),
            illustration: section.illustrationType
              ? {
                  type: section.illustrationType,
                  url: section.illustrationUrl,
                  caption: section.illustrationCaption,
                }
              : null,
          })),
          conclusion: education.conclusions.map((conclusion) => ({
            heading: conclusion.heading,
            paragraph: conclusion.paragraph,
          })),
          important_points: education.importantPoints.map((point) => ({
            id: point.id,
            content: point.content,
            point_order: point.pointOrder,
          })),
        };

        return h
          .response({
            isError: false,
            data: transformedEducation,
          })
          .code(200);
      } catch (error) {
        console.error("Get education error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengambil edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // PERBAIKAN: Create new education dengan validasi yang diperbaiki
  {
    method: "POST",
    path: "/api/educations",
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().min(10).required(),
          slug: Joi.string().min(10).optional(), // TAMBAH: Field slug opsional
          excerpt: Joi.string().min(50).required(),
          category: Joi.string().required(),
          tags: Joi.array().items(Joi.string()).min(1).required(),
          source: Joi.string().allow("").optional(),
          author: Joi.string().required(),
          headerImage: Joi.string()
            .allow("")
            .custom((value, helpers) => {
              if (!value) return value;

              // Jika value adalah base64 image
              if (value.startsWith("data:image/")) {
                // Validasi format base64
                const base64Data = value.split(",")[1];
                if (!base64Data) {
                  return helpers.error("any.invalid");
                }

                // Hitung ukuran file (base64 sekitar 1.37x ukuran asli)
                const sizeInBytes = (base64Data.length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                if (sizeInMB > 1) {
                  return helpers.error("any.invalid", {
                    message: "Ukuran gambar maksimal 1MB",
                  });
                }
              }

              return value;
            })
            .optional(),
          readingTime: Joi.number().integer().min(1).required(),
          // PERBAIKAN: Struktur content yang benar
          content: Joi.array()
            .items(
              Joi.object({
                id: Joi.string().optional(),
                h2: Joi.string().required(),
                paragraph: Joi.string().min(100).required(),
                illustration: Joi.object({
                  type: Joi.string().valid("image", "video"),
                  url: Joi.string()
                    .required()
                    .custom((value, helpers) => {
                      const parent = helpers.state.ancestors[0];

                      if (
                        parent.type === "image" &&
                        value.startsWith("data:image/")
                      ) {
                        // Validasi base64 image
                        const base64Data = value.split(",")[1];
                        if (!base64Data) {
                          return helpers.error("any.invalid");
                        }

                        const sizeInBytes = (base64Data.length * 3) / 4;
                        const sizeInMB = sizeInBytes / (1024 * 1024);

                        if (sizeInMB > 1) {
                          return helpers.error("any.invalid", {
                            message: "Ukuran gambar ilustrasi maksimal 1MB",
                          });
                        }
                      }

                      return value;
                    }),
                  caption: Joi.string().allow(""),
                }).optional(),
              })
            )
            .min(1)
            .required(),
          conclusion: Joi.object({
            h2: Joi.string().required(),
            paragraph: Joi.string().min(50).required(),
          }).required(),
          importantPoints: Joi.array().items(Joi.string()).optional(),
          isPublished: Joi.boolean().optional().default(false),
          // SUPPORT BOTH FORMATS: camelCase and snake_case
          recommendedEducation: Joi.string()
            .valid("normal", "stunting", "severly_stunting")
            .optional()
            .default("normal"),
          recommended_education: Joi.string()
            .valid("normal", "stunting", "severly_stunting")
            .optional()
            .default("normal"),
        }),
        failAction: (request, h, err) => {
          console.error("Validation error details:", err.details);
          return h
            .response({
              isError: true,
              message:
                "Data tidak valid: " +
                err.details.map((d) => d.message).join(", "),
              details: err.details,
            })
            .code(400)
            .takeover();
        },
      },
    },
    handler: async (request, h) => {
      try {
        console.log("=== CREATE EDUCATION REQUEST ===");
        console.log("Raw payload:", JSON.stringify(request.payload, null, 2));

        const {
          title,
          slug: payloadSlug,
          excerpt,
          category,
          tags,
          source,
          author,
          headerImage,
          readingTime,
          content,
          conclusion,
          importantPoints = [],
          isPublished = false,
          recommendedEducation, // Support camelCase
          recommended_education, // Support snake_case
        } = request.payload;

        // Use whichever format is provided, prioritize camelCase
        const finalRecommendedEducation =
          recommendedEducation || recommended_education || "normal";

        console.log("Parsed data:", {
          title,
          category,
          contentSections: content?.length,
          isPublished,
          tags: tags?.length,
          recommendedEducation: finalRecommendedEducation,
        });

        // PERBAIKAN: Transaction dengan field tambahan
        const result = await prisma.$transaction(
          async (tx) => {
            // Generate slug if not provided
            const slug =
              payloadSlug ||
              title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");

            // Create education dengan field baru
            const education = await tx.education.create({
              data: {
                title,
                slug, // TAMBAH: Include slug
                excerpt,
                category,
                tags,
                source: source || null,
                author,
                headerImage: headerImage || null,
                readingTime,
                isPublished,
                isDraft: !isPublished,
                publishDate: isPublished ? new Date() : null,
                recommendedEducation: finalRecommendedEducation, // Fix: use correct Prisma field name
              },
            });

            console.log(
              "Creating education with recommendedEducation:",
              finalRecommendedEducation
            ); // Debug log

            console.log(`Education created with ID: ${education.id}`);

            // Create content sections
            if (content && content.length > 0) {
              const sectionsData = content.map((section, index) => ({
                educationId: education.id,
                heading: section.h2,
                paragraph: section.paragraph,
                sectionOrder: index + 1,
                illustrationType: section.illustration?.type || null,
                illustrationUrl: section.illustration?.url || null,
                illustrationCaption: section.illustration?.caption || null,
              }));

              await tx.educationSection.createMany({
                data: sectionsData,
              });
              console.log(`Created ${sectionsData.length} content sections`);
            }

            // Create conclusion
            if (conclusion) {
              await tx.educationConclusion.create({
                data: {
                  educationId: education.id,
                  heading: conclusion.h2,
                  paragraph: conclusion.paragraph,
                },
              });
            }

            // Create important points
            if (importantPoints && importantPoints.length > 0) {
              const validImportantPoints = importantPoints.filter(
                (point) => point && point.trim()
              );
              if (validImportantPoints.length > 0) {
                const pointsData = validImportantPoints.map((point, index) => ({
                  educationId: education.id,
                  content: point,
                  pointOrder: index + 1,
                }));

                await tx.educationImportantPoint.createMany({
                  data: pointsData,
                });
                console.log(`Created ${pointsData.length} important points`);
              }
            }

            return education;
          },
          {
            timeout: 25000,
          }
        );

        console.log("Education creation completed successfully");

        return h
          .response({
            isError: false,
            message: `Edukasi berhasil ${
              isPublished ? "dipublikasi" : "disimpan sebagai draft"
            }`,
            data: { id: result.id },
          })
          .code(201);
      } catch (error) {
        console.error("Create education error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal membuat edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // PERBAIKAN: Update education dengan validasi yang diperbaiki
  {
    method: "PUT",
    path: "/api/educations/{id}",
    options: {
      validate: {
        payload: Joi.object({
          title: Joi.string().min(10).required(),
          slug: Joi.string().min(10).optional(), // TAMBAH: Field slug opsional
          excerpt: Joi.string().min(50).required(),
          category: Joi.string().required(),
          tags: Joi.array().items(Joi.string()).min(1).required(),
          source: Joi.string().allow("").optional(),
          author: Joi.string().required(),
          headerImage: Joi.string()
            .allow("")
            .custom((value, helpers) => {
              if (!value) return value;

              // Jika value adalah base64 image
              if (value.startsWith("data:image/")) {
                // Validasi format base64
                const base64Data = value.split(",")[1];
                if (!base64Data) {
                  return helpers.error("any.invalid");
                }

                // Hitung ukuran file (base64 sekitar 1.37x ukuran asli)
                const sizeInBytes = (base64Data.length * 3) / 4;
                const sizeInMB = sizeInBytes / (1024 * 1024);

                if (sizeInMB > 1) {
                  return helpers.error("any.invalid", {
                    message: "Ukuran gambar maksimal 1MB",
                  });
                }
              }

              return value;
            })
            .optional(),
          readingTime: Joi.number().integer().min(1).required(),
          // PERBAIKAN: Struktur content yang benar
          content: Joi.array()
            .items(
              Joi.object({
                id: Joi.string().optional(),
                h2: Joi.string().required(),
                paragraph: Joi.string().min(100).required(),
                illustration: Joi.object({
                  type: Joi.string().valid("image", "video"),
                  url: Joi.string()
                    .required()
                    .custom((value, helpers) => {
                      const parent = helpers.state.ancestors[0];

                      if (
                        parent.type === "image" &&
                        value.startsWith("data:image/")
                      ) {
                        // Validasi base64 image
                        const base64Data = value.split(",")[1];
                        if (!base64Data) {
                          return helpers.error("any.invalid");
                        }

                        const sizeInBytes = (base64Data.length * 3) / 4;
                        const sizeInMB = sizeInBytes / (1024 * 1024);

                        if (sizeInMB > 1) {
                          return helpers.error("any.invalid", {
                            message: "Ukuran gambar ilustrasi maksimal 1MB",
                          });
                        }
                      }

                      return value;
                    }),
                  caption: Joi.string().allow(""),
                }).optional(),
              })
            )
            .min(1)
            .required(),
          conclusion: Joi.object({
            h2: Joi.string().required(),
            paragraph: Joi.string().min(50).required(),
          }).required(),
          importantPoints: Joi.array().items(Joi.string()).optional(),
          isPublished: Joi.boolean().optional(),
          // SUPPORT BOTH FORMATS: camelCase and snake_case
          recommendedEducation: Joi.string()
            .valid("normal", "stunting", "severly_stunting")
            .optional(),
          recommended_education: Joi.string()
            .valid("normal", "stunting", "severly_stunting")
            .optional(),
        }),
        failAction: (request, h, err) => {
          console.error("Update validation error details:", err.details);
          return h
            .response({
              isError: true,
              message:
                "Data tidak valid: " +
                err.details.map((d) => d.message).join(", "),
              details: err.details,
            })
            .code(400)
            .takeover();
        },
      },
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;

        console.log("=== UPDATE EDUCATION REQUEST ===");
        console.log("Education ID:", id);
        console.log("Raw payload:", JSON.stringify(request.payload, null, 2));

        const {
          title,
          slug: payloadSlug,
          excerpt,
          category,
          tags,
          source,
          author,
          headerImage,
          readingTime,
          content,
          conclusion,
          importantPoints = [],
          isPublished,
          recommendedEducation, // Support camelCase
          recommended_education, // Support snake_case
        } = request.payload;

        // Use whichever format is provided, prioritize camelCase
        const finalRecommendedEducation =
          recommendedEducation || recommended_education;

        console.log("Parsed update data:", {
          title,
          category,
          contentSections: content?.length,
          isPublished,
          tags: tags?.length,
          recommendedEducation: finalRecommendedEducation,
        });

        // Transaction untuk update dengan field baru
        await prisma.$transaction(
          async (tx) => {
            // Get current education untuk check publish status
            const currentEducation = await tx.education.findUnique({
              where: { id: Number.parseInt(id) },
            });

            if (!currentEducation) {
              throw new Error("Education not found");
            }

            // Generate slug if not provided
            const slug =
              payloadSlug ||
              title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/[\s_-]+/g, "-")
                .replace(/^-+|-+$/g, "");

            // Update education dengan field baru
            await tx.education.update({
              where: { id: Number.parseInt(id) },
              data: {
                title,
                slug,
                excerpt,
                category,
                tags,
                source: source || null,
                author,
                headerImage: headerImage || null,
                readingTime,
                isPublished:
                  isPublished !== undefined
                    ? isPublished
                    : currentEducation?.isPublished,
                isDraft:
                  isPublished !== undefined
                    ? !isPublished
                    : currentEducation?.isDraft,
                publishDate:
                  isPublished && !currentEducation?.isPublished
                    ? new Date()
                    : currentEducation?.publishDate,
                recommendedEducation:
                  finalRecommendedEducation !== undefined
                    ? finalRecommendedEducation
                    : currentEducation?.recommendedEducation, // Fix: use correct Prisma field name
              },
            });

            console.log(
              "Updating recommendedEducation to:",
              finalRecommendedEducation
            ); // Debug log

            // Delete existing related data
            await Promise.all([
              tx.educationSection.deleteMany({
                where: { educationId: Number.parseInt(id) },
              }),
              tx.educationConclusion.deleteMany({
                where: { educationId: Number.parseInt(id) },
              }),
              tx.educationImportantPoint.deleteMany({
                where: { educationId: Number.parseInt(id) },
              }),
            ]);

            // Create new content sections
            if (content && content.length > 0) {
              const sectionsData = content.map((section, index) => ({
                educationId: Number.parseInt(id),
                heading: section.h2,
                paragraph: section.paragraph,
                sectionOrder: index + 1,
                illustrationType: section.illustration?.type || null,
                illustrationUrl: section.illustration?.url || null,
                illustrationCaption: section.illustration?.caption || null,
              }));

              await tx.educationSection.createMany({
                data: sectionsData,
              });
            }

            // Create new conclusion
            if (conclusion) {
              await tx.educationConclusion.create({
                data: {
                  educationId: Number.parseInt(id),
                  heading: conclusion.h2,
                  paragraph: conclusion.paragraph,
                },
              });
            }

            // Create new important points
            if (importantPoints && importantPoints.length > 0) {
              const validImportantPoints = importantPoints.filter(
                (point) => point && point.trim()
              );
              if (validImportantPoints.length > 0) {
                const pointsData = validImportantPoints.map((point, index) => ({
                  educationId: Number.parseInt(id),
                  content: point,
                  pointOrder: index + 1,
                }));

                await tx.educationImportantPoint.createMany({
                  data: pointsData,
                });
              }
            }
          },
          {
            timeout: 25000,
          }
        );

        console.log("Education update completed successfully");

        return h
          .response({
            isError: false,
            message: "Edukasi berhasil diperbarui",
          })
          .code(200);
      } catch (error) {
        console.error("Update education error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal memperbarui edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // Delete education
  {
    method: "DELETE",
    path: "/api/educations/{id}",
    handler: async (request, h) => {
      try {
        const { id } = request.params;

        console.log(`Deleting education ID: ${id}`);

        await prisma.education.delete({
          where: { id: Number.parseInt(id) },
        });

        console.log("Education deleted successfully");

        return h
          .response({
            isError: false,
            message: "Edukasi berhasil dihapus",
          })
          .code(200);
      } catch (error) {
        console.error("Delete education error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal menghapus edukasi: " + error.message,
          })
          .code(500);
      }
    },
  },

  // Toggle publish/draft status
  {
    method: "PUT",
    path: "/api/educations/{id}/status",
    options: {
      validate: {
        payload: Joi.object({
          is_published: Joi.boolean().required(),
          is_draft: Joi.boolean().required(),
        }),
      },
    },
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const { is_published, is_draft } = request.payload;

        console.log(
          `Toggling status for education ID: ${id} - published: ${is_published}, draft: ${is_draft}`
        );

        await prisma.education.update({
          where: { id: Number.parseInt(id) },
          data: {
            isPublished: Boolean(is_published),
            isDraft: Boolean(is_draft),
            publishDate: Boolean(is_published) ? new Date() : null,
          },
        });

        return h
          .response({
            isError: false,
            message: `Edukasi berhasil ${
              Boolean(is_published) ? "dipublikasi" : "dijadikan draft"
            }`,
            data: {
              isPublished: Boolean(is_published),
              isDraft: Boolean(is_draft),
            },
          })
          .code(200);
      } catch (error) {
        console.error("Toggle status error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal mengubah status: " + error.message,
          })
          .code(500);
      }
    },
  },

  // Toggle education like
  {
    method: "POST",
    path: "/api/educations/{id}/like",
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const userIp = request.info.remoteAddress;

        console.log(
          `Processing like for education ID: ${id} from IP: ${userIp}`
        );

        const existingLike = await prisma.educationLike.findUnique({
          where: {
            educationId_userIp: {
              educationId: Number.parseInt(id),
              userIp: userIp,
            },
          },
        });

        if (existingLike) {
          await prisma.$transaction([
            prisma.educationLike.delete({
              where: { id: existingLike.id },
            }),
            prisma.education.update({
              where: { id: Number.parseInt(id) },
              data: { likeCount: { decrement: 1 } },
            }),
          ]);

          return h
            .response({
              isError: false,
              message: "Like berhasil dihapus",
              action: "unliked",
            })
            .code(200);
        } else {
          await prisma.$transaction([
            prisma.educationLike.create({
              data: {
                educationId: Number.parseInt(id),
                userIp: userIp,
              },
            }),
            prisma.education.update({
              where: { id: Number.parseInt(id) },
              data: { likeCount: { increment: 1 } },
            }),
          ]);

          return h
            .response({
              isError: false,
              message: "Like berhasil ditambahkan",
              action: "liked",
            })
            .code(200);
        }
      } catch (error) {
        console.error("Like education error:", error);
        return h
          .response({
            isError: true,
            message: "Gagal memperbarui like: " + error.message,
          })
          .code(500);
      }
    },
  },

  // Check if user has liked education
  {
    method: "GET",
    path: "/api/educations/{id}/like-status",
    handler: async (request, h) => {
      try {
        const { id } = request.params;
        const userIp = request.info.remoteAddress;

        const existingLike = await prisma.educationLike.findUnique({
          where: {
            educationId_userIp: {
              educationId: Number.parseInt(id),
              userIp: userIp,
            },
          },
        });

        return h
          .response({
            isError: false,
            data: { hasLiked: !!existingLike },
          })
          .code(200);
      } catch (error) {
        console.error("Check like status error:", error);
        return h
          .response({
            isError: false,
            data: { hasLiked: false },
          })
          .code(200);
      }
    },
  },
];

module.exports = educationRoutes;
