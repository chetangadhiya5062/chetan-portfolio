import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("activity_logs")
      .select("activity_date, intensity")
      .not("activity_date", "is", null);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 🔥 Clean invalid date rows
    const cleaned = (data || []).filter((row) => {
      if (!row.activity_date) return false;

      const dateObj = new Date(row.activity_date);

      return !isNaN(dateObj.getTime());
    });

    return NextResponse.json(cleaned);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}