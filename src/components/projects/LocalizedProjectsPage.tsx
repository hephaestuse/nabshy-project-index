import { ProjectsExperience } from "@/components/projects/ProjectsExperience";
import {
  getLocalizedProjects,
  getProjectsMessages,
} from "@/data/projects-localization";
import type { Locale } from "@/types/locale";

type LocalizedProjectsPageProps = {
  locale: Locale;
};

export function LocalizedProjectsPage({ locale }: LocalizedProjectsPageProps) {
  return (
    <ProjectsExperience
      locale={locale}
      messages={getProjectsMessages(locale)}
      projects={getLocalizedProjects(locale)}
    />
  );
}
