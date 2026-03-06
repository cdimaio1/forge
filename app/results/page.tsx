"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import BrandKit from "@/components/BrandKit";

function ResultsContent() {
  const params = useSearchParams();
  const raw = params.get("data");

  if (!raw) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">No brand data found.</p>
        <Link href="/start" className="text-orange-400 underline mt-4 inline-block">
          Start over
        </Link>
      </div>
    );
  }

  const brandKit = JSON.parse(decodeURIComponent(raw));

  return <BrandKit kit={brandKit} />;
}

export default function ResultsPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-sm font-black text-white">F</span>
          </div>
          <span className="text-zinc-400 group-hover:text-white transition-colors text-sm font-medium">
            Forge
          </span>
        </Link>

        <Suspense fallback={<p className="text-zinc-400">Loading your brand kit…</p>}>
          <ResultsContent />
        </Suspense>

        <div className="mt-12 flex gap-4">
          <Link
            href="/start"
            className="text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-5 py-2.5 rounded-xl transition"
          >
            ← Start over
          </Link>
        </div>
      </div>
    </main>
  );
}