import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { linkedinAuthUrl, linkedinConfigured, newState } from "@/lib/publish/linkedin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!linkedinConfigured()) return NextResponse.redirect(new URL("/admin?li=not-configured", req.url));
  const state = newState();
  const res = NextResponse.redirect(linkedinAuthUrl(new URL(req.url).origin, state));
  res.cookies.set("li_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/admin/linkedin", maxAge: 600 });
  return res;
}
