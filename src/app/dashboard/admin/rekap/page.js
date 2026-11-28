import PropertyRecapWorkspace from "@/components/admin/PropertyRecapWorkspace";
import { requireRole } from "@/lib/auth/session";
import { getPropertyRecap, listRecapProperties } from "@/lib/services/properties";

export const metadata = { title: "Rekap Properti" };
export const instant = false;

const ZONE = "Asia/Jakarta";

/** Tanggal ISO "YYYY-MM-DD" untuk hari ini di zona Jakarta. */
function jakartaDate(now) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/**
 * Awal periode dalam WIB: awal bulan/kuartal/hari pertama tahun berjalan.
 * Dihitung dari `now` supaya jaringan uji tidak perlu memalsukan waktu.
 */
function resolveSince(period, now) {
  if (period !== "month" && period !== "quarter" && period !== "year") return null;

  const [year, month] = jakartaDate(now).split("-").map(Number);
  const startMonth = period === "quarter" ? month - ((month - 1) % 3) : period === "month" ? month : 1;

  // 00.00 WIB = 17.00 UTC hari sebelumnya.
  return new Date(Date.UTC(year, startMonth - 1, 1, -7));
}

function readPeriod(params) {
  const period = typeof params?.periode === "string" ? params.periode : "";
  return ["month", "quarter", "year"].includes(period) ? period : "all";
}

/**
 * Rekap properti admin: kartu KPI, distribusi per cluster/kategori, rekap per
 * agen, dan daftar properti. Semua angka dibaca dari database (FR-42, FR-43).
 */
export default async function AdminPropertyRecapPage({ searchParams }) {
  await requireRole("admin", "/dashboard/admin/rekap");

  const params = (await searchParams) ?? {};
  const period = readPeriod(params);
  const since = resolveSince(period, new Date());

  const [recap, properties] = await Promise.all([
    getPropertyRecap({ since }),
    listRecapProperties({ since }),
  ]);

  return (
    <PropertyRecapWorkspace
      recap={recap}
      properties={properties.map((property) => ({
        ...property,
        // Harga diangkut sebagai angka agar bisa dijumlahkan di klien.
        price: Number(property.price),
      }))}
      period={period}
    />
  );
}
