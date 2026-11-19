"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DESTINATION = {
  buyer: { href: "/dashboard/pembeli", label: "Akun Saya" },
  agent: { href: "/dashboard/penjual", label: "Dashboard Agen" },
  admin: { href: "/dashboard/admin", label: "Dashboard Admin" },
};

/**
 * Menu sesi di navbar publik. Dibaca dari /api/auth/session setelah halaman
 * tampil agar halaman publik tetap bisa diprerender (layout situs tidak
 * membaca cookie). Bila sesi tidak ada, tampil tautan Masuk / Daftar.
 */
export default function BuyerMenu() {
  const [session, setSession] = useState({ state: "anonymous", profile: null });

  useEffect(() => {
    const controller = new AbortController();

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data?.authenticated) {
          setSession({ state: "authenticated", profile: data.profile });
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          setSession({ state: "anonymous", profile: null });
        }
      }
    }

    loadSession();
    return () => controller.abort();
  }, []);

  if (session.state === "authenticated" && session.profile) {
    const profile = session.profile;

    if (profile.status && profile.status !== "active") {
      return (
        <Link
          href={`/akun/nonaktif?reason=${encodeURIComponent(profile.status)}`}
          className="whitespace-nowrap font-semibold text-[#E2B96A] no-underline transition-colors hover:text-white"
        >
          Status Akun
        </Link>
      );
    }

    const destination = DESTINATION[profile.role] ?? DESTINATION.buyer;

    return (
      <Link
        href={destination.href}
        className="whitespace-nowrap font-semibold text-[#E2B96A] no-underline transition-colors hover:text-white"
      >
        {destination.label}
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[#C5A059]/40 bg-white/[0.06] px-3 py-1 leading-none">
      <Link
        href="/login"
        className="whitespace-nowrap font-semibold text-[#E2B96A] no-underline transition-colors hover:text-white"
      >
        Masuk
      </Link>
      <span aria-hidden="true" className="hidden text-white/25 sm:inline">
        /
      </span>
      <Link
        href="/register"
        className="hidden whitespace-nowrap font-normal text-gray-300 no-underline transition-colors hover:text-[#C5A059] sm:inline"
      >
        Daftar
      </Link>
    </span>
  );
}
