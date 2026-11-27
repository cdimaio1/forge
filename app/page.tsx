import { Suspense } from "react";
import BriefForm from "@/components/BriefForm";
import { EXAMPLES } from "@/lib/examples";
import Header, { CoinMark } from "@/components/Header";
import { TYPE, PALETTES, fontStack, generateKit, googleFontsHref } from "@/lib/brand/kit";
import { VIBES } from "@/lib/brand/lexicon";

const STEPS = [
  {
    n: "01",
    title: "Write the brief",
    body: "One sentence: what you're building, who it's for, how it should feel. That's all a good namer needs to start.",
  },
  {
    n: "02",
    title: "Stress-test the shortlist",
    body: "Every name gets a reason, a say-it and spell-it check, and a live look at whether the .com, .co and .app are free.",
  },
  {
    n: "03",
    title: "Strike the brand",
    body: "Pick one and see it everywhere at once: wordmark, app icon, business card, homepage and social post.",
  },
];

export default function HomePage() {
  // Real output from the example briefs, so the specimen strip shows what Coinage actually makes.
  const specimens = EXAMPLES.flatMap((ex, i) => {
    const kit = generateKit({ idea: ex.idea, customer: ex.customer, vibe: ex.vibe });
    const palette = PALETTES[ex.vibe][i % 2];
    const type = TYPE[ex.vibe][0];
    return kit.names.slice(0, 2).map(n => ({ name: n.name, strategy: n.strategy, vibe: ex.vibe, palette, type, brief: ex.label }));
  });
  const fonts = googleFontsHref(VIBES.map(v => TYPE[v][0]));

  return (
    <>
      <link rel="stylesheet" href={fonts} precedence="default" />
      <Header>
        <a href="#how" className="btn btn-sm hidden sm:inline-flex">
          How it works
        </a>
      </Header>

      <main>
        <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[880px]">
              <p className="meta animate-rise">A name studio for first-time founders</p>
              <h1 className="mt-5 animate-rise font-display text-[64px] leading-[0.92] tracking-[-0.025em] [animation-delay:80ms] sm:text-[112px]">
                Coin a name.
                <br />
                <em className="text-stamp">Strike</em> a brand.
              </h1>
            </div>
            <p className="max-w-[340px] animate-rise text-[17px] leading-[1.55] text-ink-2 [animation-delay:160ms]">
              Describe what you&apos;re building. Coinage coins a shortlist, tells you which names will hold up, and shows the one you pick as a real brand.
            </p>
          </div>

          <div className="mt-12 animate-rise [animation-delay:240ms]">
            <Suspense fallback={<div className="sheet h-[460px] rounded-[28px]" />}>
              <BriefForm />
            </Suspense>
          </div>
        </section>

        <section aria-label="Names Coinage has struck" className="overflow-hidden border-y border-rule bg-sheet py-6">
          <div className="flex w-max animate-[marquee_60s_linear_infinite] gap-4 hover:[animation-play-state:paused]">
            {[...specimens, ...specimens].map((s, i) => {
              const bg = s.palette.colors.find(c => c.role === "Primary")!.hex;
              const accent = s.palette.colors.find(c => c.role === "Accent")!.hex;
              return (
                <figure key={`${s.name}-${i}`} aria-hidden={i >= specimens.length} className="flex h-[150px] w-[280px] shrink-0 flex-col justify-between rounded-2xl p-5 text-white" style={{ background: bg }}>
                  <figcaption className="flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-white/75">
                    <span>{s.brief}</span>
                    <span>{s.strategy}</span>
                  </figcaption>
                  <span className="flex items-end justify-between gap-3">
                    <span className="truncate text-[34px] leading-none" style={{ fontFamily: fontStack(s.type.heading.family), fontWeight: s.type.heading.weight }}>
                      {s.name}
                    </span>
                    <span className="mb-1 h-3 w-3 shrink-0 rounded-full" style={{ background: accent }} />
                  </span>
                </figure>
              );
            })}
          </div>
        </section>

        <section id="how" className="mx-auto max-w-[1320px] scroll-mt-20 px-5 py-24 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="meta">How it works</p>
              <h2 className="mt-4 font-display text-[48px] leading-[0.95] tracking-[-0.02em] sm:text-[60px]">
                From a sentence
                <br />
                to a <em>brand</em>.
              </h2>
            </div>
            <ol className="grid gap-8 sm:grid-cols-3">
              {STEPS.map(s => (
                <li key={s.n} className="border-t border-ink pt-5">
                  <span className="font-display text-[44px] leading-none text-stamp">{s.n}</span>
                  <h3 className="mt-6 text-[17px] font-medium">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.55] text-ink-2">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
          <span className="flex items-center gap-2.5">
            <CoinMark size={22} />
            <span className="meta">Coinage · Struck in Boston</span>
          </span>
          <span className="meta">Names are a starting point. Check trademarks before you print anything.</span>
        </div>
      </footer>
    </>
  );
}
