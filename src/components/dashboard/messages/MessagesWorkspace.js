"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import InfoNotice from "@/components/dashboard/InfoNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconCheckDouble,
  IconMap,
  IconMoreVertical,
  IconPaperclip,
  IconPhone,
  IconSearch,
  IconSend,
} from "@/components/dashboard/icons";
import { formatRupiah, initialsOf } from "@/lib/dashboard/format";
import { MESSAGE_QUICK_REPLIES } from "@/lib/dashboard/message-data";

const AVATAR_TONE = {
  BARU: "bg-ag-forest text-white",
  KONSULTASI: "bg-ag-forest-medium text-ag-gold-light",
  DIJADWALKAN: "bg-ag-slate text-white",
  NEGOSIASI: "bg-[#003c2f] text-white",
  DEAL: "bg-emerald-700 text-white",
  BATAL: "bg-ag-slate-muted text-white",
};

const TAB_ACTIVE = "bg-ag-forest text-white shadow-sm";
const TAB_IDLE = "bg-ag-surface-low text-ag-slate-secondary hover:text-ag-slate";

/**
 * Halaman Pesan dashboard agen.
 *
 * Susunan mengikuti docs/agen/messages_obrolan_calon_pembeli_sang_group:
 * daftar percakapan di kiri, ruang obrolan di kanan, respon cepat, dan
 * kolom balasan. Di ponsel daftar dan ruang obrolan bergantian agar tidak
 * berdesakan (SRS-D-07).
 *
 * Data percakapan masih demo internal. Pesan yang dikirim hanya ditambahkan
 * ke state layar dan diberi keterangan pratinjau; belum ada penyimpanan ke
 * database sampai modul pesan tersambung.
 */
export default function MessagesWorkspace({ conversations, initialContactId }) {
  const initialConversation = useMemo(
    () => conversations.find((item) => item.contactId === initialContactId) ?? null,
    [conversations, initialContactId],
  );

  const [activeId, setActiveId] = useState(
    initialConversation?.id ?? conversations[0]?.id ?? null,
  );
  const [mobileChatOpen, setMobileChatOpen] = useState(Boolean(initialConversation));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [readIds, setReadIds] = useState(() => {
    const ids = new Set(conversations.filter((item) => !item.unread).map((item) => item.id));
    if (initialConversation) ids.add(initialConversation.id);
    return ids;
  });
  const [localMessages, setLocalMessages] = useState({});

  const threadRef = useRef(null);
  const inputRef = useRef(null);
  const localIdRef = useRef(0);

  const active = conversations.find((item) => item.id === activeId) ?? null;
  const unreadCount = conversations.filter((item) => !readIds.has(item.id)).length;

  const filteredConversations = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      if (filter === "unread" && readIds.has(conversation.id)) return false;
      if (!keyword) return true;

      return [
        conversation.name,
        conversation.phone,
        conversation.email,
        conversation.city,
        conversation.preview,
        conversation.property.title,
        conversation.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [conversations, query, filter, readIds]);

  const activeMessages = active
    ? [...active.messages, ...(localMessages[active.id] ?? [])]
    : [];
  const messageCount = activeMessages.length;

  useEffect(() => {
    const node = threadRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [activeId, messageCount]);

  function selectConversation(id) {
    setActiveId(id);
    setReadIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setMobileChatOpen(true);
    setDraft("");
  }

  function insertQuickReply(text) {
    setDraft(text);
    inputRef.current?.focus();
  }

  function handleSend(event) {
    event.preventDefault();
    if (!active) return;

    const text = draft.trim();
    if (!text) return;

    localIdRef.current += 1;
    const message = {
      id: `local-${active.id}-${localIdRef.current}`,
      from: "agent",
      body: text,
      timeLabel: "Baru saja",
      status: "sent",
    };

    setLocalMessages((current) => ({
      ...current,
      [active.id]: [...(current[active.id] ?? []), message],
    }));
    setDraft("");
    inputRef.current?.focus();
  }

  function previewOf(conversation) {
    const local = localMessages[conversation.id];
    if (local?.length) return local[local.length - 1].body;
    return conversation.preview;
  }

  function timeOf(conversation) {
    const local = localMessages[conversation.id];
    if (local?.length) return "Baru saja";
    return conversation.lastMessageLabel;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen"]}
        title="Pesan"
        description="Komunikasi langsung dengan calon pembeli dan prospek kaveling. Pilih percakapan untuk membalas dari satu tempat."
        actions={
          <span className="inline-flex items-center rounded-md bg-ag-surface-low px-2.5 py-1 text-[11px] font-semibold text-ag-slate-secondary">
            Demo internal
          </span>
        }
      />

      <InfoNotice title="Pratinjau pesan (belum tersimpan)">
        Percakapan masih memakai data demo internal. Pesan yang Anda kirim hanya muncul di layar
        sampai tabel pesan tersambung ke database.
      </InfoNotice>

      <div className="flex h-[calc(100dvh-13rem)] min-h-[520px] max-h-[820px] overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <aside
          className={`${
            mobileChatOpen ? "hidden" : "flex"
          } w-full shrink-0 flex-col border-ag-line bg-ag-ivory/50 lg:flex lg:w-[320px] lg:border-r`}
          aria-label="Daftar percakapan"
        >
          <div className="bg-white p-3">
            <div className="relative">
              <IconSearch
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-muted"
              />
              <label htmlFor="message-search" className="sr-only">
                Cari percakapan berdasarkan nama, properti, atau isi pesan
              </label>
              <input
                id="message-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari percakapan..."
                className="h-9 w-full rounded-lg bg-ag-surface-low pl-9 pr-3 text-[12px] text-ag-slate placeholder:text-ag-slate-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 pb-2.5">
            <button
              type="button"
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
              className={`rounded-full px-3 py-1 text-[10.5px] font-bold transition-colors ${
                filter === "all" ? TAB_ACTIVE : TAB_IDLE
              }`}
            >
              Semua Pesan ({conversations.length})
            </button>
            <button
              type="button"
              aria-pressed={filter === "unread"}
              onClick={() => setFilter("unread")}
              className={`rounded-full px-3 py-1 text-[10.5px] font-bold transition-colors ${
                filter === "unread" ? TAB_ACTIVE : TAB_IDLE
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {filteredConversations.length > 0 ? (
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === activeId;
                const isUnread = !readIds.has(conversation.id);

                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(conversation.id)}
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`${conversation.name} — ${previewOf(conversation)}${
                        isUnread ? " (belum dibaca)" : ""
                      }`}
                      className={`relative flex w-full items-start gap-3 px-3.5 py-3 text-left transition-colors focus-visible:bg-ag-gold/10 ${
                        isActive ? "bg-ag-surface-low" : "hover:bg-ag-surface-low/60"
                      }`}
                    >
                      {isActive ? (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-0 left-0 w-1 bg-ag-gold-base"
                        />
                      ) : null}

                      <span
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                          AVATAR_TONE[conversation.status] ?? AVATAR_TONE.BARU
                        }`}
                      >
                        {initialsOf(conversation.name)}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[13px] font-bold text-ag-slate">
                            {conversation.name}
                          </span>
                          <span className="shrink-0 text-[10.5px] text-ag-slate-muted">
                            {timeOf(conversation)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-ag-slate-secondary">
                          {previewOf(conversation)}
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-ag-slate-secondary">
                          {conversation.noteTone === "available" ? (
                            <span
                              aria-hidden="true"
                              className="h-2 w-2 shrink-0 rounded-full bg-ag-available"
                            />
                          ) : null}
                          <span
                            className={
                              conversation.noteTone === "gold"
                                ? "font-bold text-ag-gold-muted"
                                : conversation.noteTone === "danger"
                                  ? "font-semibold text-red-600"
                                  : ""
                            }
                          >
                            {conversation.note}
                          </span>
                          {isUnread ? (
                            <span
                              aria-hidden="true"
                              className="ml-auto h-2 w-2 shrink-0 rounded-full bg-ag-gold-base"
                            />
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-10 text-center text-[12px] leading-relaxed text-ag-slate-secondary">
              Tidak ada percakapan pada filter ini.
            </p>
          )}
        </aside>

        <section
          className={`${
            mobileChatOpen ? "flex" : "hidden"
          } min-w-0 flex-1 flex-col bg-white lg:flex`}
          aria-label="Ruang obrolan"
        >
          {active ? (
            <>
              <header className="flex flex-col gap-3 border-b border-ag-line bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileChatOpen(false)}
                    aria-label="Kembali ke daftar percakapan"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ag-slate-secondary hover:bg-ag-surface-low lg:hidden"
                  >
                    <IconArrowLeft size={20} />
                  </button>

                  <div className="relative shrink-0">
                    <span
                      aria-hidden="true"
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold ${
                        AVATAR_TONE[active.status] ?? AVATAR_TONE.BARU
                      }`}
                    >
                      {initialsOf(active.name)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-ag-available ring-2 ring-white"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-[16px] font-bold text-ag-slate">
                        {active.name}
                      </h2>
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-900">
                        Prospek Terverifikasi
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-ag-slate-secondary">
                      {active.activeLabel} • {active.city}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex min-w-0 items-center gap-2 rounded-lg bg-ag-surface-low p-1.5 pr-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-ag-forest/10 text-ag-forest"
                    >
                      <IconMap size={19} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[12px] font-semibold text-ag-slate">
                          {active.property.title}
                        </span>
                        <StatusBadge label={active.statusLabel} tone={active.statusTone} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-ag-slate-secondary">
                        <span>
                          Unit {active.property.unit} • {formatRupiah(active.property.price)}
                        </span>
                        <Link
                          href={`/dashboard/penjual/pengajuan?q=${encodeURIComponent(active.name)}`}
                          className="font-semibold text-ag-forest hover:underline"
                        >
                          Lihat Pengajuan →
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <a
                      href={`tel:${active.phone}`}
                      aria-label={`Telepon ${active.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
                    >
                      <IconPhone size={19} />
                    </a>
                    <Link
                      href="/dashboard/penjual/pengajuan?tab=jadwal"
                      aria-label="Buka jadwal kunjungan"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
                    >
                      <IconCalendar size={19} />
                    </Link>
                    <Link
                      href={`/dashboard/penjual/kontak?contact=${encodeURIComponent(active.contactId)}`}
                      aria-label={`Lihat detail kontak ${active.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
                    >
                      <IconMoreVertical size={19} />
                    </Link>
                  </div>
                </div>
              </header>

              <div
                ref={threadRef}
                aria-live="polite"
                className="flex-1 space-y-4 overflow-y-auto bg-ag-surface-low/40 px-4 py-4"
              >
                <div className="flex justify-center">
                  <span className="rounded-full bg-white px-4 py-1 text-[10.5px] text-ag-slate-secondary shadow-sm">
                    {active.dateLabel}
                  </span>
                </div>

                {activeMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="border-t border-ag-line bg-white px-3 py-2">
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                  <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wider text-ag-slate-secondary">
                    Respon Cepat:
                  </span>
                  {MESSAGE_QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => insertQuickReply(reply.text)}
                      className="shrink-0 rounded bg-amber-50 px-3 py-1.5 text-[10.5px] font-semibold text-amber-900 transition-colors hover:bg-amber-100"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-ag-line bg-white p-3"
              >
                <button
                  type="button"
                  disabled
                  title="Lampiran belum tersedia pada demo"
                  aria-label="Lampiran belum tersedia"
                  className="flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-lg text-ag-slate-muted opacity-60"
                >
                  <IconPaperclip size={20} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertQuickReply(
                      "Berikut kami lampirkan masterplan kawasan dan denah unit yang Anda minati.",
                    )
                  }
                  title="Sisipkan pesan masterplan"
                  aria-label="Sisipkan pesan masterplan"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-forest"
                >
                  <IconMap size={20} />
                </button>

                <label htmlFor="chat-input" className="sr-only">
                  Ketik balasan untuk {active.name}
                </label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={`Ketik balasan untuk ${active.name}...`}
                  className="h-10 min-w-0 flex-1 rounded-lg bg-ag-surface-low px-3 text-[12px] text-ag-slate placeholder:text-ag-slate-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-ag-gold-base/40"
                />

                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-ag-gold-base px-4 text-[12px] font-bold text-ag-slate shadow-sm transition-colors hover:bg-ag-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Kirim</span>
                  <IconSend size={16} />
                </button>
              </form>

              <p className="bg-white px-3 pb-2 text-[10px] text-ag-slate-muted">
                Pratinjau lokal — pesan baru belum tersimpan ke database.
              </p>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
              <div>
                <p className="text-[14px] font-semibold text-ag-slate">Belum ada percakapan</p>
                <p className="mx-auto mt-1 max-w-xs text-[12.5px] leading-relaxed text-ag-slate-secondary">
                  Pilih percakapan dari daftar atau buka halaman Kontak untuk memulai.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const mine = message.from === "agent";

  return (
    <div
      className={`flex max-w-[88%] flex-col gap-1 sm:max-w-[70%] ${
        mine ? "ml-auto items-end" : "items-start"
      }`}
    >
      <div
        className={`rounded-lg p-3 text-[12.5px] leading-relaxed shadow-sm ${
          mine ? "bg-emerald-50 text-ag-slate" : "bg-white text-ag-slate"
        }`}
      >
        <p>{message.body}</p>
      </div>

      <div
        className={`flex items-center gap-1 text-[10px] text-ag-slate-muted ${
          mine ? "pr-1" : "pl-1"
        }`}
      >
        <span>{message.timeLabel}</span>
        {mine ? (
          <>
            <span aria-hidden="true">•</span>
            <span
              className={
                message.status === "read"
                  ? "font-medium text-ag-available"
                  : "text-ag-slate-secondary"
              }
            >
              {message.status === "read" ? "Dibaca" : "Terkirim"}
            </span>
            {message.status === "read" ? (
              <IconCheckDouble size={13} className="text-ag-available" />
            ) : (
              <IconCheck size={13} className="text-ag-slate-secondary" />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
