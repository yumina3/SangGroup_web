import Link from "next/link";

export const metadata = { title: "Akses Ditolak" };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-brand-cream px-5 py-12">
      <div className="w-full max-w-[440px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
          403
        </p>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-brand-ink">
          Anda tidak memiliki akses ke halaman ini
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Halaman ini hanya tersedia untuk peran tertentu. Silakan kembali ke
          dashboard Anda.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-cream"
        >
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
