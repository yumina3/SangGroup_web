"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveProjectAction } from "@/app/admin/actions";

const EMPTY = { name: "", description: "", address: "", latitude: "", longitude: "" };

/** Kelola data proyek (FR-40). */
export default function ProjectManager({ projects }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function setField(name) {
    return (value) => setForm((current) => ({ ...current, [name]: value }));
  }

  async function create(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await saveProjectAction({
      name: form.name,
      description: form.description,
      address: form.address,
      latitude: form.latitude === "" ? null : Number(form.latitude),
      longitude: form.longitude === "" ? null : Number(form.longitude),
    });
    setBusy(false);
    if (!response.ok) {
      setError(response.formError ?? "Gagal menyimpan proyek.");
      return;
    }
    setForm(EMPTY);
    router.refresh();
  }

  async function toggle(project) {
    setBusy(true);
    setError("");
    const response = await saveProjectAction({ id: project.id, isActive: !project.isActive });
    setBusy(false);
    if (!response.ok) {
      setError(response.formError ?? "Gagal mengubah proyek.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="grid gap-3 rounded-dash border border-ag-line bg-white p-4 md:grid-cols-2">
        <label className="text-[12px] font-semibold md:col-span-2">
          <span className="mb-1 block">Nama proyek *</span>
          <input
            value={form.name}
            onChange={(event) => setField("name")(event.target.value)}
            placeholder="Contoh: Sang Naya Residence"
            className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
          />
        </label>
        <label className="text-[12px] font-semibold md:col-span-2">
          <span className="mb-1 block">Alamat</span>
          <input
            value={form.address}
            onChange={(event) => setField("address")(event.target.value)}
            className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
          />
        </label>
        <label className="text-[12px] font-semibold md:col-span-2">
          <span className="mb-1 block">Deskripsi</span>
          <textarea
            value={form.description}
            onChange={(event) => setField("description")(event.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ag-line px-2 py-1.5 text-[12.5px]"
          />
        </label>
        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Latitude (opsional)</span>
          <input
            value={form.latitude}
            onChange={(event) => setField("latitude")(event.target.value)}
            className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
          />
        </label>
        <label className="text-[12px] font-semibold">
          <span className="mb-1 block">Longitude (opsional)</span>
          <input
            value={form.longitude}
            onChange={(event) => setField("longitude")(event.target.value)}
            className="h-9 w-full rounded-lg border border-ag-line px-2 text-[12.5px]"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busy || form.name.trim().length < 2}
            className="h-9 rounded-lg bg-ag-forest px-3 text-[12.5px] font-semibold text-white disabled:opacity-60"
          >
            Tambah proyek
          </button>
        </div>
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
              <th className="px-4 py-2.5">Proyek</th>
              <th className="px-4 py-2.5">Slug</th>
              <th className="px-4 py-2.5">Listing</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ag-line">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-2.5">
                  <p className="font-semibold">{project.name}</p>
                  <p className="text-[11.5px] text-ag-slate-muted">{project.address || "—"}</p>
                </td>
                <td className="px-4 py-2.5 text-ag-slate-secondary">{project.slug}</td>
                <td className="px-4 py-2.5">{project.propertyCount ?? 0}</td>
                <td className="px-4 py-2.5">{project.isActive ? "Aktif" : "Nonaktif"}</td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggle(project)}
                    disabled={busy}
                    className="rounded-lg border border-ag-line px-2.5 py-1.5 text-[11.5px] font-semibold disabled:opacity-60"
                  >
                    {project.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
