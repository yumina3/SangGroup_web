"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/dashboard/penjual/pengaturan/actions";
import ActionButton from "@/components/dashboard/ActionButton";
import InfoNotice from "@/components/dashboard/InfoNotice";
import PageHeader from "@/components/dashboard/PageHeader";
import ToggleSwitch from "@/components/dashboard/ToggleSwitch";
import AgentAvatar from "@/components/dashboard/AgentAvatar";
import { IconExit } from "@/components/dashboard/icons";
import PropertyField from "@/components/dashboard/property/PropertyField";
import PushNotifications from "@/components/notifications/PushNotifications";
import { useToast } from "@/components/dashboard/Toast";
import { penjualLogoutAction } from "@/app/penjual/actions";

const EMPTY_AGENT = {
  id: "",
  name: "Agen",
  email: "",
  phone: "",
  agencyName: "",
  agentCode: "—",
  avatarUrl: null,
};

const TABS = [
  { key: "profil", label: "Profil" },
  { key: "keamanan", label: "Keamanan" },
  { key: "notifikasi", label: "Notifikasi" },
];

const NOTIFICATIONS = [
  {
    key: "inquiry",
    label: "Pengajuan baru",
    description: "Pemberitahuan saat calon pembeli mengajukan kunjungan atau minat beli.",
    defaultChecked: true,
  },
  {
    key: "visit",
    label: "Jadwal kunjungan",
    description: "Pengingat sebelum jadwal survei lokasi di Marketing Gallery.",
    defaultChecked: true,
  },
  {
    key: "verification",
    label: "Hasil verifikasi",
    description: "Status verifikasi listing dan persetujuan kavling oleh tim admin.",
    defaultChecked: true,
  },
  {
    key: "weekly",
    label: "Ringkasan mingguan",
    description: "Rekap listing aktif, pengajuan, dan unit terjual setiap awal pekan.",
    defaultChecked: false,
  },
];

/**
 * Pengaturan akun penjual (SRS: ACC-01, SEL-11, PUSH-10).
 *
 * Halaman ini tidak memasang navbar sendiri — sidebar/topbar agen berasal
 * dari layout `/dashboard`. Karena penyimpanan profil dan langganan push
 * belum aktif, setiap aksi memberi tahu bahwa perubahan belum tersimpan.
 *
 * `initialTab` boleh diisi dari halaman (`?tab=keamanan`) supaya tautan dari
 * menu profil langsung membuka bagian yang dituju.
 */
export default function PengaturanPenjual({ agent = EMPTY_AGENT, initialTab = "profil" }) {
  const [tab, setTab] = useState(TABS.some((item) => item.key === initialTab) ? initialTab : "profil");

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={["Portal Agen", "Pengaturan"]}
        title="Pengaturan"
        description="Kelola data profil agen, keamanan akun, dan preferensi notifikasi."
        meta={
          <span className="inline-flex items-center gap-1.5 rounded-tag border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700">
            ID Agen: {agent.agentCode}
          </span>
        }
      />

      <div className="flex gap-5 overflow-x-auto border-b border-ag-line">
        {TABS.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              aria-current={active ? "page" : undefined}
              className={[
                "ag-tab -mb-px whitespace-nowrap border-b-2 pb-2.5 pt-1 text-[13px] font-semibold",
                active
                  ? "border-ag-gold-base text-ag-forest"
                  : "border-transparent text-ag-slate-secondary hover:text-ag-slate",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="max-w-4xl">
        {tab === "profil" ? (
          <div className="space-y-5">
            <ProfilTab agent={agent} />
            <SesiTab />
          </div>
        ) : null}
        {tab === "keamanan" ? <KeamananTab /> : null}
        {tab === "notifikasi" ? <NotifikasiTab /> : null}
      </div>
    </div>
  );
}

function ProfilTab({ agent }) {
  const toast = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: agent.name,
    phone: agent.phone,
    agencyName: agent.agencyName,
  });
  const [error, setError] = useState("");

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  const dirty =
    form.fullName !== agent.name ||
    form.phone !== agent.phone ||
    form.agencyName !== agent.agencyName;

  async function save(event) {
    event.preventDefault();

    const phone = form.phone.replace(/[\s()-]/g, "").replace(/^0/, "+62").replace(/^62/, "+62");
    if (form.fullName.trim().length < 3) {
      setError("Nama lengkap minimal 3 karakter.");
      return;
    }
    if (!/^\+62[0-9]{8,13}$/.test(phone)) {
      setError("Nomor WhatsApp tidak valid. Gunakan format +62 diikuti 8–13 digit.");
      return;
    }

    setError("");
    setSaving(true);
    const response = await updateProfileAction({
      fullName: form.fullName.trim(),
      phone,
      agencyName: form.agencyName,
    });
    setSaving(false);

    if (!response.ok) {
      setError(response.formError ?? "Profil gagal disimpan.");
      return;
    }

    toast.push("Profil tersimpan.", "success");
    router.refresh();
  }

  return (
    <section className="space-y-5 rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-ag-slate">Data diri</h2>
          <p className="mt-0.5 text-[13px] text-ag-slate-secondary">
            Informasi identitas agen untuk komunikasi dengan pembeli.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-tag border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700">
          Akun terverifikasi
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <AgentAvatar agent={agent} size={72} />
        <div>
          <p className="text-[13.5px] font-semibold text-ag-slate">Foto profil agen</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-ag-slate-secondary">
            Format JPG atau PNG, maksimal 2 MB, resolusi minimal 400×400 piksel.
          </p>
          <button
            type="button"
            onClick={() =>
              toast.push("Unggah foto profil belum aktif; API object storage sudah tersedia di backend.", "info")
            }
            className="mt-2 inline-flex h-9 items-center rounded-dash bg-ag-forest px-3 text-[12px] font-semibold text-white hover:bg-ag-forest-medium"
          >
            Unggah foto baru
          </button>
        </div>
      </div>

      <form noValidate onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PropertyField
            label="Nama lengkap"
            name="fullName"
            value={form.fullName}
            onChange={setField("fullName")}
            required
            error={error && form.fullName.trim().length < 3 ? error : undefined}
          />
          <PropertyField
            label="Email resmi"
            name="email"
            type="email"
            value={agent.email}
            readOnly
            hint="Email dipakai untuk masuk dan tidak bisa diubah sendiri."
          />
          <PropertyField
            label="Nomor WhatsApp"
            name="phone"
            type="tel"
            prefix="ID"
            value={form.phone}
            onChange={setField("phone")}
            required
          />
          <PropertyField
            label="Nama agensi / kantor"
            name="agencyName"
            value={form.agencyName}
            onChange={setField("agencyName")}
            required
          />
        </div>

        <div className="flex flex-col gap-2 rounded-dash bg-ag-surface-low px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold text-ag-slate">Peran akun</p>
            <p className="text-[12px] text-ag-slate-secondary">
              Peran hanya dapat diubah oleh Administrator Sang Group.
            </p>
          </div>
          <span className="self-start rounded-full bg-ag-forest px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-ag-gold-light sm:self-auto">
            Penjual / Agen
          </span>
        </div>

        {error && form.fullName.trim().length >= 3 ? (
          <p role="alert" className="text-[12px] font-semibold text-red-600">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <ActionButton
            variant="outline"
            onClick={() =>
              setForm({ fullName: agent.name, phone: agent.phone, agencyName: agent.agencyName })
            }
            disabled={!dirty}
          >
            Batalkan perubahan
          </ActionButton>
          <ActionButton type="submit" variant="primary" pending={saving} pendingLabel="Menyimpan…">
            Simpan perubahan
          </ActionButton>
        </div>
      </form>
    </section>
  );
}

/**
 * Sesi & keluar (tombol "Keluar" di bagian profil agen).
 *
 * Tombol keluar adalah tombol submit form yang menjalankan Server Action
 * `penjualLogoutAction`: cookie sesi dihapus di server lalu pengguna
 * diarahkan ke gerbang login /penjual. Garis besar sungguhan, bukan sekadar
 * menyembunyikan halaman di browser.
 */
function SesiTab() {
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-[16px] font-bold text-ag-slate">Sesi &amp; keluar</h2>
        <p className="mt-0.5 text-[13px] text-ag-slate-secondary">
          Akhiri sesi di perangkat ini. Anda perlu masuk kembali untuk membuka dashboard.
        </p>
      </div>

      <form action={penjualLogoutAction} className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-[12.5px] leading-relaxed text-ag-slate-secondary">
          Sesi berlaku hingga 8 jam. Keluar sekarang menghapus cookie sesi di browser ini.
        </p>
        <ActionButton
          type={confirming ? "submit" : "button"}
          variant={confirming ? "danger" : "outline"}
          onClick={confirming ? undefined : () => setConfirming(true)}
          disabled={false}
        >
          <IconExit size={16} />
          {confirming ? "Ya, keluar sekarang" : "Keluar dari akun"}
        </ActionButton>
      </form>

      {confirming ? (
        <p role="status" className="mt-3 rounded-tag bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700">
          Tekan “Ya, keluar sekarang” untuk mengakhiri sesi, atau{" "}
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="font-semibold underline underline-offset-2"
          >
            batalkan
          </button>
          .
        </p>
      ) : null}
    </section>
  );
}

function scoreOf(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const STRENGTH = [
  { label: "Belum diisi", color: "bg-slate-200" },
  { label: "Lemah", color: "bg-red-500" },
  { label: "Cukup", color: "bg-amber-500" },
  { label: "Kuat", color: "bg-emerald-500" },
  { label: "Sangat kuat", color: "bg-ag-forest" },
];

function KeamananTab() {
  const toast = useToast();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const score = scoreOf(form.next);
  const strength = STRENGTH[score] ?? STRENGTH[0];

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  async function save(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.current) nextErrors.current = "Kata sandi lama wajib diisi.";
    if (form.next.length < 8) {
      nextErrors.next = "Minimal 8 karakter, kombinasi huruf dan angka.";
    } else if (!/[A-Za-z]/.test(form.next) || !/[0-9]/.test(form.next)) {
      nextErrors.next = "Minimal 8 karakter, kombinasi huruf dan angka.";
    }
    if (form.confirm !== form.next) nextErrors.confirm = "Konfirmasi tidak sama dengan kata sandi baru.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (score < 2 || form.next === form.current) {
      setErrors({
        next:
          form.next === form.current
            ? "Kata sandi baru harus berbeda dari kata sandi lama."
            : "Gunakan kata sandi yang lebih kuat: minimal 8 karakter dengan huruf besar, angka, atau simbol.",
      });
      return;
    }

    setSaving(true);
    const response = await changePasswordAction({
      currentPassword: form.current,
      newPassword: form.next,
    });
    setSaving(false);

    if (!response.ok) {
      setErrors(response.fieldErrors ?? {});
      toast.push(response.formError ?? "Kata sandi gagal diubah.", "danger");
      return;
    }

    setForm({ current: "", next: "", confirm: "" });
    toast.push("Kata sandi diperbarui. Sesi lain dicabut; gunakan kata sandi baru saat login berikutnya.", "success");
  }

  return (
    <section className="space-y-5 rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-[16px] font-bold text-ag-slate">Keamanan &amp; kata sandi</h2>
        <p className="mt-0.5 text-[13px] text-ag-slate-secondary">
          Perbarui kata sandi secara berkala untuk melindungi akses data pembeli dan listing.
        </p>
      </div>

      <InfoNotice title="Kata sandi disimpan sebagai hash scrypt">
        Setelah diganti, seluruh sesi lain dicabut dan Anda perlu masuk kembali dengan kata sandi
        baru. Kata sandi lama tidak pernah disimpan dalam bentuk teks.
      </InfoNotice>

      <form noValidate onSubmit={save} className="max-w-2xl space-y-4">
        <PropertyField
          label="Kata sandi lama"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={form.current}
          onChange={setField("current")}
          required
          error={errors.current}
        />

        <div>
          <PropertyField
            label="Kata sandi baru"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.next}
            onChange={setField("next")}
            required
            placeholder="Minimal 8 karakter kombinasi huruf & angka"
            error={errors.next}
          />
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`h-full flex-1 rounded-full ${level <= score ? strength.color : "bg-slate-200"}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-ag-slate-secondary">
              {strength.label}
            </span>
          </div>
        </div>

        <PropertyField
          label="Konfirmasi kata sandi baru"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={setField("confirm")}
          required
          error={errors.confirm}
        />

        <div className="border-t border-slate-100 pt-4">
          <ActionButton
            type="submit"
            variant="primary"
            pending={saving}
            pendingLabel="Memperbarui…"
          >
            Perbarui kata sandi
          </ActionButton>
        </div>
      </form>
    </section>
  );
}

function NotifikasiTab() {
  const toast = useToast();
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(NOTIFICATIONS.map((item) => [item.key, item.defaultChecked])),
  );

  return (
    <section className="space-y-5 rounded-dash border border-ag-line bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-[16px] font-bold text-ag-slate">Preferensi notifikasi</h2>
        <p className="mt-0.5 text-[13px] text-ag-slate-secondary">
          Pilih peristiwa yang ingin Anda ketahui. Pilihan hanya berlaku setelah penyimpanan
          preferensi aktif.
        </p>
      </div>

      <InfoNotice title="Web Push aktif lewat service worker">
        Izin notifikasi diminta saat Anda menekan tombol di bawah. Subscription disimpan di server
        dan dipakai worker untuk mengirim pemberitahuan pengajuan, pesan, dan hasil verifikasi.
      </InfoNotice>

      <div className="divide-y divide-slate-100">
        {NOTIFICATIONS.map((item) => (
          <ToggleSwitch
            key={item.key}
            id={`notif-${item.key}`}
            label={item.label}
            description={item.description}
            checked={prefs[item.key]}
            onChange={(value) => {
              setPrefs((current) => ({ ...current, [item.key]: value }));
              toast.push(
                `“${item.label}” ${value ? "diaktifkan" : "dinonaktifkan"} di layar ini — belum tersimpan.`,
                "info",
              );
            }}
          />
        ))}
      </div>

      <div className="space-y-3 rounded-dash border border-ag-line bg-ag-ivory-surface px-4 py-3">
        <p className="text-[13px] font-semibold text-ag-slate">Notifikasi push di perangkat ini</p>
        <p className="text-[12px] leading-relaxed text-ag-slate-secondary">
          Aktifkan agar notifikasi tetap masuk meski tab browser ditutup. Di iOS perlu memasang
          situs ke Home Screen terlebih dahulu.
        </p>
        <PushNotifications />
      </div>
    </section>
  );
}
