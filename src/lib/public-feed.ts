import { profile, SITE_URL } from "@/content/profile";
import { projects } from "@/content/projects";
import { buildActivity } from "@/lib/activity";
import { getSource } from "@/lib/sources";
import { getSiteStatus, getSocialPosts, type SocialPost } from "@/lib/site-data";
import type { GithubData, LeetcodeData, MediumData } from "@/lib/sources/types";

export type FeedItem = { type: "medium" | "linkedin" | "x" | "github"; title: string; url: string; date: string };

export type PublicFeed = {
  generatedAt: string;
  profile: { name: string; headline: string; status: string; openToWork: boolean; resumeUrl: string };
  stats: {
    githubContributions365: number;
    leetcodeSolved: number;
    leetcodeEasy: number;
    leetcodeMedium: number;
    leetcodeHard: number;
    leetcodeStreak: number;
    mediumPosts: number;
  };
  heatmap: { date: string; github: number; leetcode: number; medium: number; posts: number }[];
  latest: FeedItem[];
  featured: { name: string; repo: string; oneLiner: string; stack: string[] }[];
};

/** Pure: turns already-fetched public data into the feed. No secrets, no hidden posts, no email. */
export function composeFeed(input: {
  github: GithubData | null;
  leetcode: LeetcodeData | null;
  medium: MediumData | null;
  posts: SocialPost[];
  status: { currently: string; openToWork: boolean };
  now?: Date;
}): PublicFeed {
  const { github, leetcode, medium, posts, status } = input;
  const activity = buildActivity(github, leetcode, medium, posts);

  // newest few of EACH type, then merged: otherwise frequent commits would push articles and posts out of the list
  const newest = (items: FeedItem[], n: number) => [...items].sort((x, y) => y.date.localeCompare(x.date)).slice(0, n);
  const latest: FeedItem[] = [
    ...newest((medium?.posts ?? []).map<FeedItem>((p) => ({ type: "medium", title: p.title, url: p.url, date: p.date })), 5),
    ...newest(
      posts.map<FeedItem>((p) => ({
        type: p.platform,
        title: (p.text || p.note || (p.platform === "x" ? "Post on X" : "Post on LinkedIn")).replace(/s+/g, " ").trim().slice(0, 140),
        url: p.url,
        date: p.postedAt ?? p.createdAt,
      })),
      6,
    ),
    ...newest(
      (github?.recentCommits ?? []).map<FeedItem>((c) => ({
        type: "github",
        title: `${c.repo.split("/")[1]}: ${c.message}`.slice(0, 140),
        url: c.url,
        date: c.date,
      })),
      5,
    ),
  ]
    .sort((x, y) => y.date.localeCompare(x.date))
    .slice(0, 16);

  return {
    generatedAt: (input.now ?? new Date()).toISOString(),
    profile: {
      name: profile.name,
      headline: `${profile.headline} — ${profile.tagline}`,
      status: status.currently.trim(),
      openToWork: status.openToWork,
      resumeUrl: `${SITE_URL}/resume`,
    },
    stats: {
      githubContributions365: github?.totalContributions ?? 0,
      leetcodeSolved: leetcode?.solved.all ?? 0,
      leetcodeEasy: leetcode?.solved.easy ?? 0,
      leetcodeMedium: leetcode?.solved.medium ?? 0,
      leetcodeHard: leetcode?.solved.hard ?? 0,
      leetcodeStreak: leetcode?.streak ?? 0,
      mediumPosts: medium?.posts.length ?? 0,
    },
    heatmap: activity.days.map((d) => ({ date: d.date, github: d.github, leetcode: d.leetcode, medium: d.medium, posts: d.posts })),
    latest,
    featured: projects.map((p) => ({
      name: p.title.split(" — ")[0],
      repo: p.repo,
      oneLiner: p.summary,
      stack: p.stack.slice(0, 4),
    })),
  };
}

export async function getPublicFeed(): Promise<PublicFeed> {
  const [github, leetcode, medium, posts, status] = await Promise.all([
    getSource("github"), // live first, last-good source_cache when a source is down
    getSource("leetcode"),
    getSource("medium"),
    getSocialPosts(), // RLS exposes only non-hidden posts
    getSiteStatus(),
  ]);
  return composeFeed({ github, leetcode, medium, posts, status });
}
