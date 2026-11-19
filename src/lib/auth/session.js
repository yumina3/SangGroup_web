import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { logAuth } from "@/lib/logging/logger";
import { findProfileById } from "./profile";
import {
  DASHBOARD_BY_ROLE,
  loginPathForRole,
} from "./redirects";
import {
  SESSION_DEFAULT_MAX_AGE,
  SESSION_REMEMBER_MAX_AGE,
  clearSessionCookie,
  readSessionCookie,
  writeSessionCookie,
} from "./session-cookie";

/**
 * Data Access Layer sesi. Satu tempat untuk membaca profil yang sedang login,
 * membuat sesi, dan menjaga rute dashboard.
 */

/** Profil aktif yang sedang login, atau null bila belum/tidak valid. */
export const getSessionProfile = cache(async () => {
  const session = await readSessionCookie();
  if (!session) return null;

  const result = await findProfileById(session.userId);
  if (!result.ok) return null;
  if (!result.profile) return null;

  return result.profile;
});

/** Tulis sesi setelah kredensial diverifikasi Supabase Auth. */
export async function createSessionForProfile(profile, { remember = false } = {}) {
  const maxAge = remember ? SESSION_REMEMBER_MAX_AGE : SESSION_DEFAULT_MAX_AGE;
  await writeSessionCookie({ userId: profile.id, maxAge });
  logAuth("session_created", { userId: profile.id, role: profile.role });
}

export async function destroySession() {
  await clearSessionCookie();
}

/**
 * Jaga layout dashboard. Tanpa sesi → login sesuai role; role salah → dashboard
 * milik role tersebut; akun nonaktif → halaman status akun.
 *
 * `currentPath` dipakai sebagai tujuan kembali setelah login.
 */
export async function requireRole(role, currentPath) {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect(
      loginPathForRole(role, {
        next: currentPath,
        reason: "unauth",
      }),
    );
  }

  if (profile.status === "pending") {
    redirect("/akun/nonaktif?reason=pending");
  }
  if (profile.status === "inactive") {
    redirect("/akun/nonaktif?reason=inactive");
  }

  if (profile.role !== role) {
    redirect(DASHBOARD_BY_ROLE[profile.role] ?? "/403");
  }

  return profile;
}

export function homeForRole(role) {
  return DASHBOARD_BY_ROLE[role] ?? "/";
}

export { SESSION_DEFAULT_MAX_AGE, SESSION_REMEMBER_MAX_AGE };
