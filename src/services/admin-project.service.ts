import "server-only";

import path from "node:path";
import { prisma } from "@/lib/prisma";
import { ApplicationError } from "@/lib/errors/application-error";
import {
  deleteStoredFile,
  getProjectBrochuresDirectory,
  getProjectImagesDirectory,
  saveUploadedFile,
} from "@/lib/files/file-storage";
import { validatePdf, validateProjectImage } from "@/lib/files/file-validation";

export type ProjectFormInput = {
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
  isActive: boolean;
  sortOrder: number;
};

function publicImagePath(fileName: string) {
  return `/api/project-images/${encodeURIComponent(fileName)}`;
}

function fileNameFromPublicImagePath(imagePath: string | null) {
  if (!imagePath?.startsWith("/api/project-images/")) {
    return null;
  }

  return decodeURIComponent(imagePath.replace("/api/project-images/", ""));
}

async function storeImage(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!(await validateProjectImage(file))) {
    throw new ApplicationError("VALIDATION_ERROR", "Invalid project image.");
  }

  const extension = path.extname(file.name).toLowerCase();
  const saved = await saveUploadedFile(
    file,
    getProjectImagesDirectory(),
    extension,
  );

  return {
    fileName: saved.fileName,
    imagePath: publicImagePath(saved.fileName),
  };
}

async function storeBrochure(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!(await validatePdf(file))) {
    throw new ApplicationError("VALIDATION_ERROR", "Invalid brochure PDF.");
  }

  const saved = await saveUploadedFile(
    file,
    getProjectBrochuresDirectory(),
    ".pdf",
  );

  return saved.fileName;
}

async function listProjects() {
  return prisma.project.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    select: {
      id: true,
      slug: true,
      titleFa: true,
      titleEn: true,
      developerNameEn: true,
      usageEn: true,
      sortOrder: true,
      isActive: true,
      visibleInIndex: true,
      imagePath: true,
      brochureFile: true,
    },
  });
}

async function getProjectForEdit(id: string) {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
}

async function createProject(input: ProjectFormInput, image: File | null, brochure: File | null) {
  const storedImage = await storeImage(image);
  const storedBrochure = await storeBrochure(brochure);

  try {
    return await prisma.project.create({
      data: {
        ...input,
        visibleInIndex: true,
        imagePath: storedImage?.imagePath ?? null,
        brochureFile: storedBrochure,
      },
    });
  } catch (error) {
    await deleteStoredFile(getProjectImagesDirectory(), storedImage?.fileName);
    await deleteStoredFile(getProjectBrochuresDirectory(), storedBrochure);
    console.error("Project create failed");
    throw error;
  }
}

async function updateProject(
  id: string,
  input: ProjectFormInput,
  image: File | null,
  brochure: File | null,
) {
  const current = await prisma.project.findUnique({
    where: {
      id,
    },
    select: {
      imagePath: true,
      brochureFile: true,
    },
  });

  if (!current) {
    throw new ApplicationError("PROJECT_NOT_FOUND");
  }

  const storedImage = await storeImage(image);
  const storedBrochure = await storeBrochure(brochure);

  try {
    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        ...input,
        imagePath: storedImage?.imagePath ?? current.imagePath,
        brochureFile: storedBrochure ?? current.brochureFile,
      },
    });

    if (storedImage) {
      await deleteStoredFile(
        getProjectImagesDirectory(),
        fileNameFromPublicImagePath(current.imagePath),
      );
    }

    if (storedBrochure) {
      await deleteStoredFile(getProjectBrochuresDirectory(), current.brochureFile);
    }

    return project;
  } catch (error) {
    await deleteStoredFile(getProjectImagesDirectory(), storedImage?.fileName);
    await deleteStoredFile(getProjectBrochuresDirectory(), storedBrochure);
    console.error("Project update failed");
    throw error;
  }
}

async function toggleProjectActive(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!project) {
    throw new ApplicationError("PROJECT_NOT_FOUND");
  }

  return prisma.project.update({
    where: { id },
    data: { isActive: !project.isActive },
  });
}

async function moveProject(id: string, direction: "up" | "down") {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id },
      select: { id: true, sortOrder: true },
    });

    if (!project) {
      throw new ApplicationError("PROJECT_NOT_FOUND");
    }

    const adjacent = await tx.project.findFirst({
      where:
        direction === "up"
          ? { sortOrder: { lt: project.sortOrder } }
          : { sortOrder: { gt: project.sortOrder } },
      orderBy: {
        sortOrder: direction === "up" ? "desc" : "asc",
      },
      select: { id: true, sortOrder: true },
    });

    if (!adjacent) {
      return;
    }

    await tx.project.update({
      where: { id: project.id },
      data: { sortOrder: adjacent.sortOrder },
    });
    await tx.project.update({
      where: { id: adjacent.id },
      data: { sortOrder: project.sortOrder },
    });
  });
}

export const adminProjectService = {
  listProjects,
  getProjectForEdit,
  createProject,
  updateProject,
  toggleProjectActive,
  moveProject,
};
