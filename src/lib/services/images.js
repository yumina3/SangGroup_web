import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import {
  deletePropertyImageFile,
  MAX_IMAGES_PER_PROPERTY,
  publicImageUrl,
  uploadPropertyImage,
  validateImageFile,
} from "@/lib/storage/supabase-storage";

/**
 * Foto properti: satu baris `property_images` per berkas, isi di Supabase
 * Storage. Semua perubahan foto pada listing approved mengembalikannya ke
 * antrean verifikasi (BR-22).
 */

async function requireOwnedProperty(agentId, propertyId, select = { id: true, ownerId: true, verificationStatus: true }) {
  const db = getDb();
  const property = await db.property.findFirst({
    where: { id: propertyId, ownerId: agentId },
    select,
  });
  if (!property) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Listing tidak ditemukan.", { status: 404 });
  }
  return property;
}

function serializeImage(image) {
  return {
    id: image.id,
    storagePath: image.storagePath,
    url: publicImageUrl(image.storagePath),
    altText: image.altText,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
    createdAt: image.createdAt.toISOString(),
  };
}

export async function listPropertyImages(agentId, propertyId) {
  const db = getDb();
  await requireOwnedProperty(agentId, propertyId);

  const images = await db.propertyImage.findMany({
    where: { propertyId },
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
  });

  return images.map(serializeImage);
}

/**
 * Unggah satu foto. Input berasal dari multipart Route Handler.
 * @param {string} agentId
 * @param {string} propertyId
 * @param {{ contentType: string, sizeBytes: number, buffer: Buffer, altText?: string }} file
 */
export async function addPropertyImage(agentId, propertyId, file) {
  const db = getDb();
  const property = await requireOwnedProperty(agentId, propertyId, {
    id: true,
    ownerId: true,
    verificationStatus: true,
    _count: { select: { images: true } },
  });

  if (property._count.images >= MAX_IMAGES_PER_PROPERTY) {
    throw new AppError(
      ERROR_CODES.CONFLICT,
      `Maksimal ${MAX_IMAGES_PER_PROPERTY} foto per listing.`,
      { status: 409 },
    );
  }

  validateImageFile(file);
  const storagePath = await uploadPropertyImage({
    propertyId,
    contentType: file.contentType,
    buffer: file.buffer,
  });

  try {
    return await db.$transaction(async (tx) => {
      const images = await tx.propertyImage.findMany({
        where: { propertyId },
        select: { sortOrder: true },
        orderBy: { sortOrder: "asc" },
      });

      const used = new Set(images.map((image) => image.sortOrder));
      let sortOrder = 0;
      while (used.has(sortOrder)) sortOrder += 1;

      const created = await tx.propertyImage.create({
        data: {
          propertyId,
          storagePath,
          altText: (file.altText ?? "").slice(0, 300),
          sortOrder,
          isPrimary: images.length === 0,
        },
      });

      if (property.verificationStatus === "approved") {
        await tx.property.update({
          where: { id: propertyId },
          data: {
            verificationStatus: "pending",
            verificationNote: null,
            verifiedAt: null,
            verifiedById: null,
          },
        });
      }

      return serializeImage(created);
    });
  } catch (error) {
    await deletePropertyImageFile(storagePath).catch(() => {});
    throw error;
  }
}

export async function removePropertyImage(agentId, propertyId, imageId) {
  const db = getDb();
  const property = await requireOwnedProperty(agentId, propertyId, {
    id: true,
    verificationStatus: true,
  });

  const image = await db.propertyImage.findFirst({
    where: { id: imageId, propertyId },
    select: { id: true, storagePath: true, isPrimary: true },
  });
  if (!image) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Foto tidak ditemukan.", { status: 404 });
  }

  await db.$transaction(async (tx) => {
    await tx.propertyImage.delete({ where: { id: image.id } });

    if (image.isPrimary) {
      const next = await tx.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: "asc" },
        select: { id: true },
      });
      if (next) {
        await tx.propertyImage.update({ where: { id: next.id }, data: { isPrimary: true } });
      }
    }

    if (property.verificationStatus === "approved") {
      await tx.property.update({
        where: { id: propertyId },
        data: {
          verificationStatus: "pending",
          verificationNote: null,
          verifiedAt: null,
          verifiedById: null,
        },
      });
    }
  });

  await deletePropertyImageFile(image.storagePath).catch(() => {});
}

export async function setPrimaryImage(agentId, propertyId, imageId) {
  const db = getDb();
  const property = await requireOwnedProperty(agentId, propertyId, {
    id: true,
    verificationStatus: true,
  });

  const image = await db.propertyImage.findFirst({
    where: { id: imageId, propertyId },
    select: { id: true },
  });
  if (!image) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Foto tidak ditemukan.", { status: 404 });
  }

  await db.$transaction(async (tx) => {
    await tx.propertyImage.updateMany({
      where: { propertyId, isPrimary: true, id: { not: imageId } },
      data: { isPrimary: false },
    });
    await tx.propertyImage.update({ where: { id: imageId }, data: { isPrimary: true } });

    if (property.verificationStatus === "approved") {
      await tx.property.update({
        where: { id: propertyId },
        data: {
          verificationStatus: "pending",
          verificationNote: null,
          verifiedAt: null,
          verifiedById: null,
        },
      });
    }
  });
}
