import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import PropertyForm from "@/components/dashboard/property/PropertyForm";
import { EmptyState } from "@/components/dashboard/States";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { getAgentDashboard } from "@/lib/dashboard/agent-data";
import { formatDateTime } from "@/lib/dashboard/format";
import { LISTING_STATUS } from "@/lib/dashboard/status-labels";

/**
 * Halaman ubah listing (SRS-F-SEL-03 s.d. SEL-05, SEL-08).
 *
 * `params` dibaca saat request dan properti dicari dari data penjual yang
 * sedang login (bukan daftar statis), jadi rute ini boleh menunggu render
 * (`instant = false`) — tidak ada shell statis yang berguna untuk hambatan
 * navigasi di sini (Next.js "blocking route").
 */
export const instant = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const property = findProperty(id);
  return { title: property ? `Ubah — ${property.title}` : "Ubah Properti" };
}

function findProperty(id) {
  return getAgentDashboard().properties.find((item) => item.id === id) ?? null;
}

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const property = findProperty(id);

  if (!property) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow={["Portal Agen", "Properti", "Ubah"]}
          title="Listing tidak ditemukan"
          description="Listing ini tidak ada di daftar milik Anda, atau sudah dihapus."
        />
        <section className="rounded-dash border border-ag-line bg-white">
          <EmptyState
            title="Tidak ada listing dengan id tersebut"
            description="Kembali ke daftar properti untuk memilih listing yang ingin diubah."
            action={
              <ActionButton as="link" href="/dashboard/penjual/properti" variant="forest">
                Buka Properti Saya
              </ActionButton>
            }
          />
        </section>
      </div>
    );
  }

  const status = LISTING_STATUS[property.listingStatus] ?? LISTING_STATUS.DRAFT;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Properti", "Ubah"]}
        title={property.title}
        description={`${property.cluster} · Unit ${property.unit} · Diperbarui ${formatDateTime(property.updatedAt)}`}
        meta={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge label={status.label} tone={status.tone} />
            <span className="text-[12px] text-ag-slate-muted">ID {property.id}</span>
          </span>
        }
        actions={
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            Kembali ke daftar
          </ActionButton>
        }
      />

      {property.listingStatus === "REJECTED" && property.rejectionReason ? (
        <p
          role="status"
          className="rounded-dash border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] leading-relaxed text-red-700"
        >
          <strong className="font-semibold">Alasan penolakan admin:</strong>{" "}
          {property.rejectionReason} Perbaiki data terkait lalu kirim ulang.
        </p>
      ) : null}

      <PropertyForm mode="edit" property={property} />
    </div>
  );
}
