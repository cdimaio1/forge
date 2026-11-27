import { contrastRatio, fontStack, type Palette, type TypePairing } from "@/lib/brand/kit";
import { domainSlug } from "@/lib/brand/score";

export type BoardProps = {
  name: string;
  tagline: string;
  summary: string;
  palette: Palette;
  type: TypePairing;
};

export function hexOf(palette: Palette, role: string) {
  return palette.colors.find(c => c.role === role)!.hex;
}

/** White or ink, whichever reads better on the given fill. */
function onColor(fill: string, ink: string) {
  return contrastRatio("#FFFFFF", fill) >= contrastRatio(ink, fill) ? "#FFFFFF" : ink;
}

function useBrand({ palette, type }: Pick<BoardProps, "palette" | "type">) {
  const primary = hexOf(palette, "Primary");
  const accent = hexOf(palette, "Accent");
  const bg = hexOf(palette, "Background");
  const ink = hexOf(palette, "Ink");
  return {
    primary,
    accent,
    bg,
    ink,
    onAccent: onColor(accent, ink),
    heading: { fontFamily: fontStack(type.heading.family), fontWeight: type.heading.weight } as React.CSSProperties,
    body: { fontFamily: fontStack(type.body.family), fontWeight: type.body.weight } as React.CSSProperties,
  };
}

function Plate({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`sheet flex flex-col overflow-hidden rounded-[22px] ${className}`}>
      <div className="relative grid flex-1 place-items-center overflow-hidden p-6">{children}</div>
      <figcaption className="meta flex justify-between border-t border-rule px-4 py-2.5">
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}

// ── The hero specimen ─────────────────────────────────────────────────────

export function Specimen({ name, tagline, palette, type, index }: BoardProps & { index: number }) {
  const b = useBrand({ palette, type });
  return (
    <section aria-label={`${name} specimen`} className="relative overflow-hidden rounded-[28px] shadow-float" style={{ background: b.bg, color: b.ink }}>
      <div className="flex justify-between px-7 pt-6 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: b.ink, opacity: 0.7 }}>
        <span>Specimen No. {String(index + 1).padStart(2, "0")}</span>
        <span className="hidden sm:inline">
          {palette.name} · {type.heading.family}
        </span>
      </div>
      <div key={name + type.heading.family} className="px-7 pb-10 pt-16 sm:pt-24">
        <h2 className="animate-strike break-words text-[64px] leading-[0.9] tracking-[-0.03em] sm:text-[112px]" style={b.heading}>
          {name}
          <span style={{ color: b.accent }}>.</span>
        </h2>
        <p className="mt-6 max-w-[520px] animate-rise text-[19px] leading-[1.4] [animation-delay:200ms]" style={b.body}>
          {tagline || "Write or pick a tagline to see it here."}
        </p>
      </div>
      <div className="flex h-3">
        {palette.colors.map(c => (
          <span key={c.role} className="flex-1" style={{ background: c.hex }} />
        ))}
      </div>
    </section>
  );
}

// ── Applications ──────────────────────────────────────────────────────────

export function Applications(props: BoardProps) {
  const { name, tagline, summary, palette, type } = props;
  const b = useBrand({ palette, type });
  const slug = domainSlug(name) || "yourname";
  const initial = name.replace(/^(the|a|an)\s+/i, "").charAt(0).toUpperCase();

  return (
    <div className="grid gap-4 md:grid-cols-6">
      {/* Website */}
      <Plate label={`Homepage · ${slug}.com`} className="md:col-span-4">
        <div className="w-full overflow-hidden rounded-xl shadow-lift" style={{ background: b.bg }}>
          <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: `${b.ink}1a`, background: `${b.ink}08` }}>
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span key={i} className="h-2 w-2 rounded-full" style={{ background: `${b.ink}33` }} />
              ))}
            </span>
            <span className="mx-auto rounded-md px-3 py-0.5 font-mono text-[10px]" style={{ background: `${b.ink}0d`, color: `${b.ink}b3` }}>
              {slug}.com
            </span>
          </div>
          <div className="px-6 pb-8 pt-5" style={{ color: b.ink, ...b.body }}>
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[17px]" style={b.heading}>
                {name}
              </span>
              <span className="hidden gap-4 opacity-70 sm:flex">
                <span>How it works</span>
                <span>Pricing</span>
                <span>About</span>
              </span>
            </div>
            <div className="mt-10 grid items-end gap-6 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-[34px] leading-[1.02] tracking-[-0.02em]" style={b.heading}>
                  {tagline || name}
                </p>
                <p className="mt-3 max-w-[340px] text-[13px] leading-[1.5] opacity-80">{summary}</p>
                <span className="mt-5 inline-flex rounded-full px-4 py-2 text-[12px] font-semibold text-white" style={{ background: b.primary }}>
                  Get started
                </span>
              </div>
              <div className="relative hidden h-[120px] sm:block" aria-hidden="true">
                <span className="absolute right-6 top-0 h-24 w-24 rounded-full" style={{ background: b.accent }} />
                <span className="absolute bottom-0 right-16 h-20 w-28 rounded-2xl" style={{ background: b.primary }} />
              </div>
            </div>
          </div>
        </div>
      </Plate>

      {/* App icon */}
      <Plate label="App icon" className="md:col-span-2">
        <div className="flex flex-col items-center gap-5">
          <span className="grid h-[112px] w-[112px] place-items-center rounded-[28px] shadow-lift" style={{ background: b.primary }}>
            <span className="text-[64px] leading-none text-white" style={b.heading}>
              {initial}
            </span>
          </span>
          <span className="flex items-end gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-[14px]" style={{ background: b.primary }}>
              <span className="text-[30px] leading-none text-white" style={b.heading}>
                {initial}
              </span>
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-[10px]" style={{ background: b.primary }}>
              <span className="text-[19px] leading-none text-white" style={b.heading}>
                {initial}
              </span>
            </span>
          </span>
          <span className="max-w-[120px] truncate text-[12px] text-ink-2">{name}</span>
        </div>
      </Plate>

      {/* Business card */}
      <Plate label="Business card" className="md:col-span-3">
        <div className="relative h-[190px] w-full max-w-[340px]">
          <div className="absolute left-0 top-0 flex h-[150px] w-[260px] -rotate-[5deg] flex-col justify-between rounded-lg p-4 shadow-lift" style={{ background: b.bg, color: b.ink, ...b.body }}>
            <span className="text-[11px] leading-[1.5]">
              <span className="block font-semibold">Your Name</span>
              <span className="block opacity-70">Founder</span>
            </span>
            <span className="text-[10px] leading-[1.5] opacity-70">
              hello@{slug}.com
              <br />
              {slug}.com
            </span>
          </div>
          <div className="absolute bottom-0 right-0 flex h-[150px] w-[260px] rotate-[3deg] items-center justify-center rounded-lg shadow-float" style={{ background: b.primary }}>
            <span className="px-4 text-center text-[30px] leading-none text-white" style={b.heading}>
              {name}
            </span>
            <span className="absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full" style={{ background: b.accent }} />
          </div>
        </div>
      </Plate>

      {/* Social post */}
      <Plate label={`Social · @${slug}`} className="md:col-span-3">
        <div className="flex aspect-square w-full max-w-[220px] flex-col justify-between rounded-xl p-5 shadow-lift" style={{ background: b.accent, color: b.onAccent }}>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] opacity-80">@{slug}</span>
          <span className="text-[24px] leading-[1.05] tracking-[-0.01em]" style={b.heading}>
            “{tagline || name}”
          </span>
          <span className="flex items-center justify-between text-[11px]" style={b.body}>
            <span style={b.heading}>{name}</span>
            <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] text-white" style={{ background: b.primary, ...b.heading }}>
              {initial}
            </span>
          </span>
        </div>
      </Plate>

      {/* Seal / sticker */}
      <Plate label="Sticker" className="md:col-span-2">
        <Seal name={name} palette={palette} type={type} />
      </Plate>

      {/* Wordmark lockups */}
      <Plate label="Lockups" className="md:col-span-4">
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="grid h-[120px] place-items-center rounded-xl" style={{ background: b.bg, color: b.ink }}>
            <span className="text-[38px] leading-none tracking-[-0.02em]" style={b.heading}>
              {name}
            </span>
          </div>
          <div className="grid h-[120px] place-items-center rounded-xl" style={{ background: b.ink }}>
            <span className="flex items-center gap-3 text-[30px] leading-none tracking-[-0.02em]" style={{ color: b.bg, ...b.heading }}>
              <span className="grid h-10 w-10 place-items-center rounded-full text-[22px] text-white" style={{ background: b.primary }}>
                {initial}
              </span>
              {name}
            </span>
          </div>
        </div>
      </Plate>
    </div>
  );
}

function Seal({ name, palette, type }: Pick<BoardProps, "name" | "palette" | "type">) {
  const b = useBrand({ palette, type });
  const unit = `${name.toUpperCase()} · EST. ${new Date().getFullYear()} · `;
  // Repeat short names so the ring reads as a full band, not scattered letters.
  const ring = unit.repeat(Math.max(1, Math.ceil(34 / unit.length)));
  const id = `seal-${domainSlug(name)}`;
  return (
    <svg viewBox="0 0 200 200" className="h-[170px] w-[170px] drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)]" role="img" aria-label={`${name} sticker`}>
      <defs>
        <path id={id} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill={b.primary} />
      <circle cx="100" cy="100" r="58" fill={b.bg} />
      <g className="origin-center animate-spin-slow" style={{ transformBox: "fill-box" }}>
        <text fill="#FFFFFF" fontSize="15" letterSpacing="2.4" style={{ fontFamily: fontStack(type.body.family), fontWeight: 600 }}>
          <textPath href={`#${id}`} textLength="440" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </g>
      <text x="100" y="118" textAnchor="middle" fontSize="54" fill={b.ink} style={b.heading}>
        {name.replace(/^(the|a|an)\s+/i, "").charAt(0).toUpperCase()}
      </text>
      <circle cx="132" cy="76" r="6" fill={b.accent} />
    </svg>
  );
}
