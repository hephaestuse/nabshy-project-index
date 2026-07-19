import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/projects/LocalizedProjectsPage";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = {
  title: "Projects | Nabshy Pro",
  description: "Premium real estate brochure prototype projects page.",
};

export default async function ProjectsPage() {
  const [projects, heroDownloadTarget] = await Promise.all([
    projectService.getActiveProjects("en"),
    projectService.getHeroDownloadTarget("en"),
  ]);

  return (
    <LocalizedProjectsPage
      locale="en"
      projects={projects}
      heroDownloadTarget={heroDownloadTarget}
    />
  );
}
