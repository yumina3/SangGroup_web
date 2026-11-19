"use server";

import { redirect } from "next/navigation";

import { destroySession } from "@/lib/auth/session";

/** Keluar dari sesi aplikasi, lalu kembali ke beranda publik. */
export async function logoutAction() {
  await destroySession();
  redirect("/", "push");
}

/** Keluar dari portal pembeli. */
export async function buyerLogoutAction() {
  await destroySession();
  redirect("/login", "push");
}

/** Keluar dari portal agen/penjual. */
export async function agentLogoutAction() {
  await destroySession();
  redirect("/login-agen", "push");
}

/** Keluar dari portal admin. */
export async function adminLogoutAction() {
  await destroySession();
  redirect("/login-admin", "push");
}
