import "server-only";

import path from "node:path";

export const imageMimeTypes = ["image/jpeg", "image/png", "image/webp"];
export const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
export const pdfMimeType = "application/pdf";
export const pdfExtension = ".pdf";

function getLimitMegabytes(envName: string, fallback: number) {
  const value = Number(process.env[envName]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function getProjectImageMaxBytes() {
  return getLimitMegabytes("PROJECT_IMAGE_MAX_SIZE_MB", 10) * 1024 * 1024;
}

export function getPdfMaxBytes() {
  return getLimitMegabytes("PDF_MAX_SIZE_MB", 50) * 1024 * 1024;
}

async function readPrefix(file: File, length: number) {
  return Buffer.from(await file.slice(0, length).arrayBuffer());
}

export async function validateProjectImage(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (
    file.size <= 0 ||
    file.size > getProjectImageMaxBytes() ||
    !imageMimeTypes.includes(file.type) ||
    !imageExtensions.includes(extension)
  ) {
    return false;
  }

  const prefix = await readPrefix(file, 12);
  const isJpeg = prefix[0] === 0xff && prefix[1] === 0xd8 && prefix[2] === 0xff;
  const isPng = prefix.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  const isWebp =
    prefix.subarray(0, 4).toString("ascii") === "RIFF" &&
    prefix.subarray(8, 12).toString("ascii") === "WEBP";

  return isJpeg || isPng || isWebp;
}

export async function validatePdf(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (
    file.size <= 0 ||
    file.size > getPdfMaxBytes() ||
    file.type !== pdfMimeType ||
    extension !== pdfExtension
  ) {
    return false;
  }

  const prefix = await readPrefix(file, 5);
  return prefix.toString("ascii") === "%PDF-";
}
