import Link from "next/link";

/**
 * Wordmark brand. Dua varian sesuai dokumen desain:
 *  - `stacked` (default): "SANG GROUP" di atas "ESTATE SYSTEM", dipakai halaman auth.
 *  - `inline`: lambang segi berisi emas + "SANG GROUP", dipakai navbar publik.
 * Dipusatkan di sini supaya tidak ada salinan kedua.
 */
export default function BrandMark({
  tone = "light",
  href = "/",
  size = "md",
  variant = "stacked",
}) {
  const isLight = tone === "light";

  if (variant === "inline") {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2.5 no-underline"
        aria-label="Sang Group — beranda"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand-gold"
        >
          <span className="h-3.5 w-3.5 rotate-45 border border-brand-gold" />
        </span>
        <span className="text-[15px] font-semibold tracking-[0.12em] text-brand-cream">
          SANG GROUP
        </span>
      </Link>
    );
  }

  const nameClass =
    size === "lg"
      ? "text-2xl font-bold tracking-[0.18em]"
      : "text-lg font-bold tracking-[0.16em]";

  return (
    <Link
      href={href}
      className="inline-flex flex-col gap-0.5 no-underline"
      aria-label="Sang Group — beranda"
    >
      <span
        className={`${nameClass} ${isLight ? "text-brand-cream" : "text-brand-ink"}`}
      >
        SANG GROUP
      </span>
      <span
        className={`text-[10px] font-medium tracking-[0.32em] ${
          isLight ? "text-brand-gold" : "text-muted"
        }`}
      >
        ESTATE SYSTEM
      </span>
    </Link>
  );
}
