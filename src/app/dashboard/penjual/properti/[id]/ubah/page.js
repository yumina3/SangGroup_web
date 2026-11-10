import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import PropertyFormSrs from "@/components/dashboard/property/PropertyFormSrs";
import { EmptyState } from "@/components/dashboard/States";
import { requirePageUser } from "@/lib/auth/current-user";
import { listPublicCategories } from "@/lib/services/categories";
import { getAgentProperty } from "@/lib/services/properties";
import { listPublicProjects } from "@/lib/services/projects";

export const instant = false;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const user = await requirePageUser(["agent"]);
  const property = await getAgentProperty(user.id, id);
  return { title: property ? `Ubah — ${property.title}` : "Ubah Properti" };
}

/** Halaman ubah listing milik agen (FR-32, FR-34). */
export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  const user = await requirePageUser(["agent"]);
  const [property, projects, categories] = await Promise.all([
    getAgentProperty(user.id, id),
    listPublicProjects(),
    listPublicCategories(),
  ]);

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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Properti", "Ubah"]}
        title={property.title}
        description={`${property.project?.name ?? "—"} · ${property.slug}`}
        actions={
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            Kembali ke daftar
          </ActionButton>
        }
      />

      <PropertyFormSrs mode="edit" property={property} projects={projects} categories={categories} />
    </div>
  );
}
