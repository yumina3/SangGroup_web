/**
 * Seed data awal sesuai PRD §8.3 dan SRS §8.
 *
 * Menjalankan: npm run db:seed
 *
 * Prasyarat di .env:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY  (untuk membuat akun Auth)
 * - DATABASE_URL               (Postgres Supabase)
 * - SUPABASE_STORAGE_BUCKET    (default: property-images, harus publik)
 *
 * Isi: 1 admin, 1 agen, 2 pembeli, 3 proyek, 3 kategori, 6 listing dengan
 * variasi status (approved/pending/rejected; tersedia/dipesan/terjual),
 * 5 pengajuan dengan variasi status, favorit, dan riwayat tindak lanjut.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

import { PrismaClient } from "../src/generated/prisma/client.ts";

try {
  process.loadEnvFile?.(".env");
} catch {
  // abaikan
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL } = process.env;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "property-images";

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !DATABASE_URL) {
  console.error(
    "Isi NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan DATABASE_URL di .env terlebih dahulu.",
  );
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });
const admin = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ACCOUNTS = [
  { email: "admin@sanggroup.id", password: "admin12345", fullName: "Admin SANG Group", phone: "+6281200000001", role: "admin" },
  { email: "nadia.prameswari@sanggroup.id", password: "penjual12345", fullName: "Nadia Prameswari", phone: "+6281200110022", role: "agent" },
  { email: "rani.hartono@gmail.com", password: "pembeli12345", fullName: "Rani Hartono", phone: "+6281357001122", role: "buyer" },
  { email: "arif.setyawan@gmail.com", password: "pembeli12345", fullName: "Arif Setyawan", phone: "+6281212003344", role: "buyer" },
];

async function ensureUser(account) {
  const { data, error } = await admin.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: { full_name: account.fullName, phone: account.phone },
  });

  if (error && !/already|registered|exists/i.test(error.message)) {
    throw new Error(`Gagal membuat ${account.email}: ${error.message}`);
  }

  let id = data?.user?.id;
  if (!id) {
    const rows = await prisma.$queryRawUnsafe(
      "select id from auth.users where lower(email) = lower($1) limit 1",
      account.email,
    );
    id = rows[0]?.id;
  }
  if (!id) throw new Error(`Akun ${account.email} tidak ditemukan setelah dibuat`);

  await prisma.profile.upsert({
    where: { id },
    create: {
      id,
      fullName: account.fullName,
      phone: account.phone,
      role: account.role,
      isActive: true,
    },
    update: { role: account.role, fullName: account.fullName, phone: account.phone, isActive: true },
  });

  return id;
}

const PROJECTS = [
  {
    name: "Sang Dipa Residence",
    slug: "sang-dipa",
    description:
      "Perumahan tropis modern di Semarang selatan dengan konsep kawasan hijau terpadu. Data simulasi untuk demo akademik.",
    address: "Kec. Candisari, Kota Semarang, Jawa Tengah",
    latitude: "-7.011240",
    longitude: "110.413510",
  },
  {
    name: "Sang Wira Residence",
    slug: "sang-wira",
    description:
      "Cluster hunian dekat kampus dan fasilitas kota. Data simulasi untuk demo akademik.",
    address: "Kec. Tembalang, Kota Semarang, Jawa Tengah",
    latitude: "-7.053110",
    longitude: "110.437720",
  },
  {
    name: "Sang Naya Residence",
    slug: "sang-naya",
    description:
      "Kawasan hunian dengan taman lingkungan dan akses tol. Data simulasi untuk demo akademik.",
    address: "Kec. Sambiroto, Kota Semarang, Jawa Tengah",
    latitude: "-7.061280",
    longitude: "110.441060",
  },
];

const CATEGORIES = [
  { name: "Rumah", slug: "rumah" },
  { name: "Ruko", slug: "ruko" },
  { name: "Kavling", slug: "kavling" },
];

const PROPERTIES = [
  {
    slug: "rumah-tipe-36-sang-dipa",
    title: "Rumah Tipe 36 — Sang Dipa",
    project: "sang-dipa",
    category: "rumah",
    price: 545_000_000n,
    landArea: 72,
    buildingArea: 36,
    bedrooms: 2,
    bathrooms: 1,
    address: "Jl. Tegalsari Raya No. 8, Candisari, Semarang",
    latitude: "-7.011240",
    longitude: "110.413510",
    businessStatus: "tersedia",
    verificationStatus: "approved",
    description:
      "Unit satu lantai dengan taman samping, menghadap jalan lingkungan yang lebar. Data simulasi.",
  },
  {
    slug: "rumah-tipe-45-sang-wira",
    title: "Rumah Tipe 45 — Sang Wira",
    project: "sang-wira",
    category: "rumah",
    price: 735_000_000n,
    landArea: 84,
    buildingArea: 45,
    bedrooms: 3,
    bathrooms: 2,
    address: "Jl. Ngesrep Timur V No. 21, Tembalang, Semarang",
    latitude: "-7.053110",
    longitude: "110.437720",
    businessStatus: "dipesan",
    verificationStatus: "approved",
    description:
      "Desain tropis modern dengan pencahayaan alami dari dua sisi. Data simulasi.",
  },
  {
    slug: "rumah-tipe-60-sang-naya",
    title: "Rumah Tipe 60 — Sang Naya",
    project: "sang-naya",
    category: "rumah",
    price: 1_180_000_000n,
    landArea: 96,
    buildingArea: 60,
    bedrooms: 3,
    bathrooms: 2,
    address: "Jl. Sambiroto Raya No. 55, Tembalang, Semarang",
    latitude: "-7.061280",
    longitude: "110.441060",
    businessStatus: "tersedia",
    verificationStatus: "approved",
    description: "Dua lantai dengan balkon belakang menghadap area hijau. Data simulasi.",
  },
  {
    slug: "ruko-dua-lantai-sang-wira",
    title: "Ruko Dua Lantai — Sang Wira",
    project: "sang-wira",
    category: "ruko",
    price: 1_450_000_000n,
    landArea: 120,
    buildingArea: 144,
    bedrooms: 0,
    bathrooms: 2,
    address: "Jl. Ngesrep Timur V No. 30, Tembalang, Semarang",
    latitude: "-7.054400",
    longitude: "110.438880",
    businessStatus: "terjual",
    verificationStatus: "approved",
    description: "Unit komersial dua lantai di jalan utama kawasan. Data simulasi.",
  },
  {
    slug: "rumah-tipe-72-sang-dipa",
    title: "Rumah Tipe 72 — Sang Dipa",
    project: "sang-dipa",
    category: "rumah",
    price: 1_600_000_000n,
    landArea: 120,
    buildingArea: 72,
    bedrooms: 4,
    bathrooms: 3,
    address: "Jl. Tegalsari Raya No. 30, Candisari, Semarang",
    latitude: "-7.012550",
    longitude: "110.414930",
    businessStatus: "tersedia",
    verificationStatus: "pending",
    description: "Tipe terluas dengan taman belakang; menunggu verifikasi admin. Data simulasi.",
  },
  {
    slug: "kavling-120-sang-naya",
    title: "Kavling 120 m² — Sang Naya",
    project: "sang-naya",
    category: "kavling",
    price: 900_000_000n,
    landArea: 120,
    buildingArea: 1,
    bedrooms: 0,
    bathrooms: 0,
    address: "Jl. Sambiroto Raya No. 77, Tembalang, Semarang",
    latitude: "-7.062020",
    longitude: "110.442910",
    businessStatus: "tersedia",
    verificationStatus: "rejected",
    description: "Kavling siap bangun; ditolak karena koordinat belum sesuai. Data simulasi.",
    verificationNote: "Titik koordinat belum sesuai dokumen; perbaiki lalu kirim ulang.",
  },
];

const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
  "base64",
);

async function ensurePlaceholderImage() {
  const path = "seed/placeholder.png";
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, PLACEHOLDER_PNG, { contentType: "image/png", upsert: true });
  if (error) {
    console.warn(`  ! Bucket "${BUCKET}" belum siap (${error.message}); path gambar tetap diisi.`);
  }
  return path;
}

async function main() {
  console.log("→ Akun Supabase Auth…");
  const ids = {};
  for (const account of ACCOUNTS) {
    ids[account.email] = await ensureUser(account);
    console.log(`  · ${account.email} (${account.role})`);
  }

  const adminId = ids["admin@sanggroup.id"];
  const agentId = ids["nadia.prameswari@sanggroup.id"];
  const buyer1 = ids["rani.hartono@gmail.com"];
  const buyer2 = ids["arif.setyawan@gmail.com"];

  console.log("→ Proyek…");
  const projectIds = {};
  for (const project of PROJECTS) {
    const row = await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        name: project.name,
        slug: project.slug,
        description: project.description,
        address: project.address,
        latitude: project.latitude,
        longitude: project.longitude,
        isActive: true,
      },
      update: { name: project.name, description: project.description, address: project.address },
    });
    projectIds[project.slug] = row.id;
  }

  console.log("→ Kategori…");
  const categoryIds = {};
  for (const category of CATEGORIES) {
    const row = await prisma.propertyCategory.upsert({
      where: { slug: category.slug },
      create: { name: category.name, slug: category.slug, isActive: true },
      update: { name: category.name, isActive: true },
    });
    categoryIds[category.slug] = row.id;
  }

  console.log("→ Listing…");
  const imagePath = await ensurePlaceholderImage();
  const propertyIds = {};
  for (const property of PROPERTIES) {
    const row = await prisma.property.upsert({
      where: { slug: property.slug },
      create: {
        projectId: projectIds[property.project],
        ownerId: agentId,
        categoryId: categoryIds[property.category],
        slug: property.slug,
        title: property.title,
        description: property.description,
        price: property.price,
        landArea: property.landArea,
        buildingArea: property.buildingArea,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        address: property.address,
        latitude: property.latitude,
        longitude: property.longitude,
        businessStatus: property.businessStatus,
        verificationStatus: property.verificationStatus,
        verificationNote: property.verificationNote ?? null,
        verifiedById: property.verificationStatus === "pending" ? null : adminId,
        verifiedAt: property.verificationStatus === "pending" ? null : new Date(),
      },
      update: {
        price: property.price,
        businessStatus: property.businessStatus,
        verificationStatus: property.verificationStatus,
        verificationNote: property.verificationNote ?? null,
      },
    });
    propertyIds[property.slug] = row.id;

    const existingImage = await prisma.propertyImage.findFirst({
      where: { propertyId: row.id, sortOrder: 0 },
    });
    if (!existingImage) {
      await prisma.propertyImage.create({
        data: {
          propertyId: row.id,
          storagePath: imagePath,
          altText: `${property.title} — foto simulasi`,
          sortOrder: 0,
          isPrimary: true,
        },
      });
    }
    console.log(`  · ${property.title} (${property.verificationStatus}/${property.businessStatus})`);
  }

  console.log("→ Pengajuan…");
  const inquiryCount = await prisma.propertyInquiry.count();
  if (inquiryCount === 0) {
    const INQUIRIES = [
      {
        buyerId: buyer1,
        property: "rumah-tipe-36-sang-dipa",
        inquiryType: "kunjungan",
        message: "Ingin melihat unit dan lingkungan pada pagi hari.",
        status: "menunggu",
        updates: [{ note: "Pengajuan dikirim pembeli." }],
      },
      {
        buyerId: buyer2,
        property: "rumah-tipe-45-sang-wira",
        inquiryType: "minat_beli",
        message: "Apakah harga bisa dinegosiasi untuk pembayaran tunai?",
        status: "dihubungi",
        updates: [{ note: "Agen menghubungi pembeli via WhatsApp." }],
      },
      {
        buyerId: buyer1,
        property: "rumah-tipe-60-sang-naya",
        inquiryType: "kunjungan",
        message: "Minta simulasi KPR dan memastikan unit masih tersedia.",
        status: "kunjungan_dijadwalkan",
        updates: [{ note: "Kunjungan dijadwalkan akhir pekan." }],
      },
      {
        buyerId: buyer2,
        property: "ruko-dua-lantai-sang-wira",
        inquiryType: "minat_beli",
        message: "Tertarik untuk unit komersial, mohon info skema pembayaran.",
        status: "selesai",
        updates: [{ note: "Deal disepakati; unit tercatat terjual." }],
      },
      {
        buyerId: buyer2,
        property: "rumah-tipe-60-sang-naya",
        inquiryType: "kunjungan",
        message: "Menanyakan jadwal survei tambahan.",
        status: "ditolak",
        updates: [{ note: "Jadwal bentrok; pembeli diarahkan memilih tanggal lain." }],
      },
    ];

    for (const inquiry of INQUIRIES) {
      const created = await prisma.propertyInquiry.create({
        data: {
          buyerId: inquiry.buyerId,
          propertyId: propertyIds[inquiry.property],
          inquiryType: inquiry.inquiryType,
          message: inquiry.message,
          status: inquiry.status,
        },
      });
      await prisma.inquiryUpdate.create({
        data: {
          inquiryId: created.id,
          actorId: inquiry.buyerId,
          oldStatus: null,
          newStatus: "menunggu",
          note: "Pengajuan dikirim pembeli.",
        },
      });
      if (inquiry.status !== "menunggu") {
        await prisma.inquiryUpdate.create({
          data: {
            inquiryId: created.id,
            actorId: agentId,
            oldStatus: "menunggu",
            newStatus: inquiry.status,
            note: inquiry.updates[0].note,
          },
        });
      }
    }
    console.log(`  · ${INQUIRIES.length} pengajuan dibuat`);
  }

  console.log("→ Favorit…");
  await prisma.favorite.upsert({
    where: { buyerId_propertyId: { buyerId: buyer1, propertyId: propertyIds["rumah-tipe-36-sang-dipa"] } },
    create: { buyerId: buyer1, propertyId: propertyIds["rumah-tipe-36-sang-dipa"] },
    update: {},
  });
  await prisma.favorite.upsert({
    where: { buyerId_propertyId: { buyerId: buyer2, propertyId: propertyIds["rumah-tipe-45-sang-wira"] } },
    create: { buyerId: buyer2, propertyId: propertyIds["rumah-tipe-45-sang-wira"] },
    update: {},
  });

  console.log("\nSelesai. Akun demo:");
  for (const account of ACCOUNTS) {
    console.log(`  ${account.role.padEnd(5)}  ${account.email}  /  ${account.password}`);
  }
  console.log(`\nBucket foto: ${BUCKET} (pastikan public agar katalog menampilkan gambar).`);
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
