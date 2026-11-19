"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";

import {
  removeFavoriteAction,
  toggleFavoriteAction,
} from "@/lib/favorites/actions";

function HeartIcon({ filled, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      aria-hidden="true"
    >
      <path
        d="M12 20.3 4.9 13.4a4.8 4.8 0 0 1 0-6.9 4.9 4.9 0 0 1 6.9 0l.2.2.2-.2a4.9 4.9 0 0 1 6.9 0 4.8 4.8 0 0 1 0 6.9L12 20.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Tombol favorit untuk kartu katalog dan halaman detail.
 *
 * - Tamu: tautan ke login pembeli dengan `next` halaman saat ini.
 * - Akun non-pembeli: tombol nonaktif dengan penjelasan.
 * - Pembeli aktif: toggle optimistis ke Server Action; hasil akhir tetap
 *   dibaca ulang dari database lewat revalidatePath.
 */
export default function FavoriteButton({
  propertyId,
  initialFavorite = false,
  isAuthenticated = false,
  isBuyer = false,
  isActive = true,
  accountStatus = null,
  loginHref = "/login",
  removeOnly = false,
  showLabel = false,
  compact = false,
  className = "",
}) {
  const [favorite, setFavorite] = useOptimistic(initialFavorite);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const sizeClass = showLabel
    ? "h-10 gap-2 px-4 text-[10px] font-bold uppercase tracking-[0.1em]"
    : compact
      ? "h-8 w-8"
      : "h-10 w-10";
  const iconSize = compact && !showLabel ? 14 : 18;
  const toneClass = favorite
    ? "border-[#0d3b2e] bg-[#0d3b2e] text-[#e6c875]"
    : "border-white/60 bg-white/95 text-[#0d3b2e] hover:bg-white";
  const baseClass = `inline-flex items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass}`;

  if (!isAuthenticated) {
    return (
      <Link
        href={loginHref}
        aria-label="Masuk untuk menyimpan properti ini ke favorit"
        title="Masuk untuk menyimpan favorit"
        className={`${baseClass} border-white/60 bg-white/95 text-[#0d3b2e] no-underline hover:bg-white ${className}`}
      >
        <HeartIcon filled={false} size={iconSize} />
        {showLabel ? <span>Masuk untuk Favorit</span> : null}
      </Link>
    );
  }

  if (!isBuyer) {
    return (
      <button
        type="button"
        disabled
        aria-label="Favorit hanya tersedia untuk akun pembeli"
        title="Favorit hanya tersedia untuk akun pembeli"
        className={`${baseClass} border-white/60 bg-white/95 text-[#0d3b2e] ${className}`}
      >
        <HeartIcon filled={false} size={iconSize} />
        {showLabel ? <span>Favorit</span> : null}
      </button>
    );
  }

  if (!isActive) {
    const reason = accountStatus || "inactive";
    return (
      <Link
        href={`/akun/nonaktif?reason=${encodeURIComponent(reason)}`}
        aria-label="Akun belum aktif, buka halaman status akun"
        title="Akun belum aktif"
        className={`${baseClass} border-white/60 bg-white/95 text-[#0d3b2e] no-underline hover:bg-white ${className}`}
      >
        <HeartIcon filled={false} size={iconSize} />
        {showLabel ? <span>Akun Belum Aktif</span> : null}
      </Link>
    );
  }

  function handleClick() {
    if (pending) return;

    setError(null);
    startTransition(async () => {
      setFavorite(!favorite);
      const action = removeOnly ? removeFavoriteAction : toggleFavoriteAction;
      const result = await action(propertyId);

      if (!result?.ok) {
        setError({
          message: result?.message ?? "Favorit belum dapat diperbarui.",
          code: result?.code ?? null,
        });
      }
    });
  }

  const label =
    removeOnly || favorite ? "Hapus dari favorit" : "Simpan ke favorit";
  // Pembungkus harus tetap menjadi acuan posisi tooltip galat. Bila pemanggil
  // sudah memberi posisi (mis. `absolute right-3 top-3`), jangan tambahkan
  // `relative` karena utility itu akan menimpa posisi tersebut.
  const hasPositionClass = /(^|\s)(absolute|fixed|relative|sticky)(\s|$)/.test(
    className,
  );
  const wrapperClass = hasPositionClass ? className : `relative ${className}`;

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={favorite}
        aria-busy={pending || undefined}
        aria-label={label}
        title={label}
        className={`${baseClass} ${toneClass}`}
      >
        <HeartIcon filled={favorite} size={iconSize} />
        {showLabel ? (
          <span>{favorite ? "Tersimpan" : "Simpan Favorit"}</span>
        ) : null}
      </button>

      {error ? (
        <span
          role="status"
          className="absolute right-0 top-full z-30 mt-2 w-56 rounded-md border border-red-200 bg-white px-3 py-2 text-left text-[11px] leading-snug text-red-700 shadow-lg"
        >
          {error.message}
          {error.code === "unauthenticated" ? (
            <>
              {" "}
              <Link
                href={loginHref}
                className="font-semibold underline"
              >
                Masuk
              </Link>
            </>
          ) : null}
          {error.code === "inactive" ? (
            <>
              {" "}
              <Link
                href={`/akun/nonaktif?reason=${encodeURIComponent(accountStatus || "inactive")}`}
                className="font-semibold underline"
              >
                Lihat status akun
              </Link>
            </>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
