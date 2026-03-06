import ColorSwatch from "./ColorSwatch";

type BrandKitData = {
  name: string;
  tagline: string;
  brandStory: string;
  headlineHero: string;
  colors: { hex: string; label: string }[];
  typography: { role: string; font: string; reason: string }[];
};

export default function BrandKit({ kit }: { kit: BrandKitData }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-2">
          Your Brand Kit
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight">{kit.name}</h1>
        <p className="text-xl text-zinc-400 mt-2 italic">"{kit.tagline}"</p>
      </div>

      <Section title="Homepage Headline">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-5">
          <p className="text-2xl font-bold leading-snug">{kit.headlineHero}</p>
        </div>
      </Section>

      <Section title="Brand Story">
        <p className="text-zinc-300 leading-relaxed">{kit.brandStory}</p>
      </Section>

      <Section title="Color Palette">
        <div className="flex flex-wrap gap-3">
          {kit.colors.map(c => (
            <ColorSwatch key={c.hex} hex={c.hex} label={c.label} />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-3">
          {kit.typography.map(t => (
            <div key={t.role} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  {t.role}
                </span>
                <span className="text-sm font-semibold text-orange-400">{t.font}</span>
              </div>
              <p className="text-sm text-zinc-400">{t.reason}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}