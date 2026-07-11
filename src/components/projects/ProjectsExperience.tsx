"use client";

import { useCallback, useEffect, useState } from "react";
import { HeroSection } from "./HeroSection";
import { ProjectsSection } from "./ProjectsSection";
import { RegistrationModal } from "./RegistrationModal";
import type { Project } from "@/types/project";

type ProjectsExperienceProps = {
  projects: Project[];
};

export function ProjectsExperience({ projects }: ProjectsExperienceProps) {
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
    <>
      <HeroSection onOpenRegistration={openRegistration} />
      <ProjectsSection projects={projects} onRegister={openRegistration} />
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={closeRegistration}
        onSuccess={handleSuccess}
      />
      {showSuccess ? (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-40 w-[min(calc(100vw-2rem),32rem)] -translate-x-1/2 bg-[#071A33] px-5 py-4 text-center text-sm font-medium text-white shadow-none"
        >
          Registration completed. Download will be enabled in the next phase.
        </div>
      ) : null}
    </>
  );
}
