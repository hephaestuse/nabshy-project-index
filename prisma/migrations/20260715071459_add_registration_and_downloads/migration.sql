-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationSession_tokenHash_key" ON "RegistrationSession"("tokenHash");

-- CreateIndex
CREATE INDEX "RegistrationSession_userId_idx" ON "RegistrationSession"("userId");

-- CreateIndex
CREATE INDEX "RegistrationSession_expiresAt_idx" ON "RegistrationSession"("expiresAt");

-- CreateIndex
CREATE INDEX "DownloadEvent_userId_idx" ON "DownloadEvent"("userId");

-- CreateIndex
CREATE INDEX "DownloadEvent_projectId_idx" ON "DownloadEvent"("projectId");

-- CreateIndex
CREATE INDEX "DownloadEvent_downloadedAt_idx" ON "DownloadEvent"("downloadedAt");

-- CreateIndex
CREATE INDEX "DownloadEvent_projectId_downloadedAt_idx" ON "DownloadEvent"("projectId", "downloadedAt");

-- AddForeignKey
ALTER TABLE "RegistrationSession" ADD CONSTRAINT "RegistrationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadEvent" ADD CONSTRAINT "DownloadEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
