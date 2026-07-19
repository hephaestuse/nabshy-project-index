import type { Locale } from "./locale";

export const registrationCookieName = "brochure_registration";
export const registrationSessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export const jobTitleValues = [
  "architect",
  "developer",
  "contractor",
  "consultant",
  "interior-designer",
  "real-estate-agent",
  "other",
] as const;

export type JobTitle = (typeof jobTitleValues)[number];

export type JobTitleOption = {
  value: JobTitle;
  label: string;
};

export type RegisterForDownloadInput = {
  targetType: "project" | "journal";
  projectSlug?: string;
  fullName: string;
  phone: string;
  jobTitle: string;
  locale: Locale;
};

export type RegisterForDownloadResult =
  | {
      success: true;
      downloadUrl: string;
    }
  | {
      success: false;
      code:
        | "VALIDATION_ERROR"
        | "PROJECT_NOT_FOUND"
        | "BROCHURE_NOT_AVAILABLE"
        | "INTERNAL_ERROR";
      fieldErrors?: {
        fullName?: string[];
        phone?: string[];
        jobTitle?: string[];
      };
      message?: string;
    };
