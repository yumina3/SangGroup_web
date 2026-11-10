import UserManager from "@/components/admin/UserManager";
import { requirePageUser } from "@/lib/auth/current-user";
import { listUsers } from "@/lib/services/admin";

export const metadata = { title: "Pengguna" };
export const instant = false;

export default async function AdminUsersPage() {
  const admin = await requirePageUser(["admin"]);
  const result = await listUsers({ page: 1, pageSize: 50 });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold">Pengguna</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          {result.total} akun terdaftar. Role dan status aktif hanya dapat diubah admin (FR-22, FR-41).
        </p>
      </div>
      <UserManager users={result.items} currentUserId={admin.id} />
    </div>
  );
}
