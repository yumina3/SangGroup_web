/**
 * Rate limit sederhana berbasis memori proses.
 *
 * Cukup untuk satu instance (lokal/demo). Bila aplikasi dijalankan pada lebih
 * dari satu instance, ganti implementasi ini dengan penyimpanan bersama
 * (mis. Redis) tanpa mengubah pemanggilnya.
 */

const buckets = new Map();

function now() {
  return Date.now();
}

function prune(bucket, windowMs, at) {
  while (bucket.hits.length > 0 && at - bucket.hits[0] > windowMs) {
    bucket.hits.shift();
  }
}

/**
 * @returns {{ ok: true } | { ok: false, retryAfterSeconds: number }}
 */
export function consume(key, { limit, windowMs }) {
  const at = now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  prune(bucket, windowMs, at);

  if (bucket.hits.length >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((bucket.hits[0] + windowMs - at) / 1000),
    );
    return { ok: false, retryAfterSeconds };
  }

  bucket.hits.push(at);
  return { ok: true };
}

export function reset(key) {
  buckets.delete(key);
}

/** Hanya untuk pengujian. */
export function resetAll() {
  buckets.clear();
}

export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  register: { limit: 3, windowMs: 60 * 60 * 1000 },
};
