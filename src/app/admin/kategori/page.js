import CategoryManager from "@/components/admin/CategoryManager";
import { requirePageUser } from "@/lib/auth/current-user";
import { listAllCategories } from "@/lib/services/categories";

export const metadata = { title: "Kategori" };
export const instant = false;

export default async function AdminCategoriesPage() {
  await requirePageUser(["admin"]);
  const categories = await listAllCategories();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-bold">Kategori properti</h1>
        <p className="mt-1 text-[13px] text-ag-slate-secondary">
          Kategori dipakai agen saat membuat listing dan sebagai filter katalog publik.
        </p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
