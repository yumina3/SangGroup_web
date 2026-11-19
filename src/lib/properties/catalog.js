import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";

/**
 * Akses data katalog properti publik dan favorit pembeli.
 *
 * Tabel `properties`, `projects`, `property_categories`, `property_images`,
 * dan `favorites` sudah ada di Supabase. Modul ini sengaja memakai query SQL
 * langsung karena model bisnis tersebut belum dimasukkan ke schema Prisma;
 * bentuk hasilnya dijaga tetap stabil agar halaman tidak ikut berubah saat
 * model Prisma ditambahkan nanti.
 */

const PROPERTY_COLUMNS = Prisma.sql`
  p.id::text AS "id",
  p.slug,
  p.title,
  p.description,
  p.price::text AS "price",
  p.land_area AS "landArea",
  p.building_area AS "buildingArea",
  p.bedrooms,
  p.bathrooms,
  p.address,
  p.latitude::text AS "latitude",
  p.longitude::text AS "longitude",
  p.business_status::text AS "businessStatus",
  p.verification_status::text AS "verificationStatus",
  p.updated_at AS "updatedAt",
  pr.name AS "projectName",
  pr.slug AS "projectSlug",
  c.name AS "categoryName",
  img.storage_path AS "imagePath"
`;

const PROPERTY_FROM = Prisma.sql`
  FROM public.properties p
  JOIN public.projects pr ON pr.id = p.project_id
  JOIN public.property_categories c ON c.id = p.category_id
  LEFT JOIN LATERAL (
    SELECT pi.storage_path
    FROM public.property_images pi
    WHERE pi.property_id = p.id
    ORDER BY pi.is_primary DESC, pi.sort_order ASC
    LIMIT 1
  ) img ON true
`;

/** URL publik foto properti. Path Storage disimpan tanpa nama bucket. */
function imageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || "property-images";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}

function mapProperty(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    landArea: row.landArea,
    buildingArea: row.buildingArea,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    address: row.address,
    latitude: row.latitude == null ? null : Number(row.latitude),
    longitude: row.longitude == null ? null : Number(row.longitude),
    businessStatus: row.businessStatus,
    verificationStatus: row.verificationStatus,
    updatedAt: row.updatedAt,
    projectName: row.projectName,
    projectSlug: row.projectSlug,
    categoryName: row.categoryName,
    imagePath: row.imagePath,
    imageUrl: imageUrl(row.imagePath),
    favoritedAt: row.favoritedAt ?? null,
  };
}

function databaseError(action, error) {
  logger.error(
    {
      event: "properties",
      action,
      message: error instanceof Error ? error.message : String(error),
    },
    `properties.${action}_failed`,
  );
  return { ok: false, code: "db_error" };
}

/** Semua listing terverifikasi, termasuk unit yang sudah terjual. */
export async function listPublicProperties() {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const rows = await getDb().$queryRaw(Prisma.sql`
      SELECT ${PROPERTY_COLUMNS}
      ${PROPERTY_FROM}
      WHERE p.verification_status = 'approved'
      ORDER BY
        CASE p.business_status
          WHEN 'tersedia' THEN 0
          WHEN 'dipesan' THEN 1
          ELSE 2
        END,
        p.created_at DESC
    `);

    return { ok: true, properties: rows.map(mapProperty) };
  } catch (error) {
    return databaseError("list_public", error);
  }
}

/** Satu listing terverifikasi berdasarkan slug atau UUID. */
export async function findPublicProperty(identifier) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }
  if (typeof identifier !== "string" || identifier.trim() === "") {
    return { ok: true, property: null };
  }

  try {
    const rows = await getDb().$queryRaw(Prisma.sql`
      SELECT ${PROPERTY_COLUMNS}
      ${PROPERTY_FROM}
      WHERE p.verification_status = 'approved'
        AND (p.slug = ${identifier} OR p.id::text = ${identifier})
      LIMIT 1
    `);

    return { ok: true, property: rows[0] ? mapProperty(rows[0]) : null };
  } catch (error) {
    return databaseError("find_public", error);
  }
}

/** Favorit milik satu pembeli, hanya listing yang masih tayang. */
export async function listFavoriteProperties(buyerId) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }
  if (!buyerId) {
    return { ok: true, properties: [] };
  }

  try {
    const rows = await getDb().$queryRaw(Prisma.sql`
      SELECT ${PROPERTY_COLUMNS}, f.created_at AS "favoritedAt"
      ${PROPERTY_FROM}
      JOIN public.favorites f ON f.property_id = p.id
      WHERE p.verification_status = 'approved'
        AND f.buyer_id = ${buyerId}::uuid
      ORDER BY f.created_at DESC
    `);

    return { ok: true, properties: rows.map(mapProperty) };
  } catch (error) {
    return databaseError("list_favorites", error);
  }
}

/** Himpunan id properti favorit untuk menandai tombol hati di katalog. */
export async function listFavoriteIds(buyerId) {
  if (!isDatabaseConfigured() || !buyerId) return new Set();

  try {
    const rows = await getDb().$queryRaw`
      SELECT f.property_id::text AS "id"
      FROM public.favorites f
      WHERE f.buyer_id = ${buyerId}::uuid
    `;
    return new Set(rows.map((row) => row.id));
  } catch (error) {
    logger.error(
      {
        event: "properties",
        action: "list_favorite_ids",
        message: error instanceof Error ? error.message : String(error),
      },
      "properties.list_favorite_ids_failed",
    );
    return new Set();
  }
}

/** Apakah satu properti sudah disimpan pembeli. */
export async function isFavorite(buyerId, propertyId) {
  if (!isDatabaseConfigured() || !buyerId || !propertyId) return false;

  try {
    const rows = await getDb().$queryRaw`
      SELECT 1 AS "found"
      FROM public.favorites
      WHERE buyer_id = ${buyerId}::uuid
        AND property_id = ${propertyId}::uuid
      LIMIT 1
    `;
    return rows.length > 0;
  } catch (error) {
    logger.error(
      {
        event: "properties",
        action: "is_favorite",
        message: error instanceof Error ? error.message : String(error),
      },
      "properties.is_favorite_failed",
    );
    return false;
  }
}

/** Jumlah favorit aktif untuk ringkasan dashboard pembeli. */
export async function countFavorites(buyerId) {
  if (!isDatabaseConfigured() || !buyerId) return 0;

  try {
    const rows = await getDb().$queryRaw`
      SELECT count(*)::int AS "count"
      FROM public.favorites f
      JOIN public.properties p ON p.id = f.property_id
      WHERE f.buyer_id = ${buyerId}::uuid
        AND p.verification_status = 'approved'
    `;
    return rows[0]?.count ?? 0;
  } catch (error) {
    logger.error(
      {
        event: "properties",
        action: "count_favorites",
        message: error instanceof Error ? error.message : String(error),
      },
      "properties.count_favorites_failed",
    );
    return 0;
  }
}

/**
 * Tambah bila belum ada, hapus bila sudah ada. Unique index
 * `favorites_buyer_property_key` membuat operasi ini idempoten.
 */
export async function toggleFavoriteRecord(buyerId, propertyId) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const db = getDb();
    const inserted = await db.$queryRaw`
      INSERT INTO public.favorites (buyer_id, property_id)
      VALUES (${buyerId}::uuid, ${propertyId}::uuid)
      ON CONFLICT (buyer_id, property_id) DO NOTHING
      RETURNING id::text AS "id"
    `;

    if (inserted.length > 0) {
      return { ok: true, favorited: true };
    }

    const deleted = await db.$queryRaw`
      DELETE FROM public.favorites
      WHERE buyer_id = ${buyerId}::uuid
        AND property_id = ${propertyId}::uuid
      RETURNING id::text AS "id"
    `;

    return { ok: true, favorited: false, removed: deleted.length > 0 };
  } catch (error) {
    return databaseError("toggle_favorite", error);
  }
}

export async function removeFavoriteRecord(buyerId, propertyId) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }

  try {
    const deleted = await getDb().$queryRaw`
      DELETE FROM public.favorites
      WHERE buyer_id = ${buyerId}::uuid
        AND property_id = ${propertyId}::uuid
      RETURNING id::text AS "id"
    `;

    return { ok: true, favorited: false, removed: deleted.length > 0 };
  } catch (error) {
    return databaseError("remove_favorite", error);
  }
}
