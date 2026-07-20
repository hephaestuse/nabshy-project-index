"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/actions/admin-auth.actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.message ? (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {state.message}
        </p>
      ) : null}
      <label className="block">
        <span className="text-sm font-bold">Username</span>
        <input
          name="username"
          required
          autoComplete="username"
          className="mt-2 w-full border border-black/25 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Password</span>
        <input
          name="password"
          required
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full border border-black/25 px-3 py-2 outline-none focus:ring-2 focus:ring-black"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
