import { requireApiUser } from "@/lib/auth/current-user";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { ok, withRoute } from "@/lib/http/api";
import { addPropertyImage, listPropertyImages } from "@/lib/services/images";

export const GET = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;
  return ok({ items: await listPropertyImages(user.id, id) });
});

/**
 * Unggah satu foto (multipart/form-data, field `file`, opsional `altText`).
 * Validasi tipe/ukuran/jumlah/kepemilikan di server (FR-44..FR-48).
 */
export const POST = withRoute(async (request, { params }) => {
  const user = await requireApiUser(["agent"]);
  const { id } = await params;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    throw new AppError(ERROR_CODES.VALIDATION, "Berkas foto wajib dikirim pada field `file`.", {
      status: 422,
      fieldErrors: { file: "Berkas foto wajib diunggah" },
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await addPropertyImage(user.id, id, {
    contentType: file.type,
    sizeBytes: file.size,
    buffer,
    altText: typeof form.get("altText") === "string" ? form.get("altText") : "",
  });

  return ok(image, { status: 201 });
});
