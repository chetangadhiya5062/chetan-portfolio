import { GITHUB_USER, SECONDARY_USERS } from "@/config/github";
import { cacheOpts } from "./types";
import type { CalendarDay, CommitInfo, GithubData, RepoInfo } from "./types";

const QUERY = `
query($login: String!, $withCalendar: Boolean!) {
  user(login: $login) {
    contributionsCollection @include(if: $withCalendar) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        name nameWithOwner description url homepageUrl stargazerCount isFork pushedAt
        primaryLanguage { name }
        repositoryTopics(first: 8) { nodes { topic { name } } }
        defaultBranchRef { target { ... on Commit { history(first: 3) { nodes { messageHeadline committedDate url } } } } }
      }
    }
  }
}`;

type GqlRepo = {
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  isFork: boolean;
  pushedAt: string;
  primaryLanguage: { name: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  defaultBranchRef: {
    target: { history?: { nodes: { messageHeadline: string; committedDate: string; url: string }[] } };
  } | null;
};

type GqlUser = {
  contributionsCollection?: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
    };
  };
  repositories: { nodes: GqlRepo[] };
};

async function fetchUser(login: string, withCalendar: boolean, fresh: boolean): Promise<GqlUser> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login, withCalendar } }),
    ...cacheOpts(fresh),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const json = (await res.json()) as { data?: { user: GqlUser | null }; errors?: { message: string }[] };
  if (!json.data?.user) throw new Error(json.errors?.[0]?.message ?? "GitHub user not found");
  return json.data.user;
}

function mapRepo(r: GqlRepo): RepoInfo {
  return {
    name: r.name,
    fullName: r.nameWithOwner,
    description: r.description,
    url: r.url,
    homepage: r.homepageUrl || null,
    stars: r.stargazerCount,
    language: r.primaryLanguage?.name ?? null,
    topics: r.repositoryTopics.nodes.map((n) => n.topic.name),
    pushedAt: r.pushedAt,
    isFork: r.isFork,
    owner: r.nameWithOwner.split("/")[0],
  };
}

export async function fetchGithub(fresh = false): Promise<GithubData> {
  const [primary, ...others] = await Promise.all([
    fetchUser(GITHUB_USER, true, fresh),
    // A secondary account failing must never take the primary data down.
    ...SECONDARY_USERS.map((u) => fetchUser(u, false, fresh).catch(() => null)),
  ]);

  const cal = primary.contributionsCollection?.contributionCalendar;
  const calendar: CalendarDay[] = (cal?.weeks ?? []).flatMap((w) =>
    w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
  );

  const nodes = [primary, ...others].flatMap((u) => u?.repositories.nodes ?? []);
  const repos = nodes.map(mapRepo).sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));

  const recentCommits: CommitInfo[] = nodes
    .flatMap((r) =>
      (r.defaultBranchRef?.target.history?.nodes ?? []).map((c) => ({
        repo: r.nameWithOwner,
        message: c.messageHeadline,
        date: c.committedDate,
        url: c.url,
      })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);

  return {
    totalContributions: cal?.totalContributions ?? 0,
    calendar,
    repos,
    recentCommits,
    fetchedAt: new Date().toISOString(),
  };
}
