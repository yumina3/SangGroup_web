"use client";

import { useState } from "react";

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
import { AGENT_CATEGORY_OPTIONS } from "@/lib/dashboard/agent-data";
import { formatRupiah } from "@/lib/dashboard/format";
import { KEY_FIELDS, validatePropertyForm } from "@/lib/validators/property";

const CATEGORY_OPTIONS = AGENT_CATEGORY_OPTIONS.map((category) => ({
  value: category,
  label: category,
}));

function emptyForm() {
  return {
    title: "",
    category: AGENT_CATEGORY_OPTIONS[0],
    cluster: "",
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
    category: property.category ?? AGENT_CATEGORY_OPTIONS[0],
    cluster: property.cluster ?? "",
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
    latitude: String(property.latitude ?? ""),
    longitude: String(property.longitude ?? ""),
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
 * "berhasil" palsu.
 */
export default function PropertyForm({ mode = "create", property = null }) {
  const toast = useToast();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(() => (property ? formFromProperty(property) : emptyForm()));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);

  // Validator dipakai langsung (bukan `import()` di dalam handler): form ini
  // kecil dan validasinya harus jalan sinkron saat tombol ditekan.
  const priceNumber = Number(form.price);
  const pricePreview = Number.isFinite(priceNumber) && priceNumber > 0 ? formatRupiah(priceNumber) : "—";

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(submission) {
    const result = validatePropertyForm(form, { submission });

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setSaved(null);
      toast.push("Beberapa isian belum benar. Periksa pesan berwarna merah.", "danger");
      const firstInvalid = document.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      } else {
        const firstError = Object.keys(result.fieldErrors)[0];
        document.querySelector(`[name="${firstError}"]`)?.focus();
      }
      return;
    }

    setErrors({});
    setSaved({ submission, value: result.value });
    toast.push(
      submission === "DRAFT"
        ? "Draft tidak tersimpan: modul database properti belum tersambung."
        : "Pengajuan verifikasi belum tersimpan: modul database properti belum tersambung.",
      "info",
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
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
              name="category"
              value={form.category}
              onChange={setField("category")}
              options={CATEGORY_OPTIONS}
              required
              error={errors.category}
            />

            <PropertyField
              label="Perumahan / cluster"
              name="cluster"
              value={form.cluster}
              onChange={setField("cluster")}
              required
              placeholder="Contoh: Tembalang Hillcrest"
              error={errors.cluster}
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
          <InfoNotice title="Penyimpanan foto belum aktif">
            Supabase Storage belum dikonfigurasi. Foto hanya ditinjau di perangkat ini dan belum
            dikirim ke server.
          </InfoNotice>
          <div className="mt-4">
            <PhotoUploader />
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
          <ActionButton
            as="link"
            href="/dashboard/penjual/properti"
            variant="outline"
          >
            Batal
          </ActionButton>
          <ActionButton variant="forest" type="button" onClick={() => submit("DRAFT")}>
            Simpan sebagai draft
          </ActionButton>
          <ActionButton
            type="submit"
            variant="primary"
            onClick={() => submit("PENDING")}
          >
            {isEdit ? "Simpan & kirim ulang" : "Kirim untuk verifikasi"}
          </ActionButton>
        </div>
      </form>

      <aside className="space-y-5 xl:col-span-4">
        <Panel title="Status listing" description="Alur verifikasi listing Anda.">
          <ol className="space-y-3">
            <StatusStep
              done
              title="Draft"
              description="Listing disimpan tetapi belum dikirim ke admin."
            />
            <StatusStep
              active={(!isEdit && true) || property?.listingStatus === "PENDING"}
              title="Menunggu verifikasi"
              description="Admin memeriksa kelengkapan data, foto, dan koordinat."
            />
            <StatusStep
              active={property?.listingStatus === "VERIFIED"}
              title="Terverifikasi"
              description="Listing tayang di katalog publik dan bisa menerima pengajuan."
            />
            <StatusStep
              title="Ditolak"
              description="Alasan penolakan muncul di halaman properti; perbaiki lalu kirim ulang."
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
    </div>
  );
}

function StatusStep({ title, description, active = false, done = false }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-ag-gold-base" : done ? "bg-ag-available" : "bg-slate-300"
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

  const changed = KEY_FIELDS.filter((key) => String(property?.[key] ?? "") !== String(form[key] ?? ""));

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
