import "server-only";

import { randomUUID } from "node:crypto";

import { AppError, ERROR_CODES } from "@/lib/errors";
import { getSupabaseAdmin, isServiceRoleConfigured } from "@/lib/supabase/admin";

/**
 * Penyimpanan foto properti di Supabase Storage (BR-05).
 *
 * Bucket bersifat publik untuk foto katalog (FR-47); tabel hanya menyimpan
 * `storage_path`, bukan isi berkas/Base64.
 */

export const IMAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "property-images";
export const MAX_IMAGES_PER_PROPERTY = 8;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const EXTENSION = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isStorageConfigured() {
  return isServiceRoleConfigured();
}

/** URL publik untuk foto katalog. */
export function publicImageUrl(storagePath) {
  if (!storagePath || !isStorageConfigured()) return null;
  const { data } = getSupabaseAdmin().storage.from(IMAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export function validateImageFile({ contentType, sizeBytes }) {
  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new AppError(
      ERROR_CODES.VALIDATION,
      "Foto harus berformat JPG, PNG, atau WEBP.",
      { status: 422, fieldErrors: { file: "Format foto tidak didukung" } },
    );
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0 || sizeBytes > MAX_IMAGE_BYTES) {
    throw new AppError(ERROR_CODES.VALIDATION, "Ukuran foto maksimal 5 MB.", {
      status: 422,
      fieldErrors: { file: "Ukuran foto maksimal 5 MB" },
    });
  }
}

/** @param {{ propertyId: string, contentType: string, buffer: Buffer }} input */
export async function uploadPropertyImage({ propertyId, contentType, buffer }) {
  if (!isStorageConfigured()) {
    throw new AppError(
      ERROR_CODES.NOT_CONFIGURED,
      "Supabase Storage belum dikonfigurasi (SUPABASE_SERVICE_ROLE_KEY).",
      { status: 503 },
    );
  }

  const extension = EXTENSION[contentType] ?? "bin";
  const storagePath = `properties/${propertyId}/${randomUUID()}.${extension}`;

  const { error } = await getSupabaseAdmin()
    .storage.from(IMAGE_BUCKET)
    .upload(storagePath, buffer, { contentType, upsert: false });

  if (error) {
    throw new AppError(ERROR_CODES.INTERNAL, "Gagal mengunggah foto ke storage.", {
      status: 502,
      cause: error,
    });
  }

  return storagePath;
}

export async function deletePropertyImageFile(storagePath) {
  if (!storagePath || !isStorageConfigured()) return false;
  const { error } = await getSupabaseAdmin().storage.from(IMAGE_BUCKET).remove([storagePath]);
  return !error;
}
