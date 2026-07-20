"use client";

import { useCallback, useEffect, useState } from "react";
import { checkDownloadAccessAction } from "@/actions/check-download-access.action";
import type { ProjectsMessages } from "@/data/projects-localization";
import type { DownloadTarget } from "@/types/download";
import type { Locale } from "@/types/locale";
import type { ProjectCardData } from "@/types/project";
import { HeroSection } from "./HeroSection";
import { LanguageSwitch } from "./LanguageSwitch";
import { ProjectsSection } from "./ProjectsSection";
import { RegistrationModal } from "./RegistrationModal";

type ProjectsExperienceProps = {
  locale: Locale;
  messages: ProjectsMessages;
  projects: ProjectCardData[];
  heroDownloadTarget: DownloadTarget | null;
};

export function ProjectsExperience({
  locale,
  messages,
  projects,
  heroDownloadTarget,
}: ProjectsExperienceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<DownloadTarget | null>(
    null,
  );
  const [downloadError, setDownloadError] = useState("");
  const [isCheckingDownload, setIsCheckingDownload] = useState(false);

  const startDownload = useCallback((downloadUrl: string) => {
    window.location.assign(downloadUrl);
  }, []);

  const closeRegistration = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTarget(null);
  }, []);

  const handleDownload = useCallback(
    (target: DownloadTarget) => {
      if (isCheckingDownload) {
        return;
      }

      setShowSuccess(false);
      setDownloadError("");
      setSelectedTarget(target);
      setIsCheckingDownload(true);

      void (async () => {
        try {
          const result = await checkDownloadAccessAction({
            targetType: target.type,
            projectSlug: target.type === "project" ? target.slug : undefined,
            locale,
          });

          if (!result.success) {
            setDownloadError(result.message ?? messages.downloadError);
            return;
          }

          if (result.registrationRequired) {
            setIsModalOpen(true);
            return;
          }

          setShowSuccess(true);
          startDownload(result.downloadUrl);
        } finally {
          setIsCheckingDownload(false);
        }
      })();
    },
    [isCheckingDownload, locale, messages.downloadError, startDownload],
  );

  const handleHeroDownload = useCallback(() => {
    if (!heroDownloadTarget) {
      setShowSuccess(false);
      setDownloadError(messages.validation.brochureNotAvailable);
      return;
    }

    handleDownload(heroDownloadTarget);
  }, [
    handleDownload,
    heroDownloadTarget,
    messages.validation.brochureNotAvailable,
  ]);

  const handleRegistrationSuccess = useCallback(
    (downloadUrl: string) => {
      setIsModalOpen(false);
      setSelectedTarget(null);
      setShowSuccess(true);
      startDownload(downloadUrl);
    },
    [startDownload],
  );

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timeout = window.setTimeout(() => setShowSuccess(false), 4200);
    return () => window.clearTimeout(timeout);
  }, [showSuccess]);

  useEffect(() => {
    if (!downloadError) {
      return;
    }

    const timeout = window.setTimeout(() => setDownloadError(""), 5200);
    return () => window.clearTimeout(timeout);
  }, [downloadError]);

  const statusMessage = isCheckingDownload
    ? messages.preparingDownload
    : downloadError;
  const showStatus = statusMessage.length > 0 || showSuccess;
  const statusClassName = downloadError
    ? "fixed bottom-5 left-1/2 z-40 w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 bg-red-700 px-5 py-4 text-center text-sm font-medium text-white shadow-none"
    : "fixed bottom-5 left-1/2 z-40 w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 bg-black px-5 py-4 text-center text-sm font-medium text-white shadow-none";
  const statusText = showSuccess ? messages.successMessage : statusMessage;

  return (
    <div
      lang={locale}
      dir={messages.dir}
      className={
        locale === "fa" ? "projects-locale-fa" : "projects-locale-en"
      }
    >
      <LanguageSwitch locale={locale} messages={messages} />
      <HeroSection messages={messages} onOpenRegistration={handleHeroDownload} />
      <ProjectsSection
        messages={messages}
        projects={projects}
        onRegister={handleDownload}
      />
      {isModalOpen ? (
        <RegistrationModal
          messages={messages}
          isOpen={isModalOpen}
          target={selectedTarget}
          onClose={closeRegistration}
          onSuccess={handleRegistrationSuccess}
        />
      ) : null}
      {showStatus ? (
        <div role="status" className={statusClassName}>
          {statusText}
        </div>
      ) : null}
    </div>
  );
}
