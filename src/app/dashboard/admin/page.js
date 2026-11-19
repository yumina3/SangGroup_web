import Alert from "@/components/ui/Alert";
import { requireRole } from "@/lib/auth/session";

export const metadata = { title: "Ringkasan Admin" };

const MODULES = [
  {
    title: "Verifikasi listing",
    description:
      "Periksa kelengkapan data properti dan setujui listing sebelum tayang di katalog.",
  },
  {
    title: "Akun pengguna",
    description:
      "Kelola status akun pembeli, agen, dan akses staf admin Sang Group.",
  },
  {
    title: "Rekap penjualan",
    description:
      "Pantau data listing, pengajuan, dan transaksi lintas agen dalam satu tempat.",
  },
];

export default async function AdminDashboardPage() {
  const profile = await requireRole("admin", "/dashboard/admin");
  const firstName = profile.fullName?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
          Portal admin
        </p>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-deep">
          Halo, {firstName}
        </h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted">
          Anda masuk sebagai administrator SANG Group. Panel operasional akan
          diisi bertahap setelah modul properti dan pengguna tersambung.
        </p>
        <p className="mt-4 text-[11px] text-muted">
          Akun: <span className="font-semibold text-brand-ink">{profile.email}</span>
        </p>
      </section>

      <Alert tone="info" title="Tahap awal">
        Dashboard admin masih berupa ringkasan. Verifikasi listing dan pengelolaan
        pengguna belum diaktifkan pada tahap ini.
      </Alert>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/[0.03]">
        <h2 className="text-[15px] font-bold text-brand-deep">
          Modul yang disiapkan
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {MODULES.map((module) => (
            <div
              key={module.title}
              className="rounded-lg border border-brand-line px-4 py-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-brand-ink">
                  {module.title}
                </p>
                <span className="shrink-0 rounded bg-brand-cream px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted">
                  Segera
                </span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
