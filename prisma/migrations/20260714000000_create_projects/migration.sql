-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFa" TEXT,
    "subtitleEn" TEXT,
    "subtitleFa" TEXT,
    "cityEn" TEXT NOT NULL,
    "cityFa" TEXT,
    "developerNameEn" TEXT NOT NULL,
    "developerNameFa" TEXT,
    "locationEn" TEXT NOT NULL,
    "locationFa" TEXT,
    "propertyTypeEn" TEXT NOT NULL,
    "propertyTypeFa" TEXT,
    "startingPriceEn" TEXT NOT NULL,
    "startingPriceFa" TEXT,
    "imageAltEn" TEXT NOT NULL,
    "imageAltFa" TEXT,
    "usage" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "brochureFile" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_isActive_sortOrder_idx" ON "Project"("isActive", "sortOrder");
