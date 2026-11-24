"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { PALETTES } from "@/lib/brand/kit";
import { VIBES, VIBE_DETAILS, isVibe, type Vibe } from "@/lib/brand/lexicon";
import { resultsHref } from "@/lib/url";

const EXAMPLES: { label: string; idea: string; customer: string; vibe: Vibe }[] = [
  {
    label: "Record shop",
    idea: "A neighborhood record shop for vinyl collectors",
    customer: "Vinyl collectors and crate diggers",
    vibe: "retro",
  },
  {
    label: "Dog-sitting app",
    idea: "An app that helps dog owners find trusted dog sitters",
    customer: "Busy professionals who own dogs",
    vibe: "playful",
  },
  {
    label: "Student budgeting",
    idea: "A budgeting tool that helps college students track spending",
    customer: "College students living on their own",
    vibe: "modern",
  },
  {
    label: "Team decisions",
    idea: "A platform that helps small teams make decisions without meetings",
    customer: "Remote product teams",
    vibe: "tech",
  },
];

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

  const ideaError = submitted && !idea.trim() ? "Describe your idea in a sentence." : "";
  const customerError = submitted && !customer.trim() ? "Say who it's for." : "";

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
      className="card flex flex-col gap-6 p-6 sm:p-8"
      noValidate
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`${id}-idea`} className="label">
            What&apos;s the idea?
          </label>
          <span className="text-xs text-fg-4">{idea.length}/160</span>
        </div>
        <textarea
          id={`${id}-idea`}
          rows={2}
          maxLength={160}
          value={idea}
          onChange={e => setIdea(e.target.value)}
          placeholder="An app that helps dog owners find trusted sitters"
          aria-invalid={Boolean(ideaError)}
          aria-describedby={`${id}-idea-hint`}
          className="field resize-none"
          autoFocus
        />
        <p id={`${id}-idea-hint`} className={`mt-1 text-xs ${ideaError ? "text-danger" : "text-fg-3"}`}>
          {ideaError || "One sentence works best. Include what it does, e.g. “helps… find…”"}
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-customer`} className="label">
          Who is it for?
        </label>
        <input
          id={`${id}-customer`}
          type="text"
          maxLength={100}
          value={customer}
          onChange={e => setCustomer(e.target.value)}
          placeholder="Busy professionals who own dogs"
          aria-invalid={Boolean(customerError)}
          className="field"
        />
        {customerError && <p className="mt-1 text-xs text-danger">{customerError}</p>}
      </div>

      <fieldset>
        <legend className="label">Pick a feel</legend>
        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {VIBES.map(v => {
            const selected = v === vibe;
            const swatches = PALETTES[v][0].colors;
            return (
              <label
                key={v}
                className={`relative flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors sm:flex-col sm:items-start sm:gap-2 ${
                  selected
                    ? "border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]"
                    : "border-stroke-strong bg-surface hover:border-[#c7c7c7] hover:bg-subtle"
                }`}
              >
                <input
                  type="radio"
                  name="vibe"
                  value={v}
                  checked={selected}
                  onChange={() => setVibe(v)}
                  className="sr-only"
                />
                <span className="flex h-4 overflow-hidden rounded-sm ring-1 ring-black/10" aria-hidden="true">
                  {swatches.map(s => (
                    <span key={s.hex} className="w-3.5" style={{ background: s.hex }} />
                  ))}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{VIBE_DETAILS[v].label}</span>
                  <span className="block text-xs leading-4 text-fg-3">{VIBE_DETAILS[v].blurb}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-4 border-t border-stroke pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-fg-3">
          <span className="mr-1">Try an example:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              type="button"
              onClick={() => applyExample(ex)}
              className="rounded-full border border-stroke bg-subtle px-2.5 py-0.5 text-fg-2 transition-colors hover:border-stroke-strong hover:bg-surface"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-lg shrink-0" disabled={pending}>
          {pending ? "Generating…" : "Generate names"}
        </button>
      </div>
    </form>
  );
}
