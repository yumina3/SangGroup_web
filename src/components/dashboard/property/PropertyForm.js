"use client";

import { useCallback, useEffect, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import Modal from "@/components/dashboard/Modal";
import Panel from "@/components/dashboard/Panel";
import { useToast } from "@/components/dashboard/Toast";
import MapPickerClient from "@/components/dashboard/property/MapPickerClient";
import PhotoUploader from "@/components/dashboard/property/PhotoUploader";
import PropertyField, {
  PropertySelect,
  PropertyTextarea,
} from "@/components/dashboard/property/PropertyField";
import { formatRupiah } from "@/lib/dashboard/format";
import {
  changedKeyFields,
  submissionOptions,
  validatePropertyForm,
} from "@/lib/validators/property";

function emptyForm() {
  return {
    title: "",
    projectId: "",
    categoryId: "",
    unit: "",
    price: "",
    landArea: "",
    buildingArea: "",
    bedrooms: "",
    bathrooms: "",
    floors: "1",
    address: "",
    city: "Semarang",
    description: "",
    latitude: "",
    longitude: "",
  };
}

function formFromProperty(property) {
  return {
    title: property.title ?? "",
    projectId: property.projectId ?? property.project?.id ?? "",
    categoryId: property.categoryId ?? property.category?.id ?? "",
    unit: property.unit ?? "",
    price: String(property.price ?? ""),
    landArea: String(property.landArea ?? ""),
    buildingArea: String(property.buildingArea ?? ""),
    bedrooms: String(property.bedrooms ?? ""),
    bathrooms: String(property.bathrooms ?? ""),
    floors: String(property.floors ?? "1"),
    address: property.address ?? "",
    city: property.city ?? "Semarang",
    description: property.description ?? "",
    latitude: property.latitude == null ? "" : String(property.latitude),
    longitude: property.longitude == null ? "" : String(property.longitude),
  };
}

/**
 * Formulir properti penjual (SRS-F-SEL-03 s.d. SEL-08).
 *
 * Satu komponen dipakai halaman "Tambah" dan "Ubah" agar kedua jalur tidak
 * berbeda. Validasi memakai aturan yang sama dengan Server Action
 * (`validatePropertyForm`), lalu opsi simpan menampilkan status yang akan
 * disimpan.
 *
 * Simpan belum menyentuh database (modul Prisma properti belum tersambung),
 * jadi hasilnya selalu pesan jujur "belum tersimpan" — bukan pemberitahuan
 * "berhasil" palsu. Tombol simpan mengikuti status listing: draft hanya untuk
 * DRAFT, "kirim verifikasi" untuk draft/ditolak/terverifikasi/disembunyikan,
 * dan seluruh form dikunci selama PENDING (admin sedang memeriksa).
 */
export default function PropertyForm({ mode = "create", property = null }) {
  const toast = useToast();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() =>
  property ? formFromProperty(property) : emptyForm());
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);
  // State untuk data proyek dan kategori dari API
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [createdPropertyId, setCreatedPropertyId] = useState(property?.id ?? null);
  const handlePhotoFilesChange = useCallback((files) => {
    setPhotoFiles(files);}, []);
  const projectOptions = [{
    value: "",
    label: loadingOptions ? "Memuat proyek..." : "Pilih proyek perumahan",
  },
  ...projects.map((project) => ({
    value: project.id,
    label: project.name,
  })),
  ];
  const categoryOptions = [{
    value: "",
    label: loadingOptions ? "Memuat kategori..." : "Pilih kategori",
  },
  ...categories.map((category) => ({
    value: category.id,
    label: category.name,
  })),
  ];

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [projectResponse, categoryResponse] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/categories"),
        ]);

        const projectResult = await projectResponse.json();
        const categoryResult = await categoryResponse.json();

        if (!projectResponse.ok || !categoryResponse.ok) {
          throw new Error("Gagal mengambil data proyek dan kategori.");
        }

        setProjects(projectResult.data?.items ?? []);
        setCategories(categoryResult.data?.items ?? []);
      } catch (error) {
        toast.push(error.message || "Gagal memuat pilihan form.", "danger");
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  const options = submissionOptions(property?.listingStatus);
  const locked = options.locked;

  // Validator dipakai langsung (bukan `import()` di dalam handler): form ini
  // kecil dan validasinya harus jalan sinkron saat tombol ditekan.
  const priceNumber = Number(form.price);
  const pricePreview = Number.isFinite(priceNumber) && priceNumber > 0 ? formatRupiah(priceNumber) : "—";

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadPhotos(propertyId) {
  const pendingFiles = photoFiles.filter(
    (file) => !uploadedFiles.includes(file)
  );
  for (const file of pendingFiles) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", file.name);
    const response = await fetch(
      `/api/agent/properties/${propertyId}/images`,
      {
        method: "POST",
        body: formData,
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.error?.message ||
        result.message ||
        `Gagal mengunggah foto ${file.name}.`
      );
    }
    setUploadedFiles((current) => [...current, file]);
    }
  }

  async function submit(submission) {
    if (locked || submitting) return;

    // Backend belum mendukung penyimpanan draft.
    if (submission === "DRAFT") {
      toast.push(
        "Penyimpanan draft belum tersedia. Silakan kirim untuk verifikasi.",
        "danger",
      );
      return;
    }

    // Validasi dasar sebelum mengirim ke API.
    if (!form.projectId || !form.categoryId) {
      toast.push("Pilih proyek dan kategori terlebih dahulu.", "danger");
      return;
    }

    const payload = {
      projectId: form.projectId,
      categoryId: form.categoryId,
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      landArea: Number(form.landArea),
      buildingArea: Number(form.buildingArea),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      unit: form.unit.trim(),
      floors: Number(form.floors),
      city: form.city.trim(),
      address: form.address.trim(),
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
    };

    setSubmitting(true);

    try {
      const targetPropertyId = isEdit
      ? property.id
      : createdPropertyId;
      const shouldUpdate = Boolean(targetPropertyId);
      const url = shouldUpdate
      ? `/api/agent/properties/${targetPropertyId}`
      : "/api/agent/properties";
      const response = await fetch(url, {
        method: shouldUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error?.message ||
          result.message ||
          "Gagal menyimpan data properti."
        );
      }

      // Ambil ID properti yang baru dibuat atau diperbarui.
      const savedPropertyId =
        result.data?.id ||
        result.data?.property?.id ||
        targetPropertyId;

      if (!savedPropertyId) {
        throw new Error(
          "Data properti tersimpan, tetapi ID properti tidak ditemukan untuk proses upload foto."
        );
      }

      // Simpan ID agar percobaan ulang tidak membuat properti duplikat.
      if (!shouldUpdate) {
        setCreatedPropertyId(savedPropertyId);
      }

      // Unggah foto setelah data properti berhasil disimpan.
      await uploadPhotos(savedPropertyId);

      setErrors({});

      toast.push(
        shouldUpdate
          ? "Properti dan foto berhasil diperbarui."
          : "Properti dan foto berhasil dikirim untuk verifikasi.",
        "success"
      );

      window.location.href = "/dashboard/penjual/properti";
    } catch (error) {
      toast.push(
        error.message || "Terjadi kesalahan saat menyimpan properti.",
        "danger",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
      {locked ? (
        <p
          role="status"
          className="rounded-dash border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800 xl:col-span-12"
        >
          <strong className="font-semibold">Listing sedang menunggu verifikasi admin.</strong> Data
          dikunci sementara agar antrean verifikasi tidak berubah. Setelah admin memutuskan, Anda bisa
          mengubah atau mengirim ulang listing ini.
        </p>
      ) : null}

      <fieldset disabled={locked} className="contents">
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            submit("PENDING");
          }}
          className="space-y-5 xl:col-span-8"
        >
        <Panel title="Informasi utama" description="Nama listing, kategori, dan posisi kavling.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <PropertyField
                label="Nama properti"
                name="title"
                value={form.title}
                onChange={setField("title")}
                required
                placeholder="Contoh: Rumah Tipe 45 — Kavling B"
                error={errors.title}
                hint="Nama ini yang dilihat calon pembeli di katalog."
              />
            </div>

            <PropertySelect
              label="Kategori"
              name="categoryId"
              value={form.categoryId}
              onChange={setField("categoryId")}
              options={categoryOptions}
              required
              error={errors.categoryId}
            />

            <PropertySelect
              label="Perumahan / cluster"
              name="projectId"
              value={form.projectId}
              onChange={setField("projectId")}
              options={projectOptions}
              required
              error={errors.projectId}
            />

            <PropertyField
              label="Nomor kavling / unit"
              name="unit"
              value={form.unit}
              onChange={setField("unit")}
              required
              placeholder="Contoh: B-07"
              error={errors.unit}
            />

            <PropertyField
              label="Harga"
              name="price"
              type="text"
              inputMode="numeric"
              prefix="Rp"
              value={form.price}
              onChange={setField("price")}
              required
              placeholder="735000000"
              error={errors.price}
              hint={`Tanpa titik atau koma. ${pricePreview}`}
            />
          </div>
        </Panel>

        <Panel title="Luas dan ruang" description="Ukuran tanah, bangunan, dan jumlah ruang.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <PropertyField
              label="Luas tanah"
              name="landArea"
              inputMode="numeric"
              suffix="m²"
              value={form.landArea}
              onChange={setField("landArea")}
              required
              placeholder="84"
              error={errors.landArea}
            />
            <PropertyField
              label="Luas bangunan"
              name="buildingArea"
              inputMode="numeric"
              suffix="m²"
              value={form.buildingArea}
              onChange={setField("buildingArea")}
              required
              placeholder="45"
              error={errors.buildingArea}
            />
            <PropertyField
              label="Jumlah lantai"
              name="floors"
              inputMode="numeric"
              suffix="lantai"
              value={form.floors}
              onChange={setField("floors")}
              required
              placeholder="1"
              error={errors.floors}
            />
            <PropertyField
              label="Kamar tidur"
              name="bedrooms"
              inputMode="numeric"
              value={form.bedrooms}
              onChange={setField("bedrooms")}
              required
              placeholder="3"
              error={errors.bedrooms}
            />
            <PropertyField
              label="Kamar mandi"
              name="bathrooms"
              inputMode="numeric"
              value={form.bathrooms}
              onChange={setField("bathrooms")}
              required
              placeholder="2"
              error={errors.bathrooms}
            />
          </div>
        </Panel>

        <Panel title="Foto properti" description="Maksimal 8 foto, JPG/PNG, 2 MB per foto.">
          <div className="mt-4">
            <PhotoUploader onFilesChange={handlePhotoFilesChange} />
          </div>
        </Panel>

        <Panel title="Lokasi" description="Alamat tampil di katalog; titik koordinat dipakai peta GIS.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <PropertyField
                label="Alamat lengkap"
                name="address"
                value={form.address}
                onChange={setField("address")}
                required
                placeholder="Jl. Ngesrep Timur V No. 21"
                error={errors.address}
              />
            </div>

            <PropertyField
              label="Kota / kabupaten"
              name="city"
              value={form.city}
              onChange={setField("city")}
              required
              error={errors.city}
            />
          </div>

          <div className="mt-4">
            <p className="mb-1.5 text-[13px] font-semibold text-ag-slate">Titik koordinat</p>
            <MapPickerClient
              latitude={form.latitude}
              longitude={form.longitude}
              error={errors.latitude || errors.longitude}
              onPick={({ latitude, longitude }) => {
                setForm((current) => ({
                  ...current,
                  latitude: String(latitude),
                  longitude: String(longitude),
                }));
                setErrors((current) => ({ ...current, latitude: undefined, longitude: undefined }));
              }}
            />

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PropertyField
                label="Latitude"
                name="latitude"
                inputMode="decimal"
                mono
                value={form.latitude}
                onChange={setField("latitude")}
                placeholder="-7.053110"
                error={errors.latitude}
                hint="Nilai berubah otomatis saat peta diklik atau titik digeser."
              />
              <PropertyField
                label="Longitude"
                name="longitude"
                inputMode="decimal"
                mono
                value={form.longitude}
                onChange={setField("longitude")}
                placeholder="110.437720"
                error={errors.longitude}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Deskripsi" description="Ceritakan keunggulan unit secara jujur dan spesifik.">
          <PropertyTextarea
            label="Deskripsi properti"
            name="description"
            value={form.description}
            onChange={setField("description")}
            maxLength={1000}
            rows={6}
            placeholder="Contoh: Desain tropis modern dengan pencahayaan alami dari dua sisi..."
            error={errors.description}
            hint="Minimal 20 karakter bila diisi. Hindari kata berlebihan tanpa bukti."
          />
        </Panel>

        <KeyFieldNotice mode={mode} property={property} form={form} />

        <div className="flex flex-wrap items-center justify-end gap-2.5 rounded-dash border border-ag-line bg-white px-5 py-4">
          <ActionButton as="link" href="/dashboard/penjual/properti" variant="outline">
            {locked ? "Kembali ke daftar" : "Batal"}
          </ActionButton>
          {options.draft ? (
            <ActionButton
              variant="forest"
              type="button"
              onClick={() => submit("DRAFT")}
              disabled={locked}
            >
              Simpan sebagai draft
            </ActionButton>
          ) : null}
          {options.verify ? (
            <ActionButton
              type="submit"
              variant="primary"
              disabled={locked || submitting}
              >
                {submitting
                  ? "Menyimpan..."
                  : isEdit
                  ? "Simpan & kirim ulang"
                  : "Kirim untuk verifikasi"}
            </ActionButton>
          ) : null}
        </div>
      </form>

        <aside className="space-y-5 xl:col-span-4">
          <Panel title="Status listing" description="Alur verifikasi listing Anda.">
          <ol className="space-y-3">
            <StatusStep
              active={!isEdit || property?.listingStatus === "DRAFT"}
              title="Draft"
              description="Listing tersimpan tetapi belum dikirim ke admin."
            />
            <StatusStep
              active={(!isEdit && !locked) || property?.listingStatus === "PENDING"}
              title="Menunggu verifikasi"
              description="Admin memeriksa kelengkapan data, foto, dan koordinat."
            />
            <StatusStep
              active={property?.listingStatus === "VERIFIED"}
              title="Terverifikasi"
              description="Listing tayang di katalog publik dan bisa menerima pengajuan."
            />
            <StatusStep
              active={property?.listingStatus === "REJECTED"}
              title="Ditolak"
              description="Alasan penolakan muncul di halaman properti; perbaiki lalu kirim ulang."
            />
            <StatusStep
              active={property?.listingStatus === "HIDDEN"}
              title="Disembunyikan"
              description="Listing tidak tayang; kirim untuk verifikasi agar tampil kembali."
            />
          </ol>
        </Panel>

        <Panel title="Panduan singkat">
          <ul className="space-y-2 text-[12.5px] leading-relaxed text-ag-slate-secondary">
            <li>Harga diisi angka utuh rupiah, tanpa titik atau kata “jt”.</li>
            <li>Foto pertama otomatis menjadi foto utama listing.</li>
            <li>Titik peta harus sesuai dokumen tanah; koordinat 0,0 ditolak.</li>
            <li>
              Mengubah harga atau lokasi pada listing terverifikasi mengirimnya kembali ke
              verifikasi admin.
            </li>
          </ul>
        </Panel>

        {saved ? (
          <Modal
            open
            onClose={() => setSaved(null)}
            title={saved.submission === "DRAFT" ? "Draft belum tersimpan" : "Belum terkirim"}
            description="Modul database properti belum tersambung ke aplikasi."
            footer={
              <ActionButton variant="outline" size="md" onClick={() => setSaved(null)}>
                Tutup
              </ActionButton>
            }
          >
            <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
              Data formulir sudah lolos validasi. Setelah penyimpanan aktif, listing akan disimpan
              sebagai{" "}
              <strong className="font-semibold text-ag-slate">
                {saved.submission === "DRAFT" ? "draft" : "menunggu verifikasi"}
              </strong>{" "}
              — tidak ada yang tercatat ke sistem saat ini.
            </p>
          </Modal>
        ) : null}
        </aside>
      </fieldset>
    </div>
  );
}

function StatusStep({ title, description, active = false }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-ag-gold-base" : "bg-slate-300"
        }`}
      />
      <div>
        <p className={`text-[13px] font-semibold ${active ? "text-ag-forest" : "text-ag-slate"}`}>
          {title}
          {active ? <span className="ml-1.5 text-[11px] font-medium text-ag-slate-muted">(sekarang)</span> : null}
        </p>
        <p className="text-[12px] leading-relaxed text-ag-slate-secondary">{description}</p>
      </div>
    </li>
  );
}

/**
 * Peringatan SRS-F-SEL-08: perubahan field kunci pada listing VERIFIED
 * mengembalikannya ke PENDING. Ditampilkan hanya bila nilai benar-benar beda.
 */
function KeyFieldNotice({ mode, property, form }) {
  if (mode !== "edit" || property?.listingStatus !== "VERIFIED") return null;

  const changed = changedKeyFields(property, form);

  if (changed.length === 0) return null;

  const labels = { price: "harga", latitude: "latitude", longitude: "longitude", address: "alamat" };

  return (
    <p
      role="status"
      className="rounded-dash border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-800"
    >
      Anda mengubah {changed.map((key) => labels[key]).join(", ")}. Listing ini sudah terverifikasi,
      sehingga menyimpan perubahan akan mengembalikannya ke status menunggu verifikasi admin
      (SRS-F-SEL-08).
    </p>
  );
}
