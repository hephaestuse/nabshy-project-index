import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/projects/LocalizedProjectsPage";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = {
  title: "پروژه‌ها | نبشی پرو",
  description: "صفحه پروژه‌های نمونه رابط کاربری بروشور املاک لوکس.",
};

export default async function PersianProjectsPage() {
  const projects = await projectService.getActiveProjects("fa");

  return <LocalizedProjectsPage locale="fa" projects={projects} />;
}
