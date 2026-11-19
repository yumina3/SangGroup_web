import Link from "next/link";

import BuyerPageHeader from "@/components/dashboard/buyer/BuyerPageHeader";
import {
  IconArrowRight,
  IconMail,
  IconMessage,
  IconPhone,
  IconPin,
  IconUsers,
} from "@/components/dashboard/icons";
import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/dashboard/format";
import { isActiveInquiry } from "@/lib/dashboard/inquiry-status";
import { listBuyerInquiries } from "@/lib/properties/inquiries";
import { KONTAK } from "@/lib/site/kontak";

export const metadata = { title: "Pesan & Konsultasi" };

/** Halaman ini membaca sesi dan pengajuan pada setiap request. */
export const instant = false;

function associatedAgent(inquiry) {
  const update = [...inquiry.history]
    .reverse()
    .find((item) => item.actorRole === "agent" && item.actorName);

  return update
    ? { name: update.actorName, since: update.createdAt }
    : null;
}

export default async function BuyerMessagesPage() {
  const profile = await requireRole("buyer", "/dashboard/pembeli/pesan");
  const result = await listBuyerInquiries(profile.id);
  const inquiries = result.ok ? result.inquiries : [];
  const active = inquiries.filter((item) => isActiveInquiry(item.status));
  const advisor = inquiries.map(associatedAgent).find(Boolean) ?? null;
  const phoneChannel = KONTAK.channels.find((item) => item.id === "telepon");
  const emailChannel = KONTAK.channels.find((item) => item.id === "email");
  const channels = [phoneChannel, emailChannel].filter(Boolean);

  return (
    <div className="space-y-6">
      <BuyerPageHeader
        icon={IconMessage}
        eyebrow="Akun pembeli"
        title="Pesan & Konsultasi"
        description="Kanal komunikasi resmi dengan tim pemasaran SANG Group. Obrolan langsung di dalam akun belum tersedia, sehingga seluruh percakapan berjalan lewat telepon, email, atau formulir kontak."
        counterLabel="Pengajuan berjalan"
        counterValue={result.ok ? active.length : "—"}
        primary={{ href: "/kontak", label: "Kirim Pesan" }}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section
          aria-labelledby="judul-advisor"
          className="flex flex-col rounded-xl border border-brand-line bg-white p-6 shadow-sm sm:p-8"
        >
          <h2
            id="judul-advisor"
            className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-ink"
          >
            Advisor pendamping Anda
          </h2>

          {advisor ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-deep text-brand-gold ring-1 ring-brand-gold/40">
                  <IconUsers size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-brand-ink">
                    {advisor.name}
                  </p>
                  <p className="text-[11px] text-muted">
                    Menangani pengajuan Anda sejak {formatDate(advisor.since)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-muted">
                Hubungi advisor melalui kanal resmi di samping untuk
                menanyakan ketersediaan unit, simulasi pembiayaan, atau
                perubahan jadwal kunjungan. Nama advisor diambil dari catatan
                tindak lanjut pengajuan terakhir Anda.
              </p>
            </>
          ) : (
            <p className="mt-4 text-[12px] leading-relaxed text-muted">
              Belum ada advisor yang tercatat menangani pengajuan Anda. Ajukan
              kunjungan atau minat beli agar tim pemasaran mendampingi Anda,
              atau langsung hubungi kanal resmi di samping.
            </p>
          )}

          <div className="mt-5 rounded-lg border border-dashed border-brand-line bg-brand-cream/40 p-4">
            <p className="text-[11.5px] font-bold text-brand-ink">
              Obrolan langsung belum tersedia
            </p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
              Riwayat chat tidak disimpan di akun ini. Tidak ada percakapan
              contoh yang ditampilkan agar Anda tidak mengira pesan sudah
              terkirim. Gunakan kanal resmi untuk setiap pertanyaan.
            </p>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Link
              href="/kontak"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-deep px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-cream no-underline transition-colors hover:bg-brand-alt"
            >
              Buka Formulir Kontak
              <IconArrowRight size={15} />
            </Link>
            <Link
              href="/dashboard/pembeli/jadwal"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-brand-line px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline transition-colors hover:border-brand-gold"
            >
              Lihat Jadwal
            </Link>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section
            aria-labelledby="judul-kanal"
            className="rounded-xl border border-brand-line bg-white p-5 shadow-sm"
          >
            <h2
              id="judul-kanal"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink"
            >
              Kanal resmi
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {channels.map((channel) => {
                const Icon = channel.id === "telepon" ? IconPhone : IconMail;

                return (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      className="flex items-start gap-2.5 text-[12px] text-brand-ink no-underline transition-colors hover:text-brand-gold"
                    >
                      <Icon size={15} className="mt-0.5 shrink-0 text-brand-gold" />
                      <span>
                        <span className="block font-semibold">
                          {channel.label}
                        </span>
                        <span className="break-all text-muted">
                          {channel.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-xl border border-brand-line bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink">
              <IconPin size={14} className="text-brand-gold" />
              Marketing Gallery
            </h2>
            <p className="mt-2 text-[11.5px] font-semibold text-brand-ink">
              {KONTAK.office.hours}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
              {KONTAK.office.address}
            </p>
            <Link
              href="/lokasi"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-brand-deep no-underline hover:text-brand-gold"
            >
              Lihat Lokasi
              <IconArrowRight size={13} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
