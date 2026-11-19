import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db/client";
import { logger } from "@/lib/logging/logger";

/**
 * Pengajuan pembeli (kunjungan & minat beli) beserta riwayat statusnya.
 *
 * Data dibaca dari `property_inquiries` dan `inquiry_updates` di Supabase.
 * Tanggal kunjungan belum disimpan sebagai kolom tersendiri, jadi jadwal yang
 * tampil ke pembeli hanya berasal dari catatan tindak lanjut agen — tidak ada
 * jadwal yang dikarang di tampilan.
 */

const INQUIRY_SELECT = Prisma.sql`
  i.id::text AS "id",
  i.inquiry_type::text AS "type",
  i.status::text AS "status",
  i.message,
  i.created_at AS "createdAt",
  i.updated_at AS "updatedAt",
  p.id::text AS "propertyId",
  p.slug AS "propertySlug",
  p.title AS "propertyTitle",
  p.business_status::text AS "businessStatus",
  pr.name AS "projectName",
  img.storage_path AS "imagePath"
`;

const INQUIRY_FROM = Prisma.sql`
  FROM public.property_inquiries i
  JOIN public.properties p ON p.id = i.property_id
  JOIN public.projects pr ON pr.id = p.project_id
  LEFT JOIN LATERAL (
    SELECT pi.storage_path
    FROM public.property_images pi
    WHERE pi.property_id = p.id
    ORDER BY pi.is_primary DESC, pi.sort_order ASC
    LIMIT 1
  ) img ON true
`;

/** Status yang menandakan jadwal kunjungan sudah disepakati agen. */
const STATUS_WITH_SCHEDULE = ["kunjungan_dijadwalkan"];

function imageUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;

  const bucket =
    process.env.NEXT_PUBLIC_SUPABASE_PROPERTY_BUCKET || "property-images";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path.replace(/^\/+/, "")}`;
}

function mapInquiry(row, updates) {
  const history = updates
    .filter((update) => update.inquiryId === row.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Catatan agen pada update status terjadwal dipakai sebagai keterangan
  // jadwal; bila belum ada, kartu menampilkan status apa adanya.
  const scheduleUpdate = history
    .filter(
      (update) =>
        update.newStatus && STATUS_WITH_SCHEDULE.includes(update.newStatus),
    )
    .at(-1);

  return {
    id: row.id,
    type: row.type,
    status: row.status,
    message: row.message,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    property: {
      id: row.propertyId,
      slug: row.propertySlug,
      title: row.propertyTitle,
      businessStatus: row.businessStatus,
      projectName: row.projectName,
      imagePath: row.imagePath,
      imageUrl: imageUrl(row.imagePath),
    },
    history: history.map((update) => ({
      id: update.id,
      oldStatus: update.oldStatus,
      newStatus: update.newStatus,
      note: update.note,
      actorName: update.actorName,
      actorRole: update.actorRole,
      isCustomer: update.actorRole === "buyer",
      createdAt: update.createdAt,
    })),
    scheduleNote: scheduleUpdate?.note ?? null,
    scheduleAt: scheduleUpdate?.createdAt ?? null,
  };
}

/** Semua pengajuan milik pembeli, terbaru lebih dulu. */
export async function listBuyerInquiries(buyerId) {
  if (!isDatabaseConfigured()) {
    return { ok: false, code: "db_not_configured" };
  }
  if (!buyerId) {
    return { ok: true, inquiries: [] };
  }

  try {
    const db = getDb();
    const rows = await db.$queryRaw(Prisma.sql`
      SELECT ${INQUIRY_SELECT}
      ${INQUIRY_FROM}
      WHERE i.buyer_id = ${buyerId}::uuid
      ORDER BY i.created_at DESC
    `);

    if (rows.length === 0) {
      return { ok: true, inquiries: [] };
    }

    const updates = await db.$queryRaw`
      SELECT
        u.id::text AS "id",
        u.inquiry_id::text AS "inquiryId",
        u.old_status::text AS "oldStatus",
        u.new_status::text AS "newStatus",
        u.note,
        u.created_at AS "createdAt",
        pr.full_name AS "actorName",
        pr.role::text AS "actorRole"
      FROM public.inquiry_updates u
      LEFT JOIN public.profiles pr ON pr.id = u.actor_id
      WHERE u.inquiry_id IN (
        SELECT id
        FROM public.property_inquiries
        WHERE buyer_id = ${buyerId}::uuid
      )
      ORDER BY u.created_at ASC
    `;

    return {
      ok: true,
      inquiries: rows.map((row) => mapInquiry(row, updates)),
    };
  } catch (error) {
    logger.error(
      {
        event: "inquiries",
        action: "list_buyer",
        message: error instanceof Error ? error.message : String(error),
      },
      "inquiries.list_buyer_failed",
    );
    return { ok: false, code: "db_error" };
  }
}
