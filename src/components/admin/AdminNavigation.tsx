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
    <nav className="border-b border-[#071A33]/15 bg-white px-4 py-3 text-[#071A33]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <Link href="/admin" className="me-4 font-bold">
          Nabshy Admin
        </Link>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-2 py-1 text-sm font-semibold hover:bg-[#f7f5f0] focus:outline-none focus:ring-2 focus:ring-[#071A33]"
          >
            {link.label}
          </Link>
        ))}
        <form action={logoutAdminAction} className="ms-auto">
          <button
            type="submit"
            className="px-3 py-2 text-sm font-bold hover:bg-[#071A33] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#071A33]"
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
