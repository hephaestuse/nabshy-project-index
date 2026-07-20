import Link from "next/link";
import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";
import { reportService } from "@/services/report.service";

export default async function UserReportsPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const users = await reportService.getRegisteredUserSummaries();

  return (
    <>
      <h1 className="text-3xl font-semibold">Registered Users</h1>
      {users.length === 0 ? (
        <p className="mt-6 border border-black/15 bg-white p-5">No registered users.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-black/15 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f7f5f0] text-left">
              <tr>
                <th className="p-3">Name</th><th className="p-3">Phone</th>
                <th className="p-3">Job</th><th className="p-3">Registered</th>
                <th className="p-3">Project</th><th className="p-3">Journal</th>
                <th className="p-3">Total</th><th className="p-3">Last activity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>{users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.fullName}</td><td className="p-3">{user.phone}</td>
                <td className="p-3">{user.jobTitle}</td><td className="p-3">{user.createdAt}</td>
                <td className="p-3">{user.projectDownloads}</td><td className="p-3">{user.journalDownloads}</td>
                <td className="p-3">{user.totalDownloads}</td><td className="p-3">{user.lastActivity ?? "-"}</td>
                <td className="p-3"><Link className="underline" href={`/admin/reports/users/${user.id}`}>View</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </>
  );
}
