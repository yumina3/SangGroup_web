import InquiryAdminList from "@/components/admin/InquiryAdminList";
import { requirePageUser } from "@/lib/auth/current-user";
import { listAllInquiries } from "@/lib/services/inquiries";

export const metadata = { title: "Pengajuan" };
export const instant = false;

const STATUS_OPTIONS = [
  ["", "Semua status"],
  ["menunggu", "Menunggu"],
  ["dihubungi", "Dihubungi"],
  ["kunjungan_dijadwalkan", "Kunjungan dijadwalkan"],
  ["selesai", "Selesai"],
  ["dibatalkan", "Dibatalkan"],
  ["ditolak", "Ditolak"],
];

/** Rekap & tindak lanjut seluruh pengajuan (FR-42). */
export default async function AdminInquiriesPage({ searchParams }) {
  await requirePageUser(["admin"]);
  const params = (await searchParams) ?? {};
  const status = typeof params.status === "string" ? params.status : "";
  const page = Math.max(1, Number.parseInt(String(params.page ?? "1"), 10) || 1);

  const result = await listAllInquiries({ page, pageSize: 20, status });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold">Pengajuan</h1>
          <p className="mt-1 text-[13px] text-ag-slate-secondary">
            Seluruh pengajuan kunjungan/minat beli beserta status tindak lanjutnya.
          </p>
        </div>
        <form method="get" className="flex items-end gap-2">
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Status</span>
            <select
              name="status"
              defaultValue={status}
              className="h-9 rounded-lg border border-ag-line px-2 text-[12.5px]"
            >
              {STATUS_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white"
          >
            Filter
          </button>
        </form>
      </div>

      <p className="text-[12.5px] text-ag-slate-secondary">
        <span className="font-semibold text-ag-slate">{result.total}</span> pengajuan.
      </p>

      <InquiryAdminList items={result.items} />

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between text-[12.5px] text-ag-slate-secondary">
          <span>
            Halaman {result.page} dari {result.totalPages}
          </span>
          <div className="flex gap-2">
            <a
              href={`/admin/pengajuan?page=${Math.max(1, result.page - 1)}&status=${status}`}
              className={`rounded-lg border border-ag-line px-3 py-1.5 font-semibold ${
                result.page <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Sebelumnya
            </a>
            <a
              href={`/admin/pengajuan?page=${Math.min(result.totalPages, result.page + 1)}&status=${status}`}
              className={`rounded-lg border border-ag-line px-3 py-1.5 font-semibold ${
                result.page >= result.totalPages ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Berikutnya
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
