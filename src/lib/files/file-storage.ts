import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

function resolveConfiguredDirectory(envName: string, fallback: string) {
  const configured = process.env[envName] ?? fallback;
  return path.resolve(configured);
}

export function getProjectImagesDirectory() {
  return resolveConfiguredDirectory(
    "PROJECT_IMAGES_DIR",
    "./storage/project-images",
  );
}

export function getProjectBrochuresDirectory() {
  return resolveConfiguredDirectory(
    "PROJECT_BROCHURES_DIR",
    process.env.BROCHURES_DIR ?? "./storage/brochures",
  );
}

export function getGeneralJournalDirectory() {
  return resolveConfiguredDirectory(
    "GENERAL_JOURNAL_DIR",
    "./storage/general-journal",
  );
}

export async function saveUploadedFile(file: File, directory: string, extension: string) {
  await mkdir(directory, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  const temporaryPath = path.join(directory, `${fileName}.tmp`);
  const finalPath = path.join(directory, fileName);

  await writeFile(temporaryPath, Buffer.from(await file.arrayBuffer()), {
    flag: "wx",
  });
  await rename(temporaryPath, finalPath);

  return {
    fileName,
    filePath: finalPath,
  };
}

export async function deleteStoredFile(directory: string, fileName: string | null | undefined) {
  if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    return;
  }

  await rm(path.join(directory, fileName), { force: true });
}
