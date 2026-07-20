import { replaceGeneralJournalAction } from "@/actions/admin-journal.actions";

export function JournalForm() {
  return (
    <form action={replaceGeneralJournalAction} className="grid gap-5 md:grid-cols-2">
      <label className="block">
        <span className="text-sm font-bold">Persian title</span>
        <input
          name="titleFa"
          required
          className="mt-2 w-full border border-black/25 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">English title</span>
        <input
          name="titleEn"
          required
          className="mt-2 w-full border border-black/25 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-sm font-bold">Journal PDF</span>
        <input
          name="file"
          required
          type="file"
          accept="application/pdf"
          className="mt-2 w-full border border-black/25 px-3 py-2"
        />
      </label>
      <div className="md:col-span-2">
        <button type="submit" className="bg-black px-5 py-3 text-sm font-bold text-white">
          Replace journal
        </button>
      </div>
    </form>
  );
}
