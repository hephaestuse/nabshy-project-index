"use client";

import {
  FormEvent,
  InvalidEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { registerForDownloadAction } from "@/actions/register-for-download.action";
import type { ProjectsMessages } from "@/data/projects-localization";
import type { DownloadTarget } from "@/types/download";
import type { RegisterForDownloadResult } from "@/types/registration";

type RegistrationModalProps = {
  messages: ProjectsMessages;
  isOpen: boolean;
  target: DownloadTarget | null;
  onClose: () => void;
  onSuccess: (downloadUrl: string) => void;
};

export function RegistrationModal({
  messages,
  isOpen,
  target,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<
      Extract<RegisterForDownloadResult, { success: false }>["fieldErrors"]
    >
  >({});
  const [generalError, setGeneralError] = useState("");
  const labelClassName =
    messages.locale === "fa"
      ? "text-sm font-bold"
      : "text-xs font-bold uppercase tracking-[0.2em]";
  const titleClassName =
    messages.locale === "fa"
      ? "pe-12 text-2xl font-light tracking-normal"
      : "pe-12 text-2xl font-light uppercase tracking-[0.16em]";
  const submitClassName =
    messages.locale === "fa"
      ? "w-full bg-[#071A33] px-6 py-4 text-sm font-bold text-white outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#071A33] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f5f0]"
      : "w-full bg-[#071A33] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#071A33] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f5f0]";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    setGeneralError("");

    if (isSubmitting) {
      return;
    }

    if (!target) {
      setGeneralError(messages.validation.projectRequired);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const jobTitle = String(formData.get("jobTitle") ?? "");

    setIsSubmitting(true);
    void (async () => {
      try {
        const result = await registerForDownloadAction({
          targetType: target.type,
          projectSlug: target.type === "project" ? target.slug : undefined,
          fullName,
          phone,
          jobTitle,
          locale: messages.locale,
        });

        if (result.success) {
          formRef.current?.reset();
          onSuccess(result.downloadUrl);
          return;
        }

        setFieldErrors(result.fieldErrors ?? {});
        setGeneralError(result.message ?? messages.validation.internalError);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const clearValidationMessage = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    event.currentTarget.setCustomValidity("");
  };

  const setValidationMessage =
    (message: string) =>
    (event: InvalidEvent<HTMLInputElement | HTMLSelectElement>) => {
      event.currentTarget.setCustomValidity(message);
    };

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/68 px-4 py-6"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-modal-title"
        dir={messages.dir}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[32rem] overflow-y-auto bg-[#f7f5f0] px-6 py-7 text-[#071A33] outline-none sm:px-9 sm:py-9"
        onMouseDown={stopPropagation}
        onKeyDown={handleDialogKeyDown}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label={messages.closeModal}
          className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#071A33] outline-none transition hover:bg-[#071A33] hover:text-white focus-visible:ring-2 focus-visible:ring-[#071A33]"
        >
          ×
        </button>

        <h2
          id="registration-modal-title"
          className={titleClassName}
        >
          {messages.modalTitle}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#24344c]">
          {messages.modalDescription}
        </p>

        {target ? (
          <p className="mt-4 text-sm font-semibold text-[#071A33]">
            {target.title}
          </p>
        ) : null}

        {generalError ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-red-700">
            {generalError}
          </p>
        ) : null}

        <form ref={formRef} className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className={labelClassName}>
              {messages.fullName}
            </span>
            <input
              required
              name="fullName"
              type="text"
              autoComplete="name"
              maxLength={120}
              disabled={isSubmitting}
              onInput={clearValidationMessage}
              onInvalid={setValidationMessage(
                messages.validation.fullNameRequired,
              )}
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
            {fieldErrors.fullName?.map((error) => (
              <span key={error} className="mt-2 block text-sm text-red-700">
                {error}
              </span>
            ))}
          </label>

          <label className="block">
            <span className={labelClassName}>
              {messages.phoneNumber}
            </span>
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              disabled={isSubmitting}
              onInput={clearValidationMessage}
              onInvalid={setValidationMessage(messages.validation.phoneRequired)}
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
            {fieldErrors.phone?.map((error) => (
              <span key={error} className="mt-2 block text-sm text-red-700">
                {error}
              </span>
            ))}
          </label>

          <label className="block">
            <span className={labelClassName}>
              {messages.jobTitle}
            </span>
            <select
              required
              name="jobTitle"
              defaultValue=""
              disabled={isSubmitting}
              onInput={clearValidationMessage}
              onInvalid={setValidationMessage(
                messages.validation.jobTitleRequired,
              )}
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            >
              <option value="" disabled>
                {messages.selectOne}
              </option>
              {messages.jobTitles.map((title) => (
                <option key={title.value} value={title.value}>
                  {title.label}
                </option>
              ))}
            </select>
            {fieldErrors.jobTitle?.map((error) => (
              <span key={error} className="mt-2 block text-sm text-red-700">
                {error}
              </span>
            ))}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className={submitClassName}
          >
            {isSubmitting
              ? messages.submittingRegistration
              : messages.continueToDownload}
          </button>
        </form>
      </div>
    </div>
  );
}
