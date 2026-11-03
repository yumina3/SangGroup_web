import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

import { getAgentDashboard } from "@/lib/dashboard/agent-data";

/**
 * Sesi login khusus halaman /penjual.
 *
 * Mode saat ini adalah DEMO: akun agen tertulis di konstanta di bawah, bukan di
 * database dan bukan di Supabase Auth. Sesi disimpan sebagai cookie berisi
 * `expiresAt.payload.signature` (HMAC-SHA256) berisi e-mail akun demo, sehingga
 * cookie tidak bisa dikarang dari browser.
 *
 * Cookie hanya membuktikan "sudah login". Pemeriksaan ini tidak menggantikan
 * autentikasi sungguhan: sebelum rilis, ganti `authenticate()` dengan Supabase
 * Auth (lihat `lib/auth/supabase-server.js`) dan baca profil dari Prisma.
 */

export const PENJUAL_COOKIE = "sang_penjual_session";
export const PENJUAL_SESSION_MAX_AGE = 60 * 60 * 8; // 8 jam

/** Akun demo halaman /penjual. */
export const DEMO_PENJUAL = {
  email: "nadia.prameswari@sanggroup.id",
  password: "penjual123",
};

/**
 * Kunci tanda tangan cookie. Di produksi wajib diisi lewat env; tanpa itu sesi
 * ditandatangani dengan kunci sementara per proses — cukup untuk demo lokal.
 */
function sessionSecret() {
  if (process.env.PENJUAL_SESSION_SECRET) return process.env.PENJUAL_SESSION_SECRET;
  if (!globalThis.__sangPenjualSecret) {
    globalThis.__sangPenjualSecret = randomBytes(32).toString("hex");
  }
  return globalThis.__sangPenjualSecret;
}

function sign(value) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function digest(value) {
  return createHash("sha256").update(String(value), "utf8").digest();
}

/** Bandingkan dua string tanpa membocorkan panjang lewat waktu respons. */
export function secureEquals(a, b) {
  return timingSafeEqual(digest(a), digest(b));
}

export function serializePenjualSession({ email, expiresAt }) {
  const payload = Buffer.from(JSON.stringify({ email }), "utf8").toString("base64url");
  const body = `${expiresAt}.${payload}`;
  return `${body}.${sign(body)}`;
}

export function parsePenjualSession(value) {
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
    if (typeof parsed?.email !== "string") return null;
    return { email: parsed.email, expiresAt };
  } catch {
    return null;
  }
}

/** Baca sesi penjual dari cookie. Mengembalikan null bila belum/tidak valid. */
export async function readPenjualSession() {
  // Selalu terikat request: membaca cookie dan memeriksa kedaluwarsa memakai
  // waktu sekarang, yang tidak boleh dibekukan ke prerender (lihat
  // docs/messages/blocking-prerender-current-time).
  await connection();

  const store = await cookies();
  return parsePenjualSession(store.get(PENJUAL_COOKIE)?.value);
}

/**
 * Cocokkan kredensial dengan akun demo.
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
export function authenticatePenjual(email, password) {
  const emailMatch = secureEquals(String(email ?? "").trim().toLowerCase(), DEMO_PENJUAL.email);
  const passwordMatch = secureEquals(String(password ?? ""), DEMO_PENJUAL.password);

  // Pesan sengaja sama untuk e-mail salah dan sandi salah.
  if (!emailMatch || !passwordMatch) {
    return { ok: false, message: "Email atau kata sandi tidak sesuai." };
  }

  return { ok: true };
}

/** Profil agen yang sedang login (data contoh dashboard). */
export function currentPenjualAgent() {
  return getAgentDashboard().agent;
}
