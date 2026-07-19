"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { adminProjectService } from "@/services/admin-project.service";

const projectSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  titleFa: z.string().trim().min(1).max(160),
  titleEn: z.string().trim().min(1).max(160),
  cityFa: z.string().trim().min(1).max(120),
  cityEn: z.string().trim().min(1).max(120),
  developerNameFa: z.string().trim().min(1).max(160),
  developerNameEn: z.string().trim().min(1).max(160),
  usageFa: z.string().trim().min(1).max(120),
  usageEn: z.string().trim().min(1).max(120),
  addressFa: z.string().trim().min(1).max(240),
  addressEn: z.string().trim().min(1).max(240),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  adminAuthService.assertAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
}

function revalidateProjectRoutes() {
  revalidatePath("/projects");
  revalidatePath("/fa/projects");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

function getFile(formData: FormData, name: string) {
  const value = formData.get(name);
  return value instanceof File && value.size > 0 ? value : null;
}

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    slug: formData.get("slug"),
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    cityFa: formData.get("cityFa"),
    cityEn: formData.get("cityEn"),
    developerNameFa: formData.get("developerNameFa"),
    developerNameEn: formData.get("developerNameEn"),
    usageFa: formData.get("usageFa"),
    usageEn: formData.get("usageEn"),
    addressFa: formData.get("addressFa"),
    addressEn: formData.get("addressEn"),
    isActive: formData.get("isActive") === "on",
    sortOrder: formData.get("sortOrder"),
  });
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const parsedInput = parseProjectForm(formData);

  if (!parsedInput.success) {
    return;
  }

  try {
    await adminProjectService.createProject(
      parsedInput.data,
      getFile(formData, "image"),
      getFile(formData, "brochure"),
    );
  } catch {
    return;
  }

  revalidateProjectRoutes();
  redirect("/admin/projects");
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  const parsedInput = parseProjectForm(formData);

  if (!parsedInput.success) {
    return;
  }

  try {
    await adminProjectService.updateProject(
      id,
      parsedInput.data,
      getFile(formData, "image"),
      getFile(formData, "brochure"),
    );
  } catch {
    return;
  }

  revalidateProjectRoutes();
  redirect("/admin/projects");
}

export async function toggleProjectActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await adminProjectService.toggleProjectActive(id);
  revalidateProjectRoutes();
}

export async function moveProjectAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? "up" : "down";
  await adminProjectService.moveProject(id, direction);
  revalidateProjectRoutes();
}
