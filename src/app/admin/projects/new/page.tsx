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
    <>
      <h1 className="text-3xl font-semibold">New project</h1>
      <div className="mt-6 border border-[#071A33]/15 bg-white p-5">
        <ProjectForm action={createProjectAction} />
      </div>
    </>
  );
}
