"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  adminSessionCookieName,
  adminSessionMaxAgeSeconds,
  createAdminSessionToken,
} from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";

const loginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export type AdminLoginResult = {
  success: false;
  message: string;
};

export async function loginAdminAction(
  _previousState: AdminLoginResult | null,
  formData: FormData,
): Promise<AdminLoginResult> {
  const parsedInput = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Enter the admin username and password.",
    };
  }

  const valid = await adminAuthService.verifyCredentials(
    parsedInput.data.username,
    parsedInput.data.password,
  );

  if (!valid) {
    return {
      success: false,
      message: "Invalid admin credentials.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminSessionMaxAgeSeconds,
  });

  redirect("/admin");
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookieName);
  redirect("/admin/login");
}
