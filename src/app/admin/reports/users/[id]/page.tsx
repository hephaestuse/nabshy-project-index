import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { reportService } from "@/services/report.service";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const { id } = await params;
  const user = await reportService.getRegisteredUserDetails(id);

  if (!user) notFound();

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">User profile</p>
          <h1 className="admin-page-title mt-3">{user.fullName}</h1>
        </div>
      </header>
      <p className="admin-panel admin-panel-pad mt-6 text-sm text-black/70">
        {user.phone} | {user.jobTitle} | Registered: {user.createdAt} | Updated:{" "}
        {user.updatedAt} | Total downloads: {user.totalDownloads}
      </p>
      <Breakdown title="Project downloads" rows={user.projects} />
      <Breakdown title="Journal downloads" rows={user.journals} />
    </div>
  );
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { title: string; downloadCount: number; firstDownload: string | null; lastDownload: string | null }[];
}) {
  return (
    <section className="mt-10">
      <h2 className="admin-section-title">{title}</h2>
      {rows.length === 0 ? (
        <p className="admin-panel admin-panel-pad mt-4 text-sm text-black/65">No downloads.</p>
      ) : (
        <div className="admin-table mt-4">
          <table>
            <thead>
              <tr><th className="p-3">Title</th><th className="p-3">Count</th><th className="p-3">First</th><th className="p-3">Last</th></tr>
            </thead>
            <tbody>{rows.map((row) => (
              <tr key={row.title}>
                <td className="p-3">{row.title}</td><td className="p-3">{row.downloadCount}</td>
                <td className="p-3">{row.firstDownload ?? "-"}</td><td className="p-3">{row.lastDownload ?? "-"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}
