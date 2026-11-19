"use server";

import { redirect } from "next/navigation";

import { loginForPortal } from "@/lib/auth/login";

export async function agentLoginAction(_prevState, formData) {
  const result = await loginForPortal({ role: "agent", formData });
  if (!result.ok) return result.state;
  redirect(result.redirectTo, "push");
}
