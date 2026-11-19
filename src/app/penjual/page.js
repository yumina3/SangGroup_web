import { redirect } from "next/navigation";

export const metadata = { title: "Portal Penjual" };

/**
 * Alias lama `/penjual` dipertahankan agar tautan lama tetap bekerja.
 * Portal login penjual yang baru ada di `/login-agen`.
 */
export default function PenjualAliasPage() {
  redirect("/login-agen");
}
