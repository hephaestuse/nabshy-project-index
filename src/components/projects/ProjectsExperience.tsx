"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProjectsMessages } from "@/data/projects-localization";
import { HeroSection } from "./HeroSection";
import { LanguageSwitch } from "./LanguageSwitch";
import { ProjectsSection } from "./ProjectsSection";
import { RegistrationModal } from "./RegistrationModal";
import type { Locale } from "@/types/locale";
import type { ProjectCardData } from "@/types/project";

type ProjectsExperienceProps = {
  locale: Locale;
  messages: ProjectsMessages;
  projects: ProjectCardData[];
};

export function ProjectsExperience({
  locale,
  messages,
  projects,
}: ProjectsExperienceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const openRegistration = useCallback(() => {
    setShowSuccess(false);
    setIsModalOpen(true);
  }, []);

  const closeRegistration = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
    setShowSuccess(true);
  }, []);

  useEffect(() => {
    if (!showSuccess) {
      return;
    }

    const timeout = window.setTimeout(() => setShowSuccess(false), 4200);
    return () => window.clearTimeout(timeout);
  }, [showSuccess]);

  return (
    <div
      lang={locale}
      dir={messages.dir}
      className={
        locale === "fa" ? "projects-locale-fa" : "projects-locale-en"
      }
    >
      <LanguageSwitch locale={locale} messages={messages} />
      <HeroSection messages={messages} onOpenRegistration={openRegistration} />
      <ProjectsSection
        messages={messages}
        projects={projects}
        onRegister={openRegistration}
      />
      <RegistrationModal
        messages={messages}
        isOpen={isModalOpen}
        onClose={closeRegistration}
        onSuccess={handleSuccess}
      />
      {showSuccess ? (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-40 w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 bg-[#071A33] px-5 py-4 text-center text-sm font-medium text-white shadow-none"
        >
          {messages.successMessage}
        </div>
      ) : null}
    </div>
  );
}
