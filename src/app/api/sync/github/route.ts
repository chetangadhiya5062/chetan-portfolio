import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const GITHUB_API = "https://api.github.com/graphql";

export async function GET(request: Request) {

  // ✅ Added protection at top of GET
  if (process.env.NODE_ENV === "production") {
    const authHeader = new URL(request.url).searchParams.get("secret");

    if (authHeader !== process.env.CRON_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const query = `
    query {
      user(login: "ChetanGadhiya017") {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  const weeks =
    json.data.user.contributionsCollection.contributionCalendar.weeks;

  const days = weeks.flatMap((week: any) =>
    week.contributionDays.map((day: any) => ({
      activity_date: day.date.split("T")[0],
      intensity: day.contributionCount,
      platform: "github",
    }))
  );

  // Clear old GitHub records
  await supabaseAdmin
    .from("activity_logs")
    .delete()
    .eq("platform", "github");

  // Insert new
  await supabaseAdmin
    .from("activity_logs")
    .insert(days);

  return NextResponse.json({
    message: "GitHub activity synced",
    totalDays: days.length,
  });
}