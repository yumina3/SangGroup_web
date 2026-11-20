import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { slugify } from "@/lib/slug";

/** Kategori/tipe properti yang dikelola admin (FR-40). */

function serializeCategory(category, propertyCount = undefined) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    isActive: category.isActive,
    ...(propertyCount === undefined ? {} : { propertyCount }),
    createdAt: category.createdAt.toISOString(),
  };
}

export async function listPublicCategories() {
  const db = getDb();
  const categories = await db.propertyCategory.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { properties: { where: { verificationStatus: "approved" } } } } },
  });
  return categories.map((category) => serializeCategory(category, category._count.properties));
}

export async function listAllCategories() {
  const db = getDb();
  const categories = await db.propertyCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { properties: true } } },
  });
  return categories.map((category) => serializeCategory(category, category._count.properties));
}

async function uniqueCategorySlug(base, excludeId = null) {
  const db = getDb();
  let candidate = base;
  for (let suffix = 2; suffix <= 50; suffix += 1) {
    const existing = await db.propertyCategory.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
  }
  throw new AppError(ERROR_CODES.CONFLICT, "Slug kategori tidak bisa dibuat unik.", { status: 409 });
}

export async function createCategory(input) {
  const db = getDb();
  const slug = await uniqueCategorySlug(slugify(input.slug || input.name, "kategori"));
  return db.propertyCategory.create({
    data: { name: input.name, slug, isActive: input.isActive ?? true },
    select: { id: true, name: true, slug: true, isActive: true },
  });
}

export async function updateCategory(categoryId, input) {
  const db = getDb();
  const category = await db.propertyCategory.findUnique({
    where: { id: categoryId },
    select: { id: true, slug: true },
  });
  if (!category) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Kategori tidak ditemukan.", { status: 404 });
  }

  let slug;
  if (input.slug && input.slug !== category.slug) {
    slug = await uniqueCategorySlug(slugify(input.slug, "kategori"), categoryId);
  }

  return db.propertyCategory.update({
    where: { id: categoryId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(slug ? { slug } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
    select: { id: true, name: true, slug: true, isActive: true },
  });
}
