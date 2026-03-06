"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VIBES = ["modern", "luxury", "playful", "retro", "tech"] as const;

export default function StartPage() {
  const router = useRouter();
  const [form, setForm] = useState({ idea: "", customer: "", vibe: "modern" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idea.trim() || !form.customer.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      const encoded = encodeURIComponent(JSON.stringify(data));
      router.push(`/results?data=${encoded}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" className="flex items-center gap-2 mb-10 group w-fit">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-sm font-black text-white">F</span>
          </div>
          <span className="text-zinc-400 group-hover:text-white transition-colors text-sm font-medium">
            Forge
          </span>
        </Link>

        <h2 className="text-3xl font-bold mb-2">Tell us about your idea</h2>
        <p className="text-zinc-400 mb-8">
          Answer three quick questions and we'll build your brand.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              What's your startup idea?
            </label>
            <input
              type="text"
              placeholder="e.g. An app that helps dog owners find trusted dog sitters"
              value={form.idea}
              onChange={e => setForm(f => ({ ...f, idea: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Who is your target customer?
            </label>
            <input
              type="text"
              placeholder="e.g. Busy urban professionals who own dogs"
              value={form.customer}
              onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              What's your brand vibe?
            </label>
            <select
              value={form.vibe}
              onChange={e => setForm(f => ({ ...f, vibe: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
            >
              {VIBES.map(v => (
                <option key={v} value={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/25 mt-2"
          >
            {loading ? "Building your brand…" : "Generate my brand kit →"}
          </button>
        </form>
      </div>
    </main>
  );
}