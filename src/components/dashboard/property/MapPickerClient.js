"use client";

import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="flex h-[320px] w-full items-center justify-center rounded-dash border border-ag-line bg-[#eae8e1] text-[13px] text-ag-slate-secondary"
    >
      Memuat peta…
    </div>
  ),
});

/**
 * Peta hanya ada di klien (Leaflet butuh window), sehingga dimuat lewat
 * next/dynamic tanpa SSR. Komponen ini memisahkan batas klien itu dari
 * formulir server-friendly lainnya.
 */
export default function MapPickerClient(props) {
  return <MapPicker {...props} />;
}
