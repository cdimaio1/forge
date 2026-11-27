"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Header, { CoinMark } from "@/components/Header";
import { Applications, Specimen } from "@/components/results/BrandBoard";
import { contrastRatio, fontStack, generateKit, googleFontsHref, vibeLabel, type BrandKit, type Palette, type TypePairing } from "@/lib/brand/kit";
import { isVibe } from "@/lib/brand/lexicon";
import type { NameIdea } from "@/lib/brand/names";
import { stressTest, type Verdict } from "@/lib/brand/score";
import { editHref, resultsHref } from "@/lib/url";

// ── helpers ───────────────────────────────────────────────────────────────

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

type Source = "loading" | "ai" | "curated";
type AiNames = { names: NameIdea[]; taglines: string[] };
type DomainStatus = { domain: string; tld: string; status: "available" | "taken" | "unknown" };

/** Ask the server for AI-coined names; fall back to the curated engine. Cached per brief for the session. */
function useCoinedNames(brief: { idea: string; customer: string; vibe: string } | null, seed: number) {
  const [state, setState] = useState<{ key: string; source: Source; data: AiNames | null }>({ key: "", source: "loading", data: null });
  const key = brief ? `coinage:${brief.idea}|${brief.customer}|${brief.vibe}|${seed}` : "";

  useEffect(() => {
    if (!brief) return;
    let cancelled = false;
    const done = (source: Source, data: AiNames | null) => {
      if (!cancelled) setState({ key, source, data });
    };

    try {
      if (sessionStorage.getItem("coinage:ai") === "off") {
        done("curated", null);
        return;
      }
      const cached = sessionStorage.getItem(key);
      if (cached) {
        done("ai", JSON.parse(cached) as AiNames);
        return;
      }
    } catch {
      /* storage unavailable: just fetch */
    }

    fetch("/api/names", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...brief, seed }) })
      .then(async res => {
        if (res.status === 501) {
          try {
            sessionStorage.setItem("coinage:ai", "off");
          } catch {}
          return done("curated", null);
        }
        if (!res.ok) return done("curated", null);
        const data = (await res.json()) as AiNames;
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
        } catch {}
        done("ai", data);
      })
      .catch(() => done("curated", null));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state.key === key ? state : { key, source: "loading" as Source, data: null };
}

function useDomains(name: string) {
  const [map, setMap] = useState<Record<string, DomainStatus[] | "loading" | "error">>({});
  useEffect(() => {
    if (!name || map[name]) return;
    setMap(m => ({ ...m, [name]: "loading" }));
    fetch(`/api/domains?name=${encodeURIComponent(name)}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: { results: DomainStatus[] }) => setMap(m => ({ ...m, [name]: d.results })))
      .catch(() => setMap(m => ({ ...m, [name]: "error" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return map[name];
}

function toMarkdown(kit: BrandKit, names: NameIdea[], name: string, tagline: string, positioning: string, palette: Palette, type: TypePairing) {
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
    ...names.filter(n => n.name !== name).map(n => `- ${n.name} (${n.strategy.toLowerCase()})`),
    "",
    `Brief: ${kit.brief.idea}, for ${kit.brief.customer}. Feel: ${vibeLabel(kit.brief.vibe)}.`,
    "",
    "Made with Coinage.",
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

const VERDICT: Record<Verdict, { label: string; cls: string }> = {
  good: { label: "Strong", cls: "bg-good text-white" },
  ok: { label: "Fair", cls: "bg-[#efe3c8] text-warn" },
  risk: { label: "Weak", cls: "bg-stamp-tint text-stamp-ink" },
};

function Pips({ value, inverted }: { value: 1 | 2 | 3; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-1" aria-label={`Ownability ${value} of 3`}>
      {[1, 2, 3].map(i => (
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= value ? "bg-stamp" : inverted ? "bg-paper/25" : "bg-rule-strong"}`} />
      ))}
    </span>
  );
}

function Panel({ id, title, meta, action, children }: { id: string; title: string; meta?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="sheet rounded-[22px] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {meta && <p className="meta mb-1">{meta}</p>}
          <h2 id={`${id}-t`} className="font-display text-[28px] leading-none tracking-[-0.01em]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
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
  const coined = useCoinedNames(kit ? { idea, customer, vibe } : null, seed);

  const [customTagline, setCustomTagline] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const names = coined.data?.names ?? kit?.names ?? [];
  const selected: NameIdea | undefined = names.find(n => n.name === params.get("name")) ?? names[0];
  const domains = useDomains(coined.source === "loading" ? "" : (selected?.name ?? ""));

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
        <Header />
        <main className="mx-auto max-w-[560px] px-5 py-28 text-center">
          <CoinMark size={56} />
          <h1 className="mt-6 font-display text-[40px] leading-none">Nothing to strike yet</h1>
          <p className="mt-3 text-[15px] text-ink-2">This link is missing the idea or who it&apos;s for. Start a brief and Coinage will take it from there.</p>
          <Link href="/" className="btn btn-ink btn-lg mt-8">
            Write a brief
          </Link>
        </main>
      </>
    );
  }

  const brief = kit.brief;
  const loading = coined.source === "loading";
  const taglines = coined.data?.taglines.length ? coined.data.taglines : kit.taglines;

  const setParams = (next: { s?: number; name?: string; t?: number; p?: number; f?: number }) => {
    const current = { s: seed, name: params.get("name") ?? undefined, t: Number(params.get("t") ?? 0) || 0, p: paletteIndex, f: typeIndex };
    router.replace(resultsHref(brief, { ...current, ...next }), { scroll: false });
  };

  const name = selected?.name ?? "";
  const selectedIndex = Math.max(0, names.findIndex(n => n.name === name));
  const taglineIndex = Math.min(Number(params.get("t") ?? 0) || 0, taglines.length);
  const usingCustom = taglineIndex === taglines.length;
  const tagline = usingCustom ? customTagline : (taglines[taglineIndex] ?? "");
  const palette = kit.palettes[paletteIndex % kit.palettes.length];
  const type = kit.typography[typeIndex % kit.typography.length];
  const positioning = kit.positioning.replace("{name}", name);
  const summary = kit.summary.replace("{name}", name);
  const checks = name ? stressTest(name) : [];
  const markdown = toMarkdown(kit, names, name, tagline, positioning, palette, type);

  function downloadJson() {
    const data = { name, tagline, positioning, voice: kit!.voice, palette, typography: type, alternatives: names.map(n => n.name), brief };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-brand.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setExportOpen(false);
  }

  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(kit.typography)} precedence="default" />
      <Header>
        <Link href={editHref(brief)} className="btn btn-sm hidden border-transparent sm:inline-flex">
          Edit brief
        </Link>
        <button type="button" className="btn btn-sm" onClick={() => copy("link", window.location.href)}>
          {copied === "link" ? "Link copied" : "Share"}
        </button>
        <div className="relative" ref={exportRef}>
          <button type="button" className="btn btn-ink btn-sm" aria-haspopup="menu" aria-expanded={exportOpen} onClick={() => setExportOpen(o => !o)} disabled={!name}>
            Export
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {exportOpen && (
            <div role="menu" className="sheet absolute right-0 top-11 w-60 rounded-2xl p-1.5 shadow-float">
              <button role="menuitem" type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-paper" onClick={() => { copy("md", markdown); setExportOpen(false); }}>
                Copy brand sheet (Markdown)
              </button>
              <button role="menuitem" type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-paper" onClick={downloadJson}>
                Download JSON
              </button>
              <button role="menuitem" type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-paper" onClick={() => { setExportOpen(false); window.print(); }}>
                Print or save as PDF
              </button>
            </div>
          )}
        </div>
      </Header>

      <main className="mx-auto max-w-[1320px] px-5 pb-24 pt-8 sm:px-8">
        {/* Brief, read back as the sentence the founder wrote */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-7">
          <p className="max-w-[860px] font-display text-[26px] leading-[1.25] text-ink-3 sm:text-[32px]">
            I&apos;m building <span className="text-ink">{brief.idea.charAt(0).toLowerCase() + brief.idea.slice(1)}</span> for{" "}
            <span className="text-ink">{brief.customer.charAt(0).toLowerCase() + brief.customer.slice(1)}</span>, and it should feel{" "}
            <em className="text-stamp">{vibeLabel(brief.vibe).toLowerCase()}</em>.
          </p>
          <span className="meta flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-ink-3" : coined.source === "ai" ? "bg-stamp" : "bg-ink"}`} />
            {loading ? "Coining…" : coined.source === "ai" ? "Coined with Claude" : "Curated naming engine"}
          </span>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* ── The mint: shortlist ───────────────────────── */}
          <aside className="lg:sticky lg:top-24" aria-labelledby="mint-t">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="meta">The mint · {loading ? "—" : names.length} names</p>
                <h1 id="mint-t" className="mt-1 font-display text-[40px] leading-none tracking-[-0.01em]">
                  Shortlist
                </h1>
              </div>
              <button type="button" className="btn btn-sm" disabled={loading} onClick={() => setParams({ s: seed + 1, name: undefined, t: 0 })}>
                <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M13.5 8a5.5 5.5 0 11-1.6-3.9M13.5 2.5v3h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Strike again
              </button>
            </div>

            {loading ? (
              <div className="sheet grid h-[520px] place-items-center rounded-[22px]" role="status">
                <span className="flex flex-col items-center gap-4">
                  <CoinMark size={64} spin />
                  <span className="meta">Coining names for your brief…</span>
                </span>
              </div>
            ) : (
              <div role="radiogroup" aria-label="Names" className="sheet overflow-hidden rounded-[22px]">
                {names.map((n, i) => {
                  const on = n.name === name;
                  return (
                    <button
                      key={n.name}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setParams({ name: n.name })}
                      style={{ animationDelay: `${i * 50}ms` }}
                      className={`group block w-full animate-rise border-b border-rule px-5 py-4 text-left transition-colors last:border-b-0 ${on ? "bg-ink text-paper" : "hover:bg-paper"}`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className={`font-mono text-[10px] uppercase tracking-[0.08em] ${on ? "text-paper/70" : "text-ink-3"}`}>
                          {String(i + 1).padStart(2, "0")} · {n.strategy}
                        </span>
                        <Pips value={n.distinctiveness} inverted={on} />
                      </span>
                      <span className="mt-1.5 block font-display text-[32px] leading-[1.05] tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-1">
                        {n.name}
                      </span>
                      <span className={`mt-1.5 block text-[13px] leading-[1.45] ${on ? "text-paper/80" : "line-clamp-2 text-ink-3"}`}>{n.rationale}</span>
                    </button>
                  );
                })}
              </div>
            )}
            <p className="meta mt-3 px-1">Red pips = how ownable the name is</p>
          </aside>

          {/* ── The board ─────────────────────────────────── */}
          <div className="flex min-w-0 flex-col gap-5">
            {loading || !name ? (
              <div className="h-[460px] animate-pulse rounded-[28px] bg-rule/50" />
            ) : (
              <>
                <Specimen name={name} tagline={tagline} summary={summary} palette={palette} type={type} index={selectedIndex} />

                {/* Stress test */}
                <Panel id="stress" meta="Before you fall in love" title="Stress test">
                  <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
                    <ul className="grid gap-2.5">
                      {checks.map(c => (
                        <li key={c.id} className="grid grid-cols-[80px_64px_1fr] items-baseline gap-3 border-b border-rule pb-2.5 last:border-b-0">
                          <span className="text-[14px] font-medium">{c.label}</span>
                          <span className={`justify-self-start rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${VERDICT[c.verdict].cls}`}>{VERDICT[c.verdict].label}</span>
                          <span className="text-[13px] leading-[1.45] text-ink-2">{c.note}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-2xl bg-paper p-4">
                      <p className="meta">Domains</p>
                      <ul className="mt-3 grid gap-2">
                        {domains === "loading" || domains === undefined
                          ? ["com", "co", "app"].map(t => (
                              <li key={t} className="flex items-center justify-between text-[14px]">
                                <span className="font-mono">.{t}</span>
                                <span className="h-4 w-20 animate-pulse rounded-full bg-rule" />
                              </li>
                            ))
                          : domains === "error"
                            ? <li className="text-[13px] text-ink-3">Couldn&apos;t reach the registries. Try again in a moment.</li>
                            : domains.map(d => (
                                <li key={d.domain} className="flex items-center justify-between gap-3 text-[14px]">
                                  <span className="truncate font-mono">{d.domain}</span>
                                  <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] ${
                                      d.status === "available" ? "bg-good text-white" : d.status === "taken" ? "bg-ink text-paper" : "bg-rule text-ink-2"
                                    }`}
                                  >
                                    {d.status === "available" ? "Looks free" : d.status === "taken" ? "Taken" : "Unknown"}
                                  </span>
                                </li>
                              ))}
                      </ul>
                      <p className="mt-3 text-[11px] leading-[1.45] text-ink-3">Live registry lookup. Premium names may still cost extra, and always run a trademark search.</p>
                    </div>
                  </div>
                </Panel>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="meta">In the wild</p>
                    <h2 className="mt-1 font-display text-[40px] leading-none tracking-[-0.01em]">{name}, everywhere</h2>
                  </div>
                </div>
                <Applications name={name} tagline={tagline} summary={summary} palette={palette} type={type} />

                <div className="mt-3">
                  <p className="meta">The system</p>
                  <h2 className="mt-1 font-display text-[40px] leading-none tracking-[-0.01em]">Brand sheet</h2>
                </div>

                <Panel id="tagline" meta="Words" title="Tagline">
                  <div role="radiogroup" aria-label="Taglines" className="grid gap-1.5">
                    {taglines.map((t, i) => (
                      <label key={t} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${i === taglineIndex ? "bg-ink text-paper" : "hover:bg-paper"}`}>
                        <input type="radio" name="tagline" checked={i === taglineIndex} onChange={() => setParams({ t: i })} className="sr-only" />
                        <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${i === taglineIndex ? "border-stamp" : "border-rule-strong"}`}>
                          {i === taglineIndex && <span className="h-2 w-2 rounded-full bg-stamp" />}
                        </span>
                        <span className="font-display text-[22px] leading-tight">{t}</span>
                      </label>
                    ))}
                    <label className={`flex items-center gap-3 rounded-xl px-3 py-2 ${usingCustom ? "bg-paper" : ""}`}>
                      <input type="radio" name="tagline" checked={usingCustom} onChange={() => setParams({ t: taglines.length })} className="sr-only" />
                      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${usingCustom ? "border-stamp" : "border-rule-strong"}`}>
                        {usingCustom && <span className="h-2 w-2 rounded-full bg-stamp" />}
                      </span>
                      <input
                        type="text"
                        value={customTagline}
                        maxLength={80}
                        placeholder="Write your own"
                        onFocus={() => !usingCustom && setParams({ t: taglines.length })}
                        onChange={e => setCustomTagline(e.target.value)}
                        className="field"
                        aria-label="Custom tagline"
                      />
                    </label>
                  </div>
                </Panel>

                <div className="grid gap-5 md:grid-cols-2">
                  <Panel
                    id="colors"
                    meta={`Palette · ${palette.name}`}
                    title="Color"
                    action={kit.palettes.length > 1 && <button type="button" className="btn btn-sm" onClick={() => setParams({ p: (paletteIndex + 1) % kit.palettes.length })}>Swap</button>}
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {palette.colors.map(c => (
                        <button key={c.role} type="button" onClick={() => copy(c.hex, c.hex)} className="group text-left" title={`Copy ${c.hex}`}>
                          <span className="block h-20 rounded-xl ring-1 ring-inset ring-black/10 transition-transform group-hover:-translate-y-0.5" style={{ background: c.hex }} />
                          <span className="mt-2 block text-[12px] font-medium">{c.name}</span>
                          <span className="block font-mono text-[10px] uppercase text-ink-3">{copied === c.hex ? "Copied" : c.hex}</span>
                        </button>
                      ))}
                    </div>
                    <ContrastRow palette={palette} />
                  </Panel>

                  <Panel id="type" meta="Free on Google Fonts" title="Type">
                    <div role="radiogroup" aria-label="Type pairings" className="grid gap-2">
                      {kit.typography.map((t, i) => {
                        const on = i === typeIndex % kit.typography.length;
                        return (
                          <button
                            key={t.heading.family}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setParams({ f: i })}
                            className={`rounded-xl border p-3.5 text-left transition-colors ${on ? "border-ink bg-paper" : "border-rule hover:border-ink-3"}`}
                          >
                            <span className="block text-[28px] leading-tight" style={{ fontFamily: fontStack(t.heading.family), fontWeight: t.heading.weight }}>
                              {name}
                            </span>
                            <span className="mt-1 block text-[13px] text-ink-2" style={{ fontFamily: fontStack(t.body.family) }}>
                              {t.heading.family} with {t.body.family}
                            </span>
                            <span className="mt-1 block text-[12px] leading-[1.4] text-ink-3">{t.note}</span>
                          </button>
                        );
                      })}
                    </div>
                  </Panel>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Panel
                    id="positioning"
                    meta="Strategy"
                    title="Positioning"
                    action={<button type="button" className="btn btn-sm" onClick={() => copy("pos", positioning)}>{copied === "pos" ? "Copied" : "Copy"}</button>}
                  >
                    <p className="text-[15px] leading-[1.6] text-ink-2">{positioning}</p>
                  </Panel>
                  <Panel id="voice" meta="How it talks" title="Voice">
                    <div className="flex flex-wrap gap-1.5">
                      {kit.voice.traits.map(t => (
                        <span key={t} className="rounded-full border border-ink px-3 py-0.5 text-[13px]">
                          {t}
                        </span>
                      ))}
                    </div>
                    <dl className="mt-4 grid gap-3 text-[14px] leading-[1.5]">
                      <div>
                        <dt className="meta">Sounds like</dt>
                        <dd className="mt-0.5 font-display text-[20px] leading-snug">{kit.voice.soundsLike}</dd>
                      </div>
                      <div>
                        <dt className="meta">Avoid</dt>
                        <dd className="mt-0.5 text-ink-2">{kit.voice.avoid}</dd>
                      </div>
                    </dl>
                  </Panel>
                </div>
              </>
            )}
          </div>
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
    <ul className="mt-5 grid gap-1.5 border-t border-rule pt-4">
      {checks.map(c => {
        const pass = c.ratio >= 4.5;
        return (
          <li key={c.label} className="flex items-center justify-between text-[13px]">
            <span className="text-ink-2">{c.label}</span>
            <span className={`font-mono text-[11px] uppercase tracking-[0.04em] ${pass ? "text-good" : "text-stamp-ink"}`}>
              {c.ratio.toFixed(1)}:1 · {pass ? "AA pass" : "AA fail"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
