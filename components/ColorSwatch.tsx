"use client";

import { useState } from "react";

export default function ColorSwatch({ hex, label }: { hex: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="flex flex-col items-center gap-2 group focus:outline-none"
      title={`Copy ${hex}`}
    >
      <div
        className="w-16 h-16 rounded-2xl shadow-lg ring-2 ring-white/5 group-hover:ring-white/20 transition"
        style={{ backgroundColor: hex }}
      />
      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition">
        {copied ? "Copied!" : label}
      </span>
      <span className="text-xs text-zinc-700 group-hover:text-zinc-400 transition font-mono">
        {hex}
      </span>
    </button>
  );
}