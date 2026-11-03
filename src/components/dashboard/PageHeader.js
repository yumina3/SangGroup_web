/**
 * Kepala halaman dashboard: breadcrumb, judul, keterangan, tombol aksi.
 * Satu-satunya h1 per halaman.
 */
export default function PageHeader({ eyebrow = [], title, description, meta, actions }) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        {eyebrow.length > 0 ? (
          <p className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ag-slate-secondary">
            {eyebrow.map((part, index) => (
              <span key={part} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-ag-slate-muted">
                    /
                  </span>
                ) : null}
                <span className={index === eyebrow.length - 1 ? "text-ag-gold-muted" : ""}>
                  {part}
                </span>
              </span>
            ))}
          </p>
        ) : null}

        <h1 className="text-[22px] font-bold leading-tight text-ag-slate md:text-[24px]">
          {title}
        </h1>

        {description ? (
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ag-slate-secondary">
            {description}
          </p>
        ) : null}

        {meta ? <div className="mt-2 text-[12px] text-ag-slate-muted">{meta}</div> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </div>
  );
}
