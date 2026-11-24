import { parseBrief, isGenericCategory, type Brief } from "./brief";
import { VIBE_DETAILS, type Vibe } from "./lexicon";
import { generateNames, type NameIdea } from "./names";
import { createRng, hashString, shuffle } from "./random";

export type ColorRole = "Primary" | "Accent" | "Background" | "Ink";
export type BrandColor = { role: ColorRole; hex: string; name: string };
export type Palette = { name: string; colors: BrandColor[] };

export type TypePairing = {
  heading: { family: string; weight: number };
  body: { family: string; weight: number };
  note: string;
};

export type Voice = { traits: string[]; soundsLike: string; avoid: string };

export type BrandKit = {
  brief: { idea: string; customer: string; vibe: Vibe };
  names: NameIdea[];
  taglines: string[];
  positioning: string;
  /** One-line description for the homepage preview. Contains "{name}". */
  summary: string;
  voice: Voice;
  palettes: Palette[];
  typography: TypePairing[];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Taglines ──────────────────────────────────────────────────────────────
// {verb} = "find trusted dog sitters", {audience} = "busy urban professionals",
// {offering} = "neighborhood record shop". Templates missing data are skipped.
const TAGLINES: Record<Vibe, string[]> = {
  modern: [
    "{Verb}, without the guesswork.",
    "Everything {audience} need. Nothing they don't.",
    "A clearer way to {verb}.",
    "Made for {audience}.",
    "The {offering}, simplified.",
  ],
  luxury: [
    "For {audience} who notice the details.",
    "Quietly exceptional.",
    "{Verb}, beautifully.",
    "Reserved for the particular.",
    "The {offering}, considered.",
  ],
  playful: [
    "Good news for {audience}.",
    "{Verb}. Happily.",
    "Way more fun than it has to be.",
    "Your new favorite way to {verb}.",
    "The {offering} that smiles back.",
  ],
  retro: [
    "Made with care for {audience}.",
    "Like they used to make it.",
    "Some things never go out of style.",
    "An honest {offering}, done right.",
    "{Verb} the old-fashioned way.",
  ],
  tech: [
    "{Verb}, on autopilot.",
    "{Verb} in seconds, not hours.",
    "Built for {audience} who move fast.",
    "The fastest way to {verb}.",
    "The {offering}, engineered.",
  ],
};

function fill(template: string, brief: Brief): string | null {
  const words = brief.offering.split(" ");
  const plural = /[^s]s$/.test(words[words.length - 1] ?? "");
  const offering = isGenericCategory(brief.offering) || words.length > 4 || plural ? null : brief.offering;
  const map: Record<string, string | null> = {
    "{verb}": brief.verbPhrase,
    "{Verb}": brief.verbPhrase ? cap(brief.verbPhrase) : null,
    "{audience}": brief.audienceShort.split(" ").length <= 4 ? brief.audienceShort : null,
    "{offering}": offering,
  };
  let out = template;
  for (const [token, value] of Object.entries(map)) {
    if (!out.includes(token)) continue;
    if (!value) return null;
    out = out.replaceAll(token, value);
  }
  return out;
}

// ── Positioning & voice ───────────────────────────────────────────────────
const DIFFERENTIATOR: Record<Vibe, string> = {
  modern: "Unlike cluttered alternatives, it keeps every step simple and obvious.",
  luxury: "Unlike mass-market options, every detail is chosen with care.",
  playful: "Unlike the serious, joyless options out there, it's genuinely fun to use.",
  retro: "Unlike trend-chasing newcomers, it's built on craft and trust that last.",
  tech: "Unlike manual workarounds, it automates the busywork end to end.",
};

const VOICES: Record<Vibe, Voice> = {
  modern: {
    traits: ["Clear", "Confident", "Helpful"],
    soundsLike: "“You're all set. Here's what happens next.”",
    avoid: "Buzzwords, exclamation marks, and long sentences.",
  },
  luxury: {
    traits: ["Assured", "Restrained", "Precise"],
    soundsLike: "“Your order has been prepared by hand.”",
    avoid: "Discounts up front, slang, and overselling.",
  },
  playful: {
    traits: ["Warm", "Witty", "Upbeat"],
    soundsLike: "“Done! That was easier than folding a fitted sheet.”",
    avoid: "Jokes at the customer's expense and forced puns.",
  },
  retro: {
    traits: ["Friendly", "Grounded", "Trustworthy"],
    soundsLike: "“Come on in. We saved you a seat.”",
    avoid: "Jargon, hype, and anything that sounds like an algorithm wrote it.",
  },
  tech: {
    traits: ["Direct", "Exact", "Capable"],
    soundsLike: "“Synced. 3 changes applied in 0.4s.”",
    avoid: "Vague promises. Show numbers instead.",
  },
};

function positioning(brief: Brief, name: string, vibe: Vibe) {
  const article = /^[aeiou]/i.test(brief.offering) ? "an" : "a";
  const lastWord = brief.offering.split(" ").pop() ?? "";
  if (!brief.verbPhrase && /[^s]s$/.test(lastWord)) {
    return `For ${brief.audience}, ${name} offers ${brief.offering}. ${DIFFERENTIATOR[vibe]}`;
  }
  const what = brief.verbPhrase
    ? `${isGenericCategory(brief.offering) ? `the ${brief.offering}` : `${article} ${brief.offering}`} that helps them ${brief.verbPhrase}`
    : `${article} ${brief.offering}`;
  return `For ${brief.audience}, ${name} is ${what}. ${DIFFERENTIATOR[vibe]}`;
}

// ── Palettes ──────────────────────────────────────────────────────────────
// Every Primary passes WCAG AA for white text; every Ink passes on its Background.
export const PALETTES: Record<Vibe, Palette[]> = {
  modern: [
    { name: "Harbor", colors: [c("Primary", "#2251CC", "Harbor Blue"), c("Accent", "#0E9384", "Lagoon"), c("Background", "#F7F8FA", "Paper"), c("Ink", "#111827", "Ink")] },
    { name: "Granite", colors: [c("Primary", "#334155", "Granite"), c("Accent", "#E8590C", "Ember"), c("Background", "#FAFAF9", "Chalk"), c("Ink", "#1C1917", "Charcoal")] },
  ],
  luxury: [
    { name: "Bronze", colors: [c("Primary", "#7A5A33", "Bronze"), c("Accent", "#B8A07E", "Oat"), c("Background", "#F7F3EC", "Linen"), c("Ink", "#1A1714", "Espresso")] },
    { name: "Conservatory", colors: [c("Primary", "#2E4A3A", "Fir"), c("Accent", "#B08D57", "Brass"), c("Background", "#F4F1EA", "Bone"), c("Ink", "#151515", "Onyx")] },
  ],
  playful: [
    { name: "Sherbet", colors: [c("Primary", "#C8284F", "Raspberry"), c("Accent", "#FFC93C", "Sunbeam"), c("Background", "#FFF8EE", "Cream"), c("Ink", "#1F1B3A", "Night")] },
    { name: "Gumdrop", colors: [c("Primary", "#5B3BE8", "Grape"), c("Accent", "#2EC4B6", "Mint"), c("Background", "#FFFCF5", "Milk"), c("Ink", "#20233A", "Ink")] },
  ],
  retro: [
    { name: "Rust Belt", colors: [c("Primary", "#A8461F", "Rust"), c("Accent", "#E5A93B", "Mustard"), c("Background", "#F3E9D7", "Parchment"), c("Ink", "#2B2118", "Walnut")] },
    { name: "Motel Pool", colors: [c("Primary", "#1F6F6B", "Pool Teal"), c("Accent", "#E07A3F", "Tangerine"), c("Background", "#F4ECDD", "Sand"), c("Ink", "#22313A", "Slate")] },
  ],
  tech: [
    { name: "Signal", colors: [c("Primary", "#0F62FE", "Signal Blue"), c("Accent", "#24A148", "Go Green"), c("Background", "#F4F6F8", "Cool Gray"), c("Ink", "#0B0F14", "Terminal")] },
    { name: "Ultraviolet", colors: [c("Primary", "#6D28D9", "Ultraviolet"), c("Accent", "#0891B2", "Cyan"), c("Background", "#F6F7FB", "Haze"), c("Ink", "#0E1116", "Void")] },
  ],
};

function c(role: ColorRole, hex: string, name: string): BrandColor {
  return { role, hex, name };
}

// ── Typography (all available on Google Fonts so the preview renders) ─────
const TYPE: Record<Vibe, TypePairing[]> = {
  modern: [
    { heading: { family: "Manrope", weight: 700 }, body: { family: "Inter", weight: 400 }, note: "Geometric headings with a workhorse body face. It reads well at any size." },
    { heading: { family: "Plus Jakarta Sans", weight: 700 }, body: { family: "Source Sans 3", weight: 400 }, note: "Slightly warmer and rounder, but still crisp and professional." },
  ],
  luxury: [
    { heading: { family: "Cormorant Garamond", weight: 600 }, body: { family: "Jost", weight: 400 }, note: "High-contrast serif headlines balanced by a quiet geometric sans." },
    { heading: { family: "Playfair Display", weight: 600 }, body: { family: "Source Serif 4", weight: 400 }, note: "Editorial and classic. It feels like a magazine spread." },
  ],
  playful: [
    { heading: { family: "Fredoka", weight: 600 }, body: { family: "Nunito", weight: 400 }, note: "Soft, rounded letterforms that feel friendly without looking childish." },
    { heading: { family: "Baloo 2", weight: 700 }, body: { family: "DM Sans", weight: 400 }, note: "Chunky, bouncy headlines over a calm, readable body face." },
  ],
  retro: [
    { heading: { family: "Alfa Slab One", weight: 400 }, body: { family: "Work Sans", weight: 400 }, note: "Sign-painter slab serif headlines paired with a clean grotesque." },
    { heading: { family: "Fraunces", weight: 700 }, body: { family: "Karla", weight: 400 }, note: "A soft, old-style serif with 1970s warmth and a modern body face." },
  ],
  tech: [
    { heading: { family: "Space Grotesk", weight: 600 }, body: { family: "IBM Plex Sans", weight: 400 }, note: "Engineered, slightly quirky headings with a precise, neutral body face." },
    { heading: { family: "Sora", weight: 600 }, body: { family: "Inter", weight: 400 }, note: "Wide, confident headings built for product UI and dashboards." },
  ],
};

const SERIF_FAMILIES = new Set(["Cormorant Garamond", "Playfair Display", "Source Serif 4", "Fraunces", "Alfa Slab One"]);

/** CSS font-family value with a sensible fallback while the web font loads. */
export function fontStack(family: string) {
  return `"${family}", ${SERIF_FAMILIES.has(family) ? "Georgia, serif" : "system-ui, sans-serif"}`;
}

export function googleFontsHref(pairings: TypePairing[]) {
  const families = new Map<string, Set<number>>();
  for (const p of pairings) {
    for (const f of [p.heading, p.body]) {
      if (!families.has(f.family)) families.set(f.family, new Set([400]));
      families.get(f.family)!.add(f.weight);
    }
  }
  const params = [...families]
    .map(([family, weights]) => `family=${family.replace(/ /g, "+")}:wght@${[...weights].sort((a, b) => a - b).join(";")}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

// ── Public API ────────────────────────────────────────────────────────────
export function generateKit(input: { idea: string; customer: string; vibe: Vibe; seed?: number }): BrandKit {
  const { idea, customer, vibe, seed = 0 } = input;
  const brief = parseBrief(idea, customer);
  const rng = createRng(hashString(`${idea}|${customer}|${vibe}|${seed}`));

  const names = generateNames(rng, brief, vibe);
  const taglines = shuffle(rng, TAGLINES[vibe])
    .map(t => fill(t, brief))
    .filter((t): t is string => Boolean(t))
    .slice(0, 3);

  return {
    brief: { idea: brief.idea, customer: brief.customer, vibe },
    names,
    taglines,
    positioning: positioning(brief, "{name}", vibe),
    summary: brief.verbPhrase
      ? `{name} helps ${brief.audienceShort} ${brief.verbPhrase}.`
      : `${cap(brief.offering)} for ${brief.audienceShort}.`,
    voice: VOICES[vibe],
    palettes: PALETTES[vibe],
    typography: TYPE[vibe],
  };
}

export function vibeLabel(vibe: Vibe) {
  return VIBE_DETAILS[vibe].label;
}

// ── Contrast helpers (WCAG 2.x) ───────────────────────────────────────────
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
