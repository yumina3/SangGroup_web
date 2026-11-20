import { CONTACT_STATUS, getAgentContacts } from "./contact-data";
import { formatLongDate, formatTime } from "./format";

/**
 * Percakapan halaman Pesan.
 *
 * Satu percakapan selalu terhubung ke satu kontak di `contact-data.js`,
 * sehingga tombol "Kirim Pesan" dari halaman Kontak membuka percakapan yang
 * benar. Identitas kontak dan riwayat pengajuan berasal dari database;
 * template balasan dan pesan yang dikirim dari layar tetap menjadi pratinjau
 * lokal karena schema belum memiliki tabel pesan.
 */

export { MESSAGE_QUICK_REPLIES } from "./ui-constants";

/**
 * @typedef {object} AgentConversation
 * @property {string} id
 * @property {string} contactId
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {string} city
 * @property {keyof typeof CONTACT_STATUS} status
 * @property {string} statusLabel
 * @property {string} statusTone
 * @property {{ id: string, title: string, cluster: string, unit: string, price: number }} property
 * @property {boolean} unread
 * @property {string} activeLabel
 * @property {string} lastMessageLabel
 * @property {string} dateLabel
 * @property {string} preview
 * @property {string} note
 * @property {"available"|"gold"|"danger"|"default"} noteTone
 * @property {Array<{ id: string, from: "buyer"|"agent", body: string, timeLabel: string, status?: "sent"|"read" }>} messages
 */

const CONVERSATION_SPECS = [
  {
    id: "conv-21",
    contactId: "ctc-21",
    unread: false,
    activeLabel: "Aktif 10 menit lalu",
    lastMessageLabel: "10:42",
    dateLabel: "Hari ini, 4 November 2026",
    note: "Kavling A-04 • Candisari Heights",
    noteTone: "available",
    messages: [
      {
        id: "msg-21-1",
        from: "buyer",
        body: "Halo, saya tertarik dengan unit Rumah Tipe 36 — Blok A di Candisari Heights. Apakah unit A-04 masih tersedia?",
        timeLabel: "09:30 WIB",
      },
      {
        id: "msg-21-2",
        from: "agent",
        body: "Selamat pagi Ibu Rani, terima kasih telah menghubungi SANG Group. Unit A-04 di Candisari Heights masih tersedia dan siap disurvei. Apakah Ibu berkenan menjadwalkan kunjungan ke marketing gallery?",
        timeLabel: "09:45 WIB",
        status: "sent",
      },
      {
        id: "msg-21-3",
        from: "buyer",
        body: "Boleh, untuk hari Sabtu ini apakah ada slot kunjungan pagi? Sekaligus saya ingin konsultasi simulasi KPR.",
        timeLabel: "10:15 WIB",
      },
      {
        id: "msg-21-4",
        from: "agent",
        body: "Tentu Ibu Rani, slot Sabtu pagi pukul 10.00–12.00 WIB tersedia. Tim konsultan kami akan menyiapkan denah dan simulasi KPR bank partner.",
        timeLabel: "10:30 WIB",
        status: "read",
      },
      {
        id: "msg-21-5",
        from: "buyer",
        body: "Baik, saya bisa survei Sabtu jam 10 pagi bersama keluarga. Tolong disiapkan ya.",
        timeLabel: "10:42 WIB",
      },
    ],
  },
  {
    id: "conv-22",
    contactId: "ctc-22",
    unread: true,
    activeLabel: "Aktif 1 jam lalu",
    lastMessageLabel: "09:15",
    dateLabel: "Hari ini, 4 November 2026",
    note: "Kavling B-07 • Tembalang Hillcrest",
    noteTone: "available",
    messages: [
      {
        id: "msg-22-1",
        from: "buyer",
        body: "Apakah ada simulasi cicilan KPR BTN 15 tahun untuk unit B-07?",
        timeLabel: "08:50 WIB",
      },
      {
        id: "msg-22-2",
        from: "agent",
        body: "Ada Pak Arif. Kami siapkan simulasi DP 20% dan tenor 15 tahun, sekaligus ketersediaan unit B-07.",
        timeLabel: "09:05 WIB",
        status: "read",
      },
      {
        id: "msg-22-3",
        from: "buyer",
        body: "Terima kasih, nanti saya pelajari dulu.",
        timeLabel: "09:15 WIB",
      },
    ],
  },
  {
    id: "conv-23",
    contactId: "ctc-23",
    unread: false,
    activeLabel: "Aktif kemarin",
    lastMessageLabel: "Kemarin",
    dateLabel: "Kemarin, 3 November 2026",
    note: "Kavling C-02",
    noteTone: "default",
    messages: [
      {
        id: "msg-23-1",
        from: "buyer",
        body: "Terima kasih informasinya, unit C-02 sangat cocok untuk keluarga kami.",
        timeLabel: "15:40 WIB",
      },
      {
        id: "msg-23-2",
        from: "agent",
        body: "Senang mendengarnya, Bu Dian. Jadwal survei Jumat pukul 09.00 WIB sudah kami catat.",
        timeLabel: "16:05 WIB",
        status: "read",
      },
      {
        id: "msg-23-3",
        from: "buyer",
        body: "Baik, sampai jumpa di gallery.",
        timeLabel: "16:20 WIB",
      },
    ],
  },
  {
    id: "conv-24",
    contactId: "ctc-24",
    unread: false,
    activeLabel: "Aktif 3 hari lalu",
    lastMessageLabel: "27 Okt",
    dateLabel: "Selasa, 27 Oktober 2026",
    note: "Kavling C-02",
    noteTone: "default",
    messages: [
      {
        id: "msg-24-1",
        from: "buyer",
        body: "Apakah legalitas SHM sudah split per kaveling?",
        timeLabel: "10:05 WIB",
      },
      {
        id: "msg-24-2",
        from: "agent",
        body: "Sudah, Pak Bagas. SHM pecah per unit dan dokumen PBG tersedia di kantor pemasaran.",
        timeLabel: "10:20 WIB",
        status: "read",
      },
      {
        id: "msg-24-3",
        from: "buyer",
        body: "Baik, saya ingin diskusikan penawaran harga untuk unit C-02.",
        timeLabel: "10:35 WIB",
      },
    ],
  },
  {
    id: "conv-27",
    contactId: "ctc-27",
    unread: true,
    activeLabel: "Aktif 4 hari lalu",
    lastMessageLabel: "26 Okt",
    dateLabel: "Senin, 26 Oktober 2026",
    note: "Tipe 60 • Sambiroto Verde",
    noteTone: "default",
    messages: [
      {
        id: "msg-27-1",
        from: "buyer",
        body: "Bisa kirimkan masterplan dan denah tipe 60?",
        timeLabel: "13:45 WIB",
      },
      {
        id: "msg-27-2",
        from: "agent",
        body: "Tentu, Bu Dewi. Kami lampirkan masterplan cluster dan denah tipe 60 via email.",
        timeLabel: "14:00 WIB",
        status: "read",
      },
      {
        id: "msg-27-3",
        from: "buyer",
        body: "Sudah saya terima, terima kasih.",
        timeLabel: "14:10 WIB",
      },
    ],
  },
  {
    id: "conv-28",
    contactId: "ctc-28",
    unread: false,
    activeLabel: "Aktif 6 hari lalu",
    lastMessageLabel: "24 Okt",
    dateLabel: "Sabtu, 24 Oktober 2026",
    note: "Booking Confirmed",
    noteTone: "gold",
    messages: [
      {
        id: "msg-28-1",
        from: "buyer",
        body: "Kuitansi booking fee sudah saya transfer via BCA.",
        timeLabel: "09:45 WIB",
      },
      {
        id: "msg-28-2",
        from: "agent",
        body: "Terima kasih, Pak Bagas. Pembayaran sudah kami terima dan unit B-07 kami tandai dipesan.",
        timeLabel: "10:00 WIB",
        status: "read",
      },
      {
        id: "msg-28-3",
        from: "buyer",
        body: "Baik, mohon kabari proses KPR berikutnya.",
        timeLabel: "10:05 WIB",
      },
    ],
  },
  {
    id: "conv-29",
    contactId: "ctc-29",
    unread: false,
    activeLabel: "Aktif 8 hari lalu",
    lastMessageLabel: "20 Okt",
    dateLabel: "Selasa, 20 Oktober 2026",
    note: "Unit D-09 terjual",
    noteTone: "gold",
    messages: [
      {
        id: "msg-29-1",
        from: "buyer",
        body: "Pembayaran lunas sudah saya lakukan. Terima kasih pendampingannya.",
        timeLabel: "15:20 WIB",
      },
      {
        id: "msg-29-2",
        from: "agent",
        body: "Terima kasih, Bu Sinta. Unit D-09 resmi tercatat terjual. Kami bantu proses serah terima.",
        timeLabel: "15:35 WIB",
        status: "read",
      },
    ],
  },
  {
    id: "conv-26",
    contactId: "ctc-26",
    unread: false,
    activeLabel: "Aktif 13 hari lalu",
    lastMessageLabel: "15 Okt",
    dateLabel: "Kamis, 15 Oktober 2026",
    note: "Pengajuan dibatalkan",
    noteTone: "danger",
    messages: [
      {
        id: "msg-26-1",
        from: "buyer",
        body: "Saya mau menanyakan kemungkinan angsuran tanpa DP.",
        timeLabel: "09:50 WIB",
      },
      {
        id: "msg-26-2",
        from: "agent",
        body: "Mohon maaf, skema KPR tanpa DP belum tersedia. Kami bisa bantu simulasi DP 10% bila berkenan.",
        timeLabel: "10:00 WIB",
        status: "read",
      },
      {
        id: "msg-26-3",
        from: "buyer",
        body: "Baik, untuk saat ini saya batalkan dulu pengajuannya.",
        timeLabel: "10:05 WIB",
      },
    ],
  },
];

const NOTE_TONE_BY_STATUS = {
  DEAL: "gold",
  SELESAI: "gold",
  DIJADWALKAN: "available",
  NEGOSIASI: "gold",
  BATAL: "danger",
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function activeLabelFor(value) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < MINUTE) return "Baru saja";
  if (elapsed < HOUR) return `Aktif ${Math.floor(elapsed / MINUTE)} menit lalu`;
  if (elapsed < DAY) return `Aktif ${Math.floor(elapsed / HOUR)} jam lalu`;
  if (elapsed < 7 * DAY) return `Aktif ${Math.floor(elapsed / DAY)} hari lalu`;
  return `Aktif ${formatLongDate(value)}`;
}

function shortTime(value) {
  return formatTime(value).replace(" WIB", "");
}

function noteFor(contact) {
  if (contact.status === "DEAL" || contact.status === "SELESAI") return "Deal tercatat";
  if (contact.status === "BATAL") return "Pengajuan dibatalkan";
  return [contact.property?.cluster, contact.property?.unit].filter(Boolean).join(" • ") || "—";
}

/**
 * Percakapan dibuat dari riwayat pengajuan kontak (data persisten).
 * Balasan agen memakai template singkat karena tabel pesan belum ada di schema.
 */
function messagesForContact(contact) {
  const activities = [...(contact.history ?? [])].reverse();
  const messages = [];

  for (const activity of activities) {
    const at = new Date(activity.at);
    messages.push({
      id: `msg-${activity.id}`,
      from: "buyer",
      body: activity.note || `${activity.title} — ${activity.propertyLabel}`,
      timeLabel: formatTime(at),
    });

    if (activity.status === "BARU" || activity.status === "DIJADWALKAN") {
      messages.push({
        id: `msg-${activity.id}-reply`,
        from: "agent",
        body:
          activity.status === "DIJADWALKAN"
            ? "Jadwal kunjungan sudah kami catat. Tim marketing gallery akan menyiapkan denah dan simulasi KPR."
            : "Terima kasih atas minat Anda. Tim kami akan segera menghubungi untuk detail kunjungan dan simulasi KPR.",
        timeLabel: formatTime(new Date(at.getTime() + 15 * MINUTE)),
        status: "read",
      });
    }
  }

  if (messages.length === 0) {
    messages.push({
      id: `msg-${contact.id}`,
      from: "buyer",
      body: "Saya tertarik dengan properti ini.",
      timeLabel: formatTime(contact.lastInteractionAt),
    });
  }

  return messages;
}

/**
 * Daftar percakapan lengkap dengan identitas kontak dan properti.
 *
 * Kontak berasal dari `getAgentContacts()` (pengajuan nyata milik agen).
 * Spesifikasi demo dipakai hanya bila id kontaknya cocok, supaya tampilan
 * contoh tetap lengkap saat aplikasi dijalankan tanpa database.
 *
 * @returns {Promise<AgentConversation[]>}
 */
export async function getAgentConversations() {
  const contacts = await getAgentContacts();
  const specs = new Map(CONVERSATION_SPECS.map((spec) => [spec.contactId, spec]));

  return contacts.map((contact) => {
    const status = CONTACT_STATUS[contact.status] ?? CONTACT_STATUS.BARU;
    const spec = specs.get(contact.id);
    const messages = spec?.messages ?? messagesForContact(contact);
    const lastMessage = messages[messages.length - 1];

    return {
      id: spec?.id ?? `conv-${contact.id}`,
      contactId: contact.id,
      unread: spec?.unread ?? contact.status === "BARU",
      activeLabel: spec?.activeLabel ?? activeLabelFor(contact.lastInteractionAt),
      lastMessageLabel: spec?.lastMessageLabel ?? shortTime(contact.lastInteractionAt),
      dateLabel: spec?.dateLabel ?? formatLongDate(contact.lastInteractionAt),
      note: spec?.note ?? noteFor(contact),
      noteTone: spec?.noteTone ?? NOTE_TONE_BY_STATUS[contact.status] ?? "default",
      messages,
      name: contact.name,
      phone: contact.phone,
      email: contact.email || "—",
      city: contact.city,
      status: contact.status,
      statusLabel: status.label,
      statusTone: status.tone,
      property: contact.property,
      preview: lastMessage?.body ?? "",
    };
  });
}
