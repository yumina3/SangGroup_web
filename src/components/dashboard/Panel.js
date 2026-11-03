/**
 * Kartu putih baku dashboard + kepala section opsional.
 * Satu radius, satu border, satu bayangan tipis — mengikuti docs/agen.
 */
export default function Panel({ title, description, action, className = "", bodyClassName = "", children }) {
  return (
    <section
      className={`rounded-dash border border-ag-line bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${className}`}
    >
      {title ? (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-[16px] font-bold text-ag-slate">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-[13px] text-ag-slate-secondary">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={bodyClassName || "p-5"}>{children}</div>
    </section>
  );
}
