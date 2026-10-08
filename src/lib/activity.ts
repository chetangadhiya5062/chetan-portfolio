import type { GithubData, LeetcodeData, MediumData } from "@/lib/sources/types";
import type { SocialPost } from "@/lib/site-data";

export type Platform = "github" | "leetcode" | "medium" | "linkedin" | "x";

export type ActivityDay = {
  date: string;
  total: number;
  github: number;
  leetcode: number;
  medium: number;
  posts: number;
};

export type FeedItem = { platform: Platform; title: string; url: string; date: string; meta?: string };

export type Activity = {
  days: ActivityDay[]; // last 365 days, ascending, gap-free
  months: { month: string; label: string; total: number }[]; // last 12 months
  feed: FeedItem[];
  totals: { github: number; leetcode: number; medium: number; posts: number; all: number };
};

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function buildActivity(
  gh: GithubData | null,
  lc: LeetcodeData | null,
  md: MediumData | null,
  posts: SocialPost[],
): Activity {
  const map = new Map<string, ActivityDay>();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const date = dayKey(d);
    map.set(date, { date, total: 0, github: 0, leetcode: 0, medium: 0, posts: 0 });
  }
  const add = (date: string | null | undefined, key: "github" | "leetcode" | "medium" | "posts", n: number) => {
    const row = date ? map.get(date.slice(0, 10)) : undefined;
    if (!row) return;
    row[key] += n;
    row.total += n;
  };
  gh?.calendar.forEach((c) => add(c.date, "github", c.count));
  lc?.calendar.forEach((c) => add(c.date, "leetcode", c.count));
  md?.posts.forEach((p) => add(p.date, "medium", 1));
  posts.forEach((p) => add(p.postedAt ?? p.createdAt, "posts", 1));

  const days = [...map.values()];

  const months: Activity["months"] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - i, 1));
    const month = dayKey(d).slice(0, 7);
    months.push({
      month,
      label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }),
      total: days.filter((x) => x.date.startsWith(month)).reduce((s, x) => s + x.total, 0),
    });
  }

  const feed: FeedItem[] = [
    ...(gh?.recentCommits ?? []).map<FeedItem>((c) => ({
      platform: "github", title: c.message, url: c.url, date: c.date, meta: c.repo.split("/")[1],
    })),
    ...(lc?.recent ?? []).map<FeedItem>((r) => ({
      platform: "leetcode", title: `Solved: ${r.title}`, url: `https://leetcode.com/problems/${r.slug}/`, date: r.date,
    })),
    ...(md?.posts ?? []).slice(0, 5).map<FeedItem>((p) => ({
      platform: "medium", title: p.title, url: p.url, date: p.date, meta: `${p.readingMinutes} min read`,
    })),
    ...posts.map<FeedItem>((p) => ({
      platform: p.platform, title: p.text?.slice(0, 120) || p.note || "Post", url: p.url, date: p.postedAt ?? p.createdAt,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);

  const sum = (k: keyof Omit<ActivityDay, "date">) => days.reduce((s, d) => s + d[k], 0);
  return {
    days,
    months,
    feed,
    totals: { github: sum("github"), leetcode: sum("leetcode"), medium: sum("medium"), posts: sum("posts"), all: sum("total") },
  };
}

/** "3h ago", "2d ago" — stable string for server rendering. */
export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 60) return `${Math.round(s / 86400)}d ago`;
  return `${Math.round(s / (86400 * 30))}mo ago`;
}
