import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const NAMES = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GITHUB_TOKEN",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
  "CRON_SECRET",
  "GEMINI_API_KEY",
  "GITHUB_DISPATCH_TOKEN",
] as const;

/**
 * Deployment self-check. Requires `Authorization: Bearer $CRON_SECRET`.
 * Reports only whether each variable is present and whether the credentials actually work. Never returns values.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const env = Object.fromEntries(NAMES.map((n) => [n, (process.env[n] ?? "").trim().length > 0]));

  const check = async (run: () => PromiseLike<{ error: { message: string } | null }> | null) => {
    try {
      const r = run();
      if (!r) return "client not created (missing env)";
      const { error } = await r;
      return error ? `error: ${error.message}` : "ok";
    } catch (e) {
      return `error: ${(e as Error).message}`;
    }
  };

  const anon = getSupabase();
  const admin = getSupabaseAdmin();
  const supabase = {
    anonRead: await check(() => anon?.from("site_settings").select("key").limit(1) ?? null),
    serviceRoleRead: await check(() => admin?.from("social_posts").select("id").limit(1) ?? null),
  };

  let github = "no token";
  if (env.GITHUB_TOKEN) {
    try {
      const r = await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }, cache: "no-store" });
      github = r.ok ? "ok" : `rejected (${r.status})`;
    } catch (e) {
      github = `error: ${(e as Error).message}`;
    }
  }

  return NextResponse.json({ env, supabase, github, vercelEnv: process.env.VERCEL_ENV ?? "local" }, { headers: { "Cache-Control": "no-store" } });
}
