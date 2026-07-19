import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { SummaryCard } from "@/components/admin/SummaryCard";
import { adminAuthService } from "@/services/admin-auth.service";
import { reportService } from "@/services/report.service";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const summary = await reportService.getAdminDashboardSummary();

  return (
    <>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total projects" value={summary.totalProjects} />
        <SummaryCard label="Active projects" value={summary.activeProjects} />
        <SummaryCard label="Inactive projects" value={summary.inactiveProjects} />
        <SummaryCard label="Registered users" value={summary.registeredUsers} />
        <SummaryCard label="Project downloads" value={summary.totalProjectDownloads} />
        <SummaryCard label="Journal downloads" value={summary.totalJournalDownloads} />
        <SummaryCard label="Unique project downloaders" value={summary.uniqueProjectDownloaders} />
        <SummaryCard label="Unique journal downloaders" value={summary.uniqueJournalDownloaders} />
      </div>
    </>
  );
}
