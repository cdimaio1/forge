# Coinage

**Coin a name. Strike a brand.**

Coinage is a name studio for first-time founders. Write one sentence about what you're building, who it's for and how it should feel. Coinage coins a shortlist of names, stress-tests each one, and strikes the one you pick into a full brand you can see in the wild.

## What it does

1. **The brief.** A single fill-in-the-blank sentence: *I'm building ___ for ___, and it should feel ___.* Five feels (Modern, Luxury, Playful, Retro, Tech) each carry their own palettes and type pairings.
2. **The mint.** Eight names across naming-studio techniques (metaphor, compound, blend, coined, phrase, descriptive), each with the reason it works and an ownability score.
3. **The stress test.** Length, say-it and spell-it checks with plain-language reasons, an app-icon check, and a live RDAP lookup for `.com`, `.co` and `.app`.
4. **The brand board.** The chosen name as a specimen, then in the wild: homepage, app icon, business card, social post, sticker and lockups, all in the selected palette and type. Below that, the brand sheet: taglines, WCAG-checked colors, Google Fonts pairings, positioning and voice.
5. **Export.** Copy a Markdown brand sheet, download JSON, or print to PDF. The URL holds the whole brief and every selection, so any result can be shared.

## Naming engines

- **Claude (optional).** Set `ANTHROPIC_API_KEY` and Coinage briefs Claude like a naming studio briefs a writer: concrete images over abstract virtues, mixed techniques, and a banned list of overused startup words and suffixes. `COINAGE_MODEL` overrides the model (default `claude-sonnet-5-5`). See [lib/brand/ai.ts](lib/brand/ai.ts).
- **Curated engine (default, offline).** Hand-curated word banks per industry and Latin/Greek roots, combined with the same techniques. No key needed. See [lib/brand/names.ts](lib/brand/names.ts) and [lib/brand/lexicon.ts](lib/brand/lexicon.ts).

## Run it

```sh
npm ci
cp .env.example .env.local   # optional: add your Anthropic key
npm run dev
```

Open [localhost:3000](http://localhost:3000) and try one of the example briefs.

## API

| Route | What it returns |
| --- | --- |
| `POST /api/names` | AI-coined names and taglines for `{ idea, customer, vibe, seed? }`, or `501` when no key is set |
| `GET /api/domains?name=` | RDAP status for `.com`, `.co` and `.app` |
| `POST /api/generate` | The full curated kit as JSON |

Built with Next.js, React, TypeScript and Tailwind CSS.
