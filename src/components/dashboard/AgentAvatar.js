"use client";

/**
 * Foto profil agen. `avatarUrl` kosong berarti belum ada foto di Storage,
 * sehingga ditampilkan potret netral (siluet) — bukan inisial berwarna yang
 * bisa disalahartikan sebagai foto.
 */
export default function AgentAvatar({ agent, size = 36 }) {
  const dimension = { width: size, height: size };

  if (agent.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={agent.avatarUrl}
        alt={`Foto profil ${agent.name}`}
        style={dimension}
        className="shrink-0 rounded-full border border-ag-line object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={dimension}
      className="flex shrink-0 items-center justify-center rounded-full bg-ag-forest text-white"
    >
      <svg
        width={size * 0.56}
        height={size * 0.56}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="9" r="3.6" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </svg>
    </span>
  );
}
