import "server-only";

import { unstable_rethrow } from "next/navigation";
import { NextResponse } from "next/server";

import { AppError, ERROR_CODES } from "@/lib/errors";
import { logger } from "@/lib/logging/logger";

/**
 * Pembungkus Route Handler.
 *
 * Semua error diterjemahkan di satu tempat: AppError → status yang diminta,
 * ZodError → 422 dengan field errors, error database → pesan umum, sisanya 500.
 * Detail internal hanya masuk log, tidak pernah ke response.
 */
export function withRoute(handler) {
  return async function route(request, context) {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error, request);
    }
  };
}

/** @param {unknown} data */
export function ok(data, { status = 200, headers = {} } = {}) {
  return NextResponse.json({ data }, { status, headers });
}

export function errorResponse(error, request) {
  // Error internal Next (redirect, notFound, bailout prerender, dynamic usage)
  // harus dilempar ulang agar framework yang menanganinya — bukan diubah
  // menjadi JSON 500.
  unstable_rethrow(error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}),
        },
      },
      { status: error.status },
    );
  }

  const prismaCode = typeof error?.code === "string" ? error.code : null;
  if (prismaCode === "P2002") {
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.CONFLICT,
          message: "Data yang sama sudah ada. Periksa kembali isian Anda.",
        },
      },
      { status: 409 },
    );
  }
  if (prismaCode === "P2003") {
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.CONFLICT,
          message: "Data ini masih dirujuk oleh data lain sehingga tidak bisa diproses.",
        },
      },
      { status: 409 },
    );
  }
  if (prismaCode === "P2025") {
    return NextResponse.json(
      { error: { code: ERROR_CODES.NOT_FOUND, message: "Data tidak ditemukan." } },
      { status: 404 },
    );
  }
  if (prismaCode === "P2010" || prismaCode === "P2011" || prismaCode === "P2019") {
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.VALIDATION,
          message: "Data ditolak oleh aturan database. Periksa kembali isian Anda.",
        },
      },
      { status: 422 },
    );
  }

  logger.error(
    {
      event: "http.unhandled",
      method: request?.method,
      path: request?.nextUrl?.pathname,
      err: { name: error?.name, message: error?.message, code: error?.code },
    },
    "Permintaan gagal tanpa penanganan khusus",
  );

  return NextResponse.json(
    {
      error: {
        code: ERROR_CODES.INTERNAL,
        message: "Terjadi kesalahan pada server. Coba lagi beberapa saat lagi.",
      },
    },
    { status: 500 },
  );
}

/**
 * Baca body JSON lalu validasi dengan skema Zod.
 *
 * @template T
 * @param {Request} request
 * @param {import("zod").ZodType<T>} schema
 * @returns {Promise<T>}
 */
export async function readJson(request, schema) {
  let body;
  try {
    body = await request.json();
  } catch {
    throw new AppError(ERROR_CODES.VALIDATION, "Body permintaan bukan JSON yang valid.", {
      status: 400,
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    /** @type {Record<string,string>} */
    const fieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path?.join(".") || "_";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new AppError(ERROR_CODES.VALIDATION, "Sebagian isian belum benar.", {
      status: 422,
      fieldErrors,
    });
  }

  return parsed.data;
}

/** @param {URLSearchParams} search */
export function readPagination(search, { defaultSize = 12, maxSize = 50 } = {}) {
  const page = Math.max(1, Number.parseInt(search.get("page") ?? "1", 10) || 1);
  const requested = Number.parseInt(search.get("pageSize") ?? String(defaultSize), 10) || defaultSize;
  const pageSize = Math.min(Math.max(1, requested), maxSize);
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

/** Angka dari query string; null bila kosong/tidak valid. */
export function readNumberParam(search, key) {
  const raw = search.get(key);
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

