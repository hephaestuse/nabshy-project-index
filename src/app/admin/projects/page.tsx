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
    <div>
      <div className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Content library</p>
          <h1 className="admin-page-title mt-3">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="admin-button">
          New project
        </Link>
      </div>
      <div className="mt-8">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
