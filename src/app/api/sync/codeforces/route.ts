import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const HANDLE = "ChetanG_1711";

export async function GET() {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.status?handle=${HANDLE}`
    );

    const json = await res.json();

    if (json.status !== "OK") {
      return NextResponse.json(
        { error: "Failed to fetch Codeforces data" },
        { status: 500 }
      );
    }

    const submissions = json.result;

    const dailyMap: Record<string, number> = {};

    submissions.forEach((sub: any) => {
      if (sub.verdict === "OK") {
        const date = new Date(sub.creationTimeSeconds * 1000)
          .toISOString()
          .split("T")[0];

        if (!dailyMap[date]) {
          dailyMap[date] = 0;
        }

        dailyMap[date] += 1;
      }
    });

    const entries = Object.entries(dailyMap).map(
      ([date, count]) => ({
        platform: "codeforces",
        activity_date: date,
        intensity: count,
      })
    );

    // Remove old codeforces entries
    await supabaseAdmin
      .from("activity_logs")
      .delete()
      .eq("platform", "codeforces");

    // Insert new ones
    await supabaseAdmin
      .from("activity_logs")
      .insert(entries);

    return NextResponse.json({
      message: "Codeforces synced",
      totalDays: entries.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}