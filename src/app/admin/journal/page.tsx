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
    <>
      <h1 className="text-3xl font-semibold">General Journal</h1>
      <section className="mt-6 border border-[#071A33]/15 bg-white p-5">
        {journal ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-bold">Title</dt><dd>{journal.titleEn}</dd></div>
            <div><dt className="font-bold">File</dt><dd>{journal.fileName}</dd></div>
            <div><dt className="font-bold">Uploaded</dt><dd>{journal.createdAt}</dd></div>
            <div><dt className="font-bold">Downloads</dt><dd>{journal.totalDownloads}</dd></div>
            <div><dt className="font-bold">Unique users</dt><dd>{journal.uniqueUsers}</dd></div>
          </dl>
        ) : (
          <p>No active journal.</p>
        )}
      </section>
      <section className="mt-6 border border-[#071A33]/15 bg-white p-5">
        <h2 className="text-xl font-semibold">Replace journal</h2>
        <div className="mt-5">
          <JournalForm />
        </div>
      </section>
    </>
  );
}
