import assert from "node:assert/strict";
import test from "node:test";

import {
  categorySchema,
  inquiryCreateSchema,
  inquiryStatusSchema,
  projectSchema,
  propertyCreateSchema,
  verificationSchema,
} from "../src/lib/validators/domain.js";

const baseProperty = {
  projectId: "11111111-1111-4111-8111-111111111111",
  categoryId: "22222222-2222-4222-8222-222222222222",
  title: "Rumah Tipe 45 — Sang Dipa",
  description: "Unit contoh untuk pengujian validasi backend.",
  price: 750_000_000,
  landArea: 84,
  buildingArea: 45,
  bedrooms: 3,
  bathrooms: 2,
  address: "Jl. Ngesrep Timur V No. 25, Semarang",
  latitude: -7.0535,
  longitude: 110.438,
};

test("listing valid lolos skema", () => {
  const parsed = propertyCreateSchema.safeParse(baseProperty);
  assert.equal(parsed.success, true);
});

test("koordinat hanya salah satu ditolak", () => {
  const parsed = propertyCreateSchema.safeParse({ ...baseProperty, longitude: undefined });
  assert.equal(parsed.success, false);
});

test("koordinat di luar rentang ditolak", () => {
  assert.equal(propertyCreateSchema.safeParse({ ...baseProperty, latitude: -91 }).success, false);
  assert.equal(propertyCreateSchema.safeParse({ ...baseProperty, longitude: 181 }).success, false);
});

test("harga negatif dan luas nol ditolak", () => {
  assert.equal(propertyCreateSchema.safeParse({ ...baseProperty, price: -1 }).success, false);
  assert.equal(propertyCreateSchema.safeParse({ ...baseProperty, landArea: 0 }).success, false);
});

test("pengajuan hanya kunjungan atau minat_beli", () => {
  assert.equal(
    inquiryCreateSchema.safeParse({
      propertyId: "11111111-1111-4111-8111-111111111111",
      inquiryType: "kunjungan",
    }).success,
    true,
  );
  assert.equal(
    inquiryCreateSchema.safeParse({
      propertyId: "11111111-1111-4111-8111-111111111111",
      inquiryType: "chat",
    }).success,
    false,
  );
});

test("status tindak lanjut hanya nilai yang diizinkan", () => {
  assert.equal(inquiryStatusSchema.safeParse({ status: "dihubungi" }).success, true);
  assert.equal(inquiryStatusSchema.safeParse({ status: "menunggu" }).success, false);
  assert.equal(inquiryStatusSchema.safeParse({ status: "dibatalkan" }).success, false);
});

test("penolakan verifikasi wajib alasan", () => {
  assert.equal(verificationSchema.safeParse({ decision: "rejected" }).success, false);
  assert.equal(
    verificationSchema.safeParse({ decision: "rejected", note: "Koordinat tidak sesuai." }).success,
    true,
  );
  assert.equal(verificationSchema.safeParse({ decision: "approved" }).success, true);
});

test("slug proyek harus URL-friendly", () => {
  assert.equal(projectSchema.safeParse({ name: "Sang Dipa", slug: "sang-dipa" }).success, true);
  assert.equal(projectSchema.safeParse({ name: "Sang Dipa", slug: "Sang Dipa" }).success, false);
  assert.equal(categorySchema.safeParse({ name: "Rumah" }).success, true);
});
