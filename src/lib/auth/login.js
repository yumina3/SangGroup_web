import "server-only";

import { logAuth } from "@/lib/logging/logger";
import { consume, reset, RATE_LIMITS } from "./rate-limit";
import { findProfileById } from "./profile";
import { createSessionForProfile } from "./session";
import {
  LOGIN_BY_ROLE,
  ROLE_LABEL,
  resolvePostLoginPath,
} from "./redirects";
import { signInWithPassword } from "./supabase-server";
import {
  formDataToObject,
  portalLoginSchema,
  toFieldErrors,
} from "@/lib/validators/auth";

/**
 * Inti login untuk ketiga portal. Portal ditentukan oleh Server Action yang
 * memanggil fungsi ini, bukan oleh input pengguna. Role akun selalu dibaca
 * dari tabel profiles.
 */

function fail(formError, extra = {}) {
  return {
    ok: false,
    state: {
      ok: false,
      formError,
      fieldErrors: {},
      switchPortal: null,
      ...extra,
    },
  };
}

export async function loginForPortal({ role, formData }) {
  const raw = formDataToObject(formData, [
    "email",
    "password",
    "next",
    "remember",
  ]);

  const parsed = portalLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      state: {
        ok: false,
        formError: null,
        fieldErrors: toFieldErrors(parsed.error),
        switchPortal: null,
      },
    };
  }

  const email = parsed.data.email;
  const rateKey = `${role}-login:${email}`;
  const limit = consume(rateKey, RATE_LIMITS.login);
  if (!limit.ok) {
    return fail(
      `Terlalu banyak percobaan masuk. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
    );
  }

  const auth = await signInWithPassword({
    email,
    password: parsed.data.password,
  });
  if (!auth.ok) {
    logAuth("login_failed", { role, reason: "credentials" });
    return fail(auth.message);
  }

  const profileResult = await findProfileById(auth.user.id);
  if (!profileResult.ok) {
    return fail(
      profileResult.code === "db_not_configured"
        ? "Database profil belum tersambung. Hubungi admin Sang Group."
        : "Profil tidak dapat dibaca saat ini. Coba lagi beberapa saat lagi.",
    );
  }

  const profile = profileResult.profile;
  if (!profile) {
    return fail(
      "Profil akun tidak ditemukan. Hubungi admin Sang Group agar profil Anda dibuatkan.",
    );
  }

  if (profile.status !== "active") {
    return fail(
      profile.status === "pending"
        ? "Akun Anda masih menunggu persetujuan admin."
        : "Akun Anda sedang nonaktif. Hubungi admin Sang Group.",
    );
  }

  if (profile.role !== role) {
    const correctPortal = LOGIN_BY_ROLE[profile.role] ?? "/login";
    return fail(
      `Akun ini terdaftar sebagai ${ROLE_LABEL[profile.role] ?? "pengguna lain"}. Masuk melalui portal yang sesuai.`,
      {
        switchPortal: {
          href: correctPortal,
          label: `Buka ${correctPortal}`,
        },
      },
    );
  }

  try {
    await createSessionForProfile(profile, {
      remember: parsed.data.remember === "on",
    });
  } catch (error) {
    logAuth("session_write_failed", {
      userId: profile.id,
      role: profile.role,
      message: error instanceof Error ? error.message : String(error),
    });
    return fail("Sesi tidak dapat dibuat. Coba lagi.");
  }

  reset(rateKey);
  logAuth("login_success", { userId: profile.id, role: profile.role });

  return {
    ok: true,
    redirectTo: resolvePostLoginPath({
      role: profile.role,
      status: profile.status,
      nextPath: parsed.data.next,
    }),
  };
}
