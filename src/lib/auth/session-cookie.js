import "server-only";

import { cookies } from "next/headers";

/**
 * Sesi disimpan sebagai cookie httpOnly berisi access/refresh token Supabase.
 * Nilai cookie tidak pernah dipercaya: setiap request divalidasi ulang ke
 * Supabase dan peran/status dibaca dari database (PRD §10.1).
 */
export const SESSION_COOKIE = "sang_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export function serializeSession({ accessToken, refreshToken }) {
  return Buffer.from(
    JSON.stringify({ accessToken, refreshToken }),
    "utf8",
  ).toString("base64url");
}

export function parseSession(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed?.accessToken) return null;
    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return null;
  }
}

export async function readSessionCookie() {
  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

export async function writeSessionCookie(tokens) {
  const store = await cookies();
  store.set(SESSION_COOKIE, serializeSession(tokens), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
