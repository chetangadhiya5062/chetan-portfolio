import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { syncAll } from "@/lib/sources";
import { notifyProfileRepo } from "@/lib/dispatch";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Cron entry. Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is set. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const isDev = process.env.NODE_ENV !== "production";
  if (!secret && !isDev) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncAll();
  revalidatePath("/");
  revalidatePath("/api/public/feed");
  await notifyProfileRepo();
  const ok = Object.values(result).every((r) => r.ok);
  return NextResponse.json({ ok, result }, { status: ok ? 200 : 207 });
}
