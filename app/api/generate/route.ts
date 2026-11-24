import { NextRequest, NextResponse } from "next/server";
import { generateKit } from "@/lib/brand/kit";
import { isVibe } from "@/lib/brand/lexicon";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const { idea, customer, vibe, seed } = (body ?? {}) as Record<string, unknown>;
  if (typeof idea !== "string" || !idea.trim() || typeof customer !== "string" || !customer.trim()) {
    return NextResponse.json({ error: "Both idea and customer are required." }, { status: 400 });
  }
  if (!isVibe(vibe)) {
    return NextResponse.json({ error: "vibe must be one of modern, luxury, playful, retro, tech." }, { status: 400 });
  }

  return NextResponse.json(
    generateKit({ idea, customer, vibe, seed: typeof seed === "number" ? seed : 0 }),
  );
}
