import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Logo mark */}
      <div className="mb-8 w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <span className="text-2xl font-black text-white">F</span>
      </div>

      <h1 className="text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
        Forge
      </h1>

      <p className="text-xl text-zinc-400 mb-10 max-w-md">
        Turn ideas into companies — instantly. Get a full brand kit in seconds.
      </p>

      <Link
        href="/start"
        className="bg-orange-500 hover:bg-orange-400 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
      >
        Start a company →
      </Link>

      <p className="mt-8 text-sm text-zinc-600">
        No credit card needed · Takes 10 seconds
      </p>
    </main>
  );
}