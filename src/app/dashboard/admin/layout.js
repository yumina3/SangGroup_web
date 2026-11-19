import AccountShell from "@/components/dashboard/AccountShell";
import { adminLogoutAction } from "@/app/(auth)/logout/actions";
import { requireRole } from "@/lib/auth/session";

const NAV = [
  { label: "Ringkasan", href: "/dashboard/admin" },
  { label: "Situs Publik", href: "/" },
];

/** Membaca sesi di setiap request. */
export const instant = false;

export default async function AdminLayout({ children }) {
  const profile = await requireRole("admin", "/dashboard/admin");

  return (
    <AccountShell
      portal="Portal Admin"
      profile={profile}
      nav={NAV}
      logoutAction={adminLogoutAction}
    >
      {children}
    </AccountShell>
  );
}
