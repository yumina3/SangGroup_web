"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { consume, reset, RATE_LIMITS } from "@/lib/auth/rate-limit";
import {
  PENJUAL_COOKIE,
  PENJUAL_SESSION_MAX_AGE,
  authenticatePenjual,
  serializePenjualSession,
} from "@/lib/auth/penjual-session";
import { loginSchema, formDataToObject, toFieldErrors } from "@/lib/validators/auth";

const REDIRECT_DASHBOARD = "/dashboard/penjual";

export async function penjualLoginAction(_prevState, formData) {
  const raw = formDataToObject(formData, ["email", "password"]);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, formError: null, fieldErrors: toFieldErrors(parsed.error) };
  }

  const limit = consume(`penjual-login:${parsed.data.email}`, RATE_LIMITS.login);
  if (!limit.ok) {
    return {
      ok: false,
      formError: `Terlalu banyak percobaan masuk. Coba lagi dalam ${limit.retryAfterSeconds} detik.`,
      fieldErrors: {},
    };
  }

  const auth = authenticatePenjual(parsed.data.email, parsed.data.password);
  if (!auth.ok) {
    return { ok: false, formError: auth.message, fieldErrors: {} };
  }

  // Sesi demo + limit direset setelah login sukses.
  const email = parsed.data.email.trim().toLowerCase();
  const store = await cookies();
  store.set(
    PENJUAL_COOKIE,
    serializePenjualSession({ email, expiresAt: Date.now() + PENJUAL_SESSION_MAX_AGE * 1000 }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: PENJUAL_SESSION_MAX_AGE,
      path: "/",
    },
  );
  reset(`penjual-login:${email}`);

  redirect(REDIRECT_DASHBOARD, "push");
}

/** Keluar: hapus cookie sesi, lalu kembali ke gerbang /penjual. */
export async function penjualLogoutAction() {
  const store = await cookies();
  store.delete(PENJUAL_COOKIE);
  redirect("/penjual", "push");
}
