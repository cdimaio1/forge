import Link from "next/link";

export function ForgeMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <rect x="1" y="1" width="11" height="11" rx="2" fill="#0F6CBD" />
      <rect x="8" y="8" width="11" height="11" rx="2" fill="#479EF5" fillOpacity="0.85" />
    </svg>
  );
}

export default function AppHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 h-12 border-b border-stroke bg-surface">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 rounded text-[15px] font-semibold text-fg">
          <ForgeMark />
          Forge
        </Link>
        <div className="ml-auto flex items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
