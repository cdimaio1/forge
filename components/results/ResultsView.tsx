"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AppHeader from "@/components/AppHeader";
import BrandPreview from "@/components/results/BrandPreview";
import { contrastRatio, fontStack, generateKit, googleFontsHref, vibeLabel, type BrandKit, type Palette, type TypePairing } from "@/lib/brand/kit";
import { isVibe } from "@/lib/brand/lexicon";
import type { NameIdea } from "@/lib/brand/names";
import { editHref, resultsHref } from "@/lib/url";

// ── small helpers ─────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 1600);
  };
  return { copied, copy };
}

function Section({ id, title, description, action, children }: { id: string; title: string; description?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="card p-5 sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id={`${id}-title`} className="text-base font-semibold leading-6">
            {title}
          </h2>
          {description && <p className="mt-0.5 text-sm leading-5 text-fg-3">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Dots({ value }: { value: 1 | 2 | 3 }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Distinctiveness ${value} of 3`} title="How distinctive and ownable the name is">
      {[1, 2, 3].map(i => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= value ? "bg-brand" : "bg-stroke-strong"}`} />
      ))}
    </span>
  );
}

function toMarkdown(kit: BrandKit, name: string, tagline: string, positioning: string, palette: Palette, type: TypePairing) {
  const lines = [
    `# ${name}`,
    "",
    tagline ? `> ${tagline}` : "",
    "",
    "## Positioning",
    positioning,
    "",
    "## Voice",
    `${kit.voice.traits.join(" · ")}`,
    `- Sounds like: ${kit.voice.soundsLike}`,
    `- Avoid: ${kit.voice.avoid}`,
    "",
    `## Colors (${palette.name})`,
    ...palette.colors.map(c => `- ${c.role}: ${c.name} ${c.hex}`),
    "",
    "## Type",
    `- Headings: ${type.heading.family} ${type.heading.weight}`,
    `- Body: ${type.body.family}`,
    "",
    "## Other names considered",
    ...kit.names.filter(n => n.name !== name).map(n => `- ${n.name} (${n.strategy.toLowerCase()})`),
    "",
    `Brief: ${kit.brief.idea}, for ${kit.brief.customer}. Feel: ${vibeLabel(kit.brief.vibe)}.`,
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

// ── main view ─────────────────────────────────────────────────────────────

export default function ResultsView() {
  const router = useRouter();
  const params = useSearchParams();
  const { copied, copy } = useCopy();

  const idea = params.get("idea")?.trim() ?? "";
  const customer = params.get("customer")?.trim() ?? "";
  const vibeParam = params.get("vibe");
  const vibe = isVibe(vibeParam) ? vibeParam : "modern";
  const seed = Number(params.get("s") ?? 0) || 0;
  const paletteIndex = Number(params.get("p") ?? 0) || 0;
  const typeIndex = Number(params.get("f") ?? 0) || 0;

  const kit = useMemo(() => (idea && customer ? generateKit({ idea, customer, vibe, seed }) : null), [idea, customer, vibe, seed]);

  const [customTagline, setCustomTagline] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !exportRef.current?.contains(e.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [exportOpen]);

  if (!kit) {
    return (
      <>
        <AppHeader />
        <main className="mx-auto max-w-[560px] px-4 py-24 text-center">
          <h1 className="text-xl font-semibold">There&apos;s no brief to work from</h1>
          <p className="mt-2 text-sm text-fg-3">This link is missing the idea or the audience. Start a new brief to generate names.</p>
          <Link href="/" className="btn btn-primary mt-6">
            Start a brief
          </Link>
        </main>
      </>
    );
  }

  const brief = kit.brief;
  const setParams = (next: { s?: number; name?: string; t?: number; p?: number; f?: number }) => {
    const current = {
      s: seed,
      name: params.get("name") ?? undefined,
      t: Number(params.get("t") ?? 0) || 0,
      p: paletteIndex,
      f: typeIndex,
    };
    router.replace(resultsHref(brief, { ...current, ...next }), { scroll: false });
  };

  const selected: NameIdea = kit.names.find(n => n.name === params.get("name")) ?? kit.names[0];
  const taglineIndex = Math.min(Number(params.get("t") ?? 0) || 0, Math.max(kit.taglines.length, 0));
  const usingCustom = taglineIndex === kit.taglines.length;
  const tagline = usingCustom ? customTagline : kit.taglines[taglineIndex] ?? "";
  const palette = kit.palettes[paletteIndex % kit.palettes.length];
  const type = kit.typography[typeIndex % kit.typography.length];
  const positioning = kit.positioning.replace("{name}", selected.name);
  const summary = kit.summary.replace("{name}", selected.name);

  const markdown = toMarkdown(kit, selected.name, tagline, positioning, palette, type);

  function downloadJson() {
    const data = { name: selected.name, tagline, positioning, voice: kit!.voice, palette, typography: type, alternatives: kit!.names.map(n => n.name), brief };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${selected.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-brand.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportOpen(false);
  }

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(kit.typography)} precedence="default" />
      <AppHeader>
        <Link href={editHref(brief)} className="btn btn-subtle">
          Edit brief
        </Link>
        <button type="button" className="btn" onClick={() => copy("link", window.location.href)}>
          {copied === "link" ? "Link copied" : "Copy link"}
        </button>
        <div className="relative" ref={exportRef}>
          <button type="button" className="btn btn-primary" aria-haspopup="menu" aria-expanded={exportOpen} onClick={() => setExportOpen(o => !o)}>
            Export
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {exportOpen && (
            <div role="menu" className="absolute right-0 top-9 w-56 rounded-lg bg-surface p-1 shadow-16">
              <button
                role="menuitem"
                type="button"
                className="block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-canvas"
                onClick={() => {
                  copy("md", markdown);
                  setExportOpen(false);
                }}
              >
                Copy as Markdown
              </button>
              <button role="menuitem" type="button" className="block w-full rounded px-3 py-1.5 text-left text-sm hover:bg-canvas" onClick={downloadJson}>
                Download JSON
              </button>
            </div>
          )}
        </div>
      </AppHeader>

      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-8 sm:px-6">
        <div className="mb-6">
          <p className="eyebrow">Brief · {vibeLabel(brief.vibe)}</p>
          <p className="mt-1 max-w-[720px] text-sm leading-5 text-fg-2">
            {brief.idea}, for <span className="text-fg">{brief.customer.charAt(0).toLowerCase() + brief.customer.slice(1)}</span>.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* ── Left: choices ───────────────────────────────── */}
          <div className="flex flex-col gap-6">
            <Section
              id="names"
              title="Names"
              description="Pick one to see it everywhere. Dots show how distinctive (and easier to own) a name is."
              action={
                <button type="button" className="btn shrink-0" onClick={() => setParams({ s: seed + 1, name: undefined, t: 0 })}>
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M13.5 8a5.5 5.5 0 11-1.6-3.9M13.5 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  More names
                </button>
              }
            >
              <div role="radiogroup" aria-label="Names" className="grid gap-2 sm:grid-cols-2">
                {kit.names.map(n => {
                  const isSelected = n.name === selected.name;
                  return (
                    <button
                      key={n.name}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setParams({ name: n.name })}
                      className={`rounded-md border p-4 text-left transition-colors ${
                        isSelected ? "border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]" : "border-stroke bg-surface hover:border-stroke-strong hover:bg-subtle"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-semibold text-fg-3">{n.strategy}</span>
                        <Dots value={n.distinctiveness} />
                      </div>
                      <p className="mt-1 font-display text-[22px] font-semibold leading-7 tracking-[-0.01em]">{n.name}</p>
                      <p className="mt-1.5 text-[13px] leading-[18px] text-fg-2">{n.rationale}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section id="tagline" title="Tagline" description="Short enough for a sign, a bio, or the top of your homepage.">
              <div role="radiogroup" aria-label="Taglines" className="flex flex-col gap-1">
                {kit.taglines.map((t, i) => (
                  <label key={t} className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${i === taglineIndex ? "bg-brand-tint" : "hover:bg-subtle"}`}>
                    <input type="radio" name="tagline" checked={i === taglineIndex} onChange={() => setParams({ t: i })} className="h-4 w-4 accent-brand" />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
                <label className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors ${usingCustom ? "bg-brand-tint" : "hover:bg-subtle"}`}>
                  <input type="radio" name="tagline" checked={usingCustom} onChange={() => setParams({ t: kit.taglines.length })} className="h-4 w-4 accent-brand" />
                  <input
                    type="text"
                    value={customTagline}
                    maxLength={80}
                    placeholder="Write your own"
                    onFocus={() => !usingCustom && setParams({ t: kit.taglines.length })}
                    onChange={e => setCustomTagline(e.target.value)}
                    className="field"
                    aria-label="Custom tagline"
                  />
                </label>
              </div>
            </Section>

            <div className="grid gap-6 md:grid-cols-2">
              <Section
                id="positioning"
                title="Positioning"
                action={
                  <button type="button" className="btn btn-subtle -mr-2 -mt-1 h-7 px-2 text-xs" onClick={() => copy("pos", positioning)}>
                    {copied === "pos" ? "Copied" : "Copy"}
                  </button>
                }
              >
                <p className="text-sm leading-[22px] text-fg-2">{positioning}</p>
              </Section>

              <Section id="voice" title="Voice">
                <div className="flex flex-wrap gap-1.5">
                  {kit.voice.traits.map(t => (
                    <span key={t} className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-semibold text-fg-2">
                      {t}
                    </span>
                  ))}
                </div>
                <dl className="mt-3 space-y-2 text-sm leading-5">
                  <div>
                    <dt className="eyebrow">Sounds like</dt>
                    <dd className="text-fg-2">{kit.voice.soundsLike}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Avoid</dt>
                    <dd className="text-fg-2">{kit.voice.avoid}</dd>
                  </div>
                </dl>
              </Section>
            </div>
          </div>

          {/* ── Right: live brand ───────────────────────────── */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-[72px]">
            <BrandPreview name={selected.name} tagline={tagline} summary={summary} palette={palette} type={type} />

            <Section
              id="colors"
              title="Colors"
              description={`${palette.name} palette. Click a swatch to copy its hex.`}
              action={
                kit.palettes.length > 1 && (
                  <button type="button" className="btn shrink-0" onClick={() => setParams({ p: (paletteIndex + 1) % kit.palettes.length })}>
                    Swap
                  </button>
                )
              }
            >
              <div className="grid grid-cols-4 gap-2">
                {palette.colors.map(c => (
                  <button key={c.role} type="button" onClick={() => copy(c.hex, c.hex)} className="group text-left" title={`Copy ${c.hex}`}>
                    <span className="block h-14 rounded-md ring-1 ring-inset ring-black/10" style={{ background: c.hex }} />
                    <span className="mt-1.5 block text-xs font-semibold">{c.role}</span>
                    <span className="block font-mono text-[11px] text-fg-3 group-hover:text-fg">{copied === c.hex ? "Copied" : c.hex}</span>
                  </button>
                ))}
              </div>
              <ContrastRow palette={palette} />
            </Section>

            <Section id="type" title="Typography" description="Free on Google Fonts.">
              <div role="radiogroup" aria-label="Type pairings" className="flex flex-col gap-2">
                {kit.typography.map((t, i) => (
                  <button
                    key={t.heading.family}
                    type="button"
                    role="radio"
                    aria-checked={i === typeIndex % kit.typography.length}
                    onClick={() => setParams({ f: i })}
                    className={`rounded-md border p-3 text-left transition-colors ${
                      i === typeIndex % kit.typography.length ? "border-brand bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]" : "border-stroke hover:bg-subtle"
                    }`}
                  >
                    <p className="text-xl leading-7" style={{ fontFamily: fontStack(t.heading.family), fontWeight: t.heading.weight }}>
                      {selected.name}
                    </p>
                    <p className="text-[13px] leading-5 text-fg-2" style={{ fontFamily: fontStack(t.body.family) }}>
                      {t.heading.family} + {t.body.family}
                    </p>
                    <p className="mt-1 text-xs leading-4 text-fg-3">{t.note}</p>
                  </button>
                ))}
              </div>
            </Section>
          </aside>
        </div>
      </main>
    </>
  );
}

function ContrastRow({ palette }: { palette: Palette }) {
  const get = (role: string) => palette.colors.find(c => c.role === role)!.hex;
  const checks = [
    { label: "Ink on background", ratio: contrastRatio(get("Ink"), get("Background")) },
    { label: "White on primary", ratio: contrastRatio("#FFFFFF", get("Primary")) },
  ];
  return (
    <ul className="mt-4 flex flex-col gap-1 border-t border-stroke pt-3 text-xs text-fg-3">
      {checks.map(c => {
        const pass = c.ratio >= 4.5;
        return (
          <li key={c.label} className="flex items-center justify-between">
            <span>{c.label}</span>
            <span className={`font-semibold ${pass ? "text-success" : "text-danger"}`}>
              {c.ratio.toFixed(1)}:1 · {pass ? "Passes AA" : "Fails AA"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
