import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { adminAuthService } from "@/services/admin-auth.service";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = adminAuthService.isValidSession(
    cookieStore.get(adminSessionCookieName)?.value,
  );

  return (
    <div className="admin-shell">
      {isAdmin ? <AdminNavigation /> : null}
      <main className="admin-content">{children}</main>
    </div>
  );
}
