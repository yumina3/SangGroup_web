import Link from "next/link";

import VerificationQueue from "@/components/admin/VerificationQueue";
import { requirePageUser } from "@/lib/auth/current-user";
import { listRecentInquiriesForAdmin } from "@/lib/services/admin";
import { getAdminRecap, listAdminProperties } from "@/lib/services/properties";

export const metadata = { title: "Ringkasan Admin" };
export const instant = false;

const INQUIRY_LABEL = {
  menunggu: "Menunggu",
  dihubungi: "Dihubungi",
  kunjungan_dijadwalkan: "Kunjungan dijadwalkan",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
  ditolak: "Ditolak",
};

/** Ringkasan admin: rekap database + antrean verifikasi (FR-42, FR-43). */
export default async function AdminPage() {
  await requirePageUser(["admin"]);

  const [pending, recap, recentInquiries] = await Promise.all([
    listAdminProperties({ page: 1, pageSize: 50, verificationStatus: "pending" }),
    getAdminRecap(),
    listRecentInquiriesForAdmin(8),
  ]);

  const stat = (label, value, href) => (
    <Link
      href={href}
      className="rounded-dash border border-ag-line bg-white px-4 py-3 transition-colors hover:border-ag-gold-base"
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-ag-slate-muted">{label}</p>
      <p className="text-[22px] font-bold text-ag-slate">{value}</p>
    </Link>
  );

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-[22px] font-bold">Ringkasan</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          Angka di bawah dihitung langsung dari database, bukan data statis.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {stat("Total listing", recap.totalProperties, "/admin/properti")}
          {stat("Menunggu verifikasi", recap.byVerification.pending ?? 0, "/admin/properti?verificationStatus=pending")}
          {stat("Disetujui", recap.byVerification.approved ?? 0, "/admin/properti?verificationStatus=approved")}
          {stat("Pengajuan", recap.totalInquiries, "/admin/pengajuan")}
          {stat("Pengguna", Object.values(recap.usersByRole).reduce((a, b) => a + b, 0), "/admin/pengguna")}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-dash border border-ag-line bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-ag-slate-muted">
            Status unit
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px]">
            {["tersedia", "dipesan", "terjual"].map((status) => (
              <li key={status} className="flex justify-between">
                <span className="capitalize">{status}</span>
                <span className="font-semibold">{recap.byBusiness[status] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-dash border border-ag-line bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-ag-slate-muted">
            Per proyek
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px]">
            {recap.byProject.map((row) => (
              <li key={row.projectId} className="flex justify-between gap-3">
                <span className="truncate">{row.projectName}</span>
                <span className="font-semibold">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-dash border border-ag-line bg-white p-4">
          <p className="text-[12px] font-bold uppercase tracking-wider text-ag-slate-muted">
            Pengajuan per status
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px]">
            {Object.entries(recap.inquiriesByStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between">
                <span>{INQUIRY_LABEL[status] ?? status}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-[18px] font-bold">Menunggu verifikasi</h2>
            <p className="text-[13px] text-ag-slate-secondary">
              {pending.total} listing perlu keputusan. Menyetujui akan menayangkannya di katalog.
            </p>
          </div>
          <Link
            href="/admin/properti"
            className="text-[12.5px] font-semibold text-ag-forest hover:underline"
          >
            Kelola semua listing →
          </Link>
        </div>
        <div className="mt-4">
          <VerificationQueue items={pending.items} />
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-[18px] font-bold">Pengajuan terbaru</h2>
          <Link
            href="/admin/pengajuan"
            className="text-[12.5px] font-semibold text-ag-forest hover:underline"
          >
            Lihat semua →
          </Link>
        </div>
        {recentInquiries.length === 0 ? (
          <p className="mt-3 rounded-dash border border-dashed border-ag-line bg-white px-4 py-6 text-center text-[13px] text-ag-slate-secondary">
            Belum ada pengajuan.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-dash border border-ag-line bg-white">
            <table className="w-full text-left text-[12.5px]">
              <thead className="border-b border-ag-line bg-ag-surface-low text-[11px] uppercase tracking-wider text-ag-slate-muted">
                <tr>
                  <th className="px-4 py-2.5">Pembeli</th>
                  <th className="px-4 py-2.5">Properti</th>
                  <th className="px-4 py-2.5">Jenis</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ag-line">
                {recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td className="px-4 py-2.5 font-semibold">{inquiry.buyerName}</td>
                    <td className="px-4 py-2.5">{inquiry.propertyTitle}</td>
                    <td className="px-4 py-2.5">
                      {inquiry.inquiryType === "kunjungan" ? "Kunjungan" : "Minat beli"}
                    </td>
                    <td className="px-4 py-2.5">{INQUIRY_LABEL[inquiry.status] ?? inquiry.status}</td>
                    <td className="px-4 py-2.5 text-ag-slate-secondary">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeZone: "Asia/Jakarta",
                      }).format(new Date(inquiry.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
