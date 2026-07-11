import type { Metadata } from "next";
import projects from "@/data/projects.json";
import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import type { Project } from "@/types/project";

export const metadata: Metadata = {
  title: "Projects | Nabshy Pro",
  description: "Premium real estate brochure prototype projects page.",
};

export default function ProjectsPage() {
  return <ProjectsExperience projects={projects as Project[]} />;
}
