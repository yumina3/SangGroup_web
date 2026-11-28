"use client";

import { useEffect, useId, useRef, useState } from "react";

import ActionButton from "@/components/dashboard/ActionButton";
import {
  IconClose,
  IconEye,
  IconEyeOff,
  IconMail,
  IconPhone,
  IconUsers,
} from "@/components/dashboard/icons";
import { formatDate, initialsOf } from "@/lib/dashboard/format";

const ROLE_LABEL = {
  buyer: "Pembeli",
  agent: "Penjual/Agen",
  admin: "Admin",
};

const ROLE_BADGE = {
  admin: "bg-ag-forest text-white",
  agent: "bg-ag-surface-low text-ag-gold-muted",
  buyer: "bg-ag-surface-low text-ag-slate-secondary",
};

/**
 * Drawer kanan untuk menambah akun staf atau meninjau akun yang sudah ada.
 *
 * Nama/email/nomor tidak dapat diubah admin lewat API saat ini, jadi mode edit
 * hanya membuka kontrol peran dan status. Pembeli selalu mendaftar sendiri.
 */
export default function UserDrawer({
  mode,
  user,
  busy,
  formError,
  fieldErrors,
  onClose,
  onSubmit,
}) {
  const generatedId = useId();
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phoneLocal, setPhoneLocal] = useState(localPhone(user?.phone));
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user?.role ?? "agent");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
    busyRef.current = busy;
  }, [onClose, busy]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKey(event) {
      if (event.key === "Escape" && !busyRef.current) onCloseRef.current();
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const creating = mode === "create";

  function handleSubmit(event) {
    event.preventDefault();

    if (creating) {
      onSubmit({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: toE164(phoneLocal),
        role,
      });
      return;
    }

    onSubmit({ role, isActive });
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ag-forest/40 backdrop-blur-sm"
        onClick={busy ? undefined : onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${generatedId}-title`}
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-ag-line bg-white shadow-2xl sm:w-[440px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ag-line bg-ag-surface-low px-5 py-4">
          <div>
            <h2
              id={`${generatedId}-title`}
              className="text-[16px] font-bold tracking-tight text-ag-slate"
            >
              {creating ? "Tambah Pengguna Baru" : "Detail Pengguna"}
            </h2>
            <p className="mt-0.5 text-[11.5px] text-ag-slate-secondary">
              {creating
                ? "Lengkapi data akun dan hak akses staf."
                : "Tinjau akun dan perbarui hak aksesnya."}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-white hover:text-ag-slate disabled:opacity-50"
          >
            <IconClose size={18} />
            <span className="sr-only">Tutup panel pengguna</span>
          </button>
        </div>

        <form
          id={`${generatedId}-form`}
          onSubmit={handleSubmit}
          aria-busy={busy || undefined}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-5"
        >
          {formError ? (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] leading-relaxed text-red-700"
            >
              {formError}
            </p>
          ) : null}

          {creating ? (
            <>
              <Field
                id={`${generatedId}-name`}
                label="Nama Lengkap"
                error={fieldErrors.fullName}
              >
                <input
                  id={`${generatedId}-name`}
                  data-autofocus
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  maxLength={120}
                  required
                  placeholder="Masukkan nama lengkap"
                  className={inputClass(fieldErrors.fullName)}
                />
              </Field>

              <Field
                id={`${generatedId}-email`}
                label="Email"
                error={fieldErrors.email}
                hint="Gunakan email aktif korporat."
              >
                <input
                  id={`${generatedId}-email`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="nama@sanggroup.id"
                  className={inputClass(fieldErrors.email)}
                />
              </Field>

              <Field
                id={`${generatedId}-phone`}
                label="Nomor WhatsApp"
                error={fieldErrors.phone}
                hint="8–13 digit setelah +62."
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-ag-slate-secondary">
                    +62
                  </span>
                  <input
                    id={`${generatedId}-phone`}
                    inputMode="numeric"
                    value={phoneLocal}
                    onChange={(event) =>
                      setPhoneLocal(event.target.value.replace(/[^\d]/g, ""))
                    }
                    placeholder="812 3456 7890"
                    className={`${inputClass(fieldErrors.phone)} pl-12`}
                  />
                </div>
              </Field>

              <Field id={`${generatedId}-role`} label="Peran Pengguna">
                <select
                  id={`${generatedId}-role`}
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className={inputClass()}
                >
                  <option value="agent">Penjual/Agen</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              <Field
                id={`${generatedId}-password`}
                label="Kata Sandi Sementara"
                error={fieldErrors.password}
                hint="Minimal 8 karakter, memuat huruf dan angka."
              >
                <div className="relative">
                  <input
                    id={`${generatedId}-password`}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    maxLength={72}
                    autoComplete="new-password"
                    placeholder="Kata sandi awal staf"
                    className={`${inputClass(fieldErrors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-ag-slate-secondary hover:text-ag-slate"
                    aria-label={
                      showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                    }
                  >
                    {showPassword ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                  </button>
                </div>
              </Field>

              <p className="rounded-lg border border-ag-line bg-ag-ivory-surface px-3 py-2.5 text-[11.5px] leading-relaxed text-ag-slate-secondary">
                Akun pembeli tidak dibuat di sini — pembeli mendaftar sendiri
                melalui halaman publik. Admin hanya membuat akun agen dan admin.
              </p>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-ag-surface-low/70 p-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ag-forest text-[13px] font-bold text-white"
                  >
                    {initialsOf(user?.fullName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-ag-slate">
                      {user?.fullName}
                    </p>
                    <span
                      className={`mt-1 inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ROLE_BADGE[user?.role] ?? ROLE_BADGE.buyer
                      }`}
                    >
                      {ROLE_LABEL[user?.role] ?? user?.role}
                    </span>
                  </div>
                </div>

                <dl className="mt-3 space-y-1.5 border-t border-ag-line/70 pt-3 text-[12px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-1.5 text-ag-slate-muted">
                      <IconMail size={14} />
                      Email
                    </dt>
                    <dd className="truncate text-ag-slate">{user?.email || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-1.5 text-ag-slate-muted">
                      <IconPhone size={14} />
                      WhatsApp
                    </dt>
                    <dd className="truncate text-ag-slate">{user?.phone || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="flex items-center gap-1.5 text-ag-slate-muted">
                      <IconUsers size={14} />
                      Bergabung
                    </dt>
                    <dd className="text-ag-slate">{formatDate(user?.createdAt)}</dd>
                  </div>
                </dl>
              </div>

              <Field id={`${generatedId}-edit-role`} label="Peran Pengguna">
                <select
                  id={`${generatedId}-edit-role`}
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className={inputClass()}
                >
                  <option value="buyer">Pembeli</option>
                  <option value="agent">Penjual/Agen</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>

              <div className="flex items-center justify-between gap-4 rounded-lg bg-ag-surface-low p-3.5">
                <div>
                  <p className="text-[12.5px] font-semibold text-ag-slate">
                    Status akun
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-ag-slate-secondary">
                    {isActive
                      ? "Aktif — pengguna dapat masuk ke portal."
                      : "Nonaktif — akses masuk pengguna diblokir."}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  aria-label="Status akun aktif"
                  onClick={() => setIsActive((value) => !value)}
                  disabled={busy}
                  className={[
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60",
                    isActive ? "bg-ag-available" : "bg-slate-300",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      isActive ? "translate-x-[22px]" : "translate-x-0.5",
                    ].join(" ")}
                  />
                </button>
              </div>

              <p className="rounded-lg border border-ag-line bg-ag-ivory-surface px-3 py-2.5 text-[11.5px] leading-relaxed text-ag-slate-secondary">
                Nama, email, dan nomor WhatsApp hanya dapat diubah oleh pemilik
                akun melalui pengaturan profil.
              </p>
            </>
          )}
        </form>

        <div className="flex items-center justify-end gap-2.5 border-t border-ag-line bg-ag-surface-low px-5 py-3.5">
          <ActionButton variant="outline" onClick={onClose} disabled={busy}>
            Batal
          </ActionButton>
          <ActionButton
            type="submit"
            form={`${generatedId}-form`}
            variant="primary"
            pending={busy}
          >
            {creating ? "Buat Akun" : "Simpan Perubahan"}
          </ActionButton>
        </div>
      </aside>
    </>
  );
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12px] font-semibold text-ag-slate"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[11.5px] text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11.5px] leading-relaxed text-ag-slate-secondary">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(error) {
  return [
    "h-10 w-full rounded-lg border bg-white px-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:outline-none",
    error
      ? "border-red-300 focus:border-red-500"
      : "border-ag-line focus:border-ag-gold-base",
  ].join(" ");
}

function localPhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("62")) return digits.slice(2);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function toE164(local) {
  const digits = String(local ?? "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  return digits ? `+62${digits}` : undefined;
}
