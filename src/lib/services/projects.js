import "server-only";

import { getDb } from "@/lib/db/client";
import { AppError, ERROR_CODES } from "@/lib/errors";
import { publicImageUrl } from "@/lib/storage/supabase-storage";
import { slugify } from "@/lib/slug";

/** Proyek perumahan (SRS §7): Sang Dipa, Sang Wira, Sang Naya. */

function serializeProject(project, propertyCount = undefined) {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    address: project.address,
    latitude: project.latitude === null ? null : Number(project.latitude),
    longitude: project.longitude === null ? null : Number(project.longitude),
    coverImageUrl: project.coverImagePath ? publicImageUrl(project.coverImagePath) : null,
    isActive: project.isActive,
    ...(propertyCount === undefined ? {} : { propertyCount }),
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

/** Daftar proyek publik (hanya aktif) beserta jumlah listing approved. */
export async function listPublicProjects() {
  const db = getDb();
  const projects = await db.project.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { properties: { where: { verificationStatus: "approved" } } },
      },
    },
  });

  return projects.map((project) => serializeProject(project, project._count.properties));
}

/** Detail proyek berdasarkan slug (publik). */
export async function getPublicProjectBySlug(slug) {
  const db = getDb();
  const project = await db.project.findFirst({
    where: { slug, isActive: true },
    include: {
      _count: {
        select: { properties: { where: { verificationStatus: "approved" } } },
      },
      sitePlans: {
        where: { approvedForUse: true },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, filePath: true, version: true },
      },
    },
  });

  if (!project) return null;

  return {
    ...serializeProject(project, project._count.properties),
    sitePlan: project.sitePlans[0]
      ? {
          id: project.sitePlans[0].id,
          url: publicImageUrl(project.sitePlans[0].filePath),
          version: project.sitePlans[0].version,
        }
      : null,
  };
}

async function uniqueProjectSlug(base, excludeId = null) {
  const db = getDb();
  let candidate = base;
  for (let suffix = 2; suffix <= 50; suffix += 1) {
    const existing = await db.project.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${suffix}`;
  }
  throw new AppError(ERROR_CODES.CONFLICT, "Slug proyek tidak bisa dibuat unik.", { status: 409 });
}

/** Admin: semua proyek (termasuk nonaktif). */
export async function listAllProjects() {
  const db = getDb();
  const projects = await db.project.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { properties: true } } },
  });
  return projects.map((project) => serializeProject(project, project._count.properties));
}

/** Admin: buat proyek baru. */
export async function createProject(input) {
  const db = getDb();
  const slug = await uniqueProjectSlug(slugify(input.slug || input.name, "proyek"));

  return db.project.create({
    data: {
      name: input.name,
      slug,
      description: input.description ?? "",
      address: input.address ?? "",
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      coverImagePath: input.coverImagePath ?? null,
      isActive: input.isActive ?? true,
    },
    select: { id: true, slug: true, name: true },
  });
}

/** Admin: ubah proyek. Slug tidak diubah otomatis agar URL tetap stabil. */
export async function updateProject(projectId, input) {
  const db = getDb();
  const existing = await db.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!existing) {
    throw new AppError(ERROR_CODES.NOT_FOUND, "Proyek tidak ditemukan.", { status: 404 });
  }

  return db.project.update({
    where: { id: projectId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.address !== undefined ? { address: input.address } : {}),
      ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
      ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      ...(input.coverImagePath !== undefined ? { coverImagePath: input.coverImagePath } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
    select: { id: true, slug: true, name: true, isActive: true },
  });
}
