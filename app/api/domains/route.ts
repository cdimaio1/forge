import { NextRequest, NextResponse } from "next/server";
import { domainSlug } from "@/lib/brand/score";

// Checks registration through RDAP, the public successor to WHOIS.
// 404 from the registry = not registered. It's a signal, not a guarantee:
// premium and reserved names can still be unavailable.

const TLDS = ["com", "co", "app"] as const;
type Status = "available" | "taken" | "unknown";

const cache = new Map<string, { status: Status; at: number }>();
const TTL = 1000 * 60 * 30;

async function check(domain: string): Promise<Status> {
  const hit = cache.get(domain);
  if (hit && Date.now() - hit.at < TTL) return hit.status;
  let status: Status = "unknown";
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, {
      headers: { accept: "application/rdap+json" },
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });
    if (res.status === 404) status = "available";
    else if (res.ok) status = "taken";
  } catch {
    status = "unknown";
  }
  cache.set(domain, { status, at: Date.now() });
  return status;
}

export async function GET(req: NextRequest) {
  const slug = domainSlug(req.nextUrl.searchParams.get("name") ?? "");
  if (slug.length < 2 || slug.length > 40) {
    return NextResponse.json({ error: "Pass a name of 2–40 letters." }, { status: 400 });
  }
  const results = await Promise.all(TLDS.map(async tld => ({ domain: `${slug}.${tld}`, tld, status: await check(`${slug}.${tld}`) })));
  return NextResponse.json({ slug, results }, { headers: { "cache-control": "private, max-age=600" } });
}
