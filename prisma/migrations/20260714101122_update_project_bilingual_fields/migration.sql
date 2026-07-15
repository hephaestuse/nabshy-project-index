-- Add new bilingual fields as nullable first so existing rows can be backfilled.
ALTER TABLE "Project"
ADD COLUMN "addressEn" TEXT,
ADD COLUMN "addressFa" TEXT,
ADD COLUMN "usageEn" TEXT,
ADD COLUMN "usageFa" TEXT;

-- Preserve useful values from the previous model before removing old columns.
UPDATE "Project"
SET
  "titleFa" = COALESCE("titleFa", "titleEn"),
  "cityFa" = COALESCE("cityFa", "cityEn"),
  "developerNameFa" = COALESCE("developerNameFa", "developerNameEn"),
  "usageEn" = COALESCE("usageEn", "usage"),
  "usageFa" = COALESCE("usageFa", "usage"),
  "addressEn" = COALESCE("addressEn", "locationEn"),
  "addressFa" = COALESCE("addressFa", "locationFa", "locationEn");

ALTER TABLE "Project"
ALTER COLUMN "titleFa" SET NOT NULL,
ALTER COLUMN "cityFa" SET NOT NULL,
ALTER COLUMN "developerNameFa" SET NOT NULL,
ALTER COLUMN "usageEn" SET NOT NULL,
ALTER COLUMN "usageFa" SET NOT NULL,
ALTER COLUMN "addressEn" SET NOT NULL,
ALTER COLUMN "addressFa" SET NOT NULL,
ALTER COLUMN "imagePath" DROP NOT NULL,
ALTER COLUMN "brochureFile" DROP NOT NULL;

ALTER TABLE "Project"
DROP COLUMN "imageAltEn",
DROP COLUMN "imageAltFa",
DROP COLUMN "locationEn",
DROP COLUMN "locationFa",
DROP COLUMN "propertyTypeEn",
DROP COLUMN "propertyTypeFa",
DROP COLUMN "startingPriceEn",
DROP COLUMN "startingPriceFa",
DROP COLUMN "subtitleEn",
DROP COLUMN "subtitleFa",
DROP COLUMN "usage";
