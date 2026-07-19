"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { isApplicationError } from "@/lib/errors/application-error";
import { getProjectsMessages } from "@/data/projects-localization";
import { registrationService } from "@/services/registration.service";
import { registrationCookieName } from "@/types/registration";
import type { DownloadAccessResult } from "@/types/download";
import type { Locale } from "@/types/locale";

const downloadAccessSchema = z.object({
  targetType: z.enum(["project", "journal"]),
  projectSlug: z.string().trim().max(120).optional(),
  locale: z.enum(["en", "fa"]),
}).refine(
  (value) => value.targetType === "journal" || Boolean(value.projectSlug),
  {
    path: ["projectSlug"],
  },
);

export async function checkDownloadAccessAction(input: {
  targetType: "project" | "journal";
  projectSlug?: string;
  locale: Locale;
}): Promise<DownloadAccessResult> {
  const parsedInput = downloadAccessSchema.safeParse(input);
  const locale = input.locale === "fa" ? "fa" : "en";
  const messages = getProjectsMessages(locale);

  if (!parsedInput.success) {
    return {
      success: false,
      code: "PROJECT_NOT_FOUND",
      message: messages.validation.projectNotFound,
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(registrationCookieName)?.value;
    const result = await registrationService.checkDownloadAccess({
      targetType: parsedInput.data.targetType,
      projectSlug: parsedInput.data.projectSlug,
      token,
    });

    if (result.registrationRequired) {
      return {
        success: true,
        registrationRequired: true,
      };
    }

    return {
      success: true,
      registrationRequired: false,
      downloadUrl: result.downloadUrl,
    };
  } catch (error) {
    if (isApplicationError(error)) {
      if (error.code === "PROJECT_NOT_FOUND") {
        return {
          success: false,
          code: "PROJECT_NOT_FOUND",
          message: messages.validation.projectNotFound,
        };
      }

      if (error.code === "BROCHURE_NOT_AVAILABLE") {
        return {
          success: false,
          code: "BROCHURE_NOT_AVAILABLE",
          message: messages.validation.brochureNotAvailable,
        };
      }
    }

    console.error("Unexpected download access error");

    return {
      success: false,
      code: "INTERNAL_ERROR",
      message: messages.validation.internalError,
    };
  }
}
