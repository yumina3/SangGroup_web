"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createStaffAction, updateUserAction } from "@/app/admin/actions";
import SummaryCard from "@/components/admin/SummaryCard";
import UserDrawer from "@/components/admin/UserDrawer";
import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import {
  IconAlert,
  IconBadge,
  IconBan,
  IconCheckCircle,
  IconMoreVertical,
  IconPlus,
  IconSearch,
  IconSliders,
  IconUsers,
} from "@/components/dashboard/icons";
import { formatDate, initialsOf } from "@/lib/dashboard/format";
import TablePagination from "./TablePagination";

const PAGE_SIZE = 10;

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

const ROLE_AVATAR = {
  admin: "bg-ag-forest text-white",
  agent: "bg-ag-forest-medium text-ag-gold-light",
  buyer: "bg-ag-surface-low text-ag-slate-secondary",
};

/**
 * Kelola akun dan peran pengguna (FR-41).
 *
 * Filter dan pagination dikerjakan di klien karena admin memuat seluruh daftar
 * akun sekaligus; pencarian email tidak tersedia di query profil Prisma.
 */
export default function UserManager({ users, currentUserId, recap }) {
  const router = useRouter();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState(null);

  const [drawer, setDrawer] = useState(null);
  const [drawerError, setDrawerError] = useState("");
  const [drawerFieldErrors, setDrawerFieldErrors] = useState({});
  const [savingDrawer, setSavingDrawer] = useState(false);

  const [roleDialog, setRoleDialog] = useState(null);
  const [roleError, setRoleError] = useState("");
  const [savingRole, setSavingRole] = useState(false);

  const [statusDialog, setStatusDialog] = useState(null);
  const [statusError, setStatusError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const stats = recap ?? {
    total: users.length,
    active: users.filter((user) => user.isActive).length,
    inactive: users.filter((user) => !user.isActive).length,
    byRole: {
      admin: users.filter((user) => user.role === "admin").length,
      agent: users.filter((user) => user.role === "agent").length,
      buyer: users.filter((user) => user.role === "buyer").length,
    },
    activeByRole: {
      admin: users.filter((user) => user.role === "admin" && user.isActive).length,
      agent: users.filter((user) => user.role === "agent" && user.isActive).length,
      buyer: users.filter((user) => user.role === "buyer" && user.isActive).length,
    },
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.fullName.toLowerCase().includes(term) ||
        (user.email ?? "").toLowerCase().includes(term) ||
        (user.phone ?? "").includes(term);
      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" ? user.isActive : !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const hasFilter = Boolean(search.trim()) || Boolean(roleFilter) || Boolean(statusFilter);

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function changeRole(value) {
    setRoleFilter(value);
    setPage(1);
  }

  function changeStatus(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
  }

  function openCreate() {
    setDrawerError("");
    setDrawerFieldErrors({});
    setDrawer({ mode: "create" });
  }

  function openEdit(user) {
    setDrawerError("");
    setDrawerFieldErrors({});
    setDrawer({ mode: "edit", user });
  }

  function closeDrawer() {
    if (!savingDrawer) setDrawer(null);
  }

  async function submitDrawer(payload) {
    if (!drawer) return;

    setSavingDrawer(true);
    setDrawerError("");
    setDrawerFieldErrors({});

    const response =
      drawer.mode === "create"
        ? await createStaffAction(payload)
        : await updateUserAction(drawer.user.id, payload);

    setSavingDrawer(false);

    if (!response.ok) {
      const message = response.formError ?? "Gagal menyimpan pengguna.";
      setDrawerError(message);
      setDrawerFieldErrors(response.fieldErrors ?? {});
      toast.push(message, "danger");
      return;
    }

    toast.push(
      drawer.mode === "create"
        ? `Akun ${payload.fullName} berhasil dibuat.`
        : `Data ${drawer.user.fullName} berhasil diperbarui.`,
      "success",
    );
    setDrawer(null);
    router.refresh();
  }

  function openRoleDialog(user) {
    setRoleError("");
    setRoleDialog({ user, targetRole: user.role });
  }

  function closeRoleDialog() {
    if (!savingRole) setRoleDialog(null);
  }

  async function confirmRoleChange() {
    if (!roleDialog || roleDialog.targetRole === roleDialog.user.role) return;

    setSavingRole(true);
    setRoleError("");

    const response = await updateUserAction(roleDialog.user.id, {
      role: roleDialog.targetRole,
    });
    setSavingRole(false);

    if (!response.ok) {
      const message = response.formError ?? "Gagal mengubah peran pengguna.";
      setRoleError(message);
      toast.push(message, "danger");
      return;
    }

    toast.push(
      `Peran ${roleDialog.user.fullName} diubah menjadi ${
        ROLE_LABEL[roleDialog.targetRole] ?? roleDialog.targetRole
      }.`,
      "success",
    );
    setRoleDialog(null);
    router.refresh();
  }

  function openStatusDialog(user) {
    setStatusError("");
    setStatusDialog({ user, nextActive: !user.isActive });
  }

  function closeStatusDialog() {
    if (!savingStatus) setStatusDialog(null);
  }

  async function confirmStatusChange() {
    if (!statusDialog) return;

    setSavingStatus(true);
    setStatusError("");

    const response = await updateUserAction(statusDialog.user.id, {
      isActive: statusDialog.nextActive,
    });
    setSavingStatus(false);

    if (!response.ok) {
      const message = response.formError ?? "Gagal mengubah status akun.";
      setStatusError(message);
      toast.push(message, "danger");
      return;
    }

    toast.push(
      statusDialog.nextActive
        ? `Akun ${statusDialog.user.fullName} diaktifkan kembali.`
        : `Akun ${statusDialog.user.fullName} dinonaktifkan.`,
      "success",
    );
    setStatusDialog(null);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Pengguna"
          value={stats.total}
          unit="Akun"
          icon={<IconUsers size={20} />}
          tone="forest"
        />
        <SummaryCard
          label="Pengguna Aktif"
          value={stats.active}
          unit="Akun"
          icon={<IconCheckCircle size={20} />}
          tone="available"
        />
        <SummaryCard
          label="Agen Aktif"
          value={stats.activeByRole.agent}
          unit="Mitra"
          icon={<IconBadge size={20} />}
          tone="gold"
        />
        <SummaryCard
          label="Nonaktif"
          value={stats.inactive}
          unit="Akun"
          icon={<IconBan size={20} />}
          tone="danger"
        />
      </div>

      <section className="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[20px] font-bold leading-tight tracking-tight text-ag-slate">
              Pengguna
            </h1>
            <span className="rounded-lg bg-ag-surface-low px-2 py-0.5 text-[10.5px] font-semibold text-ag-slate-secondary">
              Sistem Otoritas
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-ag-slate-secondary">
            Kelola akun dan peran pengguna.
          </p>
        </div>

        <ActionButton variant="primary" onClick={openCreate}>
          <IconPlus size={18} />
          Tambah Pengguna
        </ActionButton>
      </section>

      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <IconSearch
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
          />
          <label htmlFor="user-search" className="sr-only">
            Cari pengguna
          </label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => changeSearch(event.target.value)}
            placeholder="Cari nama atau email..."
            className="h-10 w-full rounded-lg border border-transparent bg-ag-ivory-surface pl-10 pr-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg bg-ag-ivory-surface px-3">
            <label
              htmlFor="user-role-filter"
              className="text-[11.5px] font-medium text-ag-slate-secondary"
            >
              Peran:
            </label>
            <select
              id="user-role-filter"
              value={roleFilter}
              onChange={(event) => changeRole(event.target.value)}
              className="h-10 cursor-pointer bg-transparent text-[12.5px] font-medium text-ag-slate focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="admin">Admin</option>
              <option value="agent">Penjual/Agen</option>
              <option value="buyer">Pembeli</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-ag-ivory-surface px-3">
            <label
              htmlFor="user-status-filter"
              className="text-[11.5px] font-medium text-ag-slate-secondary"
            >
              Status:
            </label>
            <select
              id="user-status-filter"
              value={statusFilter}
              onChange={(event) => changeStatus(event.target.value)}
              className="h-10 cursor-pointer bg-transparent text-[12.5px] font-medium text-ag-slate focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasFilter}
            title="Reset filter"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-slate disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconSliders size={18} />
            <span className="sr-only">Reset filter</span>
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <caption className="sr-only">
              Daftar akun pengguna SANG Group
            </caption>
            <thead>
              <tr className="bg-ag-surface-low">
                {["Nama", "Email", "Peran", "Status", "Bergabung", "Aksi"].map(
                  (label) => (
                    <th
                      key={label}
                      scope="col"
                      className={[
                        "px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-ag-slate-secondary",
                        label === "Aksi" ? "text-right" : "",
                      ].join(" ")}
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => {
                const isSelf = user.id === currentUserId;
                const menuOpen = menuId === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-t border-ag-line/70 transition-colors hover:bg-ag-ivory-surface/70"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[11px] font-bold tracking-tight ${
                            ROLE_AVATAR[user.role] ?? ROLE_AVATAR.buyer
                          }`}
                        >
                          {initialsOf(user.fullName)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold leading-tight text-ag-slate">
                            {user.fullName}
                          </p>
                          <p className="mt-0.5 truncate text-[11.5px] text-ag-slate-secondary">
                            {user.phone || ROLE_LABEL[user.role] || "Pengguna"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12.5px] text-ag-slate-secondary">
                      {user.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-lg px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${
                          ROLE_BADGE[user.role] ?? ROLE_BADGE.buyer
                        }`}
                      >
                        {ROLE_LABEL[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={[
                          "inline-flex rounded-lg px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider",
                          user.isActive
                            ? "bg-ag-surface-low text-ag-available"
                            : "bg-red-50 text-red-600",
                        ].join(" ")}
                      >
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-[12.5px] text-ag-slate-secondary">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isSelf ? (
                        <span className="text-[11.5px] font-medium text-ag-slate-muted">
                          Akun Anda
                        </span>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            className="rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-slate"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openRoleDialog(user)}
                            className="rounded-lg px-2.5 py-1 text-[11.5px] font-semibold text-ag-gold-muted transition-colors hover:bg-ag-surface-low hover:text-ag-gold-base"
                          >
                            Ubah Peran
                          </button>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() =>
                                setMenuId((value) =>
                                  value === user.id ? null : user.id,
                                )
                              }
                              aria-haspopup="menu"
                              aria-expanded={menuOpen}
                              aria-label={`Aksi lain untuk ${user.fullName}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ag-slate-secondary transition-colors hover:bg-ag-surface-low hover:text-ag-slate"
                            >
                              <IconMoreVertical size={17} />
                            </button>

                            {menuOpen ? (
                              <>
                                <button
                                  type="button"
                                  aria-hidden="true"
                                  tabIndex={-1}
                                  onClick={() => setMenuId(null)}
                                  className="fixed inset-0 z-10 cursor-default"
                                />
                                <div
                                  role="menu"
                                  aria-label={`Aksi untuk ${user.fullName}`}
                                  className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-ag-line bg-white py-1 shadow-xl"
                                >
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => {
                                      setMenuId(null);
                                      openStatusDialog(user);
                                    }}
                                    className={[
                                      "block w-full px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-ag-surface-low",
                                      user.isActive
                                        ? "text-red-600"
                                        : "text-ag-forest",
                                    ].join(" ")}
                                  >
                                    {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                                  </button>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 ? (
            <div className="border-t border-ag-line px-6 py-12 text-center">
              <p className="text-[13px] font-semibold text-ag-slate">
                Tidak ada pengguna yang cocok
              </p>
              <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-ag-slate-secondary">
                Coba kata kunci lain atau ubah filter peran/status.
              </p>
              {hasFilter ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 text-[12px] font-semibold text-ag-forest hover:underline"
                >
                  Reset filter
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          itemLabel="pengguna"
        />
      </section>

      {drawer ? (
        <UserDrawer
          key={drawer.mode === "edit" ? drawer.user.id : "create"}
          mode={drawer.mode}
          user={drawer.user ?? null}
          busy={savingDrawer}
          formError={drawerError}
          fieldErrors={drawerFieldErrors}
          onClose={closeDrawer}
          onSubmit={submitDrawer}
        />
      ) : null}

      <Modal
        open={Boolean(roleDialog)}
        onClose={closeRoleDialog}
        title="Ubah Peran Pengguna"
        description="Konfirmasi otorisasi"
        footer={
          <>
            <ActionButton
              variant="outline"
              onClick={closeRoleDialog}
              disabled={savingRole}
            >
              Batal
            </ActionButton>
            <ActionButton
              variant="forest"
              onClick={confirmRoleChange}
              pending={savingRole}
              disabled={
                !roleDialog || roleDialog.targetRole === roleDialog.user.role
              }
            >
              Ubah Peran
            </ActionButton>
          </>
        }
      >
        {roleDialog ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-ag-gold-muted"
              >
                <IconBadge size={22} />
              </span>
              <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
                Ubah peran{" "}
                <strong className="font-semibold text-ag-slate">
                  {roleDialog.user.fullName}
                </strong>{" "}
                dari{" "}
                <strong className="font-semibold text-ag-slate">
                  {ROLE_LABEL[roleDialog.user.role] ?? roleDialog.user.role}
                </strong>{" "}
                menjadi:
              </p>
            </div>

            <div>
              <label
                htmlFor="role-dialog-select"
                className="mb-1.5 block text-[12px] font-semibold text-ag-slate"
              >
                Peran baru
              </label>
              <select
                id="role-dialog-select"
                value={roleDialog.targetRole}
                onChange={(event) =>
                  setRoleDialog((current) =>
                    current
                      ? { ...current, targetRole: event.target.value }
                      : current,
                  )
                }
                className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate focus:border-ag-gold-base focus:outline-none"
              >
                <option value="buyer">Pembeli</option>
                <option value="agent">Penjual/Agen</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {roleDialog.targetRole === "admin" ? (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-amber-800">
                <IconAlert size={15} className="mt-0.5 shrink-0" />
                Admin memiliki akses penuh ke verifikasi listing, kategori, dan
                pengguna. Pastikan perubahan ini disengaja.
              </p>
            ) : null}

            {roleError ? (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700"
              >
                {roleError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(statusDialog)}
        onClose={closeStatusDialog}
        title={statusDialog?.nextActive ? "Aktifkan Akun" : "Nonaktifkan Akun"}
        description={
          statusDialog?.nextActive ? "Pemulihan akses" : "Suspensi hak masuk"
        }
        footer={
          <>
            <ActionButton
              variant="outline"
              onClick={closeStatusDialog}
              disabled={savingStatus}
            >
              Batal
            </ActionButton>
            <ActionButton
              variant={statusDialog?.nextActive ? "forest" : "danger"}
              onClick={confirmStatusChange}
              pending={savingStatus}
            >
              {statusDialog?.nextActive ? "Aktifkan" : "Nonaktifkan"}
            </ActionButton>
          </>
        }
      >
        {statusDialog ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  statusDialog.nextActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600",
                ].join(" ")}
              >
                {statusDialog.nextActive ? (
                  <IconCheckCircle size={22} />
                ) : (
                  <IconBan size={22} />
                )}
              </span>
              <p className="text-[13px] leading-relaxed text-ag-slate-secondary">
                {statusDialog.nextActive ? "Aktifkan kembali akun " : "Nonaktifkan akun "}
                <strong className="font-semibold text-ag-slate">
                  {statusDialog.user.fullName}
                </strong>
                ?{" "}
                {statusDialog.nextActive
                  ? "Pengguna akan bisa masuk kembali ke portal."
                  : "Pengguna tidak akan bisa masuk sampai akun diaktifkan kembali."}
              </p>
            </div>

            {!statusDialog.nextActive && statusDialog.user.role === "admin" ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-amber-800">
                Sistem menolak penonaktifan bila ini satu-satunya admin aktif.
              </p>
            ) : null}

            {statusError ? (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700"
              >
                {statusError}
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
