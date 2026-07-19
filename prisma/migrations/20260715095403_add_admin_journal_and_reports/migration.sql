-- CreateTable
CREATE TABLE "GeneralJournal" (
    "id" TEXT NOT NULL,
    "titleFa" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalFileName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralJournal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralJournalDownloadEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralJournalDownloadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GeneralJournal_isActive_idx" ON "GeneralJournal"("isActive");

-- CreateIndex
CREATE INDEX "GeneralJournalDownloadEvent_userId_idx" ON "GeneralJournalDownloadEvent"("userId");

-- CreateIndex
CREATE INDEX "GeneralJournalDownloadEvent_journalId_idx" ON "GeneralJournalDownloadEvent"("journalId");

-- CreateIndex
CREATE INDEX "GeneralJournalDownloadEvent_downloadedAt_idx" ON "GeneralJournalDownloadEvent"("downloadedAt");

-- CreateIndex
CREATE INDEX "GeneralJournalDownloadEvent_journalId_downloadedAt_idx" ON "GeneralJournalDownloadEvent"("journalId", "downloadedAt");

-- CreateIndex
CREATE INDEX "GeneralJournalDownloadEvent_userId_downloadedAt_idx" ON "GeneralJournalDownloadEvent"("userId", "downloadedAt");

-- CreateIndex
CREATE INDEX "DownloadEvent_userId_downloadedAt_idx" ON "DownloadEvent"("userId", "downloadedAt");

-- AddForeignKey
ALTER TABLE "GeneralJournalDownloadEvent" ADD CONSTRAINT "GeneralJournalDownloadEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralJournalDownloadEvent" ADD CONSTRAINT "GeneralJournalDownloadEvent_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "GeneralJournal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
