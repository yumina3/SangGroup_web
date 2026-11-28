import { redirect } from "next/navigation";

export const metadata = { title: "Pengguna" };

/** Rute lama dipertahankan agar tautan/bookmark tetap bekerja. */
export default function LegacyAdminUsersPage() {
  redirect("/dashboard/admin/pengguna");
}
