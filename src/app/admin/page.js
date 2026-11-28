import { redirect } from "next/navigation";

/**
 * Rute lama `/admin` digantikan portal admin `/dashboard/admin/rekap`.
 * Dipertahankan sebagai pengalihan agar tautan/bookmark lama tidak 404,
 * sehingga rekap properti hanya punya satu desain (docs/admin/property_recap).
 */
export default function LegacyAdminPage() {
  redirect("/dashboard/admin/rekap");
}
