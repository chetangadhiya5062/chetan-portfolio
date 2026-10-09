export type CalendarDay = { date: string; count: number };

export type RepoInfo = {
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
  isFork: boolean;
  owner: string;
};

export type CommitInfo = { repo: string; message: string; date: string; url: string };

export type GithubData = {
  totalContributions: number;
  calendar: CalendarDay[];
  repos: RepoInfo[];
  recentCommits: CommitInfo[];
  fetchedAt: string;
};

export type LeetcodeData = {
  solved: { all: number; easy: number; medium: number; hard: number };
  streak: number;
  totalActiveDays: number;
  calendar: CalendarDay[];
  contest: { rating: number; attended: number; topPercentage: number | null } | null;
  recent: { title: string; slug: string; date: string }[];
  fetchedAt: string;
};

export type MediumPost = {
  title: string;
  url: string;
  date: string;
  thumbnail: string | null;
  readingMinutes: number;
  tags: string[];
};

export type MediumData = { posts: MediumPost[]; fetchedAt: string };

export type SourceMap = {
  github: GithubData;
  leetcode: LeetcodeData;
  medium: MediumData;
};
export type SourceKey = keyof SourceMap;

/** ISR-cache source fetches for 6h on page renders; bypass the cache for cron/manual syncs. */
export const cacheOpts = (fresh: boolean) =>
  fresh ? ({ cache: "no-store" } as const) : ({ next: { revalidate: 21600 } } as const);
