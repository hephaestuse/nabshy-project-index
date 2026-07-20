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
    <div className="mx-auto max-w-sm border border-black/15 bg-white p-6">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <div className="mt-6">
        <AdminLoginForm />
      </div>
    </div>
  );
}
