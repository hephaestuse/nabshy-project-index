import "server-only";

import { createReadStream } from "node:fs";
import { open, stat } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { ApplicationError } from "@/lib/errors/application-error";
import { registrationService } from "./registration.service";

const pdfFilenamePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.pdf$/;

function getBrochuresDirectory() {
  const configuredDirectory =
    process.env.PROJECT_BROCHURES_DIR ?? process.env.BROCHURES_DIR;

  if (
    !configuredDirectory ||
    configuredDirectory === "./storage/brochures" ||
    configuredDirectory === "storage/brochures"
  ) {
    return path.join(process.cwd(), "storage", "brochures");
  }

  return path.resolve(configuredDirectory);
}

function getJournalDirectory() {
  const configuredDirectory = process.env.GENERAL_JOURNAL_DIR;

  if (
    !configuredDirectory ||
    configuredDirectory === "./storage/general-journal" ||
    configuredDirectory === "storage/general-journal"
  ) {
    return path.join(process.cwd(), "storage", "general-journal");
  }

  return path.resolve(configuredDirectory);
}

function resolvePdfPath(directory: string, filename: string) {
  if (
    !filename ||
    path.isAbsolute(filename) ||
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\") ||
    !pdfFilenamePattern.test(filename)
  ) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  const resolvedPath = path.resolve(directory, filename);
  const relativePath = path.relative(directory, resolvedPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  return resolvedPath;
}

function resolveBrochurePath(filename: string) {
  return resolvePdfPath(getBrochuresDirectory(), filename);
}

function resolveJournalPath(filename: string) {
  return resolvePdfPath(getJournalDirectory(), filename);
}

function getSafeDownloadFilename(slug: string) {
  return `${slug.replace(/[^a-zA-Z0-9_-]/g, "-")}-brochure.pdf`;
}

async function prepareBrochureDownload(slug: string, token?: string) {
  const session = await registrationService.resolveValidSession(token);

  if (!session) {
    throw new ApplicationError("DOWNLOAD_UNAUTHORIZED");
  }

  const project = await prisma.project.findFirst({
    where: {
      slug,
      isActive: true,
    },
    select: {
      id: true,
      slug: true,
      brochureFile: true,
    },
  });

  if (!project) {
    throw new ApplicationError("PROJECT_NOT_FOUND");
  }

  if (!project.brochureFile) {
    throw new ApplicationError("BROCHURE_NOT_AVAILABLE");
  }

  const filePath = resolveBrochurePath(project.brochureFile);
  const fileStats = await stat(filePath).catch(() => null);

  if (!fileStats?.isFile()) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  const fileHandle = await open(filePath, "r").catch(() => null);

  if (!fileHandle) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  await fileHandle.close();

  await prisma.downloadEvent.create({
    data: {
      userId: session.userId,
      projectId: project.id,
    },
  });

  return {
    stream: createReadStream(filePath),
    contentLength: fileStats.size,
    filename: getSafeDownloadFilename(project.slug),
  };
}

async function prepareJournalDownload(token?: string) {
  const session = await registrationService.resolveValidSession(token);

  if (!session) {
    throw new ApplicationError("DOWNLOAD_UNAUTHORIZED");
  }

  const journal = await prisma.generalJournal.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      titleEn: true,
      fileName: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!journal?.fileName) {
    throw new ApplicationError("BROCHURE_NOT_AVAILABLE");
  }

  const filePath = resolveJournalPath(journal.fileName);
  const fileStats = await stat(filePath).catch(() => null);

  if (!fileStats?.isFile()) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  const fileHandle = await open(filePath, "r").catch(() => null);

  if (!fileHandle) {
    throw new ApplicationError("FILE_NOT_FOUND");
  }

  await fileHandle.close();

  await prisma.generalJournalDownloadEvent.create({
    data: {
      userId: session.userId,
      journalId: journal.id,
    },
  });

  return {
    stream: createReadStream(filePath),
    contentLength: fileStats.size,
    filename: "platform-journal.pdf",
  };
}

export const downloadService = {
  prepareBrochureDownload,
  prepareJournalDownload,
};
