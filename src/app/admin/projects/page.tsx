import Link from "next/link";
import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { adminAuthService } from "@/services/admin-auth.service";
import { adminProjectService } from "@/services/admin-project.service";

export default async function AdminProjectsPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const projects = await adminProjectService.listProjects();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <Link href="/admin/projects/new" className="bg-[#071A33] px-4 py-2 text-sm font-bold text-white">
          New project
        </Link>
      </div>
      <div className="mt-6">
        <ProjectTable projects={projects} />
      </div>
    </>
  );
}
