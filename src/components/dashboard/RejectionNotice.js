import ActionButton from "@/components/dashboard/ActionButton";
import { IconAlert } from "@/components/dashboard/icons";

/**
 * Banner listing yang ditolak admin (FR-SEL-06: alasan penolakan harus
 * terlihat oleh penjual). Warna merah + ikon + teks, bukan warna saja.
 */
export default function RejectionNotice({ property }) {
  if (!property) return null;

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-dash border border-red-200 border-l-4 border-l-red-500 bg-red-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2.5">
        <IconAlert className="mt-0.5 shrink-0 text-red-600" />
        <p className="text-[13px] leading-relaxed text-slate-800">
          <strong className="font-semibold">Listing ditolak admin:</strong>{" "}
          <span className="font-semibold">{property.title}</span>
          {property.unit ? ` (${property.unit})` : ""}.{" "}
          {property.rejectionReason ?? "Periksa kembali data listing Anda."}
        </p>
      </div>

      <ActionButton
        as="link"
        href={`/dashboard/penjual/properti/${property.id}/ubah`}
        variant="outline"
        size="sm"
        className="shrink-0 border-red-300 text-red-700 hover:bg-red-100"
      >
        Perbaiki sekarang
      </ActionButton>
    </div>
  );
}
