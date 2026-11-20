"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveCategoryAction } from "@/app/admin/actions";

/** Kelola kategori properti (FR-40). */
export default function CategoryManager({ categories }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await saveCategoryAction({ name });
    setBusy(false);
    if (!response.ok) {
      setError(response.formError ?? "Gagal menyimpan kategori.");
      return;
    }
    setName("");
    router.refresh();
  }

  async function toggle(category) {
    setBusy(true);
    setError("");
    const response = await saveCategoryAction({ id: category.id, isActive: !category.isActive });
    setBusy(false);
    if (!response.ok) {
      setError(response.formError ?? "Gagal mengubah kategori.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="flex flex-wrap items-end gap-2 rounded-dash border border-ag-line bg-white p-4">
        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Nama kategori baru</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Contoh: Apartemen"
            className="h-9 w-64 rounded-lg border border-ag-line px-2 text-[12.5px]"
          />
        </label>
        <button
          type="submit"
          disabled={busy || name.trim().length < 2}
          className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white disabled:opacity-60"
        >
          Tambah kategori
        </button>
        <p className="text-[11.5px] text-ag-slate-muted">Slug dibuat otomatis dari nama.</p>
      </form>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-dash border border-ag-line bg-white">
        <table className="w-full text-left text-[12.5px]">
          <thead className="border-b border-ag-line bg-ag-surface-low text-[11px] uppercase tracking-wider text-ag-slate-muted">
            <tr>
              <th className="px-4 py-2.5">Nama</th>
              <th className="px-4 py-2.5">Slug</th>
              <th className="px-4 py-2.5">Listing</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-2.5 font-semibold">{category.name}</td>
                <td className="px-4 py-2.5 text-ag-slate-secondary">{category.slug}</td>
                <td className="px-4 py-2.5">{category.propertyCount ?? 0}</td>
                <td className="px-4 py-2.5">{category.isActive ? "Aktif" : "Nonaktif"}</td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggle(category)}
                    disabled={busy}
                    className="rounded-lg border border-ag-line px-2.5 py-1.5 text-[11.5px] font-semibold disabled:opacity-60"
                  >
                    {category.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-ag-slate-secondary">Belum ada kategori.</p>
        ) : null}
      </div>
    </div>
  );
}
