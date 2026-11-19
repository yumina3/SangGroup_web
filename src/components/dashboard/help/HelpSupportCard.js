import { IconClock, IconMail, IconMessage } from "@/components/dashboard/icons";

function SupportLine({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-ag-gold-base" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ag-gold-muted">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

/**
 * Kartu kontak bantuan pada Pusat Bantuan agen.
 *
 * Warna dan susunannya mengikuti kartu gelap pada
 * `docs/agen/help_center_sang_group_semarang/code.html`, memakai token agen
 * yang sudah ada.
 */
export default function HelpSupportCard({ support }) {
  return (
    <aside
      aria-labelledby="help-support-heading"
      className="relative overflow-hidden rounded-dash bg-ag-forest p-5 text-white shadow-xl"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ag-gold-base">
        {support.eyebrow}
      </p>
      <h2
        id="help-support-heading"
        className="mt-2 text-[22px] font-bold leading-tight tracking-tight"
      >
        {support.title}
      </h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-white/80">{support.description}</p>

      <div className="mt-5 flex flex-col gap-4 rounded-dash bg-ag-forest-medium p-4">
        <SupportLine icon={IconMail} label="Email Administrator">
          <a
            href={`mailto:${support.email}`}
            className="block text-[13px] font-medium text-white hover:text-ag-gold-light"
          >
            {support.email}
          </a>
          <a
            href={`mailto:${support.adminEmail}`}
            className="block text-[11.5px] text-white/70 hover:text-ag-gold-light"
          >
            {support.adminEmail}
          </a>
        </SupportLine>

        <SupportLine icon={IconMessage} label="WhatsApp Resmi (Direct Hotline)">
          <a
            href={support.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[13px] font-semibold text-ag-gold-light hover:text-white"
          >
            {support.whatsapp}
          </a>
        </SupportLine>

        <SupportLine icon={IconClock} label="Jam Operasional Layanan">
          <span className="block text-[13px] text-white">{support.hours}</span>
        </SupportLine>
      </div>

      <a
        href={support.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-dash bg-ag-gold-base px-4 text-[13px] font-bold text-ag-forest transition-colors hover:bg-ag-gold-light"
      >
        <IconMessage size={18} />
        Hubungi Admin
      </a>
      <p className="mt-2 text-center text-[11px] leading-relaxed text-white/70">
        {support.responseNote}
      </p>
    </aside>
  );
}
