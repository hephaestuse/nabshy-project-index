import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { updateProjectAction } from "@/actions/admin-project.actions";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminAuthService } from "@/services/admin-auth.service";
import { adminProjectService } from "@/services/admin-project.service";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const { id } = await params;
  const project = await adminProjectService.getProjectForEdit(id);

  if (!project) {
    notFound();
  }

  const action = updateProjectAction.bind(null, id);

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">Edit project</h1>
      </header>
      <div className="admin-panel admin-panel-pad mt-8">
        <ProjectForm action={action} project={project} />
      </div>
    </div>
  );
}
