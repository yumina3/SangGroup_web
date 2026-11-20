import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { logAuth } from "@/lib/logging/logger";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { getCurrentUser } from "./current-user";
import { findProfileById } from "./profile";
import {
  DASHBOARD_BY_ROLE,
  loginPathForRole,
} from "./redirects";
import {
  SESSION_DEFAULT_MAX_AGE,
  SESSION_REMEMBER_MAX_AGE,
  clearSessionCookie,
} from "./session-cookie";

/**
 * Data Access Layer sesi.
 *
 * Sumber kebenaran sesi adalah cookie Supabase Auth (@supabase/ssr), bukan
 * cookie aplikasi buatan sendiri. Fungsi di file ini dipertahankan supaya
 * seluruh halaman (3 portal login, layout dashboard, navbar) tidak perlu
 * diubah saat backend digabung.
 */

/**
 * Profil aktif yang sedang login, atau null bila belum/tidak valid.
 *
 * `getCurrentUser()` memeriksa sesi Supabase di server. Setelah itu profil
 * aplikasi dibaca lagi lewat `findProfileById()` agar bentuk hasil tetap
 * mengandung `email`, `agencyName`, dan `status` turunan yang dipakai UI.
 */
export const getSessionProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const result = await findProfileById(user.id);
  if (!result.ok || !result.profile) return null;

  return result.profile;
});

/**
 * Sesi Supabase sudah ditulis oleh `signInWithPassword()` / `signUpAccount()`.
 * Fungsi ini sengaja hanya mencatat audit agar pemanggil lama tetap bekerja.
 */
export async function createSessionForProfile(profile, { remember = false } = {}) {
  logAuth("session_created", {
    userId: profile.id,
    role: profile.role,
    remember,
  });
}

/** Keluar dari Supabase Auth dan hapus cookie aplikasi warisan bila ada. */
export async function destroySession() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase belum bisa dijangkau; cookie lokal tetap dibersihkan.
    }
  }
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
