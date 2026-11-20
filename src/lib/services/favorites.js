import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { serializePublicProperty } from "@/lib/services/properties";

/** Favorit pembeli (FR-25, FR-26, FR-30). */

const FAVORITE_INCLUDE = {
  property: {
    include: {
      project: { select: { id: true, name: true, slug: true } },
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
    },
  },
};

export async function listFavorites(buyerId) {
  const db = getDb();
  const rows = await db.favorite.findMany({
    where: { buyerId, property: { verificationStatus: "approved" } },
    orderBy: { createdAt: "desc" },
    include: FAVORITE_INCLUDE,
  });

  return rows.map((row) => ({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    property: serializePublicProperty(row.property),
  }));
}

export async function addFavorite(buyerId, propertyId) {
  const db = getDb();
  const property = await db.property.findFirst({
    where: { id: propertyId, verificationStatus: "approved" },
    select: { id: true },
  });
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Properti tidak ditemukan di katalog.", {
      status: 404,
    });
  }

  return db.favorite.upsert({
    where: { buyerId_propertyId: { buyerId, propertyId } },
    create: { buyerId, propertyId },
    update: {},
    select: { id: true, propertyId: true, createdAt: true },
  });
}

export async function removeFavorite(buyerId, propertyId) {
  const db = getDb();
  const result = await db.favorite.deleteMany({ where: { buyerId, propertyId } });
  if (result.count === 0) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Favorit tidak ditemukan.", { status: 404 });
  }
}

export async function isFavorite(buyerId, propertyId) {
  const db = getDb();
  const favorite = await db.favorite.findUnique({
    where: { buyerId_propertyId: { buyerId, propertyId } },
    select: { id: true },
  });
  return Boolean(favorite);
}
