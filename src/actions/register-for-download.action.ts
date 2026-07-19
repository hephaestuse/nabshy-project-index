"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import {
  ApplicationError,
  isApplicationError,
} from "@/lib/errors/application-error";
import { normalizePhoneNumber } from "@/lib/security/phone-normalization";
import { getProjectsMessages } from "@/data/projects-localization";
import { registrationService } from "@/services/registration.service";
import {
  jobTitleValues,
  registrationCookieName,
  registrationSessionMaxAgeSeconds,
  type RegisterForDownloadInput,
  type RegisterForDownloadResult,
} from "@/types/registration";

const registrationSchema = z
  .object({
    targetType: z.enum(["project", "journal"]),
    projectSlug: z.string().trim().max(120).optional(),
    fullName: z.string().trim().min(1).max(120),
    phone: z
      .string()
      .trim()
      .min(1)
      .refine((value) => normalizePhoneNumber(value) !== null),
    jobTitle: z.enum(jobTitleValues),
    locale: z.enum(["en", "fa"]),
  })
  .refine(
    (value) => value.targetType === "journal" || Boolean(value.projectSlug),
    {
      path: ["projectSlug"],
    },
  );

function getValidationMessage(
  field: "fullName" | "phone" | "jobTitle" | "projectSlug",
  code: string,
  input: RegisterForDownloadInput,
) {
  const messages = getProjectsMessages(input.locale);

  if (field === "fullName") {
    return code === "too_big"
      ? messages.validation.fullNameTooLong
      : messages.validation.fullNameRequired;
  }

  if (field === "phone") {
    return code === "too_small"
      ? messages.validation.phoneRequired
      : messages.validation.phoneInvalid;
  }

  if (field === "jobTitle") {
    return code === "invalid_value"
      ? messages.validation.jobTitleInvalid
      : messages.validation.jobTitleRequired;
  }

  return messages.validation.projectRequired;
}

function mapValidationErrors(
  error: z.ZodError,
  input: RegisterForDownloadInput,
): RegisterForDownloadResult {
  const fieldErrors: NonNullable<
    Extract<RegisterForDownloadResult, { success: false }>["fieldErrors"]
  > = {};
  let hasProjectError = false;

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (
      field !== "fullName" &&
      field !== "phone" &&
      field !== "jobTitle" &&
      field !== "projectSlug"
    ) {
      continue;
    }

    const message = getValidationMessage(field, issue.code, input);

    if (field === "projectSlug") {
      hasProjectError = true;
      continue;
    }

    fieldErrors[field] = [...(fieldErrors[field] ?? []), message];
  }

  return {
    success: false,
    code: "VALIDATION_ERROR",
    fieldErrors,
    message: hasProjectError
      ? getProjectsMessages(input.locale).validation.projectRequired
      : undefined,
  };
}

function mapServiceError(
  error: unknown,
  locale: RegisterForDownloadInput["locale"],
): RegisterForDownloadResult {
  const messages = getProjectsMessages(locale);

  if (isApplicationError(error)) {
    if (error.code === "INVALID_PHONE") {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        fieldErrors: {
          phone: [messages.validation.phoneInvalid],
        },
      };
    }

    if (error.code === "INVALID_JOB_TITLE") {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        fieldErrors: {
          jobTitle: [messages.validation.jobTitleInvalid],
        },
      };
    }

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

  console.error("Unexpected registration error", {
    code: error instanceof ApplicationError ? error.code : "UNKNOWN",
  });

  return {
    success: false,
    code: "INTERNAL_ERROR",
    message: messages.validation.internalError,
  };
}

export async function registerForDownloadAction(
  input: RegisterForDownloadInput,
): Promise<RegisterForDownloadResult> {
  const parsedInput = registrationSchema.safeParse(input);

  if (!parsedInput.success) {
    return mapValidationErrors(parsedInput.error, input);
  }

  try {
    const result = await registrationService.registerForDownload(
      parsedInput.data,
    );
    const cookieStore = await cookies();

    cookieStore.set(registrationCookieName, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: registrationSessionMaxAgeSeconds,
      expires: result.expiresAt,
    });

    return {
      success: true,
      downloadUrl: result.downloadUrl,
    };
  } catch (error) {
    return mapServiceError(error, parsedInput.data.locale);
  }
}
