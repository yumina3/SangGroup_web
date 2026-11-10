"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { verifyPropertyAction } from "@/app/admin/actions";

/** Tombol setujui/tolak untuk satu baris listing di tabel admin. */
export default function ListingVerifyButtons({ propertyId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function decide(decision, note = "") {
    setBusy(true);
    const response = await verifyPropertyAction(propertyId, decision, note);
    setBusy(false);
    if (!response.ok) {
      window.alert(response.formError ?? "Keputusan gagal disimpan.");
      return;
    }
    router.refresh();
  }

  function reject() {
    const note = window.prompt("Alasan penolakan (minimal 5 karakter):", "");
    if (note === null) return;
    if (note.trim().length < 5) {
      window.alert("Alasan penolakan minimal 5 karakter.");
      return;
    }
    decide("rejected", note.trim());
  }

  return (
    <div className="flex gap-1.5">
      <button
        type="button"
        onClick={() => decide("approved")}
        disabled={busy}
        className="rounded-lg bg-ag-forest px-2.5 py-1.5 text-[11.5px] font-semibold text-white disabled:opacity-60"
      >
        Setujui
      </button>
      <button
        type="button"
        onClick={reject}
        disabled={busy}
        className="rounded-lg border border-red-300 px-2.5 py-1.5 text-[11.5px] font-semibold text-red-700 disabled:opacity-60"
      >
        Tolak
      </button>
    </div>
  );
}
