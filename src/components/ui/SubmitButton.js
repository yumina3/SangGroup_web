"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, pendingLabel }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending || undefined}
      className={[
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md",
        "bg-brand-gold text-sm font-semibold tracking-wide text-brand-deep",
        "transition-all duration-150",
        "hover:bg-brand-gold-soft",
        "disabled:cursor-not-allowed disabled:opacity-70",
      ].join(" ")}
    >
      {pending ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-brand-deep/30 border-t-brand-deep"
          />
          {pendingLabel ?? "Memproses…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
