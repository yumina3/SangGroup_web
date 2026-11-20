"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { savePropertyAction } from "@/app/dashboard/penjual/properti/actions";

const STATUS_LABEL = {
  pending: "Menunggu verifikasi",
  approved: "Disetujui",
  rejected: "Ditolak",
};

const STATUS_TONE = {
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

const EMPTY = {
  projectId: "",
  categoryId: "",
  title: "",
  description: "",
  price: "",
  landArea: "",
  buildingArea: "",
  bedrooms: "0",
  bathrooms: "0",
  address: "",
  latitude: "",
  longitude: "",
};

function toForm(property) {
  if (!property) return EMPTY;
  return {
    projectId: property.project?.id ?? "",
    categoryId: property.category?.id ?? "",
    title: property.title ?? "",
    description: property.description ?? "",
    price: String(property.price ?? ""),
    landArea: String(property.landArea ?? ""),
    buildingArea: String(property.buildingArea ?? ""),
    bedrooms: String(property.bedrooms ?? 0),
    bathrooms: String(property.bathrooms ?? 0),
    address: property.address ?? "",
    latitude: property.latitude === null ? "" : String(property.latitude),
    longitude: property.longitude === null ? "" : String(property.longitude),
  };
}

function fieldClass(error) {
  return `h-10 w-full rounded-lg border px-3 text-[13px] text-ag-slate outline-none ${
    error ? "border-red-400" : "border-ag-line focus:border-ag-gold-base"
  }`;
}

/**
 * Form listing sesuai SRS §4.1: proyek, kategori, harga, luas, spesifikasi,
 * alamat, dan koordinat opsional. Listing baru langsung masuk verifikasi.
 */
export default function PropertyFormSrs({ mode = "create", property = null, projects = [], categories = [] }) {
  const router = useRouter();
  const [form, setForm] = useState(() => toForm(property));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!form.projectId) next.projectId = "Pilih proyek";
    if (!form.categoryId) next.categoryId = "Pilih kategori";
    if (form.title.trim().length < 3) next.title = "Nama listing minimal 3 karakter";
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      next.price = "Harga harus angka tidak negatif";
    }
    if (Number(form.landArea) <= 0) next.landArea = "Luas tanah harus lebih dari 0";
    if (Number(form.buildingArea) <= 0) next.buildingArea = "Luas bangunan harus lebih dari 0";
    if (form.address.trim().length < 5) next.address = "Alamat minimal 5 karakter";
    const hasLat = form.latitude !== "";
    const hasLng = form.longitude !== "";
    if (hasLat !== hasLng) {
      next.latitude = "Latitude dan longitude harus diisi bersama";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSaving(true);
    const response = await savePropertyAction({
      mode,
      propertyId: property?.id ?? null,
      values: {
        ...form,
        price: Number(form.price),
        landArea: Number(form.landArea),
        buildingArea: Number(form.buildingArea),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        latitude: form.latitude === "" ? null : Number(form.latitude),
        longitude: form.longitude === "" ? null : Number(form.longitude),
      },
    });
    setSaving(false);

    if (!response.ok) {
      setErrors(response.fieldErrors ?? {});
      setFormError(response.formError ?? "Listing gagal disimpan.");
      return;
    }

    if (mode === "create") {
      router.replace(`/dashboard/penjual/properti/${response.property.id}/ubah`);
    } else {
      router.refresh();
    }
  }

  async function uploadImage(file) {
    if (!property) return;
    setUploading(true);
    setFormError("");
    const body = new FormData();
    body.set("file", file);
    body.set("altText", form.title);

    const response = await fetch(`/api/agent/properties/${property.id}/images`, {
      method: "POST",
      body,
    });
    const payload = await response.json().catch(() => ({}));
    setUploading(false);

    if (!response.ok) {
      setFormError(payload?.error?.message ?? "Foto gagal diunggah.");
      return;
    }
    router.refresh();
  }

  async function removeImage(imageId) {
    if (!property) return;
    await fetch(`/api/agent/properties/${property.id}/images/${imageId}`, { method: "DELETE" });
    router.refresh();
  }

  async function makePrimary(imageId) {
    if (!property) return;
    await fetch(`/api/agent/properties/${property.id}/images/${imageId}`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {property ? (
        <p
          className={`rounded-lg border px-4 py-3 text-[12.5px] font-semibold ${
            STATUS_TONE[property.verificationStatus] ?? STATUS_TONE.pending
          }`}
        >
          Status verifikasi: {STATUS_LABEL[property.verificationStatus] ?? property.verificationStatus}
          {property.verificationNote ? ` — catatan admin: ${property.verificationNote}` : ""}
        </p>
      ) : null}

      {formError ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12.5px] text-red-700">
          {formError}
        </p>
      ) : null}

      <section className="rounded-dash border border-ag-line bg-white p-5">
        <h2 className="mb-4 text-[15px] font-bold">Informasi utama</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-1 block text-[12.5px] font-semibold">Nama listing *</span>
            <input
              value={form.title}
              onChange={(event) => setField("title")(event.target.value)}
              className={fieldClass(errors.title)}
              placeholder="Rumah Tipe 45 — Sang Dipa"
            />
            {errors.title ? <span className="text-[11.5px] text-red-600">{errors.title}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Proyek *</span>
            <select
              value={form.projectId}
              onChange={(event) => setField("projectId")(event.target.value)}
              className={fieldClass(errors.projectId)}
            >
              <option value="">— Pilih proyek —</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId ? <span className="text-[11.5px] text-red-600">{errors.projectId}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Kategori *</span>
            <select
              value={form.categoryId}
              onChange={(event) => setField("categoryId")(event.target.value)}
              className={fieldClass(errors.categoryId)}
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? <span className="text-[11.5px] text-red-600">{errors.categoryId}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Harga (Rp) *</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => setField("price")(event.target.value)}
              className={fieldClass(errors.price)}
            />
            {errors.price ? <span className="text-[11.5px] text-red-600">{errors.price}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Luas tanah (m²) *</span>
            <input
              type="number"
              min="1"
              value={form.landArea}
              onChange={(event) => setField("landArea")(event.target.value)}
              className={fieldClass(errors.landArea)}
            />
            {errors.landArea ? <span className="text-[11.5px] text-red-600">{errors.landArea}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Luas bangunan (m²) *</span>
            <input
              type="number"
              min="1"
              value={form.buildingArea}
              onChange={(event) => setField("buildingArea")(event.target.value)}
              className={fieldClass(errors.buildingArea)}
            />
            {errors.buildingArea ? (
              <span className="text-[11.5px] text-red-600">{errors.buildingArea}</span>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Kamar tidur</span>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(event) => setField("bedrooms")(event.target.value)}
              className={fieldClass(errors.bedrooms)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Kamar mandi</span>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(event) => setField("bathrooms")(event.target.value)}
              className={fieldClass(errors.bathrooms)}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1 block text-[12.5px] font-semibold">Alamat *</span>
            <input
              value={form.address}
              onChange={(event) => setField("address")(event.target.value)}
              className={fieldClass(errors.address)}
              placeholder="Jl. Contoh No. 1, Semarang"
            />
            {errors.address ? <span className="text-[11.5px] text-red-600">{errors.address}</span> : null}
          </label>

          <label className="block md:col-span-2">
            <span className="mb-1 block text-[12.5px] font-semibold">Deskripsi</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setField("description")(event.target.value)}
              className="w-full rounded-lg border border-ag-line px-3 py-2 text-[13px]"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Latitude</span>
            <input
              value={form.latitude}
              onChange={(event) => setField("latitude")(event.target.value)}
              className={fieldClass(errors.latitude)}
              placeholder="-7.011240"
            />
            {errors.latitude ? <span className="text-[11.5px] text-red-600">{errors.latitude}</span> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-[12.5px] font-semibold">Longitude</span>
            <input
              value={form.longitude}
              onChange={(event) => setField("longitude")(event.target.value)}
              className={fieldClass(errors.longitude)}
              placeholder="110.413510"
            />
          </label>
        </div>

        <p className="mt-3 text-[11.5px] text-ag-slate-muted">
          Koordinat opsional; listing tanpa koordinat tidak menghasilkan marker peta (FR-12).
        </p>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-ag-forest px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {saving
            ? "Menyimpan…"
            : mode === "create"
              ? "Simpan & kirim verifikasi"
              : "Simpan perubahan"}
        </button>
        <span className="text-[11.5px] text-ag-slate-secondary">
          Listing baru selalu berstatus menunggu verifikasi admin (BR-19).
        </span>
      </div>

      {property ? (
        <section className="rounded-dash border border-ag-line bg-white p-5">
          <h2 className="text-[15px] font-bold">Foto properti</h2>
          <p className="mt-1 text-[12px] text-ag-slate-secondary">
            JPG/PNG/WEBP, maksimal 5 MB, maksimal 8 foto. Perubahan foto pada listing disetujui
            mengembalikannya ke verifikasi.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(property.images ?? []).map((image) => (
              <div key={image.id} className="rounded-lg border border-ag-line p-2">
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={image.altText || property.title}
                    className="h-28 w-full rounded object-cover"
                  />
                ) : (
                  <div className="h-28 w-full rounded bg-ag-surface-low" aria-hidden="true" />
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {image.isPrimary ? (
                    <span className="rounded bg-ag-gold/15 px-2 py-0.5 text-[10.5px] font-bold text-ag-forest">
                      Utama
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => makePrimary(image.id)}
                      className="text-[11px] font-semibold text-ag-forest hover:underline"
                    >
                      Jadikan utama
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="text-[11px] font-semibold text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg border border-ag-line px-3 py-2 text-[12px] font-semibold hover:bg-ag-surface-low">
            {uploading ? "Mengunggah…" : "Unggah foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) uploadImage(file);
              }}
            />
          </label>
        </section>
      ) : null}
    </form>
  );
}
