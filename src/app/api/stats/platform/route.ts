import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("activity_logs")
    .select("platform, intensity");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const stats: Record<string, number> = {};

  data.forEach((entry) => {
    if (!stats[entry.platform]) {
      stats[entry.platform] = 0;
    }
    stats[entry.platform] += entry.intensity;
  });

  return NextResponse.json(stats);
}