"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createStaffAction, updateUserAction } from "@/app/admin/actions";

const ROLE_LABEL = { buyer: "Pembeli", agent: "Agen", admin: "Admin" };

const EMPTY_STAFF = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  role: "agent",
};

/** Kelola pengguna & akun staf (FR-41). */
export default function UserManager({ users, currentUserId }) {
  const router = useRouter();
  const [staff, setStaff] = useState(EMPTY_STAFF);
  const [busyId, setBusyId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function setStaffField(name) {
    return (value) => setStaff((current) => ({ ...current, [name]: value }));
  }

  async function patch(userId, payload) {
    setBusyId(userId);
    setError("");
    setSuccess("");
    const response = await updateUserAction(userId, payload);
    setBusyId(null);
    if (!response.ok) {
      setError(response.formError ?? "Gagal mengubah pengguna.");
      return;
    }
    router.refresh();
  }

  async function createStaff(event) {
    event.preventDefault();
    setCreating(true);
    setError("");
    setSuccess("");
    const response = await createStaffAction({
      email: staff.email,
      password: staff.password,
      fullName: staff.fullName,
      phone: staff.phone || undefined,
      role: staff.role,
    });
    setCreating(false);
    if (!response.ok) {
      setError(response.formError ?? "Gagal membuat akun staf.");
      return;
    }
    setStaff(EMPTY_STAFF);
    setSuccess("Akun staf dibuat. Minta staf login lewat /penjual.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-dash border border-ag-line bg-white p-4">
        <h2 className="text-[15px] font-bold">Buat akun staf</h2>
        <p className="mt-0.5 text-[12px] text-ag-slate-secondary">
          Akun agen/admin tidak didaftarkan sendiri; admin membuatkannya di sini (FR-22).
        </p>

        <form onSubmit={createStaff} className="mt-3 grid gap-3 md:grid-cols-3">
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Nama lengkap</span>
            <input
              value={staff.fullName}
              onChange={(event) => setStaffField("fullName")(event.target.value)}
              className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
            />
          </label>
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Email</span>
            <input
              type="email"
              value={staff.email}
              onChange={(event) => setStaffField("email")(event.target.value)}
              className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
            />
          </label>
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Nomor WhatsApp (+62…)</span>
            <input
              value={staff.phone}
              onChange={(event) => setStaffField("phone")(event.target.value)}
              placeholder="+62812..."
              className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
            />
          </label>
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Kata sandi awal</span>
            <input
              type="password"
              value={staff.password}
              onChange={(event) => setStaffField("password")(event.target.value)}
              className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
            />
          </label>
          <label className="text-[12px] font-semibold">
            <span className="mb-1 block">Role</span>
            <select
              value={staff.role}
              onChange={(event) => setStaffField("role")(event.target.value)}
              className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
            >
              <option value="agent">Agen</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={creating}
              className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white disabled:opacity-60"
            >
              {creating ? "Membuat…" : "Buat akun"}
            </button>
          </div>
        </form>
      </section>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12.5px] text-emerald-700">
          {success}
        </p>
      ) : null}

      <section className="overflow-x-auto rounded-dash border border-ag-line bg-white">
        <table className="w-full min-w-[760px] text-left text-[12.5px]">
          <thead className="border-b border-ag-line bg-ag-surface-low text-[11px] uppercase tracking-wider text-ag-slate-muted">
            <tr>
              <th className="px-4 py-2.5">Nama</th>
              <th className="px-4 py-2.5">Email</th>
              <th className="px-4 py-2.5">Role</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id}>
                  <td className="px-4 py-2.5">
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-[11.5px] text-ag-slate-muted">{user.phone || "—"}</p>
                  </td>
                  <td className="px-4 py-2.5">{user.email || "—"}</td>
                  <td className="px-4 py-2.5">
                    {isSelf ? (
                      ROLE_LABEL[user.role]
                    ) : (
                      <select
                        value={user.role}
                        disabled={busyId === user.id}
                        onChange={(event) => patch(user.id, { role: event.target.value })}
                        className="h-8 rounded-lg border border-ag-line px-2 text-[11.5px]"
                      >
                        <option value="buyer">Pembeli</option>
                        <option value="agent">Agen</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {isSelf ? (
                      <span className="text-[11.5px] text-ag-slate-muted">Akun Anda</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => patch(user.id, { isActive: !user.isActive })}
                        disabled={busyId === user.id}
                        className="rounded-lg border border-ag-line px-2.5 py-1.5 text-[11.5px] font-semibold disabled:opacity-60"
                      >
                        {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
