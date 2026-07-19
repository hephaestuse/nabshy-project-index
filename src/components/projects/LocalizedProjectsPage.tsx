import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import { getProjectsMessages } from "@/data/projects-localization";
import type { DownloadTarget } from "@/types/download";
import type { Locale } from "@/types/locale";
import type { ProjectCardData } from "@/types/project";

type LocalizedProjectsPageProps = {
  locale: Locale;
  projects: ProjectCardData[];
  heroDownloadTarget: DownloadTarget | null;
};

export function LocalizedProjectsPage({
  locale,
  projects,
  heroDownloadTarget,
}: LocalizedProjectsPageProps) {
  return (
    <ProjectsExperience
      locale={locale}
      messages={getProjectsMessages(locale)}
      projects={projects}
      heroDownloadTarget={heroDownloadTarget}
    />
  );
}
