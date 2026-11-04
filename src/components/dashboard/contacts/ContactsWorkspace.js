"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useToast } from "@/components/dashboard/Toast";
import {
  IconChevronDown,
  IconDownload,
  IconMail,
  IconMessage,
  IconSearch,
} from "@/components/dashboard/icons";
import { CONTACT_STATUS, CONTACT_STATUS_OPTIONS } from "@/lib/dashboard/contact-data";
import {
  formatDate,
  formatDateTime,
  formatRupiah,
  formatTime,
  initialsOf,
} from "@/lib/dashboard/format";

const AVATAR_TONE = {
  BARU: "bg-ag-forest text-white",
  KONSULTASI: "bg-ag-forest-medium text-ag-gold-light",
  DIJADWALKAN: "bg-ag-slate text-white",
  NEGOSIASI: "bg-[#003c2f] text-white",
  DEAL: "bg-emerald-700 text-white",
  SELESAI: "bg-ag-slate-secondary text-white",
  BATAL: "bg-ag-slate-muted text-white",
};

const SCORE_TONE = {
  gold: "text-ag-gold-muted",
  info: "text-blue-700",
  success: "text-emerald-700",
  danger: "text-red-600",
  neutral: "text-ag-slate-secondary",
};

/**
 * Halaman Kontak dashboard agen.
 *
 * Susunan mengikuti docs/agen/contacts_calon_pembeli_sang_group: filter di
 * atas, tabel kontak di kiri, dan panel detail + riwayat di kanan. Di layar
 * sempit tabel menggulir di dalam kontainernya dan panel detail turun ke
 * bawah (SRS-D-07).
 *
 * Data berasal dari `getAgentContacts()` (demo internal). Ekspor CSV dibuat
 * di browser dari baris yang sedang tampil, tanpa mengirim data ke server.
 */
export default function ContactsWorkspace({ contacts, initialContactId, syncLabel }) {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [selectedId, setSelectedId] = useState(initialContactId ?? contacts[0]?.id ?? null);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return contacts.filter((contact) => {
      if (status !== "ALL" && contact.status !== status) return false;
      if (!keyword) return true;

      const haystack = [
        contact.name,
        contact.phone,
        contact.email,
        contact.city,
        contact.source,
        contact.property.title,
        contact.property.cluster,
        contact.property.unit,
        CONTACT_STATUS[contact.status]?.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [contacts, query, status]);

  const selected =
    filtered.find((contact) => contact.id === selectedId) ?? filtered[0] ?? null;
  const hasFilter = Boolean(query.trim()) || status !== "ALL";

  function resetFilters() {
    setQuery("");
    setStatus("ALL");
  }

  function exportCsv() {
    if (filtered.length === 0) return;

    const header = [
      "Nama",
      "Nomor WhatsApp",
      "Email",
      "Domisili",
      "Properti Terakhir",
      "Cluster",
      "Unit",
      "Status Terakhir",
      "Skor Minat",
      "Sumber Kontak",
      "Interaksi Terakhir",
    ];

    const rows = filtered.map((contact) => [
      contact.name,
      contact.phone,
      contact.email,
      contact.city,
      contact.property.title,
      contact.property.cluster,
      contact.property.unit,
      CONTACT_STATUS[contact.status]?.label ?? contact.status,
      contact.score,
      contact.source,
      formatDateTime(contact.lastInteractionAt),
    ]);

    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kontak-calon-pembeli-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 500);

    toast.push(
      `CSV ${filtered.length} kontak dibuat dan diunduh di browser. Tidak ada data yang dikirim ke server.`,
      "success",
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen"]}
        title="Kontak"
        description="Daftar calon pembeli yang pernah menghubungi Anda. Pilih kontak untuk melihat properti yang diminati dan riwayat interaksinya."
        actions={
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-ag-slate-secondary">
            <span>Sinkronisasi terakhir</span>
            <span className="rounded-md bg-ag-surface-low px-2.5 py-1 font-semibold text-ag-forest">
              {syncLabel}
            </span>
          </div>
        }
      />

      <InfoNotice title="Data kontak masih demo internal">
        Daftar ini berasal dari data contoh dashboard. Saat database tersambung, kontak akan diambil
        dari pengajuan dan percakapan milik agen yang sedang login.
      </InfoNotice>

      <div className="flex flex-col gap-3 rounded-dash border border-ag-line bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:min-w-[280px]">
            <IconSearch
              size={19}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-muted"
            />
            <label htmlFor="contact-search" className="sr-only">
              Cari nama, WhatsApp, email, atau properti kontak
            </label>
            <input
              id="contact-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, WhatsApp, atau email..."
              className="h-10 w-full rounded-lg bg-ag-ivory pl-10 pr-3 text-[12.5px] text-ag-slate placeholder:text-ag-slate-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
            />
          </div>

          <div className="relative sm:min-w-[200px]">
            <label htmlFor="contact-status" className="sr-only">
              Filter status terakhir
            </label>
            <select
              id="contact-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg bg-ag-ivory pl-3.5 pr-10 text-[12.5px] font-semibold text-ag-slate focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
            >
              {CONTACT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <IconChevronDown
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <span className="text-[12px] text-ag-slate-secondary">
            Total{" "}
            <strong className="font-bold text-ag-slate">{filtered.length}</strong>{" "}
            {hasFilter ? `dari ${contacts.length} kontak` : "kontak terdata"}
          </span>
          <ActionButton
            variant="outline"
            size="md"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            aria-label="Ekspor daftar kontak ke CSV"
          >
            <IconDownload size={17} className="text-ag-gold" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">
        <section className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] xl:col-span-7">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] table-fixed border-collapse text-left">
                <caption className="sr-only">
                  Daftar calon pembeli yang pernah menghubungi agen. Pilih baris untuk melihat detail
                  dan riwayat interaksi.
                </caption>
                <colgroup>
                  <col className="w-[25%]" />
                  <col className="w-[20%]" />
                  <col className="w-[22%]" />
                  <col className="w-[18%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr className="bg-ag-surface-low/60 text-[9.5px] font-bold uppercase tracking-wider text-ag-slate-secondary">
                    <th scope="col" className="px-2.5 py-3.5">Nama</th>
                    <th scope="col" className="px-2.5 py-3.5">Nomor WhatsApp</th>
                    <th scope="col" className="px-2.5 py-3.5">Properti Terakhir</th>
                    <th scope="col" className="px-2.5 py-3.5">Status Terakhir</th>
                    <th scope="col" className="px-2.5 py-3.5">Interaksi Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((contact) => {
                    const isSelected = selected?.id === contact.id;
                    const statusMeta = CONTACT_STATUS[contact.status] ?? CONTACT_STATUS.BARU;

                    return (
                      <tr
                        key={contact.id}
                        tabIndex={0}
                        aria-current={isSelected ? "true" : undefined}
                        onClick={() => setSelectedId(contact.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedId(contact.id);
                          }
                        }}
                        className={[
                          "cursor-pointer border-b border-slate-100 transition-colors last:border-0 focus-visible:bg-ag-gold/10",
                          isSelected
                            ? "bg-ag-forest-medium/5 hover:bg-ag-forest-medium/10"
                            : "hover:bg-ag-surface-low/50",
                        ].join(" ")}
                      >
                        <th scope="row" className="px-2.5 py-3.5 text-left">
                          <div className="flex items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold shadow-sm ${
                                AVATAR_TONE[contact.status] ?? AVATAR_TONE.BARU
                              }`}
                            >
                              {initialsOf(contact.name)}
                            </span>
                            <span className="min-w-0">
                              <span
                                className="block truncate text-[12.5px] font-bold text-ag-slate"
                                title={contact.name}
                              >
                                {contact.name}
                              </span>
                              <span className="block truncate text-[10.5px] text-ag-slate-muted">
                                {contact.city}
                              </span>
                              <span className="block truncate text-[10px] text-ag-slate-muted">
                                {contact.email}
                              </span>
                            </span>
                          </div>
                        </th>
                        <td className="whitespace-nowrap px-2.5 py-3.5 text-[10.5px] font-medium text-ag-slate">
                          {contact.phone}
                        </td>
                        <td className="px-2.5 py-3.5">
                          <span
                            className="block truncate text-[11.5px] font-semibold text-ag-forest"
                            title={contact.property.title}
                          >
                            {contact.property.title}
                          </span>
                          <span className="block truncate text-[10.5px] text-ag-slate-secondary">
                            {contact.property.cluster} · Unit {contact.property.unit}
                          </span>
                        </td>
                        <td className="px-2.5 py-3.5">
                          <StatusBadge label={statusMeta.label} tone={statusMeta.tone} />
                        </td>
                        <td className="px-2.5 py-3.5 text-[11px] text-ag-slate-secondary">
                          <span className="block">{formatDate(contact.lastInteractionAt)}</span>
                          <span className="block text-[10px] text-ag-slate-muted">
                            {formatTime(contact.lastInteractionAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-[14px] font-semibold text-ag-slate">
                Tidak ada kontak yang cocok
              </p>
              <p className="mx-auto mt-1 max-w-sm text-[12.5px] leading-relaxed text-ag-slate-secondary">
                Ubah kata kunci atau filter status untuk melihat kontak lain.
              </p>
              {hasFilter ? (
                <ActionButton variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                  Reset filter
                </ActionButton>
              ) : null}
            </div>
          )}
        </section>

        <section
          aria-live="polite"
          aria-label="Detail kontak terpilih"
          className="rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)] xl:col-span-5"
        >
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-[18px] font-bold shadow-md ${
                      AVATAR_TONE[selected.status] ?? AVATAR_TONE.BARU
                    }`}
                  >
                    {initialsOf(selected.name)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-[18px] font-bold text-ag-slate">
                      {selected.name}
                    </h2>
                    <span className="mt-1 inline-flex rounded-full bg-ag-forest-medium/10 px-2.5 py-0.5 text-[10px] font-bold text-ag-forest-medium">
                      {selected.status === "BATAL" ? "Prospek Tidak Aktif" : "Calon Pembeli Aktif"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 rounded-lg bg-ag-surface-low px-3 py-1.5 text-right">
                  <p className="text-[9.5px] font-semibold uppercase tracking-wider text-ag-slate-muted">
                    Skor Minat
                  </p>
                  <p
                    className={`mt-0.5 text-[11.5px] font-bold ${
                      SCORE_TONE[selected.scoreTone] ?? SCORE_TONE.neutral
                    }`}
                  >
                    {selected.score}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 rounded-xl bg-ag-ivory p-4 text-[12px]">
                <InfoRow label="Nomor WhatsApp">
                  <a
                    href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ag-forest hover:underline"
                  >
                    {selected.phone}
                  </a>
                </InfoRow>
                <InfoRow label="Email">
                  <a href={`mailto:${selected.email}`} className="font-medium text-ag-slate hover:underline">
                    {selected.email}
                  </a>
                </InfoRow>
                <InfoRow label="Asal Domisili">
                  <span className="font-semibold text-ag-slate">{selected.city}</span>
                </InfoRow>
                <InfoRow label="Sumber Kontak">
                  <span className="font-semibold text-ag-slate">{selected.source}</span>
                </InfoRow>
                <InfoRow label="Properti Terakhir">
                  <span className="font-semibold text-ag-slate">
                    {selected.property.title}
                    <span className="mt-0.5 block font-normal text-ag-slate-secondary">
                      {selected.property.cluster} · Unit {selected.property.unit} ·{" "}
                      {formatRupiah(selected.property.price)}
                    </span>
                  </span>
                </InfoRow>
              </dl>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ag-gold-base px-4 text-[12px] font-bold text-ag-slate shadow-sm transition-colors hover:bg-ag-gold-light"
                >
                  <IconMessage size={17} />
                  Hubungi WhatsApp
                </a>
                <Link
                  href={`/dashboard/penjual/pesan?contact=${encodeURIComponent(selected.id)}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ag-surface-low px-4 text-[12px] font-bold text-ag-forest transition-colors hover:bg-ag-line"
                >
                  <IconMail size={17} />
                  Kirim Pesan
                </Link>
              </div>

              <div className="mt-5 border-t border-ag-line pt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[13px] font-bold text-ag-slate">
                    Riwayat Pengajuan &amp; Interaksi
                  </h3>
                  <span className="text-[10.5px] text-ag-slate-muted">
                    {selected.history.length} Aktivitas
                  </span>
                </div>

                <ol className="relative mt-4 space-y-4 border-l border-ag-line pl-4">
                  {selected.history.map((activity) => {
                    const activityStatus =
                      CONTACT_STATUS[activity.status] ?? CONTACT_STATUS.SELESAI;

                    return (
                      <li key={activity.id} className="relative pl-4">
                        <span
                          aria-hidden="true"
                          className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                            activity.status === "BARU"
                              ? "bg-ag-gold-base"
                              : activity.status === "BATAL"
                                ? "bg-red-500"
                                : "bg-ag-slate-muted"
                          }`}
                        />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10.5px] text-ag-slate-muted">
                            {formatDateTime(activity.at)}
                          </span>
                          <StatusBadge
                            label={activityStatus.label}
                            tone={activityStatus.tone}
                          />
                        </div>
                        <p className="mt-1 text-[12.5px] font-bold text-ag-slate">
                          {activity.title}
                        </p>
                        <p className="text-[11px] leading-relaxed text-ag-slate-secondary">
                          {activity.propertyLabel}
                        </p>
                        {activity.note ? (
                          <p className="mt-2 rounded-lg bg-ag-ivory p-3 text-[11.5px] leading-relaxed text-ag-slate-secondary">
                            “{activity.note}”
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>

                <p className="mt-5 text-center text-[10.5px] text-ag-slate-muted">
                  Pilih kontak lain di tabel untuk melihat riwayatnya
                </p>
              </div>
            </>
          ) : (
            <div className="px-2 py-10 text-center">
              <p className="text-[14px] font-semibold text-ag-slate">Belum ada kontak terpilih</p>
              <p className="mx-auto mt-1 max-w-xs text-[12.5px] leading-relaxed text-ag-slate-secondary">
                Ubah filter atau pilih salah satu baris kontak untuk melihat detailnya.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-ag-slate-secondary">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}
