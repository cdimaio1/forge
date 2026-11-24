import type { Vibe } from "./brand/lexicon";

export type BriefParams = { idea: string; customer: string; vibe: Vibe };

export function resultsHref(brief: BriefParams, extra: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams({ idea: brief.idea.trim(), customer: brief.customer.trim(), vibe: brief.vibe });
  for (const [k, v] of Object.entries(extra)) if (v !== undefined && v !== "" && v !== 0) params.set(k, String(v));
  return `/results?${params}`;
}

export function editHref(brief: BriefParams) {
  const params = new URLSearchParams({ idea: brief.idea, customer: brief.customer, vibe: brief.vibe });
  return `/?${params}`;
}
