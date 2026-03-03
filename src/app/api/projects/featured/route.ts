import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/projects",
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const data = await res.json();

    // ✅ Return just the array/object directly
    return NextResponse.json(data);

  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}