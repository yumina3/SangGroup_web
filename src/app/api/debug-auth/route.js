import { NextResponse } from "next/server";

import { loginForPortal } from "@/lib/auth/login";
import { signInWithPassword } from "@/lib/auth/supabase-server";
import { findProfileById } from "@/lib/auth/profile";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  try {
    const formData = new FormData();
    formData.set("email", body.email ?? "");
    formData.set("password", body.password ?? "");
    formData.set("remember", "on");

    const login = await loginForPortal({ role: "buyer", formData });

    return NextResponse.json({ step: "login", login });
  } catch (error) {
    return NextResponse.json(
      {
        step: "exception",
        name: error?.name,
        code: error?.code,
        message: error?.message,
        cause: error?.cause?.message ?? null,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
