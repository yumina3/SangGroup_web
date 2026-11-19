"use server";

import { revalidatePath } from "next/cache";

import { getSessionProfile } from "@/lib/auth/session";
import {
  findPublicProperty,
  removeFavoriteRecord,
  toggleFavoriteRecord,
} from "@/lib/properties/catalog";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function failure(code, message) {
  return { ok: false, code, message };
}

function sessionFailure(profile) {
  if (!profile) {
    return failure(
      "unauthenticated",
      "Masuk sebagai pembeli untuk menyimpan properti ke favorit.",
    );
  }
  if (profile.role !== "buyer") {
    return failure(
      "forbidden",
      "Favorit hanya tersedia untuk akun pembeli.",
    );
  }
  if (profile.status !== "active") {
    return failure(
      "inactive",
      "Akun Anda belum aktif. Hubungi admin SANG Group untuk mengaktifkannya.",
    );
  }
  return null;
}

/**
 * Semua aksi favorit melewati pemeriksaan yang sama: sesi dari cookie,
 * role/status dari database, properti harus berstatus approved, lalu operasi
 * tulis memakai id dari sesi (bukan dari klien) agar tidak bisa memalsukan
 * pemilik favorit.
 */
async function mutateFavorite(propertyId, mutate) {
  const profile = await getSessionProfile();
  const authError = sessionFailure(profile);
  if (authError) return authError;

  if (typeof propertyId !== "string" || !UUID_PATTERN.test(propertyId)) {
    return failure("invalid", "Properti tidak valid.");
  }

  const found = await findPublicProperty(propertyId);
  if (!found.ok) {
    return failure(
      found.code === "db_not_configured" ? "db_not_configured" : "db_error",
      "Favorit belum dapat disimpan. Coba lagi sebentar.",
    );
  }
  if (!found.property) {
    return failure(
      "not_found",
      "Properti tidak ditemukan atau belum tayang di katalog.",
    );
  }

  const result = await mutate(profile.id, propertyId);
  if (!result.ok) {
    return failure(
      result.code === "db_not_configured" ? "db_not_configured" : "db_error",
      "Favorit belum dapat disimpan. Coba lagi sebentar.",
    );
  }

  revalidatePath("/");
  revalidatePath("/sang-dipa");
  revalidatePath("/dashboard/pembeli");
  revalidatePath("/dashboard/pembeli/favorit");

  return { ok: true, favorited: Boolean(result.favorited) };
}

export async function toggleFavoriteAction(propertyId) {
  return mutateFavorite(propertyId, toggleFavoriteRecord);
}

export async function removeFavoriteAction(propertyId) {
  return mutateFavorite(propertyId, async (buyerId, id) => {
    const result = await removeFavoriteRecord(buyerId, id);
    return result.ok ? { ok: true, favorited: false } : result;
  });
}
