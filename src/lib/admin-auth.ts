import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const adminSessionCookieName = "admin_session";
export const adminSessionMaxAgeSeconds = 60 * 60 * 12;

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAdminSessionSecret())
    .update(value)
    .digest("base64url");
}

export function createAdminSessionToken() {
  const expiresAt = Date.now() + adminSessionMaxAgeSeconds * 1000;
  const nonce = randomBytes(24).toString("base64url");
  const payload = `${expiresAt}.${nonce}`;

  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const expectedSignature = sign(payload);
  const providedSignature = parts[2];

  if (providedSignature.length !== expectedSignature.length) {
    return false;
  }

  const signaturesMatch = timingSafeEqual(
    Buffer.from(providedSignature),
    Buffer.from(expectedSignature),
  );

  if (!signaturesMatch) {
    return false;
  }

  const expiresAt = Number(parts[0]);
  return Number.isSafeInteger(expiresAt) && expiresAt > Date.now();
}
