/**
 * Error domain yang aman diteruskan ke klien.
 *
 * `message` selalu ditulis untuk pengguna: tidak boleh memuat detail internal
 * (SQL, stack trace, nama tabel) sesuai Technical Requirements §4.
 */
export class AppError extends Error {
  /**
   * @param {string} code kode stabil untuk klien, mis. "PROPERTY_NOT_FOUND"
   * @param {string} message pesan bahasa Indonesia yang aman ditampilkan
   * @param {{ status?: number, fieldErrors?: Record<string, string> | null, cause?: unknown }} [options]
   */
  constructor(code, message, { status = 400, fieldErrors = null, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}

/** Kode error yang dipakai lintas modul. */
export const ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION_ERROR",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  NOT_CONFIGURED: "NOT_CONFIGURED",
  INTERNAL: "INTERNAL",
};
