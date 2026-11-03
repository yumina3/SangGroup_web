import Link from "next/link";

const VARIANTS = {
  primary: "bg-ag-gold text-white hover:bg-[#b3853a]",
  forest: "bg-ag-forest text-white hover:bg-ag-forest-medium",
  outline: "border border-ag-line bg-white text-ag-slate hover:bg-ag-ivory-surface",
  ghost: "text-ag-slate hover:bg-ag-surface-low",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const SIZES = {
  sm: "h-9 px-3 text-[12px] gap-1.5",
  md: "h-10 px-4 text-[13px] gap-2",
  lg: "h-11 px-5 text-[13px] gap-2",
};

/**
 * Tombol/link baku dashboard agen.
 *
 * - `pending` menonaktifkan tombol dan menampilkan tahap proses agar klik
 *   ganda tidak terjadi (SRS-N-USE-03).
 * - `flush` dipakai di dalam baris form yang sudah berisi tombol batal.
 * - Navigasi internal memakai next/link.
 */
export default function ActionButton({
  as = "button",
  href,
  variant = "primary",
  size = "md",
  pending = false,
  pendingLabel = "Memproses…",
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "inline-flex items-center justify-center rounded-dash font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    className,
  ].join(" ");

  if (as === "link" && href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={classes}
      {...rest}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
