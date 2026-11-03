"use client";

import { useMemo, useRef, useState } from "react";

import { IconClose, IconPlus } from "@/components/dashboard/icons";

/** Batas foto yang ditampilkan di UI sekaligus divalidasi klien (SRS-F-FILE-05). */
export const PHOTO_LIMITS = {
  maxFiles: 8,
  maxBytes: 2 * 1024 * 1024,
  accept: "image/jpeg,image/png",
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Pemilih foto properti (SRS-F-SEL-05).
 *
 * Validasi klien: tipe JPEG/PNG, maksimal 2 MB per foto, maksimal 8 foto.
 * Batas yang sama wajib diperiksa ulang di server sebelum menerbitkan signed
 * upload URL (SRS-F-FILE-02).
 *
 * Karena Supabase Storage belum dikonfigurasi, berkas hanya ditinjau di
 * perangkat (pratinjau object URL) dan tidak dikirim ke server. Catatan itu
 * ditampilkan apa adanya, bukan disembunyikan.
 */
export default function PhotoUploader() {
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);
  const counter = useRef(0);

  const primaryId = useMemo(() => photos[0]?.id ?? null, [photos]);

  function addFiles(fileList) {
    const incoming = Array.from(fileList ?? []);
    const nextErrors = [];
    const accepted = [];

    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        nextErrors.push(`${file.name}: format harus JPG atau PNG.`);
        continue;
      }
      if (file.size > PHOTO_LIMITS.maxBytes) {
        nextErrors.push(`${file.name}: ukuran ${formatBytes(file.size)} melebihi batas 2 MB.`);
        continue;
      }
      accepted.push(file);
    }

    setPhotos((current) => {
      const room = Math.max(PHOTO_LIMITS.maxFiles - current.length, 0);
      if (accepted.length > room) {
        nextErrors.push(
          room === 0
            ? `Maksimal ${PHOTO_LIMITS.maxFiles} foto per listing.`
            : `Hanya ${room} foto lagi yang bisa ditambahkan (maksimal ${PHOTO_LIMITS.maxFiles}).`,
        );
      }

      const added = accepted.slice(0, room).map((file) => {
        counter.current += 1;
        return {
          id: `photo-${counter.current}`,
          name: file.name,
          size: file.size,
          url: URL.createObjectURL(file),
        };
      });

      return [...current, ...added];
    });

    setErrors(nextErrors);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removePhoto(id) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function makePrimary(id) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (!target) return current;
      return [target, ...current.filter((photo) => photo.id !== id)];
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-ag-slate-secondary">
          <span className="font-semibold text-ag-slate">{photos.length}</span> dari{" "}
          {PHOTO_LIMITS.maxFiles} foto
        </p>
        <p className="text-[11.5px] text-ag-slate-muted">
          JPG/PNG · maksimal 2 MB per foto · foto pertama menjadi foto utama
        </p>
      </div>

      <div className="rounded-dash border-2 border-dashed border-ag-line bg-ag-ivory-surface/60 p-6 text-center">
        <p className="text-[13px] font-semibold text-ag-slate">
          Tarik foto ke sini atau pilih dari perangkat
        </p>
        <p className="mt-1 text-[12px] text-ag-slate-secondary">
          Batas {PHOTO_LIMITS.maxFiles} foto per listing, 2 MB per foto.
        </p>

        <label className="mt-3 inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-dash border border-ag-line bg-white px-3 text-[12px] font-semibold text-ag-forest hover:bg-ag-surface-low">
          <IconPlus size={16} />
          Pilih berkas
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={PHOTO_LIMITS.accept}
            onChange={(event) => addFiles(event.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {errors.length > 0 ? (
        <ul role="alert" className="space-y-1 rounded-dash border border-red-200 bg-red-50 px-3 py-2">
          {errors.map((message) => (
            <li key={message} className="text-[12px] font-medium text-red-700">
              {message}
            </li>
          ))}
        </ul>
      ) : null}

      {photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => {
            const isPrimary = photo.id === primaryId;
            return (
              <li
                key={photo.id}
                className="overflow-hidden rounded-dash border border-ag-line bg-white"
              >
                <div className="relative h-32 w-full bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  {isPrimary ? (
                    <span className="absolute left-2 top-2 rounded-tag bg-ag-forest px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ag-gold-light">
                      Foto utama
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-tag bg-slate-800/80 text-white hover:bg-red-600"
                  >
                    <IconClose size={14} />
                    <span className="sr-only">Hapus {photo.name}</span>
                  </button>
                </div>

                <div className="space-y-2 p-2.5">
                  <p className="truncate text-[12px] font-medium text-ag-slate" title={photo.name}>
                    {photo.name}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-ag-slate-muted">
                      {formatBytes(photo.size)}
                    </span>
                    {isPrimary ? (
                      <span className="text-[11px] font-semibold text-ag-forest">Utama</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => makePrimary(photo.id)}
                        className="text-[11px] font-semibold text-ag-gold hover:underline"
                      >
                        Jadikan utama
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="rounded-dash border border-ag-line bg-ag-surface-low px-3 py-2 text-[12px] leading-relaxed text-ag-slate-secondary">
        Penyimpanan foto ke Supabase Storage belum dikonfigurasi. Berkas di atas
        hanya ditinjau di perangkat ini dan belum dikirim ke server.
      </p>
    </div>
  );
}
