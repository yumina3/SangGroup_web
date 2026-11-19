import Link from "next/link";

const WA_SUPPORT =
  "https://wa.me/6281234567890?text=Halo%20SANG%20Group%2C%20saya%20butuh%20bantuan%20terkait%20akun.";

const PORTAL_LABEL = {
  buyer: "Akun Pembeli",
  agent: "Portal Penjual",
  admin: "Portal Admin",
};

function BrandHeader() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 no-underline"
      aria-label="Sang Group — beranda"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0d3b2e] text-[20px] font-semibold italic text-[#c5a869]"
      >
        S
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-bold tracking-[0.16em] text-[#0d3b2e]">
          SANG GROUP
        </span>
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#b39556]">
          Estate System Semarang
        </span>
      </span>
    </Link>
  );
}

/**
 * Kerangka tiga portal login (pembeli, penjual, admin) mengikuti layar
 * `docs/site/login_pengguna`: header minimal, kartu putih di tengah, aksen
 * emas, value proposition, dan trust badge. Tidak memakai navbar situs publik
 * agar pengguna fokus menyelesaikan login.
 */
export default function PortalAuthShell({
  portal = "buyer",
  title,
  description,
  notice = null,
  children,
  valueProps = [],
  valuePropsTitle = "Dengan masuk ke Akun Pembeli SANG Group, Anda dapat:",
  footer = null,
  showBack = true,
  trust = true,
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f9f8f5] text-[#1a1a1a]">
      <header className="border-b border-[#e9e3d7] bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <BrandHeader />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-[11px] font-semibold text-[#0d3b2e] no-underline transition-colors hover:text-[#b39556] sm:inline-flex"
            >
              <span aria-hidden="true">←</span>
              Katalog / Beranda
            </Link>
            <a
              href={WA_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#e4dccb] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0d3b2e] no-underline shadow-sm transition-colors hover:border-[#c5a869] hover:text-[#b39556]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 8.8c.3-.6.6-.6 1-.6h.5c.2 0 .4.1.5.5l.5 1.3c.1.3 0 .5-.2.7l-.5.5c-.1.2-.2.3 0 .6.4.7 1 1.3 1.7 1.7.3.2.4.1.6-.1l.4-.5c.2-.2.4-.3.7-.2l1.3.6c.3.1.5.3.5.5v.5c0 .4-.1.8-.5 1-.4.3-1 .4-1.5.4-2.7 0-5.2-2.3-5.5-5.2 0-.4 0-.9.2-1.2Z"
                  fill="currentColor"
                />
              </svg>
              Bantuan WA
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-5 pb-10 pt-6 sm:px-8">
        <div className="w-full max-w-[480px]">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            {showBack ? (
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-semibold text-[#0d3b2e] no-underline transition-colors hover:text-[#b39556]"
              >
                <span aria-hidden="true">←</span>
                Kembali ke Katalog Properti
              </Link>
            ) : (
              <span />
            )}
            <a
              href={WA_SUPPORT}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 font-semibold text-[#6b7a74] no-underline transition-colors hover:text-[#0d3b2e] sm:inline-flex"
            >
              <span aria-hidden="true" className="text-[#2e9e5b]">
                ●
              </span>
              Butuh bantuan? Hubungi konsultan
            </a>
          </div>

          <section className="mt-5 rounded-xl bg-white p-6 shadow-[0_18px_45px_-18px_rgba(13,59,46,0.28)] ring-1 ring-black/[0.03] sm:p-8">
            <div className="mb-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b39556]">
                {PORTAL_LABEL[portal]}
              </p>
              <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-tight text-[#0d3b2e]">
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-[13px] leading-relaxed text-[#64748b]">
                  {description}
                </p>
              ) : null}
            </div>

            {notice ? <div className="mb-5">{notice}</div> : null}

            {children}

            {valueProps.length > 0 ? (
              <div className="mt-6 rounded-lg bg-[#f3f6fd] p-4">
                <div className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 text-[15px] text-[#b39556]"
                  >
                    ✦
                  </span>
                  <p className="text-[12px] font-semibold leading-snug text-[#0d3b2e]">
                    {valuePropsTitle}
                  </p>
                </div>
                <ol className="mt-3 flex flex-col gap-2">
                  {valueProps.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[11.5px] leading-relaxed text-[#64748b]"
                    >
                      <span className="mt-0.5 text-[10px] font-bold text-[#b39556]">
                        {index + 1}.
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {footer ? (
              <div className="mt-6 text-center text-[12px] leading-relaxed text-[#64748b]">
                {footer}
              </div>
            ) : null}
          </section>

          {trust ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-medium text-[#94a3b8]">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">◇</span>
                Enkripsi SSL 256-Bit
              </span>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">⚖</span>
                Legalitas Terdaftar REI Jateng
              </span>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="px-5 pb-7 text-center text-[10.5px] text-[#94a3b8]">
        © 2026 SANG Group Semarang. Hubungi WhatsApp resmi untuk verifikasi
        keamanan akun.
      </footer>
    </div>
  );
}
