import { requireApiUser } from "@/lib/auth/current-user";
import { ok, readJson, readPagination, withRoute } from "@/lib/http/api";
import { createProperty, listAgentProperties } from "@/lib/services/properties";
import { propertyCreateSchema } from "@/lib/validators/domain";

/** Listing milik agen (FR-31, FR-34). */
export const GET = withRoute(async (request) => {
  const user = await requireApiUser(["agent"]);
  const { searchParams } = request.nextUrl;
  const { page, pageSize } = readPagination(searchParams, { defaultSize: 12 });

  return ok(
    await listAgentProperties(user.id, {
      page,
      pageSize,
      q: searchParams.get("q")?.trim() ?? "",
      verificationStatus: searchParams.get("verificationStatus") ?? "",
    }),
  );
});

/** Buat listing; otomatis masuk antrean verifikasi (BR-19). */
export const POST = withRoute(async (request) => {
  const user = await requireApiUser(["agent"]);
  const input = await readJson(request, propertyCreateSchema);
  return ok(await createProperty(user.id, input), { status: 201 });
});
