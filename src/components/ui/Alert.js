const TONE = {
  info: "border-info/30 bg-info/5 text-brand-ink",
  warning: "border-warning/40 bg-warning/10 text-brand-ink",
  danger: "border-danger/30 bg-danger/5 text-brand-ink",
  success: "border-success/30 bg-success/5 text-brand-ink",
};

/**
 * Pesan status. Peran diberikan lewat role agar diumumkan screen reader.
 */
export default function Alert({ tone = "info", title, children }) {
  const assertive = tone === "danger" || tone === "warning";

  return (
    <div
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={`rounded-md border px-4 py-3 text-sm ${TONE[tone] ?? TONE.info}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? (
        <div className={title ? "mt-1 text-[13px] leading-relaxed" : "leading-relaxed"}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
