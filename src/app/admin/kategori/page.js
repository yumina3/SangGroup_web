import { redirect } from "next/navigation";

export const metadata = { title: "Kategori" };

/** Rute lama dipertahankan agar tautan/bookmark tetap bekerja. */
export default function LegacyAdminCategoriesPage() {
  redirect("/dashboard/admin/kategori");
}
