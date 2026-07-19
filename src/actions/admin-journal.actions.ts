"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { generalJournalService } from "@/services/general-journal.service";

const journalSchema = z.object({
  titleFa: z.string().trim().min(1).max(160),
  titleEn: z.string().trim().min(1).max(160),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  adminAuthService.assertAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
}

export async function replaceGeneralJournalAction(formData: FormData) {
  await requireAdmin();
  const parsedInput = journalSchema.safeParse({
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
  });
  const file = formData.get("file");

  if (!parsedInput.success || !(file instanceof File) || file.size === 0) {
    return;
  }

  try {
    await generalJournalService.replaceJournal({
      ...parsedInput.data,
      file,
    });
  } catch {
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/journal");
  revalidatePath("/projects");
  revalidatePath("/fa/projects");
}
