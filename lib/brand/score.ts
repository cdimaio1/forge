// The stress test. Plain, explainable heuristics a founder can check by ear —
// no fake precision, every verdict comes with the reason.

export type Verdict = "good" | "ok" | "risk";
export type Check = { id: string; label: string; verdict: Verdict; note: string };

const vowelGroups = (w: string) => (w.toLowerCase().replace(/e\b/g, "").match(/[aeiouy]+/g) ?? []).length || 1;

export function syllables(name: string) {
  return name
    .split(/[\s&-]+/)
    .filter(Boolean)
    .reduce((n, w) => n + vowelGroups(w), 0);
}

// Letter patterns that people commonly mishear or misspell.
const AMBIGUOUS: [RegExp, string][] = [
  [/ph/i, "“ph” could be heard as “f”"],
  [/(.)\1/i, "double letters are easy to drop"],
  [/[^aeiou]y[^aeiou]/i, "a “y” standing in for a vowel"],
  [/q(?!u)/i, "a “q” without a “u”"],
  [/(ck|kk|cc)/i, "“c”, “k” and “ck” sound alike"],
  [/x(?=[aeiou])/i, "an “x” before a vowel can be read two ways"],
  [/(ei|ie)/i, "“ei” vs “ie” trips people up"],
  [/(ae|oe)/i, "“ae” and “oe” look Latin but read unclearly"],
];

export function stressTest(name: string): Check[] {
  const letters = name.replace(/[^a-z]/gi, "");
  const words = name.split(/\s+/).filter(Boolean);
  const syl = syllables(name);
  const ambiguity = AMBIGUOUS.filter(([re]) => re.test(letters)).map(([, why]) => why);
  const first = letters.charAt(0).toUpperCase();

  const checks: Check[] = [];

  checks.push(
    letters.length <= 8
      ? { id: "length", label: "Length", verdict: "good", note: `${letters.length} letters. Fits on a sign, a button and a handle.` }
      : letters.length <= 12
        ? { id: "length", label: "Length", verdict: "ok", note: `${letters.length} letters. Fine, but expect people to shorten it.` }
        : { id: "length", label: "Length", verdict: "risk", note: `${letters.length} letters. Long for a logo or social handle.` },
  );

  checks.push(
    syl <= 2
      ? { id: "say", label: "Say it", verdict: "good", note: `${syl} syllable${syl === 1 ? "" : "s"}. Quick to say and easy to remember.` }
      : syl === 3
        ? { id: "say", label: "Say it", verdict: "ok", note: "3 syllables. Still sayable, a little less punchy." }
        : { id: "say", label: "Say it", verdict: "risk", note: `${syl} syllables. People will likely abbreviate it.` },
  );

  checks.push(
    ambiguity.length === 0
      ? { id: "spell", label: "Spell it", verdict: "good", note: "Heard once, most people could type it correctly." }
      : ambiguity.length === 1
        ? { id: "spell", label: "Spell it", verdict: "ok", note: `Mostly clear: ${ambiguity[0]}.` }
        : { id: "spell", label: "Spell it", verdict: "risk", note: `Easy to misspell: ${ambiguity.slice(0, 2).join("; ")}.` },
  );

  checks.push(
    words.length === 1 && letters.length <= 9
      ? { id: "icon", label: "Icon", verdict: "good", note: `One word with a strong “${first}”. Works as a monogram or app icon.` }
      : words.length <= 2
        ? { id: "icon", label: "Icon", verdict: "ok", note: `Two words. The icon will lean on the initial${words.length === 2 ? "s" : ""}.` }
        : { id: "icon", label: "Icon", verdict: "risk", note: "Three words or more. Hard to compress into a mark." },
  );

  return checks;
}

/** Slug used for domain and handle checks: letters and digits only. */
export function domainSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}
