// Turns the free-text brief into structured pieces the generator can use.

import { DOMAINS, type Domain } from "./lexicon";

const STOP = new Set(
  "a an the and or but for to of in on at by with from into that which who whom where when what this these those it its is are be been being can could will would should may might must do does did have has had i we you they he she them our your their my me us app apps platform website site service services tool tools marketplace business company store shop startup subscription product products online local new people person someone users user help helps helping lets allows makes make easy easier better best more most really very just like way ways thing things get gets find own busy love loves living small big great good based near".split(
    " ",
  ),
);

// Verbs we can lift out of "An app that helps X <verb> Y" to write taglines.
const VERBS = new Set(
  "find book track plan learn save manage discover share connect buy sell make build organize order compare meet hire cook grow rent start keep stay earn reach sort create write fix clean trade swap split pay run practice study schedule design launch collect choose shop get join explore budget split read watch listen play train walk sit care cover protect monitor automate ship deploy review edit record publish invest borrow lend donate recycle reduce prepare deliver host celebrate coordinate decide brainstorm vote align plan".split(
    " ",
  ),
);

const HELPERS = new Set(["helps", "help", "lets", "let", "allows", "allow", "enables", "enable", "makes", "make", "connects", "connect", "gives", "give"]);

const GENERIC_CATEGORIES = new Set(["app", "platform", "website", "site", "service", "tool", "marketplace", "business", "company", "store", "shop", "startup", "subscription", "product", "community", "network"]);

export type Brief = {
  idea: string;
  customer: string;
  /** What it is, e.g. "neighborhood record shop" or "app". */
  offering: string;
  /** "find trusted dog sitters" — null if we can't confidently extract one. */
  verbPhrase: string | null;
  /** Lowercased audience, e.g. "busy urban professionals who own dogs". */
  audience: string;
  /** Audience trimmed to its core noun phrase, e.g. "busy urban professionals". */
  audienceShort: string;
  keywords: string[];
  /** Keywords from the idea only (not the audience), singularized. */
  ideaKeywords: string[];
  domains: Domain[];
};

function clean(s: string) {
  return s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

function lowerFirst(s: string) {
  // Keep acronyms/brands ("DJ", "iPhone") intact.
  if (/^[A-Z]{2,}/.test(s) || /^[a-z]+[A-Z]/.test(s)) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function singular(w: string) {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

function extractVerbPhrase(rest: string): string | null {
  const words = rest.split(" ");
  let start = -1;
  const first = words[0]?.toLowerCase();
  if (!first) return null;

  if (HELPERS.has(first)) {
    // "helps dog owners find trusted dog sitters" -> "find trusted dog sitters"
    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase();
      if (w === "to") continue;
      if (VERBS.has(w)) {
        start = i;
        break;
      }
    }
  } else {
    // "small teams make decisions" / "tracks spending": first verb in the opening words.
    for (let i = 0; i < Math.min(words.length, 4); i++) {
      const w = words[i].toLowerCase();
      const base = VERBS.has(w) ? w : VERBS.has(w.replace(/e?s$/, "")) ? w.replace(/e?s$/, "") : null;
      if (base) {
        words[i] = base;
        start = i;
        break;
      }
    }
  }

  if (start < 0) return null;
  const phrase = words.slice(start, start + 6).join(" ");
  return lowerFirst(phrase.replace(/[,;:].*$/, ""));
}

export function parseBrief(rawIdea: string, rawCustomer: string): Brief {
  const idea = clean(rawIdea);
  const customer = clean(rawCustomer);

  let offering = idea;
  let verbPhrase: string | null = null;

  const body = idea.replace(/^(an?|the)\s+/i, "");
  const relative = body.match(/^(.+?)\s+(?:that|which|where|to)\s+(.+)$/i);
  if (relative) {
    offering = relative[1];
    verbPhrase = extractVerbPhrase(relative[2]);
  } else {
    const forSplit = body.match(/^(.+?)\s+(?:for|aimed at)\s+.+$/i);
    offering = forSplit ? forSplit[1] : body;
  }
  offering = lowerFirst(offering.replace(/^(an?|the)\s+/i, ""));

  const audience = lowerFirst(customer.replace(/^(an?|the)\s+/i, ""));
  const audienceShort = audience.split(/\s+(?:who|that|with|in|looking|living|on|at)\s+/i)[0];

  const tokens = `${idea} ${customer}`
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/[\s-]+/)
    .map(w => w.replace(/'s?$/, ""))
    .filter(w => w.length > 2 && !STOP.has(w));
  const keywords = [...new Set(tokens)];
  const ideaTokens = new Set(
    idea
      .toLowerCase()
      .replace(/[^a-z\s-]/g, " ")
      .split(/[\s-]+/),
  );
  const ideaKeywords = [...new Set(keywords.filter(k => ideaTokens.has(k)).map(singular))];

  const scored = DOMAINS.map(d => {
    let score = 0;
    for (const k of keywords) {
      if (d.triggers.includes(k) || d.triggers.includes(singular(k))) score += 1;
    }
    return { d, score };
  })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    idea,
    customer,
    offering,
    verbPhrase,
    audience,
    audienceShort,
    keywords,
    ideaKeywords,
    domains: scored.slice(0, 2).map(x => x.d),
  };
}

export function isGenericCategory(offering: string) {
  return GENERIC_CATEGORIES.has(offering.toLowerCase());
}
