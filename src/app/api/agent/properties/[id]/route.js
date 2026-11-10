import { requireApiUser } from "@/lib/auth/current-user";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, readJson, withRoute } from "@/lib/http/api";
import {
  deleteProperty,
  getAgentProperty,
  updateProperty,
} from "@/lib/services/properties";
import { propertyUpdateSchema } from "@/lib/validators/domain";

export const GET = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  const property = await getAgentProperty(user.id, id);
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  return ok(property);
});

/** Ubah listing milik sendiri; field kunci mengembalikan ke verifikasi. */
export const PATCH = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  const input = await readJson(request, propertyUpdateSchema);
  return ok(await updateProperty(user.id, id, input));
});

export const DELETE = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  await deleteProperty(user.id, id);
  return ok({ deleted: true });
});
