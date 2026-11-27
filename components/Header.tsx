import Link from "next/link";

/** The Coinage mark: a struck coin — milled edge, serif C, a stamp-red pip. */
export function CoinMark({ size = 28, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }} aria-hidden="true">
      <span className={`milled absolute inset-0 rounded-full ${spin ? "animate-spin-slow" : ""}`} />
      <span className="absolute inset-[18%] rounded-full bg-ink" />
      <span className="relative font-display italic leading-none text-paper" style={{ fontSize: size * 0.5, marginTop: size * 0.02 }}>
        C
      </span>
      <span className="absolute rounded-full bg-stamp" style={{ width: size * 0.14, height: size * 0.14, right: "22%", top: "24%" }} />
    </span>
  );
}

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-4 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5 text-ink no-underline">
          <CoinMark />
          <span className="font-display text-[26px] leading-none tracking-[-0.01em]">Coinage</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
