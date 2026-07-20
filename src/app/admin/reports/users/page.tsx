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
    <div>
      <header className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Audience</p>
          <h1 className="admin-page-title mt-3">Registered users</h1>
        </div>
      </header>
      {users.length === 0 ? (
        <p className="admin-panel admin-panel-pad mt-8 text-sm text-black/65">No registered users.</p>
      ) : (
        <div className="admin-table mt-8">
          <table>
            <thead>
              <tr>
                <th className="p-3">Name</th><th className="p-3">Phone</th>
                <th className="p-3">Job</th><th className="p-3">Registered</th>
                <th className="p-3">Project</th><th className="p-3">Journal</th>
                <th className="p-3">Total</th><th className="p-3">Last activity</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>{users.map((user) => (
              <tr key={user.id}>
                <td className="p-3">{user.fullName}</td><td className="p-3">{user.phone}</td>
                <td className="p-3">{user.jobTitle}</td><td className="p-3">{user.createdAt}</td>
                <td className="p-3">{user.projectDownloads}</td><td className="p-3">{user.journalDownloads}</td>
                <td className="p-3">{user.totalDownloads}</td><td className="p-3">{user.lastActivity ?? "-"}</td>
                <td className="p-3"><Link className="admin-table-action" href={`/admin/reports/users/${user.id}`}>View</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
