import { NextResponse } from "next/server";
import { getPublicFeed } from "@/lib/public-feed";

// Cached at the edge; the data underneath is already ISR/last-good cached.
export const revalidate = 3600;

const headers = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}

/** Read-only public JSON: the single source of truth for the GitHub profile (and anything else later). */
export async function GET() {
  try {
    return NextResponse.json(await getPublicFeed(), { headers });
  } catch (err) {
    console.error("[public-feed]", (err as Error).message);
    return NextResponse.json({ error: "Feed temporarily unavailable" }, { status: 503, headers: { ...headers, "Cache-Control": "no-store" } });
  }
}
