import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { registrationSessionMaxAgeSeconds } from "@/types/registration";

export function generateSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getSessionExpirationDate() {
  return new Date(Date.now() + registrationSessionMaxAgeSeconds * 1000);
}
