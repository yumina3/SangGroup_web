import { formatDate, jakartaDayKey } from "@/lib/dashboard/format";

/**
 * Tugas tindak lanjut (demo, hanya-baca).
 *
 * SRS/PRD belum punya entitas tugas, jadi daftar ini adalah data contoh yang
 * diturunkan dari pengajuan yang sama dengan halaman Pengajuan dan Deals.
 * Tanggal disimpan sebagai offset hari lalu dihitung ulang pada request time
 * supaya label "Hari ini", "Besok", dan "Terlambat" tidak berbohong ketika
 * demo dibuka beberapa hari kemudian. Tidak ada aksi tulis di halaman ini.
 */

const ZONE = "Asia/Jakarta";

export const TASK_TYPES = {
  CONTACT: { label: "Hubungi", tone: "success" },
  VISIT: { label: "Kunjungan", tone: "warning" },
  DOCUMENT: { label: "Dokumen", tone: "info" },
};

const TASK_DEFINITIONS = [
  {
    id: "tsk-01",
    title: "Hubungi Rani Hartono",
    type: "CONTACT",
    buyerName: "Rani Hartono",
    propertyTitle: "Rumah Tipe 36 — Blok A",
    unit: "Candisari Heights · A-04",
    inquiryId: "inq-501",
    dueOffsetDays: -1,
    dueTime: "11:00",
    status: "OPEN",
    note: "Konfirmasi ulang kesiapan survei unit contoh.",
  },
  {
    id: "tsk-02",
    title: "Kirim brosur ke Arif Setyawan",
    type: "DOCUMENT",
    buyerName: "Arif Setyawan",
    propertyTitle: "Rumah Tipe 45 — Kavling B",
    unit: "Tembalang Hillcrest · B-07",
    inquiryId: "inq-502",
    dueOffsetDays: 0,
    dueTime: "15:00",
    status: "OPEN",
    note: "Sertakan simulasi KPR sesuai permintaan pembeli.",
  },
  {
    id: "tsk-03",
    title: "Siapkan unit untuk kunjungan Dian Larasati",
    type: "VISIT",
    buyerName: "Dian Larasati",
    propertyTitle: "Rumah Tipe 60 — Kavling C",
    unit: "Sambiroto Verde · C-02",
    inquiryId: "inq-503",
    dueOffsetDays: 2,
    dueTime: "10:00",
    status: "OPEN",
    note: "Temani kunjungan keluarga dan siapkan denah ruang keluarga.",
  },
  {
    id: "tsk-04",
    title: "Follow up Bagas Nugroho",
    type: "CONTACT",
    buyerName: "Bagas Nugroho",
    propertyTitle: "Rumah Tipe 60 — Kavling C",
    unit: "Sambiroto Verde · C-02",
    inquiryId: "inq-504",
    dueOffsetDays: 3,
    dueTime: "13:00",
    status: "OPEN",
    note: "Tanyakan kepastian jadwal setelah pencairan dana.",
  },
  {
    id: "tsk-05",
    title: "Kirim simulasi KPR ke Dewi Anggraini",
    type: "DOCUMENT",
    buyerName: "Dewi Anggraini",
    propertyTitle: "Rumah Tipe 60 — Kavling C",
    unit: "Sambiroto Verde · C-02",
    inquiryId: "inq-507",
    dueOffsetDays: 4,
    dueTime: "09:30",
    status: "OPEN",
    note: "Pembeli meminta simulasi sebelum survei lokasi.",
  },
  {
    id: "tsk-06",
    title: "Konfirmasi berkas Bagas Setiawan",
    type: "DOCUMENT",
    buyerName: "Bagas Setiawan",
    propertyTitle: "Rumah Tipe 45 — Kavling B",
    unit: "Tembalang Hillcrest · B-07",
    inquiryId: "inq-508",
    dueOffsetDays: 5,
    dueTime: "14:00",
    status: "OPEN",
    note: "Cek kelengkapan berkas KPR untuk unit yang dipesan.",
  },
  {
    id: "tsk-07",
    title: "Follow up Rani Hartono",
    type: "CONTACT",
    buyerName: "Rani Hartono",
    propertyTitle: "Rumah Tipe 36 — Blok A",
    unit: "Candisari Heights · A-04",
    inquiryId: "inq-501",
    dueOffsetDays: -2,
    dueTime: "15:00",
    status: "DONE",
    completedOffsetDays: -2,
    completedTime: "15:20",
    note: "Pembeli minta dikirim ulang jadwal survei.",
  },
  {
    id: "tsk-08",
    title: "Kunjungan Hendra Wibisono",
    type: "VISIT",
    buyerName: "Hendra Wibisono",
    propertyTitle: "Rumah Tipe 36 — Blok A",
    unit: "Candisari Heights · A-04",
    inquiryId: "inq-505",
    dueOffsetDays: -3,
    dueTime: "10:00",
    status: "DONE",
    completedOffsetDays: -3,
    completedTime: "11:00",
    note: "Kunjungan selesai, pembeli membandingkan tipe lain.",
  },
  {
    id: "tsk-09",
    title: "Kirim brosur ke Arif Setyawan",
    type: "DOCUMENT",
    buyerName: "Arif Setyawan",
    propertyTitle: "Rumah Tipe 45 — Kavling B",
    unit: "Tembalang Hillcrest · B-07",
    inquiryId: "inq-502",
    dueOffsetDays: -5,
    dueTime: "09:00",
    status: "DONE",
    completedOffsetDays: -5,
    completedTime: "09:30",
    note: "Brosur dan daftar spesifikasi sudah dikirim.",
  },
  {
    id: "tsk-10",
    title: "Telepon Kurnia Saputra",
    type: "CONTACT",
    buyerName: "Kurnia Saputra",
    propertyTitle: "Rumah Tipe 36 — Blok A",
    unit: "Candisari Heights · A-04",
    inquiryId: "inq-506",
    dueOffsetDays: -7,
    dueTime: "14:00",
    status: "DONE",
    completedOffsetDays: -7,
    completedTime: "14:20",
    note: "Pembeli menunda rencana karena skema pembayaran.",
  },
  {
    id: "tsk-11",
    title: "Arsipkan berkas Sinta Maharani",
    type: "DOCUMENT",
    buyerName: "Sinta Maharani",
    propertyTitle: "Rumah Tipe 45 — Blok D",
    unit: "Sambiroto Verde · D-09",
    inquiryId: "inq-509",
    dueOffsetDays: -9,
    dueTime: "10:00",
    status: "DONE",
    completedOffsetDays: -9,
    completedTime: "10:30",
    note: "Berkas transaksi unit terjual sudah diarsipkan.",
  },
];

function jakartaParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const pick = (type) => parts.find((part) => part.type === type)?.value;
  return {
    year: Number(pick("year")),
    month: Number(pick("month")),
    day: Number(pick("day")),
  };
}

/** ISO dengan offset Jakarta untuk "hari ini + offset" pada jam tertentu. */
function isoAtOffset(now, dayOffset, time) {
  const { year, month, day } = jakartaParts(now);
  const base = new Date(Date.UTC(year, month - 1, day));
  base.setUTCDate(base.getUTCDate() + dayOffset);

  const yyyy = base.getUTCFullYear();
  const mm = String(base.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(base.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${String(time).padStart(5, "0")}:00+07:00`;
}

function jakartaMonthKey(value) {
  const key = jakartaDayKey(value);
  return key ? key.slice(0, 7) : null;
}

/** "Selasa, 3 November 2026" untuk chip tanggal di kepala halaman. */
export function taskHeaderDate(now = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(now);
}

/** Label tanggal relatif terhadap request time, mis. "Besok, 09.00 WIB". */
export function taskDueLabel(dueAt, now = new Date(), done = false) {
  if (done) return `Selesai ${formatDate(dueAt)}`;

  const dueKey = jakartaDayKey(dueAt);
  const todayKey = jakartaDayKey(now);
  if (!dueKey || !todayKey) return formatDate(dueAt);

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZONE,
  })
    .format(new Date(dueAt))
    .replace(":", ".");

  const base = new Date(`${dueKey}T00:00:00+07:00`);
  const today = new Date(`${todayKey}T00:00:00+07:00`);
  const dayDiff = Math.round((base.getTime() - today.getTime()) / 86_400_000);

  if (dayDiff === 0) return `Hari ini, ${time} WIB`;
  if (dayDiff === 1) return `Besok, ${time} WIB`;
  if (dayDiff === -1) return `Kemarin, ${time} WIB`;

  if (dayDiff > 1 && dayDiff <= 7) {
    const weekday = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      timeZone: ZONE,
    }).format(new Date(dueAt));
    const dayMonth = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      timeZone: ZONE,
    }).format(new Date(dueAt));
    return `${weekday}, ${dayMonth} · ${time} WIB`;
  }

  return `${formatDate(dueAt)} · ${time} WIB`;
}

/**
 * Susun tugas untuk request ini.
 *
 * `bucket` menentukan tab: "today" (termasuk yang terlambat), "upcoming",
 * atau "done". Semua tanggal sudah diformat di server supaya klien tidak
 * perlu membaca jam saat render (menghindari hydration mismatch).
 *
 * @param {Date} now
 */
export function getAgentTasks(now = new Date()) {
  const todayKey = jakartaDayKey(now);
  const currentMonth = jakartaMonthKey(now);

  const tasks = TASK_DEFINITIONS.map((task) => {
    const dueAt = isoAtOffset(now, task.dueOffsetDays, task.dueTime);
    const done = task.status === "DONE";
    const completedAt =
      done && typeof task.completedOffsetDays === "number"
        ? isoAtOffset(now, task.completedOffsetDays, task.completedTime ?? "09:00")
        : null;
    const dueKey = jakartaDayKey(dueAt);
    const overdue = !done && new Date(dueAt).getTime() < now.getTime();

    return {
      ...task,
      dueAt,
      completedAt,
      dueLabel: taskDueLabel(dueAt, now, done),
      completedLabel: completedAt ? formatDate(completedAt) : null,
      overdue,
      bucket: done ? "done" : (dueKey ?? "") <= (todayKey ?? "") ? "today" : "upcoming",
    };
  });

  const open = tasks.filter((task) => task.status === "OPEN");
  const counts = {
    today: open.filter((task) => task.bucket === "today").length,
    overdue: open.filter((task) => task.overdue).length,
    upcomingWeek: open.filter((task) => {
      if (task.bucket !== "upcoming") return false;
      const diff = new Date(task.dueAt).getTime() - now.getTime();
      return diff <= 7 * 86_400_000;
    }).length,
    doneThisMonth: tasks.filter(
      (task) => task.status === "DONE" && jakartaMonthKey(task.completedAt) === currentMonth,
    ).length,
    done: tasks.filter((task) => task.status === "DONE").length,
    upcoming: open.filter((task) => task.bucket === "upcoming").length,
  };

  const sorted = [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === "OPEN" ? -1 : 1;
    if (a.status === "DONE") {
      return new Date(b.completedAt ?? b.dueAt) - new Date(a.completedAt ?? a.dueAt);
    }
    return new Date(a.dueAt) - new Date(b.dueAt);
  });

  return { tasks: sorted, counts };
}
