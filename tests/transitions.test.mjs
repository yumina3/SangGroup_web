import assert from "node:assert/strict";
import test from "node:test";

import { INQUIRY_TRANSITIONS } from "../src/lib/domain/inquiry-status.js";
import { slugify } from "../src/lib/slug.js";

test("matriks transisi pengajuan SRS", () => {
  assert.deepEqual(INQUIRY_TRANSITIONS.menunggu, [
    "dihubungi",
    "kunjungan_dijadwalkan",
    "ditolak",
    "dibatalkan",
  ]);
  assert.deepEqual(INQUIRY_TRANSITIONS.dihubungi, [
    "kunjungan_dijadwalkan",
    "selesai",
    "ditolak",
    "dibatalkan",
  ]);
  assert.deepEqual(INQUIRY_TRANSITIONS.selesai, []);
  assert.deepEqual(INQUIRY_TRANSITIONS.dibatalkan, []);
  assert.deepEqual(INQUIRY_TRANSITIONS.ditolak, []);
});

test("slugify menghasilkan slug URL-friendly", () => {
  assert.equal(slugify("Rumah Tipe 45 — Sang Dipa"), "rumah-tipe-45-sang-dipa");
  assert.equal(slugify("  Kavling 120 m²  "), "kavling-120-m2");
  assert.equal(slugify(""), "properti");
});
