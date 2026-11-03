import { jakartaDayKey } from "@/lib/dashboard/format";

/**
 * Filter dan pagination daftar properti milik agen (SRS-F-SEL-02).
 *
 * Filter disimpan di query string (`q`, `sale`, `listing`, `page`) agar
 * halaman bisa dibagikan dan dibuka ulang, sama seperti persyaratan filter
 * katalog publik (SRS-F-PUB-04). Saat modul Prisma disambungkan, fungsi ini
 * menghasilkan `where`/`skip`/`take` untuk query yang sama.
 */

export const PROPERTY_PAGE_SIZE = 10;

export function parsePropertyQuery(searchParams = {}) {
  const page = Number.parseInt(String(searchParams.page ?? "1"), 10);

  return {
    q: typeof searchParams.q === "string" ? searchParams.q.trim().slice(0, 80) : "",
    sale: normalizeEnum(searchParams.sale, ["AVAILABLE", "BOOKED", "SOLD"]),
    listing: normalizeEnum(searchParams.listing, ["DRAFT", "PENDING", "VERIFIED", "REJECTED", "HIDDEN"]),
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

function normalizeEnum(value, allowed) {
  if (typeof value !== "string") return "";
  return allowed.includes(value) ? value : "";
}

export function filterProperties(properties, query) {
  const keyword = query.q.toLowerCase();

  return properties.filter((item) => {
    if (query.sale && item.saleStatus !== query.sale) return false;
    if (query.listing && item.listingStatus !== query.listing) return false;
    if (!keyword) return true;

    const haystack = [item.title, item.cluster, item.unit, item.city, item.address]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}

export function paginate(items, page, pageSize = PROPERTY_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageCount,
    total: items.length,
    pageSize,
  };
}

/**
 * Jadwal kunjungan mendatang untuk tab "Jadwal" di halaman pengajuan.
 * Urut dari yang paling dekat.
 */
export function upcomingVisits(inquiries, now = new Date()) {
  const today = jakartaDayKey(now);
  return inquiries
    .filter(
      (item) =>
        item.type === "VISIT" &&
        item.scheduledAt &&
        ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(item.status) &&
        (jakartaDayKey(item.scheduledAt) ?? "") >= today,
    )
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
}

/** Filter pengajuan: tab status, jenis, dan kata kunci. */
export function parseInquiryQuery(searchParams = {}) {
  const tab = String(searchParams.tab ?? "semua");
  return {
    tab: ["semua", "belum", "sudah", "jadwal"].includes(tab) ? tab : "semua",
    type: normalizeEnum(searchParams.type, ["VISIT", "INTEREST"]),
    q: typeof searchParams.q === "string" ? searchParams.q.trim().slice(0, 80) : "",
  };
}

export function filterInquiries(inquiries, query, now = new Date()) {
  const keyword = query.q.toLowerCase();

  return inquiries.filter((item) => {
    if (query.type && item.type !== query.type) return false;

    if (query.tab === "belum" && item.status !== "PENDING") return false;
    if (query.tab === "sudah" && item.status === "PENDING") return false;
    if (
      query.tab === "jadwal" &&
      !upcomingVisits([item], now).length
    ) {
      return false;
    }

    if (!keyword) return true;
    const haystack = [item.buyer.name, item.buyer.phone, item.property.title]
      .join(" ")
      .toLowerCase();
    return haystack.includes(keyword);
  });
}
