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
    <>
      <h1 className="text-3xl font-semibold">{report.title}</h1>
      <p className="mt-3 text-sm">
        Total: {report.totalDownloads} | Unique users: {report.uniqueUsers} | First:{" "}
        {report.firstDownload ?? "-"} | Last: {report.lastDownload ?? "-"}
      </p>
      <div className="mt-6 overflow-x-auto border border-black/15 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f7f5f0] text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Phone</th>
              <th className="p-3">Job</th><th className="p-3">Count</th>
              <th className="p-3">First</th><th className="p-3">Last</th>
            </tr>
          </thead>
          <tbody>{report.users.map((row) => (
            <tr key={row.phone} className="border-t">
              <td className="p-3">{row.fullName}</td><td className="p-3">{row.phone}</td>
              <td className="p-3">{row.jobTitle}</td><td className="p-3">{row.downloadCount}</td>
              <td className="p-3">{row.firstDownload ?? "-"}</td><td className="p-3">{row.lastDownload ?? "-"}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
