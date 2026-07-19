import "server-only";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { verifyAdminSessionToken } from "@/lib/admin-auth";
import { ApplicationError } from "@/lib/errors/application-error";

async function verifyCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !passwordHash) {
    throw new ApplicationError("INTERNAL_ERROR");
  }

  if (username !== expectedUsername) {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

function isValidSession(token: string | undefined) {
  return verifyAdminSessionToken(token);
}

function requireAdminSession(token: string | undefined) {
  if (!isValidSession(token)) {
    redirect("/admin/login");
  }
}

function assertAdminSession(token: string | undefined) {
  if (!isValidSession(token)) {
    throw new ApplicationError("SESSION_INVALID");
  }
}

export const adminAuthService = {
  verifyCredentials,
  isValidSession,
  requireAdminSession,
  assertAdminSession,
};
