import Link from "next/link";
import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { reportService } from "@/services/report.service";

export default async function DownloadReportsPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const [projects, journals] = await Promise.all([
    reportService.getProjectDownloadSummaries(),
    reportService.getJournalDownloadSummaries(),
  ]);

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Activity</p>
          <h1 className="admin-page-title mt-3">Download reports</h1>
        </div>
      </header>
      <section className="mt-8">
        <h2 className="admin-section-title">Project brochure downloads</h2>
        <ReportTable
          rows={projects.map((project) => ({
            id: project.id,
            title: project.title,
            status: project.isActive ? "Active" : "Inactive",
            total: project.totalDownloads,
            unique: project.uniqueUsers,
            last: project.lastDownload,
            href: `/admin/reports/downloads/projects/${project.id}`,
          }))}
        />
      </section>
      <section className="mt-10">
        <h2 className="admin-section-title">General journal downloads</h2>
        <ReportTable
          rows={journals.map((journal) => ({
            id: journal.id,
            title: journal.title,
            status: journal.isActive ? "Active" : "Inactive",
            total: journal.totalDownloads,
            unique: journal.uniqueUsers,
            last: journal.lastDownload,
            href: `/admin/reports/downloads/journal/${journal.id}`,
          }))}
        />
      </section>
    </div>
  );
}

function ReportTable({
  rows,
}: {
  rows: {
    id: string;
    title: string;
    status: string;
    total: number;
    unique: number;
    last: string | null;
    href: string;
  }[];
}) {
  if (rows.length === 0) {
    return <p className="admin-panel admin-panel-pad mt-4 text-sm text-black/65">No download events.</p>;
  }

  return (
    <div className="admin-table mt-4">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Total</th>
            <th>Unique users</th>
            <th>Last download</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{row.status}</td>
              <td>{row.total}</td>
              <td>{row.unique}</td>
              <td>{row.last ?? "-"}</td>
              <td><Link href={row.href} className="admin-table-action">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
