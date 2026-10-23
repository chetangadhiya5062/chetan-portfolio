import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { connectLinkedIn } from "@/lib/publish/linkedin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const back = (q: string) => NextResponse.redirect(new URL(`/admin?${q}`, process.env.NEXT_PUBLIC_SITE_URL || url.origin));
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = req.headers.get("cookie")?.match(/(?:^|;\s*)li_state=([^;]+)/)?.[1];
  if (!code || !state || !cookie || state !== cookie) return back("li=bad-state");

  const r = await connectLinkedIn(code, url.origin);
  revalidatePath("/admin");
  const res = back(`li=${r.ok ? "connected" : "failed"}`);
  res.cookies.delete({ name: "li_state", path: "/api/admin/linkedin" });
  return res;
}
