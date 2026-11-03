import { jakartaDayKey } from "@/lib/dashboard/format";

/**
 * Turunan data dashboard penjual.
 *
 * Semua angka pada kartu ringkasan dihitung dari `properties` dan `inquiries`
 * yang sama dengan yang ditampilkan pada daftar, sehingga ringkasan tidak
 * mungkin berbeda dengan daftar (SRS-N-DAT-07). Saat modul Prisma
 * disambungkan, penggantinya cukup query `count`/`aggregate` dengan aturan
 * yang sama di sini.
 */

/** Status pengajuan yang masih butuh tindakan atau sedang berjalan. */
export const ACTIVE_INQUIRY_STATUSES = ["PENDING", "CONFIRMED", "RESCHEDULED"];

/** Status listing yang terlihat publik dan bisa menerima pengajuan. */
export const PUBLIC_LISTING_STATUS = "VERIFIED";

export function summarize(properties, inquiries, now = new Date()) {
  const available = properties.filter((item) => item.saleStatus === "AVAILABLE");
  const booked = properties.filter((item) => item.saleStatus === "BOOKED");
  const sold = properties.filter((item) => item.saleStatus === "SOLD");
  const pending = properties.filter((item) => item.listingStatus === "PENDING");

  const activeInquiries = inquiries.filter((item) =>
    ACTIVE_INQUIRY_STATUSES.includes(item.status),
  );

  const todayKey = jakartaDayKey(now);
  const upcomingVisits = inquiries
    .filter(
      (item) =>
        item.type === "VISIT" &&
        item.scheduledAt &&
        ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(item.status) &&
        (jakartaDayKey(item.scheduledAt) ?? "") >= todayKey,
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  return {
    totalProperties: properties.length,
    pendingVerification: pending.length,
    activeInquiries: activeInquiries.length,
    pendingInquiries: inquiries.filter((item) => item.status === "PENDING").length,
    soldProperties: sold.length,
    soldValue: sold.reduce((sum, item) => sum + item.price, 0),
    availableCount: available.length,
    bookedCount: booked.length,
    soldCount: sold.length,
    activeListingValue: properties
      .filter((item) => item.listingStatus === PUBLIC_LISTING_STATUS && item.saleStatus !== "SOLD")
      .reduce((sum, item) => sum + item.price, 0),
    upcomingVisits,
  };
}

/** Listing terbaru yang ditolak admin beserta alasannya (FR-SEL-06). */
export function latestRejected(properties) {
  return (
    properties
      .filter((item) => item.listingStatus === "REJECTED")
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] ?? null
  );
}

/** Pengajuan terbaru untuk tabel ringkasan. */
export function recentInquiries(inquiries, limit = 5) {
  return [...inquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
}
