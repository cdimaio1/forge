import { Suspense } from "react";
import AppHeader from "@/components/AppHeader";
import BriefForm from "@/components/BriefForm";

const STEPS = [
  { title: "Describe it", body: "A sentence about the idea and who it's for." },
  { title: "Shortlist names", body: "Metaphors, blends, coined words, and phrases, each with a reason it works." },
  { title: "See it as a brand", body: "Taglines, colors, and type, previewed together and ready to export." },
];

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-[1200px] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-[760px]">
          <h1 className="font-display text-[32px] font-semibold leading-10 tracking-[-0.01em] sm:text-[40px] sm:leading-[52px]">
            Find a name worth building on.
          </h1>
          <p className="mt-3 max-w-[560px] text-base leading-6 text-fg-2">
            Describe your idea and Forge gives you a shortlist of distinctive names, plus a first pass at the brand around them.
          </p>

          <div className="mt-8">
            <Suspense fallback={<div className="card h-[420px]" />}>
              <BriefForm />
            </Suspense>
          </div>

          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-brand shadow-2">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-sm leading-5 text-fg-3">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </>
  );
}
