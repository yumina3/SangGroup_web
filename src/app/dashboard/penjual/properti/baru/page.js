import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import PropertyFormSrs from "@/components/dashboard/property/PropertyFormSrs";
import { requirePageUser } from "@/lib/auth/current-user";
import { listPublicCategories } from "@/lib/services/categories";
import { listPublicProjects } from "@/lib/services/projects";

export const metadata = { title: "Tambah Listing Baru" };
export const instant = false;

/** Form listing baru (FR-31, FR-33). */
export default async function NewPropertyPage() {
  await requirePageUser(["agent"]);
  const [projects, categories] = await Promise.all([listPublicProjects(), listPublicCategories()]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Properti", "Tambah"]}
        title="Tambah Listing Baru"
        description="Lengkapi proyek, kategori, harga, spesifikasi, dan titik lokasi. Listing baru masuk antrean verifikasi admin sebelum tayang di katalog."
        actions={
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            Kembali ke daftar
          </ActionButton>
        }
      />

      <PropertyFormSrs mode="create" projects={projects} categories={categories} />
    </div>
  );
}
