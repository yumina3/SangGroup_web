import "server-only";

import { getDb } from "@/lib/db/client";
import {
  ACTIVE_INQUIRY_STATUSES,
  INQUIRY_TRANSITIONS,
} from "@/lib/domain/inquiry-status";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { logger } from "@/lib/logging/logger";
import { enqueueAll, NOTIFICATION_TYPES } from "@/lib/services/notifications";
import { publicImageUrl } from "@/lib/storage/supabase-storage";

/**
 * Pengajuan kunjungan/minat beli (SRS §3.5, §7, VL-13..VL-18).
 */

export { ACTIVE_INQUIRY_STATUSES, INQUIRY_TRANSITIONS };


const INQUIRY_INCLUDE = {
  property: {
    include: {
      project: { select: { id: true, name: true, slug: true } },
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
    },
  },
  buyer: { select: { id: true, fullName: true, phone: true } },
  updates: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      oldStatus: true,
      newStatus: true,
      note: true,
      createdAt: true,
      actor: { select: { id: true, fullName: true } },
    },
  },
};

function serializeInquiry(inquiry, { includeBuyerContact = false } = {}) {
  const primary = inquiry.property.images?.[0] ?? null;
  return {
    id: inquiry.id,
    inquiryType: inquiry.inquiryType,
    message: inquiry.message,
    status: inquiry.status,
    createdAt: inquiry.createdAt.toISOString(),
    updatedAt: inquiry.updatedAt.toISOString(),
    property: {
      id: inquiry.property.id,
      slug: inquiry.property.slug,
      title: inquiry.property.title,
      price: Number(inquiry.property.price),
      businessStatus: inquiry.property.businessStatus,
      project: inquiry.property.project,
      primaryImageUrl: primary ? publicImageUrl(primary.storagePath) : null,
    },
    buyer: {
      id: inquiry.buyer.id,
      fullName: inquiry.buyer.fullName,
      ...(includeBuyerContact ? { phone: inquiry.buyer.phone } : {}),
    },
    updates: inquiry.updates.map((update) => ({
      id: update.id,
      oldStatus: update.oldStatus,
      newStatus: update.newStatus,
      note: update.note,
      actorName: update.actor?.fullName ?? null,
      createdAt: update.createdAt.toISOString(),
    })),
  };
}

/**
 * Pembeli mengirim pengajuan (FR-27, FR-30).
 * @param {string} buyerId
 * @param {{ propertyId: string, inquiryType: "kunjungan"|"minat_beli", message?: string }} input
 */
export async function createInquiry(buyerId, input) {
  const db = getDb();
  const property = await db.property.findFirst({
    where: { id: input.propertyId, verificationStatus: "approved" },
    select: {
      id: true,
      title: true,
      ownerId: true,
      businessStatus: true,
    },
  });

  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Properti tidak ditemukan di katalog.", {
      status: 404,
    });
  }
  if (property.businessStatus === "terjual") {
    throw new AppError(ERROR_CODES.CONFLICT, "Properti ini sudah terjual.", { status: 409 });
  }
  if (property.ownerId === buyerId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, "Anda tidak bisa mengajukan properti sendiri.", {
      status: 403,
    });
  }

  try {
    const { inquiryId, notificationId } = await db.$transaction(async (tx) => {
      const inquiry = await tx.propertyInquiry.create({
        data: {
          buyerId,
          propertyId: input.propertyId,
          inquiryType: input.inquiryType,
          message: input.message ? input.message : null,
          status: "menunggu",
        },
        select: { id: true },
      });

      await tx.inquiryUpdate.create({
        data: {
          inquiryId: inquiry.id,
          actorId: buyerId,
          oldStatus: null,
          newStatus: "menunggu",
          note: null,
        },
      });

      const notification = await tx.notification.create({
        data: {
          userId: property.ownerId,
          type: NOTIFICATION_TYPES.INQUIRY_CREATED,
          title:
            input.inquiryType === "kunjungan"
              ? "Permintaan kunjungan baru"
              : "Minat beli baru",
          body: `${property.title} — segera tindak lanjuti di dashboard.`,
          url: "/dashboard/penjual/pengajuan",
          dedupeKey: `inquiry:${inquiry.id}:created`,
        },
        select: { id: true },
      });

      return { inquiryId: inquiry.id, notificationId: notification.id };
    });

    await enqueueAll([notificationId]);
    logger.info(
      { event: "inquiry.created", inquiryId, ownerId: property.ownerId },
      "Pengajuan baru",
    );

    return getInquiryForUser({ id: buyerId, role: "buyer" }, inquiryId);
  } catch (error) {
    if (error?.code === "P2002") {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "Sudah ada pengajuan aktif untuk properti ini. Tunggu tanggapan agen.",
        { status: 409 },
      );
    }
    throw error;
  }
}

/** Ambil pengajuan yang boleh dilihat pengguna (FR-29, BH-23). */
export async function getInquiryForUser(user, inquiryId) {
  const db = getDb();
  const inquiry = await db.propertyInquiry.findFirst({
    where: {
      id: inquiryId,
      ...(user.role === "admin"
        ? {}
        : user.role === "agent"
          ? { property: { ownerId: user.id } }
          : { buyerId: user.id }),
    },
    include: INQUIRY_INCLUDE,
  });

  if (!inquiry) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Pengajuan tidak ditemukan.", { status: 404 });
  }

  return serializeInquiry(inquiry, { includeBuyerContact: user.role !== "buyer" });
}

/** Daftar pengajuan milik pembeli. */
export async function listBuyerInquiries(buyerId, { page = 1, pageSize = 20 } = {}) {
  const db = getDb();
  const where = { buyerId };

  const [total, rows] = await db.$transaction([
    db.propertyInquiry.count({ where }),
    db.propertyInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: INQUIRY_INCLUDE,
    }),
  ]);

  return {
    items: rows.map((row) => serializeInquiry(row)),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Daftar pengajuan untuk listing milik agen (FR-35). */
export async function listAgentInquiries(
  agentId,
  { page = 1, pageSize = 20, status = "", inquiryType = "" } = {},
) {
  const db = getDb();
  const where = {
    property: { ownerId: agentId },
    ...(status ? { status } : {}),
    ...(inquiryType ? { inquiryType } : {}),
  };

  const [total, rows] = await db.$transaction([
    db.propertyInquiry.count({ where }),
    db.propertyInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: INQUIRY_INCLUDE,
    }),
  ]);

  return {
    items: rows.map((row) => serializeInquiry(row, { includeBuyerContact: true })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Rekap pengajuan untuk admin (FR-42). */
export async function listAllInquiries({ page = 1, pageSize = 20, status = "" } = {}) {
  const db = getDb();
  const where = status ? { status } : {};
  const [total, rows] = await db.$transaction([
    db.propertyInquiry.count({ where }),
    db.propertyInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: INQUIRY_INCLUDE,
    }),
  ]);

  return {
    items: rows.map((row) => serializeInquiry(row, { includeBuyerContact: true })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Agen/admin memperbarui status pengajuan (FR-36, VL-17).
 * @param {{ id: string, role: string }} actor
 */
export async function updateInquiryStatus(actor, inquiryId, { status, note = "" }) {
  const db = getDb();

  const inquiry = await db.propertyInquiry.findFirst({
    where: {
      id: inquiryId,
      ...(actor.role === "admin" ? {} : { property: { ownerId: actor.id } }),
    },
    include: {
      property: { select: { title: true, ownerId: true } },
    },
  });
  if (!inquiry) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Pengajuan tidak ditemukan.", { status: 404 });
  }

  const allowed = INQUIRY_TRANSITIONS[inquiry.status] ?? [];
  if (!allowed.includes(status) || status === "dibatalkan") {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Status ${inquiry.status} tidak bisa diubah menjadi ${status}.`,
      { status: 409 },
    );
  }

  const notificationId = await db.$transaction(async (tx) => {
    const updated = await tx.propertyInquiry.updateMany({
      where: { id: inquiryId, status: inquiry.status },
      data: { status },
    });
    if (updated.count === 0) {
      throw new AppError(ERROR_CODES.CONFLICT, "Pengajuan sudah berubah. Muat ulang halaman.", {
        status: 409,
      });
    }

    const event = await tx.inquiryUpdate.create({
      data: {
        inquiryId,
        actorId: actor.id,
        oldStatus: inquiry.status,
        newStatus: status,
        note: note ? note.slice(0, 500) : null,
      },
      select: { id: true },
    });

    const notification = await tx.notification.create({
      data: {
        userId: inquiry.buyerId,
        type: NOTIFICATION_TYPES.INQUIRY_STATUS,
        title:
          status === "selesai"
            ? "Pengajuan Anda selesai"
            : status === "ditolak"
              ? "Pengajuan Anda ditolak"
              : "Ada kabar dari agen",
        body: `${inquiry.property.title} — status pengajuan kini ${status.replaceAll("_", " ")}.`,
        url: "/akun",
        dedupeKey: `inquiry:${inquiryId}:event:${event.id}`,
      },
      select: { id: true },
    });

    return notification.id;
  });

  await enqueueAll([notificationId]);
  logger.info(
    { event: "inquiry.status", inquiryId, status, actorId: actor.id },
    "Status pengajuan",
  );

  return getInquiryForUser(actor, inquiryId);
}

/** Pembeli membatalkan pengajuan aktif (BR-29). */
export async function cancelInquiry(buyerId, inquiryId, reason = "") {
  const db = getDb();
  const inquiry = await db.propertyInquiry.findFirst({
    where: { id: inquiryId, buyerId },
    include: { property: { select: { title: true, ownerId: true } } },
  });
  if (!inquiry) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Pengajuan tidak ditemukan.", { status: 404 });
  }
  if (!ACTIVE_INQUIRY_STATUSES.includes(inquiry.status)) {
    throw new AppError(ERROR_CODES.CONFLICT, "Pengajuan ini sudah final.", { status: 409 });
  }

  const notificationId = await db.$transaction(async (tx) => {
    const updated = await tx.propertyInquiry.updateMany({
      where: { id: inquiryId, status: inquiry.status },
      data: { status: "dibatalkan" },
    });
    if (updated.count === 0) {
      throw new AppError(ERROR_CODES.CONFLICT, "Pengajuan sudah berubah.", { status: 409 });
    }

    const event = await tx.inquiryUpdate.create({
      data: {
        inquiryId,
        actorId: buyerId,
        oldStatus: inquiry.status,
        newStatus: "dibatalkan",
        note: reason ? reason.slice(0, 500) : null,
      },
      select: { id: true },
    });

    const notification = await tx.notification.create({
      data: {
        userId: inquiry.property.ownerId,
        type: NOTIFICATION_TYPES.INQUIRY_CANCELLED,
        title: "Pengajuan dibatalkan pembeli",
        body: inquiry.property.title,
        url: "/dashboard/penjual/pengajuan",
        dedupeKey: `inquiry:${inquiryId}:event:${event.id}`,
      },
      select: { id: true },
    });

    return notification.id;
  });

  await enqueueAll([notificationId]);
  return getInquiryForUser({ id: buyerId, role: "buyer" }, inquiryId);
}

// --- Adapter status lama untuk UI dashboard (sementara) -----------------

const LEGACY_TO_SRS = {
  CONFIRMED: "dihubungi",
  RESCHEDULED: "kunjungan_dijadwalkan",
  REJECTED: "ditolak",
  COMPLETED: "selesai",
};

/** Dipakai Server Action pengajuan versi UI lama. */
export async function sellerTransition(agentId, inquiryId, input) {
  const status = LEGACY_TO_SRS[input.next];
  if (!status) {
    throw new AppError(ERROR_CODES.VALIDATION, "Status tindak lanjut tidak dikenal.", {
      status: 422,
    });
  }
  return updateInquiryStatus({ id: agentId, role: "agent" }, inquiryId, {
    status,
    note: input.note ?? "",
  });
}
