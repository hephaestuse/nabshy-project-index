import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/projects/LocalizedProjectsPage";

export const metadata: Metadata = {
  title: "Projects | Nabshy Pro",
  description: "Premium real estate brochure prototype projects page.",
};

export default function ProjectsPage() {
  return <LocalizedProjectsPage locale="en" />;
}
