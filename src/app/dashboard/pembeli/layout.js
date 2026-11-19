import AccountShell from "@/components/dashboard/AccountShell";
import { buyerLogoutAction } from "@/app/(auth)/logout/actions";
import { requireRole } from "@/lib/auth/session";

const NAV = [
  { label: "Ringkasan", href: "/dashboard/pembeli" },
  { label: "Favorit", href: "/dashboard/pembeli/favorit" },
  { label: "Jadwal Kunjungan", href: "/dashboard/pembeli/jadwal" },
  { label: "Status Minat", href: "/dashboard/pembeli/status" },
  { label: "Pesan", href: "/dashboard/pembeli/pesan" },
  { label: "Jelajahi Properti", href: "/sang-dipa" },
];

/** Membaca sesi di setiap request. */
export const instant = false;

export default async function BuyerLayout({ children }) {
  const profile = await requireRole("buyer", "/dashboard/pembeli");

  return (
    <AccountShell
      portal="Akun Pembeli"
      profile={profile}
      nav={NAV}
      logoutAction={buyerLogoutAction}
    >
      {children}
    </AccountShell>
  );
}
