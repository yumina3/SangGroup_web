import ActionButton from "@/components/dashboard/ActionButton";
import PageHeader from "@/components/dashboard/PageHeader";
import PropertyForm from "@/components/dashboard/property/PropertyForm";

export const metadata = { title: "Tambah Listing Baru" };

/**
 * Formulir listing baru (SRS-F-SEL-03 s.d. SEL-06).
 *
 * Navbar/sidebar agen berasal dari layout `/dashboard` — halaman ini tidak
 * membuat topbar sendiri. Formulirnya komponen klien karena peta Leaflet dan
 * pratinjau foto hanya bisa berjalan di browser.
 */
export default function NewPropertyPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Properti", "Tambah"]}
        title="Tambah Listing Baru"
        description="Lengkapi data unit, unggah foto, dan tandai titik lokasi. Listing baru masuk antrean verifikasi admin sebelum tayang di katalog."
        actions={
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            Kembali ke daftar
          </ActionButton>
        }
      />

      <PropertyForm mode="create" />
    </div>
  );
}
