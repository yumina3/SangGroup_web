import { requireApiUser } from "@/lib/auth/current-user";
import { ok, withRoute } from "@/lib/http/api";
import { removePropertyImage, setPrimaryImage } from "@/lib/services/images";

/** Hapus satu foto listing. */
export const DELETE = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id, imageId } = await params;
  await removePropertyImage(user.id, id, imageId);
  return ok({ deleted: true });
});

/** Jadikan foto utama. */
export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id, imageId } = await params;
  await setPrimaryImage(user.id, id, imageId);
  return ok({ isPrimary: true });
});
