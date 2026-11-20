"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { approveAgentAction } from "@/app/admin/actions";

/** Daftar pendaftaran agen yang menunggu persetujuan admin. */
export default function AgentApprovals({ agents }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  async function approve(id) {
    setBusyId(id);
    setError("");
    const response = await approveAgentAction(id);
    setBusyId(null);
    if (!response.ok) {
      setError(response.formError ?? "Gagal menyetujui akun.");
      return;
    }
    router.refresh();
  }

  if (agents.length === 0) {
    return (
      <p className="rounded-dash border border-dashed border-ag-line bg-white px-4 py-6 text-center text-[13px] text-ag-slate-secondary">
        Tidak ada pendaftaran agen yang menunggu.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {error}
        </p>
      ) : null}

      <ul className="divide-y divide-ag-line rounded-dash border border-ag-line bg-white">
        {agents.map((agent) => (
          <li key={agent.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p className="text-[13.5px] font-bold">{agent.fullName}</p>
              <p className="text-[12px] text-ag-slate-secondary">
                {agent.agencyName ?? "—"} · {agent.email} · {agent.phone}
              </p>
            </div>
            <button
              type="button"
              onClick={() => approve(agent.id)}
              disabled={busyId === agent.id}
              className="rounded-lg bg-ag-forest px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60"
            >
              {busyId === agent.id ? "Menyetujui…" : "Setujui akun"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
