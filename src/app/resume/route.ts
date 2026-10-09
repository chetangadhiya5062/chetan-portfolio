import { NextResponse } from "next/server";
import { getResume } from "@/lib/site-data";

export const dynamic = "force-dynamic";

/** Stable resume URL for LinkedIn Featured etc. Always redirects to whatever is current. */
export async function GET(req: Request) {
  const { url } = await getResume();
  const target = new URL(url, req.url);
  return NextResponse.redirect(target, 302);
}
