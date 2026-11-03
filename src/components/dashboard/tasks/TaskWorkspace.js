"use client";

import { useMemo, useState } from "react";

import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  IconAlert,
  IconArrowRight,
  IconCalendar,
  IconCheckCircle,
  IconChevronDown,
  IconClock,
  IconSearch,
} from "@/components/dashboard/icons";
import { TASK_TYPES } from "@/lib/dashboard/task-data";

const TABS = [
  { key: "today", label: "Hari Ini" },
  { key: "upcoming", label: "Mendatang" },
  { key: "done", label: "Selesai" },
];

const TYPE_OPTIONS = [
  { value: "", label: "Semua jenis" },
  ...Object.entries(TASK_TYPES).map(([value, meta]) => ({ value, label: meta.label })),
];

/**
 * Tugas Tindak Lanjut (demo, hanya-baca).
 *
 * Tidak ada checkbox aktif, tombol tambah, atau modal: SRS/PRD belum punya
 * entitas tugas, jadi halaman ini hanya menampilkan agenda contoh yang
 * diturunkan dari pengajuan. Tanggal relatif sudah dihitung di server pada
 * request time, sehingga tab "Hari Ini" dan label "Terlambat" tetap benar.
 */
export default function TaskWorkspace({ tasks, counts, todayLabel }) {
  const [tab, setTab] = useState("today");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return tasks.filter((task) => {
      if (task.bucket !== tab) return false;
      if (type && task.type !== type) return false;
      if (!keyword) return true;
      const haystack = [task.title, task.buyerName, task.propertyTitle, task.unit, task.note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [tasks, tab, type, query]);

  const tabCounts = {
    today: counts.today,
    upcoming: counts.upcoming,
    done: counts.done,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen"]}
        title="Tugas Tindak Lanjut"
        description="Agenda kontak, survei kaveling, dan kelengkapan dokumen calon pembeli. Daftar ini hanya-baca pada mode demo."
        actions={
          <span className="inline-flex items-center gap-2 rounded-lg border border-ag-line bg-white px-3 py-2 text-[12px] font-semibold text-ag-slate shadow-sm">
            <IconCalendar size={17} className="text-ag-gold" />
            {todayLabel}
          </span>
        }
      />

      <div
        role="status"
        className="flex flex-col gap-1 rounded-dash border border-ag-line bg-ag-surface-low px-4 py-3 text-[12.5px] leading-relaxed text-ag-slate sm:flex-row sm:items-center sm:justify-between"
      >
        <span>
          <strong className="font-semibold">Mode demo · hanya-baca.</strong> Tugas diturunkan dari
          pengajuan yang ada; menambah, mencentang, atau mengubah jadwal belum tersedia dan tidak
          disimpan.
        </span>
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-ag-slate-muted">
          Tanpa aksi tulis
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Perlu tindakan hari ini"
          value={counts.today}
          unit="tugas"
          footnote="Termasuk tugas yang sudah melewati tenggat."
          icon={<IconClock size={17} />}
          tone="forest"
        />
        <StatCard
          label="Terlambat"
          value={counts.overdue}
          unit="tugas"
          footnote="Tenggat lewat dan belum ditandai selesai."
          icon={<IconAlert size={17} />}
          tone="danger"
        />
        <StatCard
          label="Mendatang minggu ini"
          value={counts.upcomingWeek}
          unit="tugas"
          footnote="Jadwal dalam tujuh hari ke depan."
          icon={<IconCalendar size={17} />}
          tone="neutral"
        />
        <StatCard
          label="Selesai bulan ini"
          value={counts.doneThisMonth}
          unit="tugas"
          footnote="Tercatat selesai pada bulan berjalan."
          icon={<IconCheckCircle size={17} />}
          tone="forest"
        />
      </div>

      <section className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-3 border-b border-ag-line px-4 pt-4 md:flex-row md:items-end md:justify-between">
          <div
            role="tablist"
            aria-label="Kelompok tugas"
            className="flex gap-5 overflow-x-auto overflow-y-hidden"
          >
            {TABS.map((item) => {
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.key)}
                  className={[
                    "-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 pb-2.5 text-[13px]",
                    active
                      ? "border-ag-gold-base font-bold text-ag-forest"
                      : "border-transparent font-medium text-ag-slate-secondary hover:text-ag-slate",
                  ].join(" ")}
                >
                  {item.label}
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10.5px] font-bold",
                      active
                        ? "bg-ag-forest text-white"
                        : "bg-ag-surface-low text-ag-slate-secondary",
                    ].join(" ")}
                  >
                    {tabCounts[item.key]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pb-2">
            <div className="relative">
              <IconSearch
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-muted"
              />
              <label htmlFor="task-search" className="sr-only">
                Cari tugas atau nama pembeli
              </label>
              <input
                id="task-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari tugas atau nama pembeli…"
                className="h-9 w-[240px] max-w-full rounded-lg border border-ag-line bg-white pl-9 pr-3 text-[12.5px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
              />
            </div>

            <div className="relative">
              <label htmlFor="task-type" className="sr-only">
                Filter jenis tugas
              </label>
              <select
                id="task-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="h-9 appearance-none rounded-lg border border-ag-line bg-white pl-3 pr-8 text-[12.5px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ag-slate-muted"
              >
                <IconChevronDown size={15} />
              </span>
            </div>
          </div>
        </div>

        <ul aria-live="polite" className="divide-y divide-slate-100">
          {visible.length > 0 ? (
            visible.map((task) => {
              const done = task.status === "DONE";
              const typeMeta = TASK_TYPES[task.type] ?? TASK_TYPES.CONTACT;
              return (
                <li
                  key={task.id}
                  className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 shrink-0" aria-hidden="true">
                      {done ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-ag-available">
                          <IconCheckCircle size={16} />
                        </span>
                      ) : (
                        <span className="block h-5 w-5 rounded-full border-2 border-ag-line bg-white" />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={[
                            "text-[13.5px] font-bold",
                            done ? "text-ag-slate-secondary line-through" : "text-ag-slate",
                          ].join(" ")}
                        >
                          {task.title}
                        </h3>
                        <StatusBadge label={typeMeta.label} tone={typeMeta.tone} />
                        {done ? (
                          <span className="text-[10.5px] font-semibold text-emerald-700">
                            Selesai
                          </span>
                        ) : (
                          <span className="sr-only">Belum selesai</span>
                        )}
                      </div>

                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] text-ag-slate-secondary">
                        <span>
                          Calon pembeli:{" "}
                          <strong className="font-semibold text-ag-slate">{task.buyerName}</strong>
                        </span>
                        <span aria-hidden="true" className="text-ag-slate-muted">/</span>
                        <span>
                          Unit:{" "}
                          <strong className="font-semibold text-ag-slate">{task.propertyTitle}</strong>
                          <span className="text-ag-slate-muted"> · {task.unit}</span>
                        </span>
                      </p>

                      {task.note ? (
                        <p className="mt-0.5 line-clamp-1 text-[11.5px] text-ag-slate-muted">
                          {task.note}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 pl-8 sm:justify-end sm:pl-0">
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11.5px] font-semibold",
                        done
                          ? "bg-emerald-50 text-emerald-700"
                          : task.overdue
                            ? "bg-red-50 text-red-700"
                            : "text-ag-slate-secondary",
                      ].join(" ")}
                    >
                      <IconClock size={15} />
                      {done ? task.completedLabel ? `Selesai ${task.completedLabel}` : "Selesai" : task.dueLabel}
                      {!done && task.overdue ? (
                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider">
                          Terlambat
                        </span>
                      ) : null}
                    </span>

                    {task.inquiryId ? (
                      <a
                        href={`/dashboard/penjual/pengajuan?id=${task.inquiryId}#pengajuan-${task.inquiryId}`}
                        className="inline-flex items-center gap-1 text-[11.5px] font-bold text-ag-forest hover:underline"
                      >
                        Buka pengajuan
                        <IconArrowRight size={14} />
                      </a>
                    ) : null}
                  </div>
                </li>
              );
            })
          ) : (
            <li className="px-6 py-14 text-center">
              <span
                aria-hidden="true"
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-ag-surface-low text-ag-slate-secondary"
              >
                <IconCheckCircle size={24} />
              </span>
              <p className="text-[13px] font-bold text-ag-slate">Tidak ada tugas yang cocok</p>
              <p className="mt-1 text-[12px] text-ag-slate-secondary">
                Ubah kata kunci, jenis tugas, atau pilih tab lain.
              </p>
            </li>
          )}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ag-line bg-ag-ivory-surface px-4 py-2.5 text-[11.5px] text-ag-slate-secondary">
          <span>
            Menampilkan <strong className="font-semibold text-ag-slate">{visible.length}</strong>{" "}
            tugas {TABS.find((item) => item.key === tab)?.label.toLowerCase()}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-ag-slate-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ag-slate-muted" />
            Mode demo · tanpa sinkronisasi
          </span>
        </div>
      </section>
    </div>
  );
}
