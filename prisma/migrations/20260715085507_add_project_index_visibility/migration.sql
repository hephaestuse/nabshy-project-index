-- DropIndex
DROP INDEX "Project_isActive_sortOrder_idx";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "visibleInIndex" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Project_isActive_visibleInIndex_sortOrder_idx" ON "Project"("isActive", "visibleInIndex", "sortOrder");
