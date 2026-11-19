import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Sesi aplikasi setelah Supabase Auth memverifikasi email + kata sandi.
 *
 * Cookie hanya berisi `userId` dan waktu kedaluwarsa, ditandatangani
 * HMAC-SHA256. Role dan status TIDAK disimpan di cookie; keduanya selalu dibaca
 * ulang dari tabel `profiles` di server. Dengan begitu perubahan role oleh
 * admin langsung berlaku dan cookie tidak bisa dikarang dari browser.
 *
 * Catatan: Supabase tetap sumber identitas (verifikasi kata sandi). Cookie ini
 * adalah sesi aplikasi, bukan pengganti Supabase Auth.
 */

export const SESSION_COOKIE = "sang_session";
export const SESSION_DEFAULT_MAX_AGE = 60 * 60 * 12; // 12 jam
export const SESSION_REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // 30 hari

/**
 * Kunci tanda tangan. Di produksi wajib diisi lewat env; tanpa itu sesi
 * ditandatangani dengan kunci sementara per proses — cukup untuk demo lokal.
 */
function sessionSecret() {
  if (process.env.AUTH_SESSION_SECRET) return process.env.AUTH_SESSION_SECRET;
  if (process.env.PENJUAL_SESSION_SECRET) return process.env.PENJUAL_SESSION_SECRET;
  if (!globalThis.__sangAuthSessionSecret) {
    globalThis.__sangAuthSessionSecret = randomBytes(32).toString("hex");
  }
  return globalThis.__sangAuthSessionSecret;
}

function sign(value) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function digest(value) {
  return createHash("sha256").update(String(value), "utf8").digest();
}

function secureEquals(a, b) {
  return timingSafeEqual(digest(a), digest(b));
}

export function serializeSession({ userId, expiresAt }) {
  const payload = Buffer.from(JSON.stringify({ userId }), "utf8").toString("base64url");
  const body = `${expiresAt}.${payload}`;
  return `${body}.${sign(body)}`;
}

export function parseSession(value) {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [expiresAtRaw, payload, signature] = parts;
  const body = `${expiresAtRaw}.${payload}`;
  if (!secureEquals(signature, sign(body))) return null;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof parsed?.userId !== "string" || !parsed.userId) return null;
    return { userId: parsed.userId, expiresAt };
  } catch {
    return null;
  }
}

/** Baca sesi mentah dari cookie. Tidak menyentuh database. */
export async function readSessionCookie() {
  // Selalu terikat request: membaca cookie dan memeriksa kedaluwarsa memakai
  // waktu sekarang, yang tidak boleh dibekukan ke prerender.
  await connection();

  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

/**
 * Tulis cookie sesi. Hanya boleh dipanggil dari Server Action atau Route
 * Handler (Next.js tidak mengizinkan set cookie saat render).
 */
export async function writeSessionCookie({ userId, maxAge = SESSION_DEFAULT_MAX_AGE }) {
  const expiresAt = Date.now() + maxAge * 1000;
  const store = await cookies();

  store.set(SESSION_COOKIE, serializeSession({ userId, expiresAt }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
