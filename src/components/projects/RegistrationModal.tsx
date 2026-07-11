"use client";

import {
  FormEvent,
  InvalidEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
} from "react";
import type { ProjectsMessages } from "@/data/projects-localization";

type RegistrationModalProps = {
  messages: ProjectsMessages;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function RegistrationModal({
  messages,
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
    onSuccess();
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

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className={labelClassName}>
              {messages.fullName}
            </span>
            <input
              required
              name="fullName"
              type="text"
              autoComplete="name"
              onInput={clearValidationMessage}
              onInvalid={setValidationMessage(
                messages.validation.fullNameRequired,
              )}
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
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
              onInput={clearValidationMessage}
              onInvalid={setValidationMessage(messages.validation.phoneRequired)}
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
          </label>

          <label className="block">
            <span className={labelClassName}>
              {messages.jobTitle}
            </span>
            <select
              required
              name="jobTitle"
              defaultValue=""
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
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className={submitClassName}
          >
            {messages.continueToDownload}
          </button>
        </form>
      </div>
    </div>
  );
}
