import "server-only";

import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { logAuth } from "@/lib/logging/logger";

/**
 * Akses profil aplikasi. Semua fungsi mengembalikan hasil terstruktur agar
 * halaman auth bisa membedakan "belum dikonfigurasi", "database gagal", dan
 * "profil tidak ditemukan" tanpa melempar error ke pengguna.
 *
 * Skema `profiles` mengikuti SRS: tidak menyimpan email maupun status. Email
 * dibaca dari `auth.users`, sedangkan status diturunkan dari `is_active`.
 */

const PROFILE_SELECT = {
  id: true,
  fullName: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

/** Bentuk profil yang dipakai halaman: tambah email dan status turunan. */
function decorateProfile(profile, { email = null, agencyName = null } = {}) {
  if (!profile) return null;

  return {
    ...profile,
    email,
    agencyName,
    // Agen nonaktif diperlakukan sebagai menunggu persetujuan admin. Skema
    // SRS hanya punya is_active, jadi status "pending" diturunkan di sini.
    status: profile.isActive
      ? "active"
      : profile.role === "agent"
        ? "pending"
        : "inactive",
  };
}

/** Email dan metadata agen hanya ada di auth.users, bukan di profiles. */
async function findAuthDetails(db, id) {
  const rows = await db.$queryRaw`
    SELECT
      u.email,
      u.raw_user_meta_data->>'agency_name' AS "agencyName"
    FROM auth.users u
    WHERE u.id = ${id}::uuid
    LIMIT 1
  `;

  return rows[0] ?? {};
}

export async function findProfileById(id) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const db = getDb();
    const profile = await db.profile.findUnique({
      where: { id },
      select: PROFILE_SELECT,
    });

    if (!profile) {
      return { ok: true, profile: null };
    }

    const auth = await findAuthDetails(db, id);
    return { ok: true, profile: decorateProfile(profile, auth) };
  } catch (error) {
    logAuth("profile_read_failed", {
      userId: id,
      message: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, code: "db_error" };
  }
}

/**
 * Dibuat idempoten karena baris profil mungkin sudah dibuat oleh proses lain.
 * Role selalu `buyer`; jangan pernah membaca role dari form atau metadata.
 */
export async function upsertBuyerProfile({ id, fullName, phone }) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const profile = await getDb().profile.upsert({
      where: { id },
      update: { fullName, phone, role: "buyer", isActive: true },
      create: {
        id,
        fullName,
        phone,
        role: "buyer",
        isActive: true,
      },
      select: PROFILE_SELECT,
    });

    return { ok: true, profile: decorateProfile(profile) };
  } catch (error) {
    logAuth("profile_upsert_failed", {
      userId: id,
      message: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, code: "db_error" };
  }
}

/**
 * Profil agen baru dibuat nonaktif sampai admin mengaktifkannya. Role dan
 * status tidak pernah dibaca dari form. Nama agensi disimpan di metadata
 * Supabase (auth.users.raw_user_meta_data), bukan di tabel profiles.
 */
export async function upsertAgentProfile({ id, fullName, phone }) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const profile = await getDb().profile.upsert({
      where: { id },
      update: { fullName, phone, role: "agent" },
      create: {
        id,
        fullName,
        phone,
        role: "agent",
        isActive: false,
      },
      select: PROFILE_SELECT,
    });

    return { ok: true, profile: decorateProfile(profile) };
  } catch (error) {
    logAuth("profile_upsert_failed", {
      userId: id,
      message: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, code: "db_error" };
  }
}
