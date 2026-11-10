import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, withRoute } from "@/lib/http/api";
import { addFavorite, listFavorites, removeFavorite } from "@/lib/services/favorites";
import { favoriteSchema } from "@/lib/validators/domain";

/** Favorit pembeli (FR-25..FR-26). */
export const GET = withRoute(async () => {
  const user = await requireApiUser(["buyer"]);
  return ok({ items: await listFavorites(user.id) });
});

export const POST = withRoute(async (request) => {
  const user = await requireApiUser(["buyer"]);
  const { propertyId } = await readJson(request, favoriteSchema);
  const favorite = await addFavorite(user.id, propertyId);
  return ok({ id: favorite.id, propertyId }, { status: 201 });
});

export const DELETE = withRoute(async (request) => {
  const user = await requireApiUser(["buyer"]);
  const propertyId = request.nextUrl.searchParams.get("propertyId");
  if (!propertyId) {
    return ok({ removed: false });
  }
  await removeFavorite(user.id, propertyId);
  return ok({ removed: true });
});
