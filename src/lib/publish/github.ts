/** Optional: keep the GitHub profile bio in step with the site. Needs GITHUB_USER_TOKEN (fine-grained, profile write). */
export const githubProfileConfigured = () => !!process.env.GITHUB_USER_TOKEN;

export async function updateGithubBio(bio: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.GITHUB_USER_TOKEN;
  if (!token) return { ok: false, error: "GITHUB_USER_TOKEN is not set." };
  try {
    const res = await fetch("https://api.github.com/user", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      body: JSON.stringify({ bio: bio.slice(0, 160) }),
      signal: AbortSignal.timeout(10000),
    });
    return res.ok ? { ok: true } : { ok: false, error: `GitHub said ${res.status}` };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
