import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { adminSessionCookieName } from "@/lib/admin-auth";
import { adminAuthService } from "@/services/admin-auth.service";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();

  if (
    adminAuthService.isValidSession(
      cookieStore.get(adminSessionCookieName)?.value,
    )
  ) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto mt-[12vh] max-w-md admin-panel admin-panel-pad">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/55">Nabshy</p>
      <h1 className="mt-3 text-3xl font-semibold">Admin login</h1>
      <div className="mt-6">
        <AdminLoginForm />
      </div>
    </div>
  );
}
