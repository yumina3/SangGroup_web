"use server";

import { redirect } from "next/navigation";

import { loginForPortal } from "@/lib/auth/login";

export async function buyerLoginAction(_prevState, formData) {
  const result = await loginForPortal({ role: "buyer", formData });
  if (!result.ok) return result.state;
  redirect(result.redirectTo, "push");
}
