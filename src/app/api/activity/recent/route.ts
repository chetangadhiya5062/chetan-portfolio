import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("activity_logs")
    .select("*")
    .order("activity_date", { ascending: false })
    .limit(10);

  if (error) {
    console.error("SUPABASE ERROR:", error); // 👈 ADD THIS
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}