import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import { getProjectsMessages } from "@/data/projects-localization";
import type { Locale } from "@/types/locale";
import type { ProjectCardData } from "@/types/project";

type LocalizedProjectsPageProps = {
  locale: Locale;
  projects: ProjectCardData[];
};

export function LocalizedProjectsPage({
  locale,
  projects,
}: LocalizedProjectsPageProps) {
  return (
    <ProjectsExperience
      locale={locale}
      messages={getProjectsMessages(locale)}
      projects={projects}
    />
  );
}
