"use client";

import { useState } from "react";

import { VISIT } from "@/lib/site/data";

/** Ikon garis untuk tiga item kontak. */
function ContactIcon({ name }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    className: "mt-0.5 shrink-0 text-[#c5a869]",
  };

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7.5V12l3 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg {...common}>
        <path
          d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16.5 13l4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Section 8: kunjungan VIP.
 *
 * Validasi di klien hanya untuk pesan cepat; validasi otoritatif tetap harus
 * dijalankan di Server Action saat backend tersedia (PRD §7).
 */
export default function VisitSection() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    cluster: VISIT.form.clusters[0],
    date: "",
    time: VISIT.form.times[0].id,
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function validate() {
    const next = {};

    if (values.name.trim().length < 3) {
      next.name = "Nama lengkap wajib diisi (minimal 3 karakter).";
    }

    const digits = values.phone.replace(/\D/g, "");
    const phoneOk =
      (digits.startsWith("08") && digits.length >= 10 && digits.length <= 14) ||
      (digits.startsWith("628") && digits.length >= 11 && digits.length <= 15);
    if (!phoneOk) {
      next.phone = "Nomor WhatsApp tidak valid.";
    }

    if (!values.date) {
      next.date = "Tanggal kunjungan wajib dipilih.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(`${values.date}T00:00:00`) < today) {
        next.date = "Tanggal kunjungan tidak valid.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event) {
    event.preventDefault();
    if (validate()) setSubmitted(true);
  }

  const inputClass =
    "h-11 w-full rounded-lg border bg-white px-3 font-sans text-[12.5px] text-gray-800 placeholder:text-gray-400 focus:border-[#c5a869] focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/15";
  const labelClass =
    "font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500";

  return (
    <section id="contact" className="bg-[#0d3b2e] px-6 py-20 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Kartu kiri */}
        <div className="rounded-xl bg-[#08231b] p-7 sm:p-9">
          <span className="block font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#c5a869]">
            {VISIT.eyebrow}
          </span>
          <h2 className="mt-3 font-sans text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[32px]">
            {VISIT.heading}
          </h2>
          <p className="mt-4 font-sans text-xs leading-relaxed text-white/65">
            {VISIT.body}
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {VISIT.contacts.map((contact) => (
              <li key={contact.id} className="flex items-start gap-3">
                <ContactIcon name={contact.icon} />
                <div>
                  <p className="font-sans text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#c5a869]">
                    {contact.label}
                  </p>
                  {contact.lines.map((line) => (
                    <p
                      key={line}
                      className="mt-1 font-sans text-[11.5px] leading-relaxed text-white/70"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <a
            href="/kontak"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-md bg-[#c5a869] font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#0d3b2e] no-underline transition-colors hover:bg-[#d4af37]"
          >
            Chat WhatsApp Tim Pemasaran
          </a>
        </div>

        {/* Kartu form */}
        <div className="rounded-xl border border-[#c5a869]/45 bg-white p-7 sm:p-9">
          <h3 className="font-sans text-[18px] font-bold text-[#0d3b2e]">
            {VISIT.form.heading}
          </h3>
          <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-gray-500">
            {VISIT.form.body}
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vip-name" className={labelClass}>
                  {VISIT.form.nameLabel} *
                </label>
                <input
                  id="vip-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={VISIT.form.namePlaceholder}
                  value={values.name}
                  onChange={(event) => update("name", event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "vip-name-error" : undefined}
                  className={`${inputClass} ${
                    errors.name ? "border-[#ba1a1a]" : "border-gray-200"
                  }`}
                />
                {errors.name ? (
                  <p
                    id="vip-name-error"
                    className="font-sans text-[10.5px] font-medium text-[#ba1a1a]"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vip-phone" className={labelClass}>
                  {VISIT.form.phoneLabel} *
                </label>
                <input
                  id="vip-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={VISIT.form.phonePlaceholder}
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "vip-phone-error" : undefined}
                  className={`${inputClass} ${
                    errors.phone ? "border-[#ba1a1a]" : "border-gray-200"
                  }`}
                />
                {errors.phone ? (
                  <p
                    id="vip-phone-error"
                    className="font-sans text-[10.5px] font-medium text-[#ba1a1a]"
                  >
                    {errors.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="vip-cluster" className={labelClass}>
                  {VISIT.form.clusterLabel} *
                </label>
                <select
                  id="vip-cluster"
                  name="cluster"
                  value={values.cluster}
                  onChange={(event) => update("cluster", event.target.value)}
                  className={`${inputClass} border-gray-200`}
                >
                  {VISIT.form.clusters.map((cluster) => (
                    <option key={cluster} value={cluster}>
                      {cluster}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vip-date" className={labelClass}>
                  {VISIT.form.dateLabel} *
                </label>
                <input
                  id="vip-date"
                  name="date"
                  type="date"
                  value={values.date}
                  onChange={(event) => update("date", event.target.value)}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "vip-date-error" : undefined}
                  className={`${inputClass} ${
                    errors.date ? "border-[#ba1a1a]" : "border-gray-200"
                  }`}
                />
                {errors.date ? (
                  <p
                    id="vip-date-error"
                    className="font-sans text-[10.5px] font-medium text-[#ba1a1a]"
                  >
                    {errors.date}
                  </p>
                ) : null}
              </div>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className={labelClass}>{VISIT.form.timeLabel} *</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {VISIT.form.times.map((time) => {
                  const selected = values.time === time.id;
                  return (
                    <label
                      key={time.id}
                      className={`flex h-10 cursor-pointer items-center justify-center rounded-md border font-sans text-[10.5px] font-semibold transition-colors ${
                        selected
                          ? "border-[#0d3b2e] bg-[#0d3b2e] text-white"
                          : "border-gray-200 text-gray-500 hover:border-[#0d3b2e]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={time.id}
                        checked={selected}
                        onChange={() => update("time", time.id)}
                        className="sr-only"
                      />
                      {time.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="vip-note" className={labelClass}>
                {VISIT.form.noteLabel}
              </label>
              <textarea
                id="vip-note"
                name="note"
                rows={3}
                maxLength={500}
                placeholder={VISIT.form.notePlaceholder}
                value={values.note}
                onChange={(event) => update("note", event.target.value)}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-sans text-[12.5px] text-gray-800 placeholder:text-gray-400 focus:border-[#c5a869] focus:outline-none focus:ring-[3px] focus:ring-[#c5a869]/15"
              />
            </div>

            <button
              type="submit"
              className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#0d3b2e] font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#134e3f]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="m4 12 5 5 11-11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {VISIT.form.submit}
            </button>

            {submitted ? (
              <p role="status" className="font-sans text-[11px] font-medium text-[#0d3b2e]">
                Terima kasih. Permintaan kunjungan Anda tercatat dan tim kami akan
                menghubungi Anda lewat WhatsApp.
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
              <p className="max-w-[300px] font-sans text-[9.5px] leading-relaxed text-gray-400">
                {VISIT.form.privacy}
              </p>
              <a
                href="/kontak"
                className="font-sans text-[9.5px] font-semibold text-[#0d3b2e] underline decoration-[#c5a869] decoration-1 underline-offset-2 hover:text-[#c5a869]"
              >
                {VISIT.form.consultant}
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
