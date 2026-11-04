/**
 * Ikon garis 20 px (stroke, tanpa emoji) untuk dashboard agen.
 *
 * Memakai ikon SVG inline agar tidak menambah dependensi dan ikon ikut
 * diwarnai teks (`currentColor`). Material Symbols/emoji sengaja tidak
 * dipakai supaya tampilan tidak bergantung pada font ikon eksternal dan
 * tidak memunculkan emoji berwarna di sistem yang berbeda.
 */

function Svg({ children, size = 20, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function IconEye(props) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconEyeOff(props) {
  return (
    <Svg {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6a9.6 9.6 0 0 1 1.4-.1c6 0 9.5 6.1 9.5 6.1a17 17 0 0 1-2.9 3.6" />
      <path d="M6.4 7.2A17 17 0 0 0 2.5 12S6 18.1 12 18.1c1.7 0 3.2-.4 4.5-1.1" />
      <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
    </Svg>
  );
}

export function IconSearch(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Svg>
  );
}

export function IconBell(props) {
  return (
    <Svg {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 6-2 7-2 7h16s-2-1-2-7" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </Svg>
  );
}

export function IconCalendar(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </Svg>
  );
}

export function IconPlus(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconMenu(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function IconClose(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconChevronDown(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function IconAlert(props) {
  return (
    <Svg {...props}>
      <path d="M12 4 2.8 20h18.4z" />
      <path d="M12 10v4.5M12 17.4h.01" />
    </Svg>
  );
}

export function IconHome(props) {
  return (
    <Svg {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
    </Svg>
  );
}

export function IconBuilding(props) {
  return (
    <Svg {...props}>
      <path d="M4 21V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v15" />
      <path d="M15 10h3a2 2 0 0 1 2 2v9M3 21h18" />
      <path d="M8 8h3M8 12h3M8 16h3" />
    </Svg>
  );
}

export function IconInbox(props) {
  return (
    <Svg {...props}>
      <path d="M4 13h4l1.5 3h5l1.5-3h4" />
      <path d="M5.5 5h13l1.5 8v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6z" />
    </Svg>
  );
}

export function IconSettings(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H2.8a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.2 8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9.9 4V3.8a2 2 0 1 1 4 0V4a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Svg>
  );
}

export function IconKanban(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4" width="5" height="16" rx="1.2" />
      <rect x="10.5" y="4" width="5" height="10" rx="1.2" />
      <rect x="17.5" y="4" width="3" height="13" rx="1.2" />
    </Svg>
  );
}

export function IconCheckSquare(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8.5 12.5 2.4 2.4 4.8-5" />
    </Svg>
  );
}

export function IconUsers(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 20a6 6 0 0 0-2-4.5" />
    </Svg>
  );
}

export function IconMessage(props) {
  return (
    <Svg {...props}>
      <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-6.2A7 7 0 0 1 11 4h2a7 7 0 0 1 7 8z" />
    </Svg>
  );
}

export function IconChart(props) {
  return (
    <Svg {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Svg>
  );
}

export function IconBadge(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="9" r="4.5" />
      <path d="M8.5 12.8 7 21l5-2.5L17 21l-1.5-8.2" />
    </Svg>
  );
}

export function IconFunnel(props) {
  return (
    <Svg {...props}>
      <path d="M4 5h16l-6 7.5V20l-4-2v-5.5z" />
    </Svg>
  );
}

export function IconMap(props) {
  return (
    <Svg {...props}>
      <path d="M9 4 3.5 6.5v13L9 17l6 2.5 5.5-2.5v-13L15 6.5z" />
      <path d="M9 4v13M15 6.5v13" />
    </Svg>
  );
}

export function IconPlug(props) {
  return (
    <Svg {...props}>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0z" />
      <path d="M12 17v4" />
    </Svg>
  );
}

export function IconHelp(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.5a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.8-.9 1.5v.6" />
      <path d="M12 17.2h.01" />
    </Svg>
  );
}

export function IconExit(props) {
  return (
    <Svg {...props}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4M6 12h9" />
    </Svg>
  );
}

export function IconSliders(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </Svg>
  );
}

export function IconDownload(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v12" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M4 17v2.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V17" />
    </Svg>
  );
}

export function IconList(props) {
  return (
    <Svg {...props}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </Svg>
  );
}

export function IconArrowRight(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </Svg>
  );
}

export function IconClock(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

export function IconPhone(props) {
  return (
    <Svg {...props}>
      <path d="M8.2 3.5 10 8l-2 1.8a13 13 0 0 0 6.2 6.2L16 14l4.5 1.8v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 2.2 4.7a2 2 0 0 1 2-2.2h3z" />
    </Svg>
  );
}

export function IconMail(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </Svg>
  );
}

export function IconCheckCircle(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </Svg>
  );
}

export function IconBan(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m6 18 12-12" />
    </Svg>
  );
}

export function IconFileText(props) {
  return (
    <Svg {...props}>
      <path d="M6 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20z" />
      <path d="M13 3.5v5h5M9 13h6M9 17h4" />
    </Svg>
  );
}

export function IconArrowLeft(props) {
  return (
    <Svg {...props}>
      <path d="M20 12H4" />
      <path d="m10 18-6-6 6-6" />
    </Svg>
  );
}

export function IconSend(props) {
  return (
    <Svg {...props}>
      <path d="M21 3 3 10.5l7 2.5 2.5 7z" />
      <path d="M10 13 21 3" />
    </Svg>
  );
}

export function IconPaperclip(props) {
  return (
    <Svg {...props}>
      <path d="M20.5 11.5 12 20a6 6 0 0 1-8.5-8.5l8-8a4 4 0 0 1 5.7 5.7l-8 8a2 2 0 0 1-2.8-2.8l7.6-7.6" />
    </Svg>
  );
}

export function IconCheck(props) {
  return (
    <Svg {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  );
}

export function IconCheckDouble(props) {
  return (
    <Svg {...props}>
      <path d="m2.5 12.5 4.5 4.5L16.5 7" />
      <path d="m11.5 15.5 1.5 1.5L22.5 7" />
    </Svg>
  );
}

export function IconMoreVertical(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

