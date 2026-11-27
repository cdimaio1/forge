// Naming engine. Each strategy is a technique real naming agencies use;
// every candidate carries the reason it works so the user can judge it.

import type { Brief } from "./brief";
import {
  COMPOUND_TAILS,
  PHRASE_PATTERNS,
  ROOT_ENDINGS,
  VIBE_IMAGES,
  type Root,
  type Vibe,
} from "./lexicon";
import { pick, shuffle, type Rng } from "./random";

export type NameStrategy = "Metaphor" | "Compound" | "Blend" | "Coined" | "Phrase" | "Descriptive";

export type NameIdea = {
  name: string;
  strategy: NameStrategy;
  rationale: string;
  /** 1–3: how ownable/unusual the name is. Descriptive names score low. */
  distinctiveness: 1 | 2 | 3;
};

// The overused startup suffixes ("Petify", "Bookly", "Tasker.io", "Flickr").
const BANNED_ENDINGS = /(ify|ly|io|ster|[^aeiou]r)$/i;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

function pronounceable(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length < 3) return false;
  if (/[^aeiouy]{4,}/.test(w)) return false; // consonant pile-ups
  if (/[aeiou]{3,}/.test(w)) return false;
  if (/(.)\1\1/.test(w)) return false;
  return true;
}

function joinWords(a: string, b: string) {
  const left = a.toLowerCase();
  const right = b.toLowerCase();
  // Merge a doubled letter at the seam: "Leash" + "house" stays, "Kiln"+"nest" -> "Kilnest"
  if (left.endsWith(right[0])) return cap(left + right.slice(1));
  return cap(left + right);
}

function domainImages(brief: Brief): { word: string; theme: string }[] {
  return brief.domains.flatMap(d => d.images.map(word => ({ word, theme: d.theme })));
}

function domainRoots(brief: Brief): Root[] {
  return brief.domains.flatMap(d => d.roots);
}

function metaphor(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const pool = domainImages(brief);
  const fallback = VIBE_IMAGES[vibe].map(word => ({ word, theme: `a ${vibe} sensibility` }));
  return shuffle(rng, pool.length ? pool : fallback)
    .slice(0, 4)
    .map(({ word, theme }) => ({
      name: word,
      strategy: "Metaphor",
      rationale: `A real word borrowed from ${theme}. It hints at what you do without spelling it out, so it still fits if the business grows.`,
      distinctiveness: 2,
    }));
}

function compound(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const domain = domainImages(brief).map(x => x.word);
  const vibeWords = shuffle(rng, VIBE_IMAGES[vibe]).slice(0, domain.length ? 2 : 12);
  const heads = [...domain, ...vibeWords].filter(w => w.length <= 6);
  const out: NameIdea[] = [];
  for (const head of shuffle(rng, heads).slice(0, 6)) {
    const tail = pick(rng, COMPOUND_TAILS[vibe]);
    const name = joinWords(head, tail);
    if (!pronounceable(name) || name.length > 11) continue;
    out.push({
      name,
      strategy: "Compound",
      rationale: `“${head}” + “${tail}”. Two plain words fused into one. It's easy to say and spell, and it sounds like a place people go back to.`,
      distinctiveness: 2,
    });
  }
  return out;
}

function blend(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const words = [...domainImages(brief).map(x => x.word), ...VIBE_IMAGES[vibe], ...brief.ideaKeywords.map(cap)]
    .filter(w => w.length >= 4 && w.length <= 9 && /^[a-z]+$/i.test(w));
  const out: NameIdea[] = [];
  const seen = new Set<string>();
  const pool = shuffle(rng, words);
  for (const a of pool) {
    for (const b of pool) {
      if (a === b) continue;
      const al = a.toLowerCase();
      const bl = b.toLowerCase();
      // Find the longest overlap where the end of A is the start of B.
      for (let k = Math.min(4, al.length - 2, bl.length - 2); k >= 3; k--) {
        if (al.endsWith(bl.slice(0, k))) {
          const name = cap(al + bl.slice(k));
          if (name.length <= 10 && pronounceable(name) && !seen.has(name) && name.toLowerCase() !== al && name.toLowerCase() !== bl) {
            seen.add(name);
            out.push({
              name,
              strategy: "Blend",
              rationale: `${a} and ${b} overlap on “${bl.slice(0, k)}”, so they merge into one word. A coined word like this is easier to trademark and get a domain for.`,
              distinctiveness: 3,
            });
          }
          break;
        }
      }
      if (out.length >= 2) return out;
    }
  }
  return out;
}

function coined(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const roots = domainRoots(brief);
  const pool: Root[] = roots.length
    ? roots
    : [
        { root: "nova", meaning: "new" },
        { root: "lumen", meaning: "light" },
        { root: "verus", meaning: "true" },
        { root: "clara", meaning: "clear" },
      ];
  const out: NameIdea[] = [];
  for (const { root, meaning } of shuffle(rng, pool).slice(0, 3)) {
    // Drop the root's Latin/Greek inflection, then try each vibe ending and keep
    // the ones that flow (no vowel collisions, no consonant pile-ups).
    const stem = root.replace(/(us|is|um|os)$/i, "").replace(/[aeiouy]+$/i, "");
    const options = shuffle(rng, ROOT_ENDINGS[vibe])
      .map(ending => cap(stem + ending))
      .filter(n => pronounceable(n) && !/[aeiou]{2}/i.test(n) && n.length >= 5 && n.length <= 9 && n.toLowerCase() !== root);
    if (!options.length) continue;
    out.push({
      name: options[0],
      strategy: "Coined",
      rationale: `Built on the root “${root}”, which means ${meaning}. It sounds established and carries real meaning, and nobody else is likely to own it.`,
      distinctiveness: 3,
    });
  }
  return out;
}

function phrase(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const domain = shuffle(rng, domainImages(brief).map(x => x.word));
  const vibeWords = shuffle(rng, VIBE_IMAGES[vibe]);
  const firsts = domain.length ? domain : vibeWords;
  const seconds = [...vibeWords, ...domain];
  const out: NameIdea[] = [];
  const patterns = shuffle(rng, PHRASE_PATTERNS[vibe]);
  for (let i = 0; i < 2; i++) {
    const pattern = patterns[i % patterns.length];
    const a = firsts[i];
    const b = seconds.find(w => w !== a && !pattern.includes(w));
    if (!a || !b || pattern.includes(a)) continue;
    const name = pattern.replace("{A}", a).replace("{B}", b);
    out.push({
      name,
      strategy: "Phrase",
      rationale: `A short phrase with some personality. It reads like a sign above the door, which suits a ${vibe} brand for ${brief.audienceShort}.`,
      distinctiveness: 2,
    });
  }
  return out;
}

function descriptive(rng: Rng, brief: Brief, vibe: Vibe): NameIdea[] {
  const triggers = new Set(brief.domains.flatMap(d => d.triggers));
  const all = brief.ideaKeywords.filter(k => k.length >= 3 && k.length <= 7);
  const kw = all.filter(k => triggers.has(k)).length ? all.filter(k => triggers.has(k)) : all;
  if (!kw.length) return [];
  const word = pick(rng, kw);
  const tail = pick(rng, COMPOUND_TAILS[vibe]);
  const name = joinWords(word, tail);
  if (!pronounceable(name)) return [];
  return [
    {
      name,
      strategy: "Descriptive",
      rationale: `Says what you do (“${word}”) right in the name. Customers get it on day one, but it's harder to trademark and stand out with.`,
      distinctiveness: 1,
    },
  ];
}

export function generateNames(rng: Rng, brief: Brief, vibe: Vibe, count = 8): NameIdea[] {
  const buckets = [
    metaphor(rng, brief, vibe),
    blend(rng, brief, vibe),
    compound(rng, brief, vibe),
    coined(rng, brief, vibe),
    phrase(rng, brief, vibe),
    descriptive(rng, brief, vibe),
  ];

  const literal = new Set(brief.keywords);
  const seen = new Set<string>();
  const accept = (n: NameIdea) => {
    const key = n.name.toLowerCase();
    if (seen.has(key)) return false;
    // Don't offer "Nook" and "Nook Atelier" in the same shortlist.
    if (n.strategy === "Phrase" && key.split(/\W+/).some(w => seen.has(w))) return false;
    if (n.strategy !== "Descriptive" && literal.has(key)) return false;
    if (n.strategy !== "Phrase" && BANNED_ENDINGS.test(n.name) && n.strategy !== "Metaphor") return false;
    seen.add(key);
    return true;
  };

  // Round-robin across strategies so the shortlist is varied, not six of one kind.
  const result: NameIdea[] = [];
  let progress = true;
  while (result.length < count && progress) {
    progress = false;
    for (const bucket of buckets) {
      while (bucket.length) {
        const next = bucket.shift()!;
        if (accept(next)) {
          result.push(next);
          progress = true;
          break;
        }
      }
      if (result.length >= count) break;
    }
  }
  return result;
}
