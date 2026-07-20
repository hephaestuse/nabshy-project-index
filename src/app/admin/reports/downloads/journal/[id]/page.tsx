import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { reportService } from "@/services/report.service";

export default async function JournalDownloadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const { id } = await params;
  const report = await reportService.getJournalDownloadDetails(id);

  if (!report) notFound();

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Download report</p>
          <h1 className="admin-page-title mt-3">{report.title}</h1>
        </div>
      </header>
      <p className="admin-panel admin-panel-pad mt-6 text-sm text-black/70">
        Total: {report.totalDownloads} | Unique users: {report.uniqueUsers} | First:{" "}
        {report.firstDownload ?? "-"} | Last: {report.lastDownload ?? "-"}
      </p>
      <div className="admin-table mt-6">
        <table>
          <thead>
            <tr>
              <th className="p-3">Name</th><th className="p-3">Phone</th>
              <th className="p-3">Job</th><th className="p-3">Count</th>
              <th className="p-3">First</th><th className="p-3">Last</th>
            </tr>
          </thead>
          <tbody>{report.users.map((row) => (
            <tr key={row.phone}>
              <td className="p-3">{row.fullName}</td><td className="p-3">{row.phone}</td>
              <td className="p-3">{row.jobTitle}</td><td className="p-3">{row.downloadCount}</td>
              <td className="p-3">{row.firstDownload ?? "-"}</td><td className="p-3">{row.lastDownload ?? "-"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
