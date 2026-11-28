import UserManager from "@/components/admin/UserManager";
import { requireRole } from "@/lib/auth/session";
import { getUserRecap, listUsers } from "@/lib/services/admin";

export const metadata = { title: "Pengguna" };
export const instant = false;

/** Kelola akun dan peran pengguna di dalam shell dashboard admin (FR-41). */
export default async function AdminUsersPage() {
  const admin = await requireRole("admin", "/dashboard/admin/pengguna");

  const [result, recap] = await Promise.all([
    listUsers({ page: 1, pageSize: 500 }),
    getUserRecap(),
  ]);

  return (
    <UserManager
      users={result.items}
      currentUserId={admin.id}
      recap={recap}
    />
  );
}
