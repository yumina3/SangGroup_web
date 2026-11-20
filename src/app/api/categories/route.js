import { ok, withRoute } from "@/lib/http/api";
import { listPublicCategories } from "@/lib/services/categories";

/** Kategori aktif untuk filter katalog. */
export const GET = withRoute(async () => {
  return ok({ items: await listPublicCategories() });
});
