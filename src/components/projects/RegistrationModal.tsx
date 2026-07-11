"use client";

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
} from "react";

const jobTitles = [
  "Architect",
  "Developer",
  "Contractor",
  "Consultant",
  "Interior Designer",
  "Real Estate Agent",
  "Other",
];

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function RegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: RegistrationModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[32rem] overflow-y-auto bg-[#f7f5f0] px-6 py-7 text-[#071A33] outline-none sm:px-9 sm:py-9"
        onMouseDown={stopPropagation}
        onKeyDown={handleDialogKeyDown}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close registration modal"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center text-2xl leading-none text-[#071A33] outline-none transition hover:bg-[#071A33] hover:text-white focus-visible:ring-2 focus-visible:ring-[#071A33]"
        >
          ×
        </button>

        <h2
          id="registration-modal-title"
          className="pr-12 text-2xl font-light uppercase tracking-[0.16em]"
        >
          Register Interest
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-[#24344c]">
          Enter your details to continue. This prototype keeps registration and
          downloads mocked.
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Full Name
            </span>
            <input
              required
              name="fullName"
              type="text"
              autoComplete="name"
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Phone Number
            </span>
            <input
              required
              name="phone"
              type="tel"
              autoComplete="tel"
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Job Title
            </span>
            <select
              required
              name="jobTitle"
              defaultValue=""
              className="mt-2 w-full border border-[#071A33]/25 bg-white px-4 py-3 text-base outline-none transition focus-visible:border-[#071A33] focus-visible:ring-2 focus-visible:ring-[#071A33]/35"
            >
              <option value="" disabled>
                Select one
              </option>
              {jobTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="w-full bg-[#071A33] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#071A33] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f5f0]"
          >
            Continue to Download
          </button>
        </form>
      </div>
    </div>
  );
}
