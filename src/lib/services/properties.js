import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { logger } from "@/lib/logging/logger";
import { enqueueAll, NOTIFICATION_TYPES } from "@/lib/services/notifications";
import { deletePropertyImageFile, publicImageUrl } from "@/lib/storage/supabase-storage";
import { slugify } from "@/lib/slug";

/**
 * Modul properti sesuai SRS §7.
 *
 * Aturan penting:
 * - listing baru selalu `pending` dan tidak tampil publik (BR-19);
 * - agen hanya mengelola listing miliknya (BR-18, FR-37);
 * - perubahan harga/koordinat/proyek/kategori/alamat pada listing approved
 *   mengembalikannya ke `pending` (BR-22);
 * - status bisnis `terjual` final (dijaga trigger database);
 * - publik hanya melihat `verification_status = approved` (FR-06).
 */

export const ACTIVE_INQUIRY_STATUSES = ["menunggu", "dihubungi", "kunjungan_dijadwalkan"];

const LISTING_INCLUDE = {
  project: { select: { id: true, name: true, slug: true, address: true } },
  category: { select: { id: true, name: true, slug: true } },
  owner: { select: { id: true, fullName: true } },
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
};

const CARD_INCLUDE = {
  project: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
  _count: {
    select: { inquiries: { where: { status: { in: ACTIVE_INQUIRY_STATUSES } } } },
  },
};

export function serializeImage(image) {
  return {
    id: image.id,
    storagePath: image.storagePath,
    url: publicImageUrl(image.storagePath),
    altText: image.altText,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
  };
}

/** Bentuk data publik: tanpa kontak agen (NF-14). */
export function serializePublicProperty(property) {
  const images = property.images ?? [];
  const primary = images.find((image) => image.isPrimary) ?? images[0] ?? null;
  return {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    price: Number(property.price),
    landArea: property.landArea,
    buildingArea: property.buildingArea,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    address: property.address,
    latitude: property.latitude === null ? null : Number(property.latitude),
    longitude: property.longitude === null ? null : Number(property.longitude),
    businessStatus: property.businessStatus,
    verificationStatus: property.verificationStatus,
    project: property.project,
    category: property.category,
    primaryImageUrl: primary ? publicImageUrl(primary.storagePath) : null,
    images: images.map(serializeImage),
    activeInquiries: property._count?.inquiries ?? 0,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

function serializeAgentProperty(property) {
  return {
    ...serializePublicProperty(property),
    owner: property.owner,
    verificationNote: property.verificationNote,
    verifiedAt: property.verifiedAt?.toISOString() ?? null,
  };
}

async function uniquePropertySlug(base, excludeId = null) {
  const db = getDb();
  const normalized = slugify(base, "properti");
  let candidate = normalized;
  for (let suffix = 2; suffix <= 99; suffix += 1) {
    const existing = await db.property.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${normalized}-${suffix}`;
  }
  throw new AppError(ERROR_CODES.CONFLICT, "Slug listing tidak bisa dibuat unik.", { status: 409 });
}

function decimalOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(6) : null;
}

function propertyWriteData(input) {
  const data = {};
  if (input.projectId !== undefined) data.projectId = input.projectId;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = BigInt(Math.round(input.price));
  if (input.landArea !== undefined) data.landArea = input.landArea;
  if (input.buildingArea !== undefined) data.buildingArea = input.buildingArea;
  if (input.bedrooms !== undefined) data.bedrooms = input.bedrooms;
  if (input.bathrooms !== undefined) data.bathrooms = input.bathrooms;
  if (input.address !== undefined) data.address = input.address;
  if (input.latitude !== undefined) data.latitude = decimalOrNull(input.latitude);
  if (input.longitude !== undefined) data.longitude = decimalOrNull(input.longitude);
  return data;
}

const KEY_FIELDS = ["price", "latitude", "longitude", "projectId", "categoryId", "address"];

// --- Publik -------------------------------------------------------------

/**
 * Katalog publik: hanya listing approved, dengan filter dan pagination.
 * Filter katalog dan peta memakai query yang sama (FR-11).
 */
export async function listPublicProperties({
  page = 1,
  pageSize = 12,
  q = "",
  project = "",
  category = "",
  minPrice = null,
  maxPrice = null,
  minLand = null,
  maxLand = null,
  minBuilding = null,
  maxBuilding = null,
  businessStatus = "",
} = {}) {
  const db = getDb();
  const where = {
    verificationStatus: "approved",
    ...(project ? { project: { slug: project } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(businessStatus ? { businessStatus } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(minPrice !== null || maxPrice !== null
      ? {
          price: {
            ...(minPrice !== null ? { gte: BigInt(Math.round(minPrice)) } : {}),
            ...(maxPrice !== null ? { lte: BigInt(Math.round(maxPrice)) } : {}),
          },
        }
      : {}),
    ...(minLand !== null || maxLand !== null
      ? {
          landArea: {
            ...(minLand !== null ? { gte: minLand } : {}),
            ...(maxLand !== null ? { lte: maxLand } : {}),
          },
        }
      : {}),
    ...(minBuilding !== null || maxBuilding !== null
      ? {
          buildingArea: {
            ...(minBuilding !== null ? { gte: minBuilding } : {}),
            ...(maxBuilding !== null ? { lte: maxBuilding } : {}),
          },
        }
      : {}),
  };

  const [total, rows] = await db.$transaction([
    db.property.count({ where }),
    db.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: CARD_INCLUDE,
    }),
  ]);

  return {
    items: rows.map(serializePublicProperty),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/** Detail publik berdasarkan slug (FR-15, FR-19). */
export async function getPublicPropertyBySlug(slug) {
  const db = getDb();
  const property = await db.property.findFirst({
    where: { slug, verificationStatus: "approved" },
    include: LISTING_INCLUDE,
  });

  return property ? serializePublicProperty(property) : null;
}

// --- Agen ---------------------------------------------------------------

export async function listAgentProperties(
  agentId,
  { page = 1, pageSize = 12, q = "", verificationStatus = "" } = {},
) {
  const db = getDb();
  const where = {
    ownerId: agentId,
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, rows] = await db.$transaction([
    db.property.count({ where }),
    db.property.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { ...CARD_INCLUDE, owner: { select: { id: true, fullName: true } } },
    }),
  ]);

  return {
    items: rows.map(serializeAgentProperty),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAgentProperty(agentId, propertyId) {
  const db = getDb();
  const property = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    include: {
      ...LISTING_INCLUDE,
      _count: {
        select: { inquiries: { where: { status: { in: ACTIVE_INQUIRY_STATUSES } } } },
      },
    },
  });

  return property ? serializeAgentProperty(property) : null;
}

/** Buat listing baru; selalu `pending` (BR-19). */
export async function createProperty(ownerId, input) {
  const db = getDb();

  const [project, category] = await Promise.all([
    db.project.findFirst({ where: { id: input.projectId, isActive: true }, select: { id: true } }),
    db.propertyCategory.findFirst({
      where: { id: input.categoryId, isActive: true },
      select: { id: true },
    }),
  ]);
  if (!project) {
    throw new AppError(ERROR_CODES.VALIDATION, "Proyek tidak ditemukan atau nonaktif.", {
      status: 422,
      fieldErrors: { projectId: "Pilih proyek yang aktif" },
    });
  }
  if (!category) {
    throw new AppError(ERROR_CODES.VALIDATION, "Kategori tidak ditemukan atau nonaktif.", {
      status: 422,
      fieldErrors: { categoryId: "Pilih kategori yang aktif" },
    });
  }

  const slug = await uniquePropertySlug(input.title);

  const created = await db.property.create({
    data: {
      ...propertyWriteData(input),
      ownerId,
      projectId: input.projectId,
      categoryId: input.categoryId,
      slug,
      verificationStatus: "pending",
      businessStatus: "tersedia",
    },
    select: { id: true },
  });

  logger.info({ event: "property.created", propertyId: created.id, ownerId }, "Listing dibuat");
  return getAgentProperty(ownerId, created.id);
}

/**
 * Ubah listing milik agen. Field kunci pada listing approved mengembalikan
 * status ke pending (BR-22).
 */
export async function updateProperty(agentId, propertyId, input) {
  const db = getDb();
  const current = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    select: {
      id: true,
      verificationStatus: true,
      price: true,
      latitude: true,
      longitude: true,
      projectId: true,
      categoryId: true,
      address: true,
    },
  });
  if (!current) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }

  const data = propertyWriteData(input);

  const keyChanged = KEY_FIELDS.some((field) => {
    if (input[field] === undefined) return false;
    if (field === "price") return Number(current.price) !== Number(input.price);
    if (field === "latitude" || field === "longitude") {
      const currentValue = current[field] === null ? null : Number(current[field]).toFixed(6);
      const nextValue = decimalOrNull(input[field]);
      return currentValue !== nextValue;
    }
    return String(current[field] ?? "") !== String(input[field] ?? "");
  });

  const backToVerification = current.verificationStatus === "approved" && keyChanged;

  await db.property.update({
    where: { id: propertyId },
    data: {
      ...data,
      ...(backToVerification
        ? {
            verificationStatus: "pending",
            verificationNote: null,
            verifiedAt: null,
            verifiedById: null,
          }
        : {}),
    },
  });

  return getAgentProperty(agentId, propertyId);
}

/** Kirim ulang listing yang ditolak/diubah ke antrean verifikasi. */
export async function resubmitProperty(agentId, propertyId) {
  const db = getDb();
  const current = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    select: { id: true, verificationStatus: true },
  });
  if (!current) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  if (current.verificationStatus === "approved") {
    throw new AppError(ERROR_CODES.CONFLICT, "Listing ini sudah disetujui.", { status: 409 });
  }

  await db.property.update({
    where: { id: propertyId },
    data: {
      verificationStatus: "pending",
      verificationNote: null,
      verifiedAt: null,
      verifiedById: null,
    },
  });

  return getAgentProperty(agentId, propertyId);
}

const BUSINESS_TRANSITIONS = {
  tersedia: ["dipesan", "terjual"],
  dipesan: ["tersedia", "terjual"],
  terjual: [],
};

/** Ubah status bisnis unit (FR-32, PRD §7.4). */
export async function updateBusinessStatus(agentId, propertyId, businessStatus) {
  const db = getDb();
  const current = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    select: { id: true, businessStatus: true },
  });
  if (!current) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  if (!(BUSINESS_TRANSITIONS[current.businessStatus] ?? []).includes(businessStatus)) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Status ${current.businessStatus} tidak bisa langsung diubah ke ${businessStatus}.`,
      { status: 409 },
    );
  }

  await db.property.update({ where: { id: propertyId }, data: { businessStatus } });
  return getAgentProperty(agentId, propertyId);
}

/** Hapus listing; hanya pending/rejected dan belum punya pengajuan. */
export async function deleteProperty(agentId, propertyId) {
  const db = getDb();
  const current = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    select: {
      id: true,
      verificationStatus: true,
      images: { select: { storagePath: true } },
      _count: { select: { inquiries: true } },
    },
  });
  if (!current) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  if (!["pending", "rejected"].includes(current.verificationStatus)) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      "Hanya listing berstatus pending atau rejected yang bisa dihapus.",
      { status: 409 },
    );
  }
  if (current._count.inquiries > 0) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      "Listing sudah memiliki pengajuan sehingga tidak bisa dihapus.",
      { status: 409 },
    );
  }

  await db.property.delete({ where: { id: propertyId } });
  for (const image of current.images) {
    await deletePropertyImageFile(image.storagePath).catch(() => {});
  }

  logger.info({ event: "property.deleted", propertyId, agentId }, "Listing dihapus");
}

// --- Admin --------------------------------------------------------------

export async function listAdminProperties({
  page = 1,
  pageSize = 20,
  verificationStatus = "",
  projectId = "",
  ownerId = "",
  businessStatus = "",
} = {}) {
  const db = getDb();
  const where = {
    ...(verificationStatus ? { verificationStatus } : {}),
    ...(projectId ? { projectId } : {}),
    ...(ownerId ? { ownerId } : {}),
    ...(businessStatus ? { businessStatus } : {}),
  };

  const [total, rows] = await db.$transaction([
    db.property.count({ where }),
    db.property.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        ...CARD_INCLUDE,
        owner: { select: { id: true, fullName: true } },
      },
    }),
  ]);

  return {
    items: rows.map(serializeAgentProperty),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

/**
 * Keputusan admin atas listing pending (FR-39, BR-20).
 * @param {{ decision: "approved"|"rejected", note?: string }} input
 */
export async function verifyProperty(adminId, propertyId, { decision, note }) {
  const db = getDb();
  const property = await db.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      title: true,
      ownerId: true,
      verificationStatus: true,
      businessStatus: true,
    },
  });
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  if (property.verificationStatus !== "pending") {
    throw new AppError(ERROR_CODES.CONFLICT, "Listing ini tidak sedang menunggu verifikasi.", {
      status: 409,
    });
  }
  if (decision === "rejected" && (note ?? "").trim().length < 5) {
    throw new AppError(ERROR_CODES.VALIDATION, "Alasan penolakan wajib diisi minimal 5 karakter.", {
      status: 422,
      fieldErrors: { note: "Alasan penolakan wajib diisi" },
    });
  }
  if (decision === "rejected" && property.businessStatus !== "tersedia") {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      "Listing yang sudah dipesan/terjual tidak bisa ditolak.",
      { status: 409 },
    );
  }

  const notificationId = await db.$transaction(async (tx) => {
    await tx.property.update({
      where: { id: propertyId },
      data: {
        verificationStatus: decision,
        verificationNote: decision === "rejected" ? note.trim() : null,
        verifiedById: adminId,
        verifiedAt: new Date(),
      },
    });

    const notification = await tx.notification.create({
      data: {
        userId: property.ownerId,
        type:
          decision === "approved"
            ? NOTIFICATION_TYPES.PROPERTY_VERIFIED
            : NOTIFICATION_TYPES.PROPERTY_REJECTED,
        title: decision === "approved" ? "Listing Anda disetujui" : "Listing Anda ditolak",
        body:
          decision === "approved"
            ? `${property.title} sudah tayang di katalog.`
            : `${property.title} ditolak: ${note}`,
        url: `/dashboard/penjual/properti/${propertyId}/ubah`,
        dedupeKey: `property:${propertyId}:review:${decision}:${Date.now()}`,
      },
      select: { id: true },
    });

    return notification.id;
  });

  await enqueueAll([notificationId]);
  logger.info({ event: "property.verified", propertyId, decision, adminId }, "Verifikasi listing");
}

/** Rekap admin dari database, bukan angka hard-coded (FR-42, FR-43). */
export async function getAdminRecap() {
  const db = getDb();

  const [
    totalProperties,
    byVerification,
    byBusiness,
    byProject,
    inquiriesByStatus,
    totalInquiries,
    usersByRole,
    totalFavorites,
  ] = await db.$transaction([
    db.property.count(),
    db.property.groupBy({ by: ["verificationStatus"], _count: { _all: true } }),
    db.property.groupBy({ by: ["businessStatus"], _count: { _all: true } }),
    db.property.groupBy({ by: ["projectId"], _count: { _all: true } }),
    db.propertyInquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    db.propertyInquiry.count(),
    db.profile.groupBy({ by: ["role"], _count: { _all: true } }),
    db.favorite.count(),
  ]);

  const projects = await db.project.findMany({ select: { id: true, name: true, slug: true } });
  const projectName = new Map(projects.map((project) => [project.id, project.name]));

  return {
    totalProperties,
    totalInquiries,
    totalFavorites,
    byVerification: Object.fromEntries(
      byVerification.map((row) => [row.verificationStatus, row._count._all]),
    ),
    byBusiness: Object.fromEntries(byBusiness.map((row) => [row.businessStatus, row._count._all])),
    byProject: byProject.map((row) => ({
      projectId: row.projectId,
      projectName: projectName.get(row.projectId) ?? "—",
      count: row._count._all,
    })),
    inquiriesByStatus: Object.fromEntries(
      inquiriesByStatus.map((row) => [row.status, row._count._all]),
    ),
    usersByRole: Object.fromEntries(usersByRole.map((row) => [row.role, row._count._all])),
  };
}

// --- Email dari auth.users (tidak ada di schema public) -----------------

export async function getEmailsByIds(ids) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map();
  try {
    const rows = await getDb().$queryRawUnsafe(
      "select id, email from auth.users where id = any($1::uuid[])",
      unique,
    );
    return new Map(rows.map((row) => [row.id, row.email]));
  } catch {
    return new Map();
  }
}

// --- Adapter untuk UI dashboard lama (frontend SRS menyusul) ------------

const LEGACY_LISTING = { pending: "PENDING", approved: "VERIFIED", rejected: "REJECTED" };
const LEGACY_SALE = { tersedia: "AVAILABLE", dipesan: "BOOKED", terjual: "SOLD" };

function legacyProperty(property) {
  const primary = property.images?.[0] ?? null;
  return {
    id: property.id,
    title: property.title,
    cluster: property.project?.name ?? "—",
    unit: property.slug,
    category: property.category?.name ?? "—",
    price: Number(property.price),
    city: property.project?.name ?? "—",
    address: property.address,
    landArea: property.landArea,
    buildingArea: property.buildingArea,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    floors: 1,
    latitude: property.latitude === null ? 0 : Number(property.latitude),
    longitude: property.longitude === null ? 0 : Number(property.longitude),
    description: property.description,
    listingStatus: LEGACY_LISTING[property.verificationStatus] ?? "PENDING",
    saleStatus: LEGACY_SALE[property.businessStatus] ?? "AVAILABLE",
    rejectionReason: property.verificationNote,
    activeInquiries: property._count?.inquiries ?? 0,
    primaryPhotoUrl: primary ? publicImageUrl(primary.storagePath) : null,
    version: 0,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
  };
}

/** Profil agen untuk navbar/pengaturan. */
export async function getAgentProfileView(agentId) {
  const db = getDb();
  const profile = await db.profile.findUnique({
    where: { id: agentId },
    select: { id: true, fullName: true, phone: true },
  });
  if (!profile) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Profil agen tidak ditemukan.", { status: 404 });
  }
  const emails = await getEmailsByIds([agentId]);

  return {
    id: profile.id,
    name: profile.fullName,
    email: emails.get(agentId) ?? "",
    phone: profile.phone ?? "",
    agencyName: "SANG Group",
    agentCode: `AGT-${profile.id.slice(0, 8).toUpperCase()}`,
    avatarUrl: null,
  };
}

/** Data dashboard versi lama; dipakai UI sampai halaman SRS selesai. */
export async function getAgentDashboard(agentId) {
  const db = getDb();
  const [profile, properties, inquiries] = await Promise.all([
    db.profile.findUnique({
      where: { id: agentId },
      select: { id: true, fullName: true, phone: true },
    }),
    db.property.findMany({
      where: { ownerId: agentId },
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: {
        project: true,
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
        _count: {
          select: { inquiries: { where: { status: { in: ACTIVE_INQUIRY_STATUSES } } } },
        },
      },
    }),
    db.propertyInquiry.findMany({
      where: { property: { ownerId: agentId } },
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        buyer: { select: { id: true, fullName: true, phone: true } },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            slug: true,
            project: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  if (!profile) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Profil agen tidak ditemukan.", { status: 404 });
  }

  const emails = await getEmailsByIds([
    profile.id,
    ...inquiries.map((inquiry) => inquiry.buyerId),
  ]);

  const legacyProperties = properties.map(legacyProperty);
  const sold = legacyProperties.filter((property) => property.saleStatus === "SOLD");

  const summary = {
    totalProperties: legacyProperties.length,
    pendingVerification: legacyProperties.filter((p) => p.listingStatus === "PENDING").length,
    activeInquiries: legacyProperties.reduce((sum, p) => sum + p.activeInquiries, 0),
    soldProperties: sold.length,
    soldValue: sold.reduce((sum, p) => sum + p.price, 0),
    availableCount: legacyProperties.filter((p) => p.saleStatus === "AVAILABLE").length,
    bookedCount: legacyProperties.filter((p) => p.saleStatus === "BOOKED").length,
    activeListingValue: legacyProperties
      .filter((p) => p.listingStatus === "VERIFIED" && p.saleStatus !== "SOLD")
      .reduce((sum, p) => sum + p.price, 0),
  };

  return {
    agent: {
      id: profile.id,
      name: profile.fullName,
      email: emails.get(profile.id) ?? "",
      phone: profile.phone ?? "",
      agencyName: "SANG Group",
      agentCode: `AGT-${profile.id.slice(0, 8).toUpperCase()}`,
      avatarUrl: null,
    },
    summary,
    properties: legacyProperties,
    inquiries: inquiries.map((inquiry) => ({
      id: inquiry.id,
      ticket: `#INQ-${inquiry.createdAt.getUTCFullYear()}-${inquiry.id.slice(0, 4).toUpperCase()}`,
      type: inquiry.inquiryType === "kunjungan" ? "VISIT" : "INTEREST",
      status:
        {
          menunggu: "PENDING",
          dihubungi: "CONFIRMED",
          kunjungan_dijadwalkan: "RESCHEDULED",
          selesai: "COMPLETED",
          dibatalkan: "CANCELLED",
          ditolak: "REJECTED",
        }[inquiry.status] ?? "PENDING",
      createdAt: inquiry.createdAt.toISOString(),
      scheduledAt: null,
      message: inquiry.message,
      offerPrice: null,
      sellerNote: null,
      buyer: {
        id: inquiry.buyer.id,
        name: inquiry.buyer.fullName,
        phone: inquiry.buyer.phone ?? "",
        email: emails.get(inquiry.buyerId) ?? "",
      },
      property: {
        id: inquiry.property.id,
        title: inquiry.property.title,
        price: Number(inquiry.property.price),
        unit: inquiry.property.slug,
        cluster: inquiry.property.project?.name ?? "—",
      },
    })),
  };
}

/** Antrean verifikasi versi lama (dipakai halaman /admin saat ini). */
export async function listPendingVerifications({ page = 1, pageSize = 20 } = {}) {
  const result = await listAdminProperties({ page, pageSize, verificationStatus: "pending" });
  const emails = await getEmailsByIds(result.items.map((item) => item.owner?.id));

  return {
    ...result,
    items: result.items.map((item) => ({
      ...item,
      cluster: item.project?.name ?? "—",
      unit: item.slug,
      category: item.category?.name ?? "—",
      city: item.project?.name ?? "—",
      photoCount: item.images?.length ?? 0,
      listingStatus: "PENDING",
      saleStatus: { tersedia: "AVAILABLE", dipesan: "BOOKED", terjual: "SOLD" }[item.businessStatus],
      agent: {
        id: item.owner?.id,
        fullName: item.owner?.fullName,
        email: emails.get(item.owner?.id) ?? "",
      },
    })),
  };
}
