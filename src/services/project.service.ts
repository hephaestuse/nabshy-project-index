import "server-only";

import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DownloadTarget } from "@/types/download";
import type { Locale } from "@/types/locale";
import type { ProjectCardData } from "@/types/project";

const projectSelect = {
  id: true,
  slug: true,
  titleFa: true,
  titleEn: true,
  cityFa: true,
  cityEn: true,
  developerNameFa: true,
  developerNameEn: true,
  usageFa: true,
  usageEn: true,
  addressFa: true,
  addressEn: true,
  imagePath: true,
} as const;

type ProjectRecord = {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  cityFa: string;
  cityEn: string;
  developerNameFa: string;
  developerNameEn: string;
  usageFa: string;
  usageEn: string;
  addressFa: string;
  addressEn: string;
  imagePath: string | null;
};

function mapProjectForLocale(
  project: ProjectRecord,
  locale: Locale,
): ProjectCardData {
  const isPersian = locale === "fa";

  return {
    id: project.id,
    slug: project.slug,
    title: isPersian ? project.titleFa : project.titleEn,
    subtitle: null,
    city: isPersian ? project.cityFa : project.cityEn,
    citySearchText: project.cityFa,
    developerName: isPersian
      ? project.developerNameFa
      : project.developerNameEn,
    usage: isPersian ? project.usageFa : project.usageEn,
    address: isPersian ? project.addressFa : project.addressEn,
    image: project.imagePath,
  };
}

async function getActiveProjects(locale: Locale) {
  await connection();

  const projects = await prisma.project.findMany({
    where: {
      isActive: true,
      visibleInIndex: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: projectSelect,
  });

  return projects.map((project) => mapProjectForLocale(project, locale));
}

async function getHeroDownloadTarget(locale: Locale): Promise<DownloadTarget | null> {
  await connection();

  const journal = await prisma.generalJournal.findFirst({
    where: {
      isActive: true,
    },
    select: {
      titleFa: true,
      titleEn: true,
      fileName: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!journal?.fileName) {
    return null;
  }

  return {
    type: "journal",
    title: locale === "fa" ? journal.titleFa : journal.titleEn,
  };
}

export const projectService = {
  getActiveProjects,
  getHeroDownloadTarget,
};
