"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { saveCategoryAction } from "@/app/admin/actions";
import SummaryCard from "@/components/admin/SummaryCard";
import ActionButton from "@/components/dashboard/ActionButton";
import Modal from "@/components/dashboard/Modal";
import { useToast } from "@/components/dashboard/Toast";
import {
  IconBuilding,
  IconCheckCircle,
  IconList,
  IconPlus,
  IconSearch,
  IconSliders,
} from "@/components/dashboard/icons";
import TablePagination from "./TablePagination";

const PAGE_SIZE = 8;
const FORM_ID = "category-form";

const TABS = [
  { value: "active", label: "Tipe Properti" },
  { value: "archived", label: "Arsip" },
];

/**
 * Kelola kategori properti (FR-40) dengan tampilan master data.
 *
 * Kategori tidak punya field deskripsi atau kode terpisah, jadi kode yang
 * tampil diturunkan dari slug dan status arsip dipakai sebagai pengganti
 * hapus: kategori yang sudah dipakai listing tetap aman.
 */
export default function CategoryManager({ categories }) {
  const router = useRouter();
  const toast = useToast();

  const [tab, setTab] = useState("active");
  const [search, setSearch] = useState("");
  const [usage, setUsage] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );
  const archivedCategories = useMemo(
    () => categories.filter((category) => !category.isActive),
    [categories],
  );
  const totalListings = useMemo(
    () =>
      categories.reduce(
        (total, category) => total + (category.propertyCount ?? 0),
        0,
      ),
    [categories],
  );

  const source = tab === "active" ? activeCategories : archivedCategories;
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return source.filter((category) => {
      const matchesSearch =
        !term ||
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term);
      const matchesUsage =
        usage === "all" ||
        (usage === "used"
          ? (category.propertyCount ?? 0) > 0
          : (category.propertyCount ?? 0) === 0);
      return matchesSearch && matchesUsage;
    });
  }, [source, search, usage]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const hasFilter = Boolean(search.trim()) || usage !== "all";

  function changeTab(nextTab) {
    setTab(nextTab);
    setPage(1);
  }

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function changeUsage(value) {
    setUsage(value);
    setPage(1);
  }

  function resetFilters() {
    setSearch("");
    setUsage("all");
    setPage(1);
  }

  function openCreate() {
    setFormError("");
    setFieldErrors({});
    setModal({ mode: "create" });
  }

  function openEdit(category) {
    setFormError("");
    setFieldErrors({});
    setModal({ mode: "edit", category });
  }

  function closeModal() {
    if (!busy) setModal(null);
  }

  async function submitCategory(payload) {
    setBusy(true);
    setFormError("");
    setFieldErrors({});

    const response = await saveCategoryAction(payload);
    setBusy(false);

    if (!response.ok) {
      const message = response.formError ?? "Gagal menyimpan kategori.";
      setFormError(message);
      setFieldErrors(response.fieldErrors ?? {});
      toast.push(message, "danger");
      return;
    }

    toast.push(
      payload.id
        ? `Kategori “${payload.name}” berhasil diperbarui.`
        : `Kategori “${payload.name}” berhasil ditambahkan.`,
      "success",
    );
    setModal(null);
    router.refresh();
  }

  async function toggleCategory(category) {
    setBusyId(category.id);
    const response = await saveCategoryAction({
      id: category.id,
      isActive: !category.isActive,
    });
    setBusyId(null);

    if (!response.ok) {
      toast.push(
        response.formError ?? "Gagal mengubah status kategori.",
        "danger",
      );
      return;
    }

    toast.push(
      category.isActive
        ? `Kategori “${category.name}” dipindahkan ke arsip.`
        : `Kategori “${category.name}” diaktifkan kembali.`,
      "success",
    );
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[24px] font-bold leading-tight tracking-tight text-ag-slate md:text-[26px]">
              Kategori
            </h1>
            <span className="rounded-lg bg-ag-surface-low px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ag-forest">
              Master Data
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ag-slate-secondary">
            Kelola tipe properti yang dipakai pada listing SANG Group Semarang.
          </p>
        </div>

        <ActionButton variant="primary" onClick={openCreate}>
          <IconPlus size={18} />
          Tambah Kategori
        </ActionButton>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          label="Total Kategori"
          value={categories.length}
          unit="Tipe Properti"
          icon={<IconBuilding size={20} />}
          tone="forest"
        />
        <SummaryCard
          label="Kategori Aktif"
          value={activeCategories.length}
          unit="Tipe Properti"
          icon={<IconCheckCircle size={20} />}
          tone="available"
        />
        <SummaryCard
          label="Listing Terkait"
          value={totalListings}
          unit="Listing"
          icon={<IconList size={20} />}
          tone="gold"
        />
      </div>

      <section className="overflow-hidden rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div
          role="tablist"
          aria-label="Kelompok kategori"
          className="flex items-center gap-8 border-b border-ag-line px-5 pt-4"
        >
          {TABS.map((item) => {
            const selected = tab === item.value;
            const count =
              item.value === "active"
                ? activeCategories.length
                : archivedCategories.length;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => changeTab(item.value)}
                className={[
                  "relative pb-3 text-[13.5px] transition-colors",
                  selected
                    ? "font-bold text-ag-slate"
                    : "font-medium text-ag-slate-secondary hover:text-ag-slate",
                ].join(" ")}
              >
                {item.label}
                <span className="ml-1.5 text-[11px] font-semibold text-ag-slate-muted">
                  {count}
                </span>
                {selected ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-ag-gold-muted"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 bg-ag-surface-low/60 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <IconSearch
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ag-slate-secondary"
            />
            <label htmlFor="category-search" className="sr-only">
              Cari kategori
            </label>
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Cari kategori atau slug..."
              className="h-10 w-full rounded-lg border border-transparent bg-white pl-10 pr-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label
              htmlFor="category-usage"
              className="whitespace-nowrap text-[12px] font-medium text-ag-slate-secondary"
            >
              Status Pemakaian:
            </label>
            <select
              id="category-usage"
              value={usage}
              onChange={(event) => changeUsage(event.target.value)}
              className="h-10 rounded-lg border border-transparent bg-white px-3 text-[12.5px] font-medium text-ag-slate focus:border-ag-gold-base focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="used">Dipakai</option>
              <option value="unused">Belum Dipakai</option>
            </select>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilter}
              title="Reset filter"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white px-3 text-[12.5px] font-medium text-ag-slate-secondary transition-colors hover:text-ag-slate disabled:cursor-not-allowed disabled:opacity-45"
            >
              <IconSliders size={17} />
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <caption className="sr-only">
              Daftar kategori properti SANG Group
            </caption>
            <thead>
              <tr className="bg-white">
                {[
                  "Kode",
                  "Nama Kategori",
                  "Status",
                  "Jumlah Listing",
                  "Aksi",
                ].map((label) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-ag-line/70 transition-colors hover:bg-ag-surface-low/40"
                >
                  <td className="px-6 py-4 align-top">
                    <span className="inline-block max-w-[110px] truncate rounded-lg bg-ag-surface-low px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ag-forest">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span className="block text-[13.5px] font-semibold text-ag-slate">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] text-ag-slate-secondary">
                      slug: {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span
                      className={[
                        "inline-flex rounded-lg px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider",
                        category.isActive
                          ? "bg-ag-surface-low text-ag-available"
                          : "bg-ag-surface-low text-ag-slate-secondary",
                      ].join(" ")}
                    >
                      {category.isActive ? "Aktif" : "Arsip"}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <span
                      className={[
                        "inline-flex rounded-lg bg-ag-surface-low px-2.5 py-1 text-[11.5px] font-semibold",
                        (category.propertyCount ?? 0) > 0
                          ? "text-ag-slate"
                          : "text-ag-slate-muted",
                      ].join(" ")}
                    >
                      {category.propertyCount ?? 0} Listing
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="text-[11.5px] font-semibold text-ag-gold-muted transition-colors hover:text-ag-gold-base"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        disabled={busyId === category.id}
                        title={
                          category.isActive
                            ? "Sembunyikan kategori dari katalog tanpa menghapus relasinya"
                            : "Tampilkan kembali kategori di katalog"
                        }
                        className={[
                          "text-[11.5px] font-semibold transition-colors disabled:opacity-50",
                          category.isActive
                            ? "text-red-600 hover:underline"
                            : "text-ag-forest hover:underline",
                        ].join(" ")}
                      >
                        {busyId === category.id
                          ? "Menyimpan…"
                          : category.isActive
                            ? "Arsipkan"
                            : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 ? (
            <div className="border-t border-ag-line px-6 py-12 text-center">
              <p className="text-[13px] font-semibold text-ag-slate">
                {hasFilter
                  ? "Tidak ada kategori yang cocok"
                  : tab === "active"
                    ? "Belum ada kategori aktif"
                    : "Arsip kategori masih kosong"}
              </p>
              <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-ag-slate-secondary">
                {hasFilter
                  ? "Coba kata kunci lain atau reset filter untuk melihat semua kategori."
                  : tab === "active"
                    ? "Tambahkan kategori baru agar agen bisa mengelompokkan listing."
                    : "Kategori yang diarsipkan akan muncul di sini."}
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
          itemLabel={tab === "active" ? "kategori aktif" : "kategori arsip"}
        />
      </section>

      <aside className="flex flex-col gap-5 rounded-dash bg-ag-surface-low p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ag-forest text-ag-gold-base"
          >
            <IconCheckCircle size={22} />
          </span>
          <div>
            <h2 className="text-[14px] font-bold text-ag-slate">
              Aturan Relasi &amp; Integritas Master Data
            </h2>
            <p className="mt-1 max-w-3xl text-[12.5px] leading-relaxed text-ag-slate-secondary">
              Kategori yang sudah terhubung dengan listing tidak dapat dihapus
              untuk menjaga konsistensi data dan riwayat pemesanan. Gunakan
              tombol <strong className="font-semibold text-ag-slate">Arsipkan</strong>{" "}
              agar kategori tidak lagi muncul di katalog publik.
            </p>
          </div>
        </div>
        <p className="shrink-0 text-[11.5px] text-ag-slate-secondary">
          Status Sistem:{" "}
          <strong className="font-semibold text-ag-forest">Terkunci Aman</strong>
        </p>
      </aside>

      <Modal
        open={Boolean(modal)}
        onClose={closeModal}
        title={
          modal?.mode === "edit"
            ? `Edit Kategori${modal.category ? `: ${modal.category.name}` : ""}`
            : "Tambah Kategori Baru"
        }
        description={
          modal?.mode === "edit"
            ? "Perbarui nama, slug, atau status tampil kategori."
            : "Tambahkan klasifikasi tipe hunian yang dipakai pada listing SANG Group."
        }
        footer={
          <>
            <ActionButton
              variant="outline"
              onClick={closeModal}
              disabled={busy}
            >
              Batal
            </ActionButton>
            <ActionButton
              type="submit"
              form={FORM_ID}
              variant="primary"
              pending={busy}
            >
              Simpan
            </ActionButton>
          </>
        }
      >
        {modal ? (
          <CategoryForm
            key={modal.category?.id ?? "new"}
            category={modal.category}
            busy={busy}
            formError={formError}
            fieldErrors={fieldErrors}
            onSubmit={submitCategory}
          />
        ) : null}
      </Modal>
    </div>
  );
}

function CategoryForm({ category, busy, formError, fieldErrors, onSubmit }) {
  const generatedId = useId();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...(category ? { id: category.id } : {}),
      name: name.trim(),
      slug: slug.trim() || undefined,
      isActive,
    });
  }

  return (
    <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] leading-relaxed text-red-700"
        >
          {formError}
        </p>
      ) : null}

      <div>
        <label
          htmlFor={`${generatedId}-name`}
          className="mb-1.5 block text-[12px] font-semibold text-ag-slate"
        >
          Nama Kategori <span className="text-red-600">*</span>
        </label>
        <input
          id={`${generatedId}-name`}
          data-autofocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          required
          placeholder="Contoh: Rumah Subsidi"
          className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
        />
        {fieldErrors.name ? (
          <p className="mt-1 text-[11.5px] text-red-600">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`${generatedId}-slug`}
          className="mb-1.5 block text-[12px] font-semibold text-ag-slate"
        >
          Slug
        </label>
        <input
          id={`${generatedId}-slug`}
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          maxLength={80}
          placeholder="rumah-subsidi"
          className="h-10 w-full rounded-lg border border-ag-line bg-white px-3 text-[13px] text-ag-slate placeholder:text-ag-slate-muted focus:border-ag-gold-base focus:outline-none"
        />
        <p className="mt-1 text-[11.5px] leading-relaxed text-ag-slate-secondary">
          Kosongkan untuk dibuat otomatis dari nama. Hanya huruf kecil, angka,
          dan tanda hubung.
        </p>
        {fieldErrors.slug ? (
          <p className="mt-1 text-[11.5px] text-red-600">{fieldErrors.slug}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg bg-ag-surface-low p-3.5">
        <div>
          <p className="text-[12.5px] font-semibold text-ag-slate">
            Status kategori
          </p>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-ag-slate-secondary">
            {isActive
              ? "Aktif — tampil sebagai filter di katalog publik."
              : "Diarsipkan — disembunyikan dari katalog publik."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label="Status kategori aktif"
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
    </form>
  );
}
