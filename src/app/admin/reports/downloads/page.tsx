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
    <>
      <h1 className="text-3xl font-semibold">Download Reports</h1>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Project brochure downloads</h2>
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
      <section className="mt-8">
        <h2 className="text-xl font-semibold">General journal downloads</h2>
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
    </>
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
    return <p className="mt-4 border border-black/15 bg-white p-5">No download events.</p>;
  }

  return (
    <div className="mt-4 overflow-x-auto border border-black/15 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-[#f7f5f0] text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Status</th>
            <th className="p-3">Total</th>
            <th className="p-3">Unique users</th>
            <th className="p-3">Last download</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3">{row.title}</td>
              <td className="p-3">{row.status}</td>
              <td className="p-3">{row.total}</td>
              <td className="p-3">{row.unique}</td>
              <td className="p-3">{row.last ?? "-"}</td>
              <td className="p-3"><Link href={row.href} className="underline">View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
