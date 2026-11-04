/**
 * Pemformatan angka, uang, dan tanggal berbahasa Indonesia.
 *
 * Dipakai bersama oleh server dan klien. Lokal dan zona waktu dipatok
 * ("id-ID", "Asia/Jakarta") agar hasil render server dan browser sama dan
 * tidak memicu hydration mismatch.
 */

const ZONE = "Asia/Jakarta";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return rupiahFormatter.format(value);
}

/** "Rp 1,2 M" / "Rp 545 jt" untuk label ringkas pada kartu. */
export function formatRupiahShort(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 2,
    })} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    })} jt`;
  }
  return formatRupiah(value);
}

export function formatNumber(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("id-ID").format(value);
}

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "28 Okt 2026" */
export function formatDate(value) {
  const date = toDate(value);
  if (!date) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: ZONE,
  }).format(date);
}

/** "09.30 WIB" */
export function formatTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZONE,
  })
    .format(date)
    .replace(":", ".");
  return `${time} WIB`;
}

/** "28 Okt 2026 · 09.30 WIB" */
export function formatDateTime(value) {
  const date = toDate(value);
  if (!date) return "—";
  return `${formatDate(date)} · ${formatTime(date)}`;
}

/** "Rabu, 28 Oktober 2026" — dipakai di kepala halaman. */
export function formatLongDate(value = new Date()) {
  const date = toDate(value) ?? new Date();
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(date);
}

/**
 * Kunci tanggal Jakarta ("2026-10-30") dari sebuah ISO string. Dipakai untuk
 * menentukan apakah jadwal kunjungan masih di masa depan tanpa bergantung
 * zona waktu server.
 */
export function jakartaDayKey(value) {
  const date = toDate(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ZONE,
  }).format(date);
}

/** Inisial dua huruf untuk avatar nama. */
export function initialsOf(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
