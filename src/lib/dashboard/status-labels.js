/**
 * Label dan gaya badge status.
 *
 * Satu sumber untuk seluruh dashboard agen (SRS §3.4). Warna tidak pernah
 * menjadi satu-satunya penanda: setiap badge selalu memuat teks status, dan
 * badge ketersediaan memakai titik berwarna + teks.
 */

export const LISTING_STATUS = {
  DRAFT: { label: "Draft", tone: "neutral" },
  PENDING: { label: "Menunggu Verifikasi", tone: "warning" },
  VERIFIED: { label: "Terverifikasi", tone: "success" },
  REJECTED: { label: "Ditolak", tone: "danger" },
  HIDDEN: { label: "Disembunyikan", tone: "neutral" },
};

export const SALE_STATUS = {
  AVAILABLE: { label: "Tersedia", tone: "success" },
  BOOKED: { label: "Dipesan", tone: "warning" },
  SOLD: { label: "Terjual", tone: "neutral" },
};

export const INQUIRY_STATUS = {
  PENDING: { label: "Baru", tone: "warning" },
  CONFIRMED: { label: "Dikonfirmasi", tone: "info" },
  RESCHEDULED: { label: "Dijadwal Ulang", tone: "info" },
  REJECTED: { label: "Ditolak", tone: "danger" },
  COMPLETED: { label: "Selesai", tone: "success" },
  CANCELLED: { label: "Dibatalkan pembeli", tone: "neutral" },
};

export const INQUIRY_TYPE = {
  VISIT: { label: "Kunjungan", tone: "gold" },
  INTEREST: { label: "Minat Beli", tone: "info" },
};

/**
 * Transisi tindak lanjut yang boleh dilakukan penjual (SRS §6.8):
 * PENDING → CONFIRMED | RESCHEDULED | REJECTED; CONFIRMED/RESCHEDULED → COMPLETED.
 */
export const SELLER_INQUIRY_ACTIONS = {
  PENDING: ["CONFIRMED", "RESCHEDULED", "REJECTED"],
  CONFIRMED: ["COMPLETED", "RESCHEDULED", "REJECTED"],
  RESCHEDULED: ["CONFIRMED", "COMPLETED", "REJECTED"],
  REJECTED: [],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Transisi ketersediaan yang boleh dilakukan penjual (SRS §6.8).
 * Hanya listing VERIFIED yang boleh berpindah ke BOOKED/SOLD.
 */
export function allowedSaleTransitions({ listingStatus, saleStatus }) {
  if (listingStatus !== "VERIFIED") return [];

  if (saleStatus === "AVAILABLE") return ["BOOKED", "SOLD"];
  if (saleStatus === "BOOKED") return ["SOLD", "AVAILABLE"];
  return [];
}

export function labelOf(map, key, fallback = "—") {
  return map[key]?.label ?? fallback;
}

export function toneOf(map, key) {
  return map[key]?.tone ?? "neutral";
}
