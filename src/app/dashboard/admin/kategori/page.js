import CategoryManager from "@/components/admin/CategoryManager";
import { requireRole } from "@/lib/auth/session";
import { listAllCategories } from "@/lib/services/categories";

export const metadata = { title: "Kategori" };
export const instant = false;

/** Master data kategori properti di dalam shell dashboard admin (FR-40). */
export default async function AdminCategoriesPage() {
  await requireRole("admin", "/dashboard/admin/kategori");
  const categories = await listAllCategories();

  return <CategoryManager categories={categories} />;
}
