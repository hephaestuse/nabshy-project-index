import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { JournalForm } from "@/components/admin/JournalForm";
import { adminAuthService } from "@/services/admin-auth.service";
import { generalJournalService } from "@/services/general-journal.service";

export default async function AdminJournalPage() {
  const cookieStore = await cookies();
  adminAuthService.requireAdminSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );
  const journal = await generalJournalService.getActiveJournal();

  return (
    <div>
      <header className="admin-page-header">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Content library</p>
          <h1 className="admin-page-title mt-3">General journal</h1>
        </div>
      </header>
      <section className="admin-panel admin-panel-pad mt-8">
        {journal ? (
          <dl className="grid gap-px overflow-hidden bg-black/12 sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-white p-4"><dt className="admin-label text-black/55">Title</dt><dd className="mt-2 text-sm font-semibold">{journal.titleEn}</dd></div>
            <div className="bg-white p-4"><dt className="admin-label text-black/55">File</dt><dd className="mt-2 truncate text-sm font-semibold">{journal.fileName}</dd></div>
            <div className="bg-white p-4"><dt className="admin-label text-black/55">Uploaded</dt><dd className="mt-2 text-sm font-semibold">{journal.createdAt}</dd></div>
            <div className="bg-white p-4"><dt className="admin-label text-black/55">Downloads</dt><dd className="mt-2 text-sm font-semibold">{journal.totalDownloads}</dd></div>
            <div className="bg-white p-4"><dt className="admin-label text-black/55">Unique users</dt><dd className="mt-2 text-sm font-semibold">{journal.uniqueUsers}</dd></div>
          </dl>
        ) : (
          <p>No active journal.</p>
        )}
      </section>
      <section className="admin-panel admin-panel-pad mt-6">
        <h2 className="admin-section-title">Replace journal</h2>
        <div className="mt-6">
          <JournalForm />
        </div>
      </section>
    </div>
  );
}
