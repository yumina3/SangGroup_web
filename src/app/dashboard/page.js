import { redirect } from "next/navigation";

import { getSessionProfile, homeForRole } from "@/lib/auth/session";
import { loginPathForRole } from "@/lib/auth/redirects";

/** Membaca sesi untuk menentukan portal tujuan. */
export const instant = false;

export const metadata = { title: "Dashboard" };

/**
 * Titik masuk netral `/dashboard`. Pengguna diarahkan ke portal sesuai role
 * yang tersimpan di tabel profiles, bukan berdasarkan input pengguna.
 */
export default async function DashboardIndexPage() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect(loginPathForRole("buyer", { reason: "unauth" }));
  }

  if (profile.status === "pending" || profile.status === "inactive") {
    redirect(`/akun/nonaktif?reason=${profile.status}`);
  }

  redirect(homeForRole(profile.role));
}
