import { formatVerificationAge } from "@/lib/dashboard/format";

/**
 * Bentuk data antrean verifikasi untuk `VerificationQueue`.
 *
 * Halaman mengubah hasil `listAdminProperties()` menjadi baris siap tampil di
 * sini, sehingga komponen tidak perlu tahu apakah datanya dari Prisma atau
 * fixture. `now` dipakai untuk label umur ("2 hari lalu").
 *
 * @param {object[]} properties hasil serialisasi properti admin
 * @param {Date|string} [now]
 */
export function toVerificationQueueItems(properties, now = new Date()) {
  return properties.map((property) => ({
    id: property.id,
    title: property.title,
    unit: `${property.buildingArea}/${property.landArea}`,
    location: property.address,
    agentName: property.owner?.fullName ?? "—",
    imageUrl: property.primaryImageUrl,
    submittedAt: property.updatedAt,
    submittedNote: formatVerificationAge(property.updatedAt, now),
    price: property.price,
    landArea: property.landArea,
    buildingArea: property.buildingArea,
  }));
}

/**
 * Filter untuk kotak pencarian topbar (judul, agen, alamat, tipe unit).
 *
 * @param {ReturnType<typeof toVerificationQueueItems>} items
 * @param {string} [query]
 */
export function filterVerificationQueue(items, query) {
  const needle = String(query ?? "").trim().toLowerCase();
  if (!needle) return items;

  return items.filter((item) =>
    [item.title, item.unit, item.location, item.agentName].some((value) =>
      String(value ?? "").toLowerCase().includes(needle),
    ),
  );
}
