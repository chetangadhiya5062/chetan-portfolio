import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    await supabaseAdmin
      .from("activity_logs")
      .insert([
        {
          platform: "linkedin",
          activity_date: today,
          intensity: 1,
        },
      ]);

    return NextResponse.json({
      message: "LinkedIn activity logged",
      date: today,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}