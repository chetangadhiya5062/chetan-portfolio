import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const LEETCODE_API = "https://leetcode.com/graphql";

export async function GET() {
  const query = `
    query {
      matchedUser(username: "chetangadhiya4939") {
        submissionCalendar
      }
    }
  `;

  const res = await fetch(LEETCODE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  const calendarStr =
    json.data.matchedUser.submissionCalendar;

  const calendar = JSON.parse(calendarStr);

  const entries = Object.entries(calendar).map(
    ([timestamp, count]: any) => {
      const date = new Date(Number(timestamp) * 1000)
        .toISOString()
        .split("T")[0];

      return {
        platform: "leetcode",
        activity_date: date,
        intensity: Number(count),
      };
    }
  );

  // Clear old leetcode entries
  await supabaseAdmin
    .from("activity_logs")
    .delete()
    .eq("platform", "leetcode");

  // Insert new ones
  await supabaseAdmin
    .from("activity_logs")
    .insert(entries);

  return NextResponse.json({
    message: "LeetCode synced",
    totalDays: entries.length,
  });
}