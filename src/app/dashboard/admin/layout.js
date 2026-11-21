import AdminShell from "@/components/admin/AdminShell";
import { adminLogoutAction } from "@/app/(auth)/logout/actions";
import { requireRole } from "@/lib/auth/session";

export const metadata = {
  title: { default: "Portal Admin", template: "%s — SANG Group" },
};

/** Layout ini membaca sesi di setiap request. */
export const instant = false;

export default async function AdminLayout({ children }) {
  const profile = await requireRole("admin", "/dashboard/admin");

  return (
    <AdminShell profile={profile} logoutAction={adminLogoutAction}>
      {children}
    </AdminShell>
  );
}
