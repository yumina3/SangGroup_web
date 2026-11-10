import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import InfoNotice from "@/components/dashboard/InfoNotice";
import InquiryBoard from "@/components/dashboard/inquiry/InquiryBoard";
import PageHeader from "@/components/dashboard/PageHeader";
import { requirePageUser } from "@/lib/auth/current-user";
import { getAgentDashboard } from "@/lib/services/properties";
import {
  filterInquiries,
  parseInquiryQuery,
  upcomingVisits,
} from "@/lib/dashboard/agent-filters";
import { formatLongDate } from "@/lib/dashboard/format";
import { SELLER_INQUIRY_ACTIONS } from "@/lib/dashboard/status-labels";

export const metadata = { title: "Pengajuan Masuk" };

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "belum", label: "Belum ditanggapi" },
  { key: "sudah", label: "Sudah ditanggapi" },
  { key: "jadwal", label: "Jadwal kunjungan" },
];

function tabHref(tab, type, focusId = null) {
  const search = new URLSearchParams();
  if (tab !== "semua") search.set("tab", tab);
  if (type) search.set("type", type);
  if (focusId) search.set("id", focusId);
  const query = search.toString();
  return query ? `/dashboard/penjual/pengajuan?${query}` : "/dashboard/penjual/pengajuan";
}

/**
 * Daftar pengajuan atas properti milik penjual (SRS-F-SEL-09) beserta tindak
 * lanjutnya (SRS-F-SEL-10).
 *
 * Filter tab dan jenis disimpan di URL agar halaman bisa dibagikan. Urutan
 * selalu terbaru lebih dulu. Karakter nonaktif tidak bisa diklik dan
 * ditandai `aria-disabled`.
 */
export default function InquiriesPage({ searchParams }) {
  return (
    <Suspense fallback={<p className="text-[13px] text-ag-slate-secondary">Memuat pengajuan…</p>}>
      <InquiriesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function InquiriesContent({ searchParams }) {
  // Halaman memakai `new Date()` (jadwal mendatang, kepala halaman), jadi
  // dirender di request time dan dialirkan lewat <Suspense>.
  await connection();

  const params = (await searchParams) ?? {};
  const query = parseInquiryQuery(params);
  const focusId = typeof params.id === "string" ? params.id : null;

  const user = await requirePageUser(["agent"]);
  const { properties, inquiries } = await getAgentDashboard(user.id);
  const filtered = [...filterInquiries(inquiries, query)].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const nextVisit = upcomingVisits(inquiries)[0] ?? null;
  const pendingCount = inquiries.filter((item) => item.status === "PENDING").length;
  const propertyOptions = properties.map((item) => ({
    id: item.id,
    title: item.title,
    unit: item.unit,
    price: item.price,
  }));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", formatLongDate(new Date())]}
        title="Pengajuan Masuk"
        description="Permintaan kunjungan dan minat beli dari calon pembeli atas listing Anda. Tanggapi dengan catatan agar pembeli tahu langkah berikutnya."
        meta={
          <span>
            <strong className="font-semibold text-ag-slate">{pendingCount}</strong> pengajuan belum
            ditanggapi ·{" "}
            {nextVisit ? `kunjungan terdekat ${formatLongDate(nextVisit.scheduledAt)}` : "belum ada jadwal kunjungan"}
          </span>
        }
      />

      <InfoNotice title="Pratinjau tindak lanjut (belum tersimpan)">
        Perubahan status pengajuan tampil sebagai pratinjau di layar ini dan belum tercatat di log
        (SRS-F-SEL-10). Aturan tetap ditegakkan: hanya transisi yang sah, catatan wajib diisi, dan
        jadwal ulang harus tanggal mendatang.
      </InfoNotice>

      <div className="flex flex-col gap-3 border-b border-ag-line sm:flex-row sm:items-end sm:justify-between">
        <nav aria-label="Filter pengajuan" className="-mb-px flex gap-5 overflow-x-auto">
          {TABS.map((tab) => {
            const active = query.tab === tab.key;
            const count =
              tab.key === "semua"
                ? inquiries.length
                : filterInquiries(inquiries, { tab: tab.key, type: query.type, q: query.q }).length;

            return (
              <Link
                key={tab.key}
                href={tabHref(tab.key, query.type, focusId)}
                aria-current={active ? "page" : undefined}
                className={[
                  "whitespace-nowrap border-b-2 pb-2.5 pt-1 text-[13px] font-semibold",
                  active
                    ? "border-ag-gold-base text-ag-forest"
                    : "border-transparent text-ag-slate-secondary hover:text-ag-slate",
                ].join(" ")}
              >
                {tab.label}
                <span className="ml-1.5 text-[11px] font-bold text-ag-slate-muted">{count}</span>
              </Link>
            );
          })}
        </nav>

        <form method="get" role="search" aria-label="Cari pengajuan" className="flex gap-2 pb-2">
          {query.tab !== "semua" ? <input type="hidden" name="tab" value={query.tab} /> : null}
          {focusId ? <input type="hidden" name="id" value={focusId} /> : null}
          <label htmlFor="inquiry-q" className="sr-only">
            Cari nama pembeli, nomor WhatsApp, atau nama properti
          </label>
          <input
            id="inquiry-q"
            name="q"
            type="search"
            defaultValue={query.q}
            placeholder="Cari pembeli atau properti"
            className="h-9 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none sm:w-60"
          />
          <select
            name="type"
            defaultValue={query.type}
            aria-label="Jenis pengajuan"
            className="h-9 rounded-lg border border-ag-line bg-white px-2 text-[12.5px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none"
          >
            <option value="">Semua jenis</option>
            <option value="VISIT">Kunjungan</option>
            <option value="INTEREST">Minat beli</option>
          </select>
          <button
            type="submit"
            className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white hover:bg-ag-forest-medium"
          >
            Cari
          </button>
        </form>
      </div>

      <InquiryBoard
        items={filtered}
        properties={propertyOptions}
        transitions={SELLER_INQUIRY_ACTIONS}
        filterLabel={TABS.find((tab) => tab.key === query.tab)?.label ?? "Semua"}
        focusId={focusId}
      />
    </div>
  );
}
