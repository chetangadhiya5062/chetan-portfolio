import { profile } from "@/content/profile";
import { cacheOpts } from "./types";
import type { LeetcodeData } from "./types";

const QUERY = `
query($u: String!) {
  matchedUser(username: $u) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
  userContestRanking(username: $u) { rating attendedContestsCount topPercentage }
  recentAcSubmissionList(username: $u, limit: 10) { title titleSlug timestamp }
}`;

type Resp = {
  data?: {
    matchedUser: {
      submitStatsGlobal: { acSubmissionNum: { difficulty: string; count: number }[] };
      userCalendar: { streak: number; totalActiveDays: number; submissionCalendar: string };
    } | null;
    userContestRanking: { rating: number; attendedContestsCount: number; topPercentage: number | null } | null;
    recentAcSubmissionList: { title: string; titleSlug: string; timestamp: string }[] | null;
  };
};

const isoDay = (unixSeconds: number) => new Date(unixSeconds * 1000).toISOString().slice(0, 10);

export async function fetchLeetcode(fresh = false): Promise<LeetcodeData> {
  const username = profile.handles.leetcode;
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/u/${username}/`,
      "User-Agent": "Mozilla/5.0 (compatible; chetan-portfolio/2.0; +https://chetangadhiya.vercel.app)",
    },
    body: JSON.stringify({ query: QUERY, variables: { u: username } }),
    ...cacheOpts(fresh),
  });
  if (!res.ok) throw new Error(`LeetCode ${res.status}`);
  const data = ((await res.json()) as Resp).data;
  const user = data?.matchedUser;
  if (!user) throw new Error("LeetCode user not found");

  const count = (d: string) =>
    user.submitStatsGlobal.acSubmissionNum.find((x) => x.difficulty === d)?.count ?? 0;

  const raw = JSON.parse(user.userCalendar.submissionCalendar || "{}") as Record<string, number>;
  const byDay = new Map<string, number>();
  for (const [ts, n] of Object.entries(raw)) {
    const day = isoDay(Number(ts));
    byDay.set(day, (byDay.get(day) ?? 0) + Number(n));
  }
  const calendar = [...byDay].map(([date, c]) => ({ date, count: c })).sort((a, b) => a.date.localeCompare(b.date));

  const contest = data?.userContestRanking;
  return {
    solved: { all: count("All"), easy: count("Easy"), medium: count("Medium"), hard: count("Hard") },
    streak: user.userCalendar.streak,
    totalActiveDays: user.userCalendar.totalActiveDays,
    calendar,
    contest: contest
      ? { rating: Math.round(contest.rating), attended: contest.attendedContestsCount, topPercentage: contest.topPercentage }
      : null,
    recent: (data?.recentAcSubmissionList ?? []).map((s) => ({
      title: s.title,
      slug: s.titleSlug,
      date: new Date(Number(s.timestamp) * 1000).toISOString(),
    })),
    fetchedAt: new Date().toISOString(),
  };
}
