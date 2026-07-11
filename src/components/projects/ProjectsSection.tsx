"use client";

import type { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";

type ProjectsSectionProps = {
  projects: Project[];
  onRegister: () => void;
};

export function ProjectsSection({ projects, onRegister }: ProjectsSectionProps) {
  return (
    <section id="projects-grid" className="bg-[#f7f5f0] px-5 py-16 text-[#080808] sm:px-8 md:py-24">
      <div className="mx-auto max-w-[60rem] lg:max-w-[78rem]">
        <h2 className="mb-10 text-center text-3xl font-light uppercase tracking-[0.12em] sm:text-4xl md:mb-14">
          Trending Projects
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onRegister={onRegister}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
