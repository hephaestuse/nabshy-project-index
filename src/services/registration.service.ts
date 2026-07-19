import "server-only";

import { prisma } from "@/lib/prisma";
import { ApplicationError } from "@/lib/errors/application-error";
import { normalizePhoneNumber } from "@/lib/security/phone-normalization";
import {
  generateSessionToken,
  getSessionExpirationDate,
  hashSessionToken,
} from "@/lib/security/session-token";
import type { JobTitle, RegisterForDownloadInput } from "@/types/registration";

type RegistrationServiceInput = Omit<
  RegisterForDownloadInput,
  "jobTitle" | "locale"
> & {
  jobTitle: JobTitle;
};

function getDownloadUrl(slug: string) {
  return `/api/download/${encodeURIComponent(slug)}`;
}

function getJournalDownloadUrl() {
  return "/api/download/journal";
}

async function resolveValidSession(token: string | undefined) {
  if (!token) {
    return null;
  }

  const session = await prisma.registrationSession.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      revokedAt: true,
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    return null;
  }

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  };
}

async function checkProjectDownloadAccess(projectSlug: string, token?: string) {
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      isActive: true,
    },
    select: {
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

  const session = await resolveValidSession(token);

  if (!session) {
    return {
      registrationRequired: true as const,
    };
  }

  return {
    registrationRequired: false as const,
    downloadUrl: getDownloadUrl(project.slug),
  };
}

async function checkJournalDownloadAccess(token?: string) {
  const journal = await prisma.generalJournal.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      fileName: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!journal?.fileName) {
    throw new ApplicationError("BROCHURE_NOT_AVAILABLE");
  }

  const session = await resolveValidSession(token);

  if (!session) {
    return {
      registrationRequired: true as const,
    };
  }

  return {
    registrationRequired: false as const,
    downloadUrl: getJournalDownloadUrl(),
  };
}

async function checkDownloadAccess(input: {
  targetType: "project" | "journal";
  projectSlug?: string;
  token?: string;
}) {
  if (input.targetType === "journal") {
    return checkJournalDownloadAccess(input.token);
  }

  if (!input.projectSlug) {
    throw new ApplicationError("PROJECT_NOT_FOUND");
  }

  return checkProjectDownloadAccess(input.projectSlug, input.token);
}

async function registerForDownload(input: RegistrationServiceInput) {
  const normalizedPhone = normalizePhoneNumber(input.phone);

  if (!normalizedPhone) {
    throw new ApplicationError("INVALID_PHONE");
  }

  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = getSessionExpirationDate();

  const result = await prisma.$transaction(async (tx) => {
    let downloadUrl: string;

    if (input.targetType === "journal") {
      const journal = await tx.generalJournal.findFirst({
        where: {
          isActive: true,
        },
        select: {
          fileName: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!journal?.fileName) {
        throw new ApplicationError("BROCHURE_NOT_AVAILABLE");
      }

      downloadUrl = getJournalDownloadUrl();
    } else {
      if (!input.projectSlug) {
        throw new ApplicationError("PROJECT_NOT_FOUND");
      }

      const project = await tx.project.findFirst({
        where: {
          slug: input.projectSlug,
          isActive: true,
        },
        select: {
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

      downloadUrl = getDownloadUrl(project.slug);
    }

    const user = await tx.user.upsert({
      where: {
        phone: normalizedPhone,
      },
      update: {
        fullName: input.fullName,
        jobTitle: input.jobTitle,
      },
      create: {
        fullName: input.fullName,
        phone: normalizedPhone,
        jobTitle: input.jobTitle,
      },
      select: {
        id: true,
      },
    });

    await tx.registrationSession.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      downloadUrl,
    };
  });

  return {
    ...result,
    token,
    expiresAt,
  };
}

export const registrationService = {
  checkDownloadAccess,
  registerForDownload,
  resolveValidSession,
};
