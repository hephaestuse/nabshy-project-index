export type ApplicationErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_PHONE"
  | "INVALID_JOB_TITLE"
  | "PROJECT_NOT_FOUND"
  | "BROCHURE_NOT_AVAILABLE"
  | "SESSION_INVALID"
  | "DOWNLOAD_UNAUTHORIZED"
  | "FILE_NOT_FOUND"
  | "INTERNAL_ERROR";

export class ApplicationError extends Error {
  code: ApplicationErrorCode;

  constructor(code: ApplicationErrorCode, message?: string) {
    super(message ?? code);
    this.name = "ApplicationError";
    this.code = code;
  }
}

export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}
