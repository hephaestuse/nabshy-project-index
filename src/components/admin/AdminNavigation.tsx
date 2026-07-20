import Link from "next/link";
import { logoutAdminAction } from "@/actions/admin-auth.actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/journal", label: "General Journal" },
  { href: "/admin/reports/downloads", label: "Download Reports" },
  { href: "/admin/reports/users", label: "Users" },
];

export function AdminNavigation() {
  return (
    <nav className="border-b border-black bg-black px-4 py-3 text-white">
      <div className="mx-auto flex max-w-[80rem] flex-wrap items-center gap-x-1 gap-y-2">
        <Link href="/admin" className="me-4 px-2 py-2 text-sm font-bold uppercase tracking-[0.14em]">
          Nabshy / Admin
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white/70 transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
          >
            {link.label}
          </Link>
        ))}
        <form action={logoutAdminAction} className="ms-auto">
          <button
            type="submit"
            className="border border-white/45 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
