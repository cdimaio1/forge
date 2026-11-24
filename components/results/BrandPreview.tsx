import { fontStack, type Palette, type TypePairing } from "@/lib/brand/kit";

type Props = {
  name: string;
  tagline: string;
  summary: string;
  palette: Palette;
  type: TypePairing;
};

function color(palette: Palette, role: string) {
  return palette.colors.find(c => c.role === role)!.hex;
}

/** A tiny homepage mock rendered in the selected name, palette, and type. */
export default function BrandPreview({ name, tagline, summary, palette, type }: Props) {
  const primary = color(palette, "Primary");
  const accent = color(palette, "Accent");
  const bg = color(palette, "Background");
  const ink = color(palette, "Ink");
  const heading = { fontFamily: fontStack(type.heading.family), fontWeight: type.heading.weight };
  const body = { fontFamily: fontStack(type.body.family), fontWeight: type.body.weight };
  const slug = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");

  return (
    <div className="overflow-hidden rounded-lg border border-stroke bg-surface shadow-4" aria-label={`Homepage preview for ${name}`}>
      <div className="flex h-7 items-center gap-1.5 border-b border-stroke bg-subtle px-3">
        <span className="h-2 w-2 rounded-full bg-[#d1d1d1]" />
        <span className="h-2 w-2 rounded-full bg-[#d1d1d1]" />
        <span className="h-2 w-2 rounded-full bg-[#d1d1d1]" />
        <span className="ml-2 truncate rounded bg-surface px-2 text-[11px] leading-4 text-fg-3 ring-1 ring-stroke">{slug}.com</span>
      </div>

      <div style={{ background: bg, color: ink, ...body }} className="px-6 pb-7 pt-4">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-white"
            style={{ background: primary, ...heading }}
          >
            {name.charAt(0)}
          </span>
          <span className="text-[15px]" style={heading}>
            {name}
          </span>
          <span className="ml-auto hidden gap-4 text-xs opacity-70 sm:flex">
            <span>How it works</span>
            <span>About</span>
          </span>
        </div>

        <div className="mt-9">
          <span className="inline-block h-1 w-8 rounded-full" style={{ background: accent }} />
          <h3 className="mt-3 text-[26px] leading-[1.15] tracking-[-0.01em]" style={heading}>
            {tagline || name}
          </h3>
          <p className="mt-3 text-[13px] leading-5 opacity-75">{summary}</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="rounded-md px-3.5 py-2 text-xs font-semibold text-white" style={{ background: primary }}>
              Get started
            </span>
            <span className="text-xs font-semibold" style={{ color: primary }}>
              Learn more
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
