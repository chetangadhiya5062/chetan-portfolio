import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const githubRes = await fetch(
      `${baseUrl}/api/sync/github`
    );

    const leetcodeRes = await fetch(
      `${baseUrl}/api/sync/leetcode`
    );

    const codeforcesRes = await fetch(
      `${baseUrl}/api/sync/codeforces`
    );

    // ✅ Added Medium Sync
    const mediumRes = await fetch(
      `${baseUrl}/api/sync/medium`
    );

    const githubJson = await githubRes.json();
    const leetcodeJson = await leetcodeRes.json();
    const codeforcesJson = await codeforcesRes.json();
    const mediumJson = await mediumRes.json();

    // ✅ Updated return response
    return NextResponse.json({
      message: "All platforms synced",
      github: githubJson,
      leetcode: leetcodeJson,
      codeforces: codeforcesJson,
      medium: mediumJson,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}