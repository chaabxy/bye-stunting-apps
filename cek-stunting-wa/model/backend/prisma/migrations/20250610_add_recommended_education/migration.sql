-- CreateEnum
CREATE TYPE "recommended_education_type" AS ENUM ('normal', 'stunting', 'severly_stunting');

-- AlterTable
ALTER TABLE "educations" ADD COLUMN "recomended_education" "recommended_education_type" NOT NULL DEFAULT 'normal';
