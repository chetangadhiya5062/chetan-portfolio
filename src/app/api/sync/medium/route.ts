import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { XMLParser } from "fast-xml-parser";

export const dynamic = "force-dynamic";

const RSS_URL = "https://medium.com/feed/@ChetanGadhiy017";

export async function GET() {
  try {
    const res = await fetch(RSS_URL);
    const xmlText = await res.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const parsed = parser.parse(xmlText);

    // ✅ Safer version (Fix Applied)
    let items = parsed?.rss?.channel?.item || [];

    // Ensure items is always an array
    if (!Array.isArray(items)) {
      items = [items];
    }

    const entries = items.map((item: any) => {
      const date = new Date(item.pubDate)
        .toISOString()
        .split("T")[0];

      return {
        platform: "medium",
        activity_date: date,
        intensity: 1,
      };
    });

    await supabaseAdmin
      .from("activity_logs")
      .delete()
      .eq("platform", "medium");

    await supabaseAdmin
      .from("activity_logs")
      .insert(entries);

    return NextResponse.json({
      message: "Medium synced",
      totalArticles: entries.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}