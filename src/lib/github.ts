export type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  language: string;
  topics: string[];
  pushed_at: string;
};

async function fetchRepos(username: string): Promise<Repo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.mercy-preview+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    console.error("GitHub Error:", await res.text());
    throw new Error("Failed to fetch repos");
  }

  const data = await res.json();

  return data
    .filter((repo: any) => !repo.fork)
    .map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      pushed_at: repo.pushed_at,
    }));
}

export async function getAllRepos() {
  const [professional, learning] = await Promise.all([
    fetchRepos("ChetanGadhiya017"),
    fetchRepos("ChetanGadhiya5062"),
  ]);

  const all = [...professional, ...learning];

  return all.sort(
    (a, b) =>
      new Date(b.pushed_at).getTime() -
      new Date(a.pushed_at).getTime()
  );
}