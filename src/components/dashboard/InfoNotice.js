"use client";

const TONES = {
  info: "border-ag-line bg-ag-surface-low text-ag-slate",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-700",
  success: "border-ag-available/30 bg-emerald-50 text-emerald-800",
};

/**
 * Catatan jujur tentang keadaan modul yang belum tersambung (mis. database,
 * Storage). Dipakai agar halaman tidak menampilkan tombol yang seolah
 * berhasil padahal belum menyimpan apa pun.
 */
export default function InfoNotice({ tone = "info", title, children, action }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={`flex flex-col gap-2 rounded-dash border px-4 py-3 text-[12.5px] leading-relaxed sm:flex-row sm:items-center sm:justify-between ${TONES[tone] ?? TONES.info}`}
    >
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={title ? "mt-0.5 opacity-90" : ""}>{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
