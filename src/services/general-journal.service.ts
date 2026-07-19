import "server-only";

import { prisma } from "@/lib/prisma";
import { ApplicationError } from "@/lib/errors/application-error";
import {
  deleteStoredFile,
  getGeneralJournalDirectory,
  saveUploadedFile,
} from "@/lib/files/file-storage";
import { validatePdf } from "@/lib/files/file-validation";

async function getActiveJournal() {
  const journal = await prisma.generalJournal.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          downloadEvents: true,
        },
      },
    },
  });

  if (!journal) {
    return null;
  }

  const uniqueUsers = await prisma.generalJournalDownloadEvent.findMany({
    where: {
      journalId: journal.id,
    },
    distinct: ["userId"],
    select: {
      userId: true,
    },
  });

  return {
    id: journal.id,
    titleFa: journal.titleFa,
    titleEn: journal.titleEn,
    fileName: journal.fileName,
    originalFileName: journal.originalFileName,
    createdAt: journal.createdAt.toISOString(),
    totalDownloads: journal._count.downloadEvents,
    uniqueUsers: uniqueUsers.length,
  };
}

async function replaceJournal(input: {
  titleFa: string;
  titleEn: string;
  file: File;
}) {
  if (!(await validatePdf(input.file))) {
    throw new ApplicationError("VALIDATION_ERROR", "Invalid journal PDF.");
  }

  const directory = getGeneralJournalDirectory();
  const saved = await saveUploadedFile(input.file, directory, ".pdf");

  try {
    await prisma.$transaction(async (tx) => {
      await tx.generalJournal.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      await tx.generalJournal.create({
        data: {
          titleFa: input.titleFa,
          titleEn: input.titleEn,
          fileName: saved.fileName,
          originalFileName: input.file.name,
          isActive: true,
        },
      });
    });
  } catch (error) {
    await deleteStoredFile(directory, saved.fileName);
    console.error("Journal replacement failed");
    throw error;
  }
}

export const generalJournalService = {
  getActiveJournal,
  replaceJournal,
};
