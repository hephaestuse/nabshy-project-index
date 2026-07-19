import "server-only";

import { prisma } from "@/lib/prisma";

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

async function getAdminDashboardSummary() {
  const [
    totalProjects,
    activeProjects,
    inactiveProjects,
    registeredUsers,
    totalProjectDownloads,
    totalJournalDownloads,
    uniqueProjectDownloaders,
    uniqueJournalDownloaders,
  ] = await Promise.all([
    prisma.project.count({ where: { visibleInIndex: true } }),
    prisma.project.count({ where: { isActive: true, visibleInIndex: true } }),
    prisma.project.count({ where: { isActive: false, visibleInIndex: true } }),
    prisma.user.count(),
    prisma.downloadEvent.count(),
    prisma.generalJournalDownloadEvent.count(),
    prisma.downloadEvent.findMany({ distinct: ["userId"], select: { userId: true } }),
    prisma.generalJournalDownloadEvent.findMany({
      distinct: ["userId"],
      select: { userId: true },
    }),
  ]);

  return {
    totalProjects,
    activeProjects,
    inactiveProjects,
    registeredUsers,
    totalProjectDownloads,
    totalJournalDownloads,
    uniqueProjectDownloaders: uniqueProjectDownloaders.length,
    uniqueJournalDownloaders: uniqueJournalDownloaders.length,
  };
}

async function getProjectDownloadSummaries() {
  const projects = await prisma.project.findMany({
    where: { visibleInIndex: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      titleEn: true,
      isActive: true,
      downloadEvents: {
        select: { userId: true, downloadedAt: true },
        orderBy: { downloadedAt: "desc" },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    title: project.titleEn,
    isActive: project.isActive,
    totalDownloads: project.downloadEvents.length,
    uniqueUsers: new Set(project.downloadEvents.map((event) => event.userId)).size,
    lastDownload: iso(project.downloadEvents[0]?.downloadedAt),
  }));
}

async function getJournalDownloadSummaries() {
  const journals = await prisma.generalJournal.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titleEn: true,
      isActive: true,
      createdAt: true,
      downloadEvents: {
        select: { userId: true, downloadedAt: true },
        orderBy: { downloadedAt: "desc" },
      },
    },
  });

  return journals.map((journal) => ({
    id: journal.id,
    title: journal.titleEn,
    isActive: journal.isActive,
    uploadedAt: iso(journal.createdAt),
    totalDownloads: journal.downloadEvents.length,
    uniqueUsers: new Set(journal.downloadEvents.map((event) => event.userId)).size,
    lastDownload: iso(journal.downloadEvents[0]?.downloadedAt),
  }));
}

async function getProjectDownloadDetails(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      titleEn: true,
      downloadEvents: {
        include: { user: true },
        orderBy: { downloadedAt: "asc" },
      },
    },
  });

  if (!project) return null;

  const byUser = new Map<string, {
    fullName: string;
    phone: string;
    jobTitle: string;
    dates: Date[];
  }>();

  for (const event of project.downloadEvents) {
    const current = byUser.get(event.userId) ?? {
      fullName: event.user.fullName,
      phone: event.user.phone,
      jobTitle: event.user.jobTitle,
      dates: [],
    };
    current.dates.push(event.downloadedAt);
    byUser.set(event.userId, current);
  }

  const dates = project.downloadEvents.map((event) => event.downloadedAt);

  return {
    title: project.titleEn,
    totalDownloads: dates.length,
    uniqueUsers: byUser.size,
    firstDownload: iso(dates[0]),
    lastDownload: iso(dates.at(-1)),
    users: Array.from(byUser.values())
      .map((user) => ({
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
        downloadCount: user.dates.length,
        firstDownload: iso(user.dates[0]),
        lastDownload: iso(user.dates.at(-1)),
      }))
      .sort((a, b) => b.downloadCount - a.downloadCount),
  };
}

async function getJournalDownloadDetails(journalId: string) {
  const journal = await prisma.generalJournal.findUnique({
    where: { id: journalId },
    select: {
      titleEn: true,
      downloadEvents: {
        include: { user: true },
        orderBy: { downloadedAt: "asc" },
      },
    },
  });

  if (!journal) return null;

  const byUser = new Map<string, {
    fullName: string;
    phone: string;
    jobTitle: string;
    dates: Date[];
  }>();

  for (const event of journal.downloadEvents) {
    const current = byUser.get(event.userId) ?? {
      fullName: event.user.fullName,
      phone: event.user.phone,
      jobTitle: event.user.jobTitle,
      dates: [],
    };
    current.dates.push(event.downloadedAt);
    byUser.set(event.userId, current);
  }

  const dates = journal.downloadEvents.map((event) => event.downloadedAt);

  return {
    title: journal.titleEn,
    totalDownloads: dates.length,
    uniqueUsers: byUser.size,
    firstDownload: iso(dates[0]),
    lastDownload: iso(dates.at(-1)),
    users: Array.from(byUser.values())
      .map((user) => ({
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
        downloadCount: user.dates.length,
        firstDownload: iso(user.dates[0]),
        lastDownload: iso(user.dates.at(-1)),
      }))
      .sort((a, b) => b.downloadCount - a.downloadCount),
  };
}

async function getRegisteredUserSummaries() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      downloadEvents: { select: { downloadedAt: true } },
      journalDownloadEvents: { select: { downloadedAt: true } },
    },
  });

  return users.map((user) => {
    const dates = [
      ...user.downloadEvents.map((event) => event.downloadedAt),
      ...user.journalDownloadEvents.map((event) => event.downloadedAt),
    ].sort((a, b) => b.getTime() - a.getTime());

    return {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      jobTitle: user.jobTitle,
      createdAt: iso(user.createdAt),
      projectDownloads: user.downloadEvents.length,
      journalDownloads: user.journalDownloadEvents.length,
      totalDownloads: user.downloadEvents.length + user.journalDownloadEvents.length,
      lastActivity: iso(dates[0]),
    };
  });
}

async function getRegisteredUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      downloadEvents: { include: { project: true }, orderBy: { downloadedAt: "asc" } },
      journalDownloadEvents: {
        include: { journal: true },
        orderBy: { downloadedAt: "asc" },
      },
    },
  });

  if (!user) return null;

  const projectMap = new Map<string, { title: string; dates: Date[] }>();
  const journalMap = new Map<string, { title: string; dates: Date[] }>();

  for (const event of user.downloadEvents) {
    const current = projectMap.get(event.projectId) ?? {
      title: event.project.titleEn,
      dates: [],
    };
    current.dates.push(event.downloadedAt);
    projectMap.set(event.projectId, current);
  }

  for (const event of user.journalDownloadEvents) {
    const current = journalMap.get(event.journalId) ?? {
      title: event.journal.titleEn,
      dates: [],
    };
    current.dates.push(event.downloadedAt);
    journalMap.set(event.journalId, current);
  }

  return {
    fullName: user.fullName,
    phone: user.phone,
    jobTitle: user.jobTitle,
    createdAt: iso(user.createdAt),
    updatedAt: iso(user.updatedAt),
    totalDownloads: user.downloadEvents.length + user.journalDownloadEvents.length,
    projects: Array.from(projectMap.values()).map((item) => ({
      title: item.title,
      downloadCount: item.dates.length,
      firstDownload: iso(item.dates[0]),
      lastDownload: iso(item.dates.at(-1)),
    })),
    journals: Array.from(journalMap.values()).map((item) => ({
      title: item.title,
      downloadCount: item.dates.length,
      firstDownload: iso(item.dates[0]),
      lastDownload: iso(item.dates.at(-1)),
    })),
  };
}

export const reportService = {
  getAdminDashboardSummary,
  getProjectDownloadSummaries,
  getProjectDownloadDetails,
  getJournalDownloadSummaries,
  getJournalDownloadDetails,
  getRegisteredUserSummaries,
  getRegisteredUserDetails,
};
