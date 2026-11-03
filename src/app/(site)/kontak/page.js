import { KONTAK } from "@/lib/site/kontak";

export const metadata = {
  title: "Kontak",
  description:
    "Hubungi SANG Group Semarang untuk konsultasi hunian: telepon, WhatsApp, email, atau kunjungi kantor pemasaran di Jl. Diponegoro No. 88.",
};

/**
 * Halaman Kontak (/kontak).
 *
 * Sumber: docs/site/kontak_sang_group_semarang/code.html — dua section:
 * 1. Hero + kanal kontak + form pesan
 * 2. Kantor & gallery
 *
 * Navbar dan footer dipasang oleh layout grup (site), bukan di sini.
 */
export default function KontakPage() {
  const inputClass =
    "h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-sans text-[12.5px] text-[#1b2a22] placeholder:text-gray-400 focus:border-[#c5a869] focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/15";
  const labelClass =
    "font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500";

  return (
    <>
      {/* ============ 1. HERO + FORM ============ */}
      <section className="relative w-full overflow-hidden bg-[#0f4c3a]">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={KONTAK.hero.image}
            alt={KONTAK.hero.alt}
            className="h-full w-full object-cover brightness-[0.45]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-br from-[#0f4c3a]/95 via-[#0f4c3a]/85 to-[#0f4c3a]/60"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-16 lg:py-24">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-[#e6c875]">
            {KONTAK.hero.eyebrow}
          </span>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {KONTAK.hero.title}
          </h1>
          <p className="mt-4 font-sans text-sm text-white/75">{KONTAK.hero.body}</p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Kanal kontak */}
            <ul className="flex flex-col gap-3">
              {KONTAK.channels.map((channel) => (
                <li key={channel.id}>
                  <a
                    href={channel.href}
                    className="flex flex-col rounded-lg border border-white/15 bg-white/5 px-5 py-4 no-underline backdrop-blur-sm transition-colors hover:border-[#c5a869]/50 hover:bg-white/10"
                  >
                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-[#c5a869]">
                      {channel.label}
                    </span>
                    <span className="mt-1 font-sans text-[13px] font-medium text-white">
                      {channel.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Form */}
            <div className="rounded-xl bg-white p-6 shadow-2xl sm:p-8">
              <h2 className="font-sans text-xl font-bold text-[#0d3b2e]">
                {KONTAK.form.title}
              </h2>

              <form className="mt-5 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="k-nama" className={labelClass}>
                      {KONTAK.form.nameLabel}
                    </label>
                    <input
                      id="k-nama"
                      name="nama"
                      type="text"
                      autoComplete="name"
                      placeholder={KONTAK.form.namePlaceholder}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="k-wa" className={labelClass}>
                      {KONTAK.form.phoneLabel}
                    </label>
                    <input
                      id="k-wa"
                      name="whatsapp"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={KONTAK.form.phonePlaceholder}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-email" className={labelClass}>
                    {KONTAK.form.emailLabel}
                  </label>
                  <input
                    id="k-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={KONTAK.form.emailPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-cluster" className={labelClass}>
                    {KONTAK.form.clusterLabel}
                  </label>
                  <select id="k-cluster" name="cluster" className={inputClass}>
                    {KONTAK.form.clusters.map((cluster) => (
                      <option key={cluster} value={cluster}>
                        {cluster}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="k-pesan" className={labelClass}>
                    {KONTAK.form.messageLabel}
                  </label>
                  <textarea
                    id="k-pesan"
                    name="pesan"
                    rows={4}
                    placeholder={KONTAK.form.messagePlaceholder}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-sans text-[12.5px] text-[#1b2a22] placeholder:text-gray-400 focus:border-[#c5a869] focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/15"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-11 items-center justify-center rounded-md bg-[#0d3b2e] font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#134e3f]"
                >
                  {KONTAK.form.submit}
                </button>

                <p className="font-sans text-[9.5px] text-gray-400">
                  {KONTAK.form.privacy}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. KANTOR ============ */}
      <section id="kantor" className="w-full bg-[#f5f5f2] px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-[#0d3b2e] md:text-4xl">
            {KONTAK.office.title}
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-[13px] leading-relaxed text-stone-600">
            {KONTAK.office.body}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#b39556]">
                {KONTAK.office.addressLabel}
              </p>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#1b2a22]">
                {KONTAK.office.address}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#b39556]">
                {KONTAK.office.hoursLabel}
              </p>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#1b2a22]">
                {KONTAK.office.hours}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
