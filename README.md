# Forge

**Find a name worth building on.**

Describe a business idea and who it's for, pick a feel, and Forge gives you a shortlist of distinctive names. Each one comes with the reason it works. Pick a name and you see it as a brand: taglines, positioning, voice, an accessible color palette, and a type pairing, all previewed together on a mock homepage.

## Try it locally

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) and try one of the example briefs.

## How names are made

Forge doesn't glue a suffix onto your first word. The [naming engine](lib/brand/names.ts) parses the brief, matches it to hand-curated word banks in [the lexicon](lib/brand/lexicon.ts), and uses the same techniques naming studios use:

| Strategy | Example | Why |
| --- | --- | --- |
| Metaphor | Chorus, Collar | A real word borrowed from the world of the business |
| Blend | Encorecord, Whistleash | Two words merged where their letters overlap |
| Compound | Needleyard, Leashbean | Two plain words fused into a place-like name |
| Coined | Sonette, Amicola | Built on a Latin or Greek root with real meaning |
| Phrase | Second Crate, Little Leash | A short name with personality |
| Descriptive | Recordhouse | Says what you do; clear on day one, harder to own |

Overused startup endings (-ify, -ly, -r, .io) are filtered out, and every shortlist mixes strategies.

## How it works

- **[Brief form](components/BriefForm.tsx)** on the home page collects the idea, audience, and feel.
- **[Results](components/results/ResultsView.tsx)** generate everything in the browser from the brief. The URL holds the brief and your selections, so any result can be shared or bookmarked.
- **[Kit generator](lib/brand/kit.ts)** builds taglines, positioning, voice, WCAG-checked palettes, and Google Fonts pairings.
- **[`POST /api/generate`](app/api/generate/route.ts)** returns the same kit as JSON (`{ idea, customer, vibe, seed? }`).

Generation is deterministic and runs locally. No API key needed.

Built with Next.js, React, TypeScript, and Tailwind CSS.
