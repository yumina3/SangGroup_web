import "server-only";

import pino from "pino";

const level = process.env.LOG_LEVEL ?? "info";

/**
 * Logger terstruktur (PRD §10.6). Jangan pernah mencatat kata sandi, token,
 * anon key, atau isi pesan pribadi.
 */
export const logger = pino({
  level,
  base: { service: "sang-group" },
  redact: {
    paths: [
      "password",
      "*.password",
      "token",
      "*.token",
      "access_token",
      "*.access_token",
      "refresh_token",
      "*.refresh_token",
    ],
    censor: "[redacted]",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function logAuth(action, context = {}) {
  logger.info({ event: "auth", action, ...context }, `auth.${action}`);
}
