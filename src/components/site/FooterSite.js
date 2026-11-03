/**
 * Satu-satunya footer untuk role pengguna.
 *
 * Dipakai ulang lewat layout (site)/. Mengikuti berkas code.html di tiap
 * folder docs/site:
 * empat kolom di atas krem, lalu bar bawah dengan hak cipta, plus tombol
 * WhatsApp mengambang.
 */

const FOOTER_COLUMNS = [
  {
    title: "Navigasi Utama",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Koleksi Hunian", href: "/sang-dipa" },
      { label: "Fasilitas Lengkap", href: "/fasilitas" },
      { label: "Location", href: "/lokasi" },
      { label: "Masterplan GIS", href: "/lokasi#gis" },
    ],
  },
  {
    title: "Informasi & Legalitas",
    links: [
      { label: "Berita & Rilis Terbaru", href: "/berita" },
      { label: "Hubungi Konsultan VIP", href: "/kontak" },
      { label: "Sertifikat SHM & PBG/BPN", href: "/kontak" },
      { label: "Kebijakan Privasi", href: "/kontak" },
    ],
  },
];

export default function FooterSite() {
  return (
    <footer className="relative bg-[#08231B] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Kolom 1: identitas */}
          <div>
            <a href="/" className="inline-flex items-baseline leading-none">
              <span className="font-serif text-2xl font-bold italic text-white">Sang</span>
              <span className="mx-1.5 font-serif text-2xl font-bold italic text-[#C5A059]">
                Group
              </span>
            </a>
            <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.28em] text-white/40">
              Residential &amp; Lifestyle Community
            </p>
            <p className="mt-5 max-w-xs font-sans text-[12px] leading-relaxed text-white/60">
              Pengembang perumahan berkelanjutan di Semarang yang memadukan
              arsitektur tropis, tata kota digital, dan kawasan hijau terpadu.
            </p>
          </div>

          {/* Kolom 2 & 3 */}
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-[12px] text-white/60 no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Kolom 4: kantor */}
          <div>
            <h2 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
              Kantor Gallery Semarang
            </h2>
            <div className="mt-4 flex flex-col gap-1.5 font-sans text-[12px] leading-relaxed text-white/60">
              <p>Jl. Diponegoro No. 88, Lahai Sirandu,</p>
              <p>Gajahmungkur, Kota Semarang, Jawa Tengah 50232</p>
              <p className="mt-1">Senin – Minggu, 08.30 – 17.00 WIB</p>
              <p>+62 (024) 841-2026</p>
            </div>

            <a
              href="/kontak"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-[2px] border border-white/30 px-4 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white no-underline transition-colors hover:border-white hover:bg-white/10"
            >
              WhatsApp Tim Sales
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-[10px] text-white/40">
            © 2026 SANG Group. All Rights Reserved. Master Residential Developer Semarang.
          </p>
          <p className="font-sans text-[10px] text-white/40">
            Kantor Pemasaran: Gajahmungkur, Kota Semarang
          </p>
        </div>
      </div>

      <a
        href="/kontak"
        aria-label="Hubungi kami lewat WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1-1-.3-2.4-1-3.7-2.3-1.3-1.3-2-2.7-2.3-3.7-.2-.7-.2-1.2-.1-1.7.1-.5.7-1.5 1.2-1.7.3-.1.7-.1.9.1l1 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.4.7 1 1.4 1.7 1.9.2.1.3.1.5 0l.7-.5c.2-.1.4-.1.6 0l1.9 1c.2.1.2.5.1.9Z" />
        </svg>
      </a>
    </footer>
  );
}
