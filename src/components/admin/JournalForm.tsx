import { replaceGeneralJournalAction } from "@/actions/admin-journal.actions";

export function JournalForm() {
  return (
    <form action={replaceGeneralJournalAction} className="grid gap-6 md:grid-cols-2">
      <label className="block">
        <span className="admin-label">Persian title</span>
        <input
          name="titleFa"
          required
          className="admin-field"
        />
      </label>
      <label className="block">
        <span className="admin-label">English title</span>
        <input
          name="titleEn"
          required
          className="admin-field"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="admin-label">Journal PDF</span>
        <input
          name="file"
          required
          type="file"
          accept="application/pdf"
          className="admin-field"
        />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="admin-button">
          Replace journal
        </button>
      </div>
    </form>
  );
}
