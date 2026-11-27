import { NextRequest, NextResponse } from "next/server";
import { aiConfigured, coinWithClaude } from "@/lib/brand/ai";
import { isVibe } from "@/lib/brand/lexicon";

// Returns AI-coined names, or 501 when no API key is configured so the client
// keeps the curated engine's names.

export async function GET() {
  return NextResponse.json({ ai: aiConfigured() });
}

export async function POST(req: NextRequest) {
  if (!aiConfigured()) return NextResponse.json({ error: "AI naming is not configured." }, { status: 501 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const { idea, customer, vibe, seed } = body;
  if (typeof idea !== "string" || !idea.trim() || typeof customer !== "string" || !customer.trim() || !isVibe(vibe)) {
    return NextResponse.json({ error: "idea, customer and a valid vibe are required." }, { status: 400 });
  }
  if (idea.length > 200 || customer.length > 120) {
    return NextResponse.json({ error: "Brief is too long." }, { status: 400 });
  }

  try {
    const result = await coinWithClaude({ idea: idea.trim(), customer: customer.trim(), vibe, seed: typeof seed === "number" ? seed : 0 });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[coinage] AI naming failed:", err);
    return NextResponse.json({ error: "AI naming failed." }, { status: 502 });
  }
}
