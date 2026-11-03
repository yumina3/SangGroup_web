import { INQUIRY_TYPE, INQUIRY_STATUS } from "@/lib/dashboard/status-labels";
import { formatDateTime } from "@/lib/dashboard/format";
import StatusBadge from "./StatusBadge";

/**
 * Tabel pengajuan terbaru untuk halaman ringkasan.
 * Di layar sempit tabel menggulir di dalam kontainernya (SRS-D-07).
 */
export default function RecentInquiriesTable({ inquiries }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
        <caption className="sr-only">
          Lima pengajuan terbaru atas properti milik Anda
        </caption>
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-ag-slate-muted">
            <th scope="col" className="px-3 py-2.5">Calon Pembeli</th>
            <th scope="col" className="px-3 py-2.5">Properti</th>
            <th scope="col" className="px-3 py-2.5">Jenis</th>
            <th scope="col" className="px-3 py-2.5">Waktu Masuk</th>
            <th scope="col" className="px-3 py-2.5">Status</th>
            <th scope="col" className="px-3 py-2.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="transition-colors hover:bg-ag-ivory-surface/70">
              <th scope="row" className="px-3 py-3 text-left font-semibold text-ag-slate">
                {inquiry.buyer.name}
              </th>
              <td className="px-3 py-3 text-ag-slate-secondary">{inquiry.property.title}</td>
              <td className="px-3 py-3">
                <StatusBadge
                  label={INQUIRY_TYPE[inquiry.type].label}
                  tone={INQUIRY_TYPE[inquiry.type].tone}
                />
              </td>
              <td className="px-3 py-3 text-[12px] text-ag-slate-muted">
                {formatDateTime(inquiry.createdAt)}
              </td>
              <td className="px-3 py-3">
                <StatusBadge
                  label={INQUIRY_STATUS[inquiry.status].label}
                  tone={INQUIRY_STATUS[inquiry.status].tone}
                />
              </td>
              <td className="px-3 py-3 text-right">
                <a
                  href={`/dashboard/penjual/pengajuan?id=${encodeURIComponent(inquiry.id)}`}
                  className="text-[13px] font-semibold text-ag-forest hover:text-ag-gold"
                >
                  {inquiry.status === "PENDING" ? "Tanggapi" : "Lihat"}
                  <span className="sr-only"> — pengajuan {inquiry.buyer.name}</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
