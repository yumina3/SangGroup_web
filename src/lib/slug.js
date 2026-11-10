/**
 * Util slug: huruf kecil, angka, dan tanda hubung (VL-07).
 * Contoh: "Rumah Tipe 45 — Sang Dipa" -> "rumah-tipe-45-sang-dipa".
 */
export function slugify(value, fallback = "properti") {
  const slug = String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || fallback;
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
