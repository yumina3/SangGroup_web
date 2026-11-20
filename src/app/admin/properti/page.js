import ListingVerifyButtons from "@/components/admin/ListingVerifyButtons";
import { requirePageUser } from "@/lib/auth/current-user";
import { listAdminProperties } from "@/lib/services/properties";
import { listAllProjects } from "@/lib/services/projects";

export const metadata = { title: "Kelola Listing" };
export const instant = false;

const VERIFICATION_LABEL = {
  pending: { text: "Menunggu", className: "bg-amber-50 text-amber-800" },
  approved: { text: "Disetujui", className: "bg-emerald-50 text-emerald-700" },
  rejected: { text: "Ditolak", className: "bg-red-50 text-red-700" },
};

const BUSINESS_LABEL = {
  tersedia: "Tersedia",
  dipesan: "Dipesan",
  terjual: "Terjual",
};

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

/** Admin melihat semua listing dengan filter (FR-38). */
export default async function AdminPropertiesPage({ searchParams }) {
  await requirePageUser(["admin"]);
  const params = (await searchParams) ?? {};

  const verificationStatus = typeof params.verificationStatus === "string" ? params.verificationStatus : "";
  const businessStatus = typeof params.businessStatus === "string" ? params.businessStatus : "";
  const projectId = typeof params.projectId === "string" ? params.projectId : "";
  const page = Math.max(1, Number.parseInt(String(params.page ?? "1"), 10) || 1);

  const [projects, result] = await Promise.all([
    listAllProjects(),
    listAdminProperties({ page, pageSize: 20, verificationStatus, businessStatus, projectId }),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold">Kelola listing</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          Semua listing dari seluruh agen. Filter berdasarkan status verifikasi, status unit, atau proyek.
        </p>
      </div>

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-dash border border-ag-line bg-white p-4">
        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Verifikasi</span>
          <select
            name="verificationStatus"
            defaultValue={verificationStatus}
            className="h-9 rounded-lg border border-ag-line px-2 text-[12.5px]"
          >
            <option value="">Semua</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </label>

        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Status unit</span>
          <select
            name="businessStatus"
            defaultValue={businessStatus}
            className="h-9 rounded-lg border border-ag-line px-2 text-[12.5px]"
          >
            <option value="">Semua</option>
            <option value="tersedia">Tersedia</option>
            <option value="dipesan">Dipesan</option>
            <option value="terjual">Terjual</option>
          </select>
        </label>

        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Proyek</span>
          <select
            name="projectId"
            defaultValue={projectId}
            className="h-9 max-w-[220px] rounded-lg border border-ag-line px-2 text-[12.5px]"
          >
            <option value="">Semua</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white"
        >
          Terapkan
        </button>
        <a href="/admin/properti" className="h-9 px-2 text-[12.5px] font-semibold leading-9 text-ag-slate-secondary hover:underline">
          Reset
        </a>
      </form>

      <p className="text-[12.5px] text-ag-slate-secondary">
        <span className="font-semibold text-ag-slate">{result.total}</span> listing ditemukan.
      </p>

      <div className="overflow-x-auto rounded-dash border border-ag-line bg-white">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead className="border-b border-ag-line bg-ag-surface-low text-[11px] uppercase tracking-wider text-ag-slate-muted">
            <tr>
              <th className="px-4 py-2.5">Listing</th>
              <th className="px-4 py-2.5">Agen</th>
              <th className="px-4 py-2.5">Harga</th>
              <th className="px-4 py-2.5">Verifikasi</th>
              <th className="px-4 py-2.5">Unit</th>
              <th className="px-4 py-2.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {result.items.map((property) => {
              const verification = VERIFICATION_LABEL[property.verificationStatus] ?? VERIFICATION_LABEL.pending;
              return (
                <tr key={property.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{property.title}</p>
                    <p className="text-[11.5px] text-ag-slate-muted">
                      {property.project?.name} · {property.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">{property.owner?.fullName ?? "—"}</td>
                  <td className="px-4 py-3">{rupiah(property.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${verification.className}`}>
                      {verification.text}
                    </span>
                    {property.verificationNote ? (
                      <p className="mt-1 max-w-[220px] text-[11px] text-ag-slate-muted">
                        {property.verificationNote}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{BUSINESS_LABEL[property.businessStatus]}</td>
                  <td className="px-4 py-3">
                    {property.verificationStatus === "pending" ? (
                      <ListingVerifyButtons propertyId={property.id} />
                    ) : (
                      <span className="text-[11.5px] text-ag-slate-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {result.items.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-ag-slate-secondary">
            Tidak ada listing pada filter ini.
          </p>
        ) : null}
      </div>

      {result.totalPages > 1 ? (
        <div className="flex items-center justify-between text-[12.5px] text-ag-slate-secondary">
          <span>
            Halaman {result.page} dari {result.totalPages}
          </span>
          <div className="flex gap-2">
            <a
              href={`/admin/properti?page=${Math.max(1, result.page - 1)}&verificationStatus=${verificationStatus}&businessStatus=${businessStatus}&projectId=${projectId}`}
              className={`rounded-lg border border-ag-line px-3 py-1.5 font-semibold ${
                result.page <= 1 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Sebelumnya
            </a>
            <a
              href={`/admin/properti?page=${Math.min(result.totalPages, result.page + 1)}&verificationStatus=${verificationStatus}&businessStatus=${businessStatus}&projectId=${projectId}`}
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
