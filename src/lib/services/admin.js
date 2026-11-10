import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { logger } from "@/lib/logging/logger";
import { getEmailsByIds } from "@/lib/services/properties";
import { getSupabaseAdmin, isServiceRoleConfigured } from "@/lib/supabase/admin";

/**
 * Pengelolaan pengguna oleh admin (FR-41).
 *
 * Role dan status aktif hanya bisa diubah di sini; trigger database juga
 * menolak perubahan dari klien biasa.
 */

export async function listUsers({ role = "", q = "", page = 1, pageSize = 20 } = {}) {
  const db = getDb();
  const where = {
    ...(role ? { role } : {}),
    ...(q ? { fullName: { contains: q, mode: "insensitive" } } : {}),
  };

  const [total, rows] = await db.$transaction([
    db.profile.count({ where }),
    db.profile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
  ]);

  const emails = await getEmailsByIds(rows.map((row) => row.id));

  return {
    items: rows.map((row) => ({
      ...row,
      email: emails.get(row.id) ?? "",
      createdAt: row.createdAt.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Ubah role/status pengguna.
 * Admin tidak boleh menurunkan dirinya sendiri atau menonaktifkan admin terakhir.
 */
export async function updateUser(adminId, userId, { role, isActive }) {
  const db = getDb();
  const user = await db.profile.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });
  if (!user) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Pengguna tidak ditemukan.", { status: 404 });
  }

  if (userId === adminId && (role !== undefined || isActive === false)) {
    throw new AppError(
      ERROR_CODES.FORBIDDEN,
      "Anda tidak bisa mengubah role atau menonaktifkan akun sendiri.",
      { status: 403 },
    );
  }

  if (isActive === false && user.role === "admin") {
    const activeAdmins = await db.profile.count({ where: { role: "admin", isActive: true } });
    if (activeAdmins <= 1) {
      throw new AppError(ERROR_CODES.CONFLICT, "Minimal harus ada satu admin aktif.", {
        status: 409,
      });
    }
  }

  const updated = await db.profile.update({
    where: { id: userId },
    data: {
      ...(role !== undefined ? { role } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
    select: { id: true, role: true, isActive: true },
  });

  logger.info(
    { event: "admin.user_updated", userId, by: adminId, role, isActive },
    "Pengguna diubah",
  );
  return updated;
}

/**
 * Buat akun staf (agen/admin) memakai Supabase Admin API.
 * Trigger `handle_new_user` membuat profil; role lalu diperbarui.
 */
export async function createStaffUser({ email, password, fullName, phone, role }) {
  if (!isServiceRoleConfigured()) {
    throw new AppError(
      ERROR_CODES.NOT_CONFIGURED,
      "SUPABASE_SERVICE_ROLE_KEY belum diisi di server.",
      { status: 503 },
    );
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, phone: phone ?? null },
  });

  if (error || !data.user) {
    throw new AppError(ERROR_CODES.CONFLICT, error?.message ?? "Gagal membuat akun staf.", {
      status: 409,
    });
  }

  const db = getDb();
  await db.profile.upsert({
    where: { id: data.user.id },
    create: {
      id: data.user.id,
      fullName,
      phone: phone ?? null,
      role,
      isActive: true,
    },
    update: { role, fullName, phone: phone ?? null },
  });

  return { id: data.user.id, email, role };
}

/** Daftar pengajuan terbaru untuk rekap admin. */
export async function listRecentInquiriesForAdmin(limit = 10) {
  const db = getDb();
  const rows = await db.propertyInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      buyer: { select: { fullName: true } },
      property: { select: { title: true, slug: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    inquiryType: row.inquiryType,
    createdAt: row.createdAt.toISOString(),
    buyerName: row.buyer.fullName,
    propertyTitle: row.property.title,
    propertySlug: row.property.slug,
  }));
}
