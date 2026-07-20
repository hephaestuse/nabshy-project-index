"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/actions/admin-auth.actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.message ? (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}
      <label className="block">
        <span className="admin-label">Username</span>
        <input
          name="username"
          required
          autoComplete="username"
          className="admin-field"
        />
      </label>
      <label className="block">
        <span className="admin-label">Password</span>
        <input
          name="password"
          required
          type="password"
          autoComplete="current-password"
          className="admin-field"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="admin-button w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
