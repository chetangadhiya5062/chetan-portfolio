import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const username = "chetangadhiya5062";

    const res = await fetch(
      `https://api.github.com/users/${username}/events`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const events = await res.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid GitHub response" },
        { status: 500 }
      );
    }

    let insertCount = 0;

    for (const event of events) {
      if (event.type === "PushEvent" && event.public) {
        const date = event.created_at.split("T")[0];

        const { error } = await supabaseAdmin
          .from("activity_logs")
          .insert({
            external_id: event.id, // 🔥 duplicate prevention
            platform: "github",
            activity_date: date,
            intensity: 1,
            title: event.repo?.name ?? "GitHub Push",
            url: event.repo?.name
              ? `https://github.com/${event.repo.name}`
              : null,
            type: event.type,
            description: `Pushed to ${event.repo?.name}`,
            metadata: event,
          });

        if (error) {
          // Ignore duplicate errors (unique constraint)
          if (error.code !== "23505") {
            console.log("INSERT ERROR:", error);
          }
        } else {
          insertCount++;
        }
      }
    }

    return NextResponse.json({
      message: "GitHub events synced",
      total: insertCount,
    });
  } catch (err: any) {
    console.log("GLOBAL ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}