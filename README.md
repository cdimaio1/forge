# Forge

**Turn a rough business idea into a first-pass brand kit.**

Enter an idea, who it’s for, and a visual vibe. Forge uses those inputs to present a name, tagline, brand story, color palette, and typography recommendations in one place.

## Try it locally

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) and start a brand kit. Try a neighborhood record shop for vinyl collectors with a retro vibe.

## How it works

1. The [start form](app/start/page.tsx) collects the idea, audience, and vibe.
2. The [generate endpoint](app/api/generate/route.ts) calls a [local mock generator](lib/mockGenerator.ts).
3. The [results screen](app/results/page.tsx) renders the generated direction as a [brand kit](components/BrandKit.tsx).

This is a prototype with preset generation logic, not an AI service. It does not require an API key.

Built with Next.js, React, TypeScript, and Tailwind CSS.
