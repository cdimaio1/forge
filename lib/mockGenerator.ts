type Input = { idea: string; customer: string; vibe: string };

const VIBE_PALETTES: Record<string, { hex: string; label: string }[]> = {
  modern: [
    { hex: "#0F172A", label: "Midnight" },
    { hex: "#6366F1", label: "Indigo" },
    { hex: "#F8FAFC", label: "Slate White" },
    { hex: "#22D3EE", label: "Cyan" },
  ],
  luxury: [
    { hex: "#1C1C1C", label: "Onyx" },
    { hex: "#C9A84C", label: "Gold" },
    { hex: "#F5F0E8", label: "Cream" },
    { hex: "#6B4E3D", label: "Mahogany" },
  ],
  playful: [
    { hex: "#FF6B6B", label: "Coral" },
    { hex: "#FFE66D", label: "Sunshine" },
    { hex: "#4ECDC4", label: "Turquoise" },
    { hex: "#1A1A2E", label: "Deep Navy" },
  ],
  retro: [
    { hex: "#F4A261", label: "Terracotta" },
    { hex: "#264653", label: "Teal" },
    { hex: "#E9C46A", label: "Mustard" },
    { hex: "#2A2A2A", label: "Charcoal" },
  ],
  tech: [
    { hex: "#0A0A0A", label: "Black" },
    { hex: "#00FF88", label: "Neon Green" },
    { hex: "#1A1A2E", label: "Deep Navy" },
    { hex: "#FFFFFF", label: "White" },
  ],
};

const VIBE_TYPOGRAPHY: Record<string, { role: string; font: string; reason: string }[]> = {
  modern: [
    { role: "Heading", font: "Inter", reason: "Clean, geometric sans-serif with excellent legibility." },
    { role: "Body", font: "Inter", reason: "Consistent system font feel for digital-first products." },
    { role: "Accent", font: "Space Mono", reason: "Adds technical character to CTAs and labels." },
  ],
  luxury: [
    { role: "Heading", font: "Playfair Display", reason: "Elegant serifs convey heritage and refinement." },
    { role: "Body", font: "Cormorant Garamond", reason: "Long-form reading with a sophisticated feel." },
    { role: "Accent", font: "Montserrat Light", reason: "Modern counterpoint to serif headlines." },
  ],
  playful: [
    { role: "Heading", font: "Nunito", reason: "Rounded letterforms feel friendly and approachable." },
    { role: "Body", font: "DM Sans", reason: "Neutral but warm for paragraph text." },
    { role: "Accent", font: "Pacifico", reason: "Handwritten accent for personality moments." },
  ],
  retro: [
    { role: "Heading", font: "Rockwell", reason: "Bold slab serifs nod to mid-century design." },
    { role: "Body", font: "Lato", reason: "Humanist sans for comfortable reading." },
    { role: "Accent", font: "Special Elite", reason: "Typewriter style for nostalgic details." },
  ],
  tech: [
    { role: "Heading", font: "JetBrains Mono", reason: "Monospaced headings signal developer credibility." },
    { role: "Body", font: "IBM Plex Sans", reason: "Neutral and authoritative for technical content." },
    { role: "Accent", font: "Fira Code", reason: "Code-adjacent font reinforces technical identity." },
  ],
};

function slugify(str: string): string {
  const words = str.trim().split(/\s+/).slice(0, 3);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
}

export function mockGenerate(input: Input) {
  const { idea, customer, vibe } = input;

  const firstWord = idea.split(" ").find(w => w.length > 3) || "Nova";
  const nameBase = slugify(firstWord);
  const suffix = { modern: "ly", luxury: "ux", playful: "ify", retro: "Co", tech: ".io" }[vibe] ?? "ly";
  const name = nameBase + suffix;

  const taglines: Record<string, string> = {
    modern: `The modern way to ${idea.split(" ").slice(0, 4).join(" ").toLowerCase()}.`,
    luxury: `Redefining excellence for ${customer.split(" ").slice(0, 3).join(" ").toLowerCase()}.`,
    playful: `${customer.split(" ")[0]} deserve better. Way better.`,
    retro: `Trusted by ${customer.split(" ").slice(0, 3).join(" ").toLowerCase()} since day one.`,
    tech: `${idea.split(" ").slice(0, 3).join(" ")} — automated.`,
  };

  const headlines: Record<string, string> = {
    modern: `The smarter way to ${idea.split(" ").slice(0, 5).join(" ").toLowerCase()}`,
    luxury: `Crafted for those who expect more`,
    playful: `Finally, something built just for ${customer.split(" ")[0].toLowerCase()}s`,
    retro: `Good old-fashioned quality, for a new generation`,
    tech: `${idea.split(" ").slice(0, 4).join(" ")} — in one click`,
  };

  const brandStory = `${name} was born from a simple observation: ${customer} have been underserved for too long. Our team set out to build something different — a ${vibe}-first solution that makes ${idea.toLowerCase()} feel effortless. We believe the best products don't just solve problems, they become a part of the way you live and work. That's what ${name} is all about.`;

  return {
    name,
    tagline: taglines[vibe] ?? taglines.modern,
    headlineHero: headlines[vibe] ?? headlines.modern,
    brandStory,
    colors: VIBE_PALETTES[vibe] ?? VIBE_PALETTES.modern,
    typography: VIBE_TYPOGRAPHY[vibe] ?? VIBE_TYPOGRAPHY.modern,
  };
}