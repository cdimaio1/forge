"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { PALETTES, TYPE } from "@/lib/brand/kit";
import { VIBES, VIBE_DETAILS, isVibe, type Vibe } from "@/lib/brand/lexicon";
import { EXAMPLES } from "@/lib/examples";
import { resultsHref } from "@/lib/url";

export default function BriefForm() {
  const router = useRouter();
  const params = useSearchParams();
  const id = useId();

  const initialVibe = params.get("vibe");
  const [idea, setIdea] = useState(params.get("idea") ?? "");
  const [customer, setCustomer] = useState(params.get("customer") ?? "");
  const [vibe, setVibe] = useState<Vibe>(isVibe(initialVibe) ? initialVibe : "modern");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const ideaMissing = submitted && !idea.trim();
  const customerMissing = submitted && !customer.trim();

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitted(true);
    if (!idea.trim() || !customer.trim()) return;
    setPending(true);
    router.push(resultsHref({ idea, customer, vibe }));
  }

  function applyExample(ex: (typeof EXAMPLES)[number]) {
    setIdea(ex.idea);
    setCustomer(ex.customer);
    setVibe(ex.vibe);
    setSubmitted(false);
  }

  return (
    <form
      onSubmit={submit}
      onKeyDown={e => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
      }}
      className="sheet grain relative rounded-[28px] shadow-float"
      noValidate
    >
      <div className="flex items-center justify-between border-b border-rule px-6 py-3 sm:px-9">
        <span className="meta">The brief</span>
        <span className="meta hidden sm:inline">⌘ + Enter to strike</span>
      </div>

      <div className="px-6 pb-8 pt-7 sm:px-9 sm:pt-9">
        <p className="font-display text-[30px] leading-[1.35] tracking-[-0.01em] sm:text-[40px]">
          <label htmlFor={`${id}-idea`}>I&apos;m building</label>{" "}
          <input
            id={`${id}-idea`}
            className="blank"
            value={idea}
            maxLength={160}
            onChange={e => setIdea(e.target.value)}
            placeholder="an app that helps dog owners find sitters"
            aria-invalid={ideaMissing}
            aria-describedby={`${id}-help`}
            autoFocus
          />{" "}
          <label htmlFor={`${id}-customer`}>for</label>{" "}
          <input
            id={`${id}-customer`}
            className="blank"
            value={customer}
            maxLength={100}
            onChange={e => setCustomer(e.target.value)}
            placeholder="busy professionals with dogs"
            aria-invalid={customerMissing}
          />
          <span>, and it should feel…</span>
        </p>
        <p id={`${id}-help`} className={`mt-3 text-sm ${ideaMissing || customerMissing ? "text-stamp-ink" : "text-ink-3"}`}>
          {ideaMissing || customerMissing
            ? "Fill in both blanks: what it is, and who it's for."
            : "Say what it does (“helps… find…”), not what it's called. The more specific, the better the names."}
        </p>

        <fieldset className="mt-7">
          <legend className="sr-only">Feel</legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {VIBES.map(v => {
              const on = v === vibe;
              const p = PALETTES[v][0].colors;
              const face = TYPE[v][0].heading;
              return (
                <label
                  key={v}
                  className={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border p-3.5 transition-all duration-300 ${
                    on ? "border-ink bg-ink text-paper shadow-lift" : "border-rule bg-sheet hover:-translate-y-0.5 hover:border-ink-3"
                  }`}
                >
                  <input type="radio" name="vibe" value={v} checked={on} onChange={() => setVibe(v)} className="sr-only" />
                  <span className="flex items-start justify-between">
                    <span className="text-[30px] leading-none" style={{ fontFamily: `"${face.family}", Georgia, serif`, fontWeight: face.weight }}>
                      Aa
                    </span>
                    <span className="flex -space-x-1.5" aria-hidden="true">
                      {p.slice(0, 3).map(s => (
                        <span key={s.hex} className="h-4 w-4 rounded-full" style={{ background: s.hex, boxShadow: `0 0 0 2px ${on ? "#121110" : "#fbfaf7"}` }} />
                      ))}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium">{VIBE_DETAILS[v].label}</span>
                    <span className={`block text-xs leading-4 ${on ? "text-paper/70" : "text-ink-3"}`}>{VIBE_DETAILS[v].blurb}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-rule px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="meta mr-1.5">Try</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              type="button"
              onClick={() => applyExample(ex)}
              className="rounded-full border border-rule px-3 py-1 text-[13px] text-ink-2 transition-colors hover:border-ink hover:text-ink"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-ink btn-lg shrink-0" disabled={pending}>
          {pending ? "Striking…" : "Strike names"}
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
