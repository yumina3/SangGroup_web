/**
 * Label status properti yang tampil di katalog publik.
 *
 * Database memakai enum `BusinessStatus` berbahasa Indonesia; UI tetap
 * menampilkan label yang ramah pembaca dan warna yang konsisten dengan badge
 * situs publik.
 */
export const BUSINESS_STATUS_META = {
  tersedia: {
    label: "Tersedia",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  dipesan: {
    label: "Dipesan",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  terjual: {
    label: "Terjual",
    badge: "bg-slate-100 text-slate-600 ring-slate-500/20",
  },
};

export function businessStatusMeta(status) {
  return (
    BUSINESS_STATUS_META[status] ?? {
      label: status || "Tidak diketahui",
      badge: "bg-slate-100 text-slate-600 ring-slate-500/20",
    }
  );
}
