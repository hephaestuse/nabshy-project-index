import { cookies } from "next/headers";
import { createProjectAction } from "@/actions/admin-project.actions";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { adminAuthService } from "@/services/admin-auth.service";

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );

  return (
    <div>
      <header className="admin-page-header">
        <h1 className="admin-page-title">New project</h1>
      </header>
      <div className="admin-panel admin-panel-pad mt-8">
        <ProjectForm action={createProjectAction} />
      </div>
    </div>
  );
}
