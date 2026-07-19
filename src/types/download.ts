export type DownloadAccessResult =
  | {
      success: true;
      registrationRequired: false;
      downloadUrl: string;
    }
  | {
      success: true;
      registrationRequired: true;
    }
  | {
      success: false;
      code: "PROJECT_NOT_FOUND" | "BROCHURE_NOT_AVAILABLE" | "INTERNAL_ERROR";
      message?: string;
    };

export type DownloadTarget =
  | {
      type: "project";
      slug: string;
      title: string;
    }
  | {
      type: "journal";
      title: string;
    };
