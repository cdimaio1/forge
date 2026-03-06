import { NextRequest, NextResponse } from "next/server";
import { mockGenerate } from "@/lib/mockGenerator";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { idea, customer, vibe } = body;

  if (!idea || !customer || !vibe) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = mockGenerate({ idea, customer, vibe });

  return NextResponse.json(result);
}