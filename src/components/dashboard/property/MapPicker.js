"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

const DEFAULT_CENTER = [-7.0051, 110.4381]; // Kota Semarang
const DEFAULT_ZOOM = 13;
const PICKED_ZOOM = 16;

function pinIcon() {
  return L.divIcon({
    className: "",
    html: '<span class="block h-4 w-4 rounded-full border-2 border-white bg-[#C8963E] shadow-md"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

/**
 * Peta pemilih koordinat (SRS-F-SEL-04).
 *
 * - Klik peta memindahkan titik; titik juga dapat digeser.
 * - Nilai Latitude/Longitude pada formulir tersinkron dua arah dengan peta.
 * - Leaflet menyentuh `window`, jadi komponen ini hanya dirender di klien
 *   (lihat MapPickerClient yang memakai next/dynamic tanpa SSR).
 * - Marker memakai DivIcon, bukan ikon PNG bawaan Leaflet, agar path gambar
 *   tidak perlu disalin manual ke /public.
 */
export default function MapPicker({ latitude, longitude, onPick, error }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onPickRef = useRef(onPick);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  const hasPoint =
    latitude !== "" &&
    longitude !== "" &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const lat = Number(latitude);
  const lng = Number(longitude);

  // 1. Buat peta sekali saja.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = L.map(containerRef.current, {
      center: hasPoint ? [lat, lng] : DEFAULT_CENTER,
      zoom: hasPoint ? PICKED_ZOOM : DEFAULT_ZOOM,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.on("click", (event) => {
      onPickRef.current?.({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    });

    mapRef.current = map;
    setReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Peta dibuat sekali; perubahan nilai ditangani effect marker di bawah.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Marker mengikuti nilai latitude/longitude pada formulir.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    if (!hasPoint) {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const marker = L.marker([lat, lng], {
        icon: pinIcon(),
        draggable: true,
        keyboard: true,
        title: "Titik lokasi properti",
      }).addTo(map);

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onPickRef.current?.({
          latitude: Number(position.lat.toFixed(6)),
          longitude: Number(position.lng.toFixed(6)),
        });
      });

      markerRef.current = marker;
    }

    if (!map.getBounds().pad(-0.15).contains([lat, lng])) {
      map.setView([lat, lng], PICKED_ZOOM);
    }
  }, [ready, hasPoint, lat, lng]);

  return (
    <div className="space-y-1.5">
      <div
        className={`relative h-[320px] w-full overflow-hidden rounded-dash border ${
          error ? "border-red-400" : "border-ag-line"
        }`}
      >
        <div
          ref={containerRef}
          role="application"
          aria-label="Peta pemilih koordinat properti. Klik peta untuk menentukan titik lokasi."
          className="h-full w-full"
        />
        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#eae8e1] text-[13px] text-ag-slate-secondary">
            Memuat peta…
          </div>
        ) : null}
        <p className="pointer-events-none absolute bottom-3 left-3 right-3 z-[500] rounded-tag bg-white/90 px-3 py-2 text-[12px] leading-relaxed text-ag-slate-secondary shadow-sm">
          Klik peta atau geser titik untuk menentukan lokasi. Nilai Latitude dan
          Longitude di bawah ikut berubah otomatis.
        </p>
      </div>
      <p className="text-[11px] text-ag-slate-muted">
        Peta dasar © OpenStreetMap contributors.
      </p>
    </div>
  );
}
