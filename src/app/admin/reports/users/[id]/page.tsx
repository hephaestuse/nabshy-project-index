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
    <>
      <h1 className="text-3xl font-semibold">{user.fullName}</h1>
      <p className="mt-3 text-sm">
        {user.phone} | {user.jobTitle} | Registered: {user.createdAt} | Updated:{" "}
        {user.updatedAt} | Total downloads: {user.totalDownloads}
      </p>
      <Breakdown title="Project downloads" rows={user.projects} />
      <Breakdown title="Journal downloads" rows={user.journals} />
    </>
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
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4">No downloads.</p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-black/15 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7f5f0] text-left">
              <tr><th className="p-3">Title</th><th className="p-3">Count</th><th className="p-3">First</th><th className="p-3">Last</th></tr>
            </thead>
            <tbody>{rows.map((row) => (
              <tr key={row.title} className="border-t">
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
