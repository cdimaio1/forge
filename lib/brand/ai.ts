// Optional AI naming. When ANTHROPIC_API_KEY is set, Claude coins the
// shortlist under the same rules a naming studio would brief a writer with.
// Without a key, Coinage falls back to the curated engine in names.ts.

import type { Vibe } from "./lexicon";
import { VIBE_DETAILS } from "./lexicon";
import type { NameIdea, NameStrategy } from "./names";

const STRATEGIES: NameStrategy[] = ["Metaphor", "Compound", "Blend", "Coined", "Phrase", "Descriptive"];

export type AiResult = { names: NameIdea[]; taglines: string[] };

const SYSTEM = `You are a senior verbal-identity writer at an independent naming studio. You name real companies, so your shortlists are specific, sayable and ownable — never generic.

Rules:
- Draw from the concrete world of the business: objects, places, rituals, slang and history its customers would recognise. Concrete images beat abstract virtues.
- Mix techniques across the list: Metaphor (a real word borrowed from that world), Compound (two plain words fused), Blend (two words overlapping into one), Coined (built on a real Latin/Greek/other root whose meaning you state), Phrase (2–3 words with personality), and at most one Descriptive.
- Banned: suffixes -ify, -ly, -io, -r (Flickr-style dropped vowels), "AI" or ".ai", and the overused startup vocabulary: Nova, Lumen, Nexus, Flow, Hub, Sync, Spark, Pulse, Zen, Genie, Wise, Mind, Hive, Quest, Verse, Labs, Ly, Bright, Smart, Easy.
- No misspellings to dodge a domain (no "Kwik", "Lyft"-style vowel swaps) unless the misspelling itself is the idea.
- Do not reuse well-known existing brand names.
- Each rationale is 1–2 short, plain sentences that name the specific image or root and why it fits THESE customers. No hype words ("innovative", "seamless", "elevate", "empower", "unlock").
- Taglines: 3 options, under 8 words each, in the requested feel, specific to the idea. No colons, no "Your X, reimagined".

Respond with JSON only, no prose, in exactly this shape:
{"names":[{"name":"...","strategy":"Metaphor|Compound|Blend|Coined|Phrase|Descriptive","rationale":"...","distinctiveness":1|2|3}],"taglines":["...","...","..."]}
distinctiveness: 3 = coined/unusual and easy to own, 2 = real word used in a fresh context, 1 = descriptive.`;

export function aiConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function coinWithClaude(input: { idea: string; customer: string; vibe: Vibe; seed: number }): Promise<AiResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const model = process.env.COINAGE_MODEL || "claude-sonnet-5-5";

  const feel = VIBE_DETAILS[input.vibe];
  const user = `Brief
What it is: ${input.idea}
Who it's for: ${input.customer}
Feel: ${feel.label} — ${feel.blurb}
Round: ${input.seed + 1}${input.seed > 0 ? " (the founder wants fresh directions, avoid the obvious first-round picks)" : ""}

Coin 8 names.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.find(c => c.type === "text")?.text ?? "";
  return parse(text);
}

function parse(text: string): AiResult {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("No JSON in model reply");
  const raw = JSON.parse(text.slice(start, end + 1)) as { names?: unknown[]; taglines?: unknown[] };

  const seen = new Set<string>();
  const names: NameIdea[] = [];
  for (const n of raw.names ?? []) {
    if (!n || typeof n !== "object") continue;
    const o = n as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    if (!name || name.length > 28 || seen.has(name.toLowerCase())) continue;
    const strategy = STRATEGIES.includes(o.strategy as NameStrategy) ? (o.strategy as NameStrategy) : "Metaphor";
    const d = Number(o.distinctiveness);
    seen.add(name.toLowerCase());
    names.push({
      name,
      strategy,
      rationale: typeof o.rationale === "string" ? o.rationale.trim() : "",
      distinctiveness: d === 1 || d === 2 || d === 3 ? d : 2,
    });
  }
  const taglines = (raw.taglines ?? []).filter((t): t is string => typeof t === "string" && t.trim().length > 0).map(t => t.trim()).slice(0, 3);
  if (names.length < 3) throw new Error("Too few names in model reply");
  return { names: names.slice(0, 8), taglines };
}
