import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/projects/LocalizedProjectsPage";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = {
  title: "پروژه‌ها | نبشی پرو",
  description: "صفحه پروژه‌های نمونه رابط کاربری بروشور املاک لوکس.",
};

export default async function PersianProjectsPage() {
  const [projects, heroDownloadTarget] = await Promise.all([
    projectService.getActiveProjects("fa"),
    projectService.getHeroDownloadTarget("fa"),
  ]);

  return (
    <LocalizedProjectsPage
      locale="fa"
      projects={projects}
      heroDownloadTarget={heroDownloadTarget}
    />
  );
}
