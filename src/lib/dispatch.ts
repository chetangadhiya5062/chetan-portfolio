/**
 * Tell the GitHub profile repo that the portfolio changed so its README refreshes within a minute.
 * Optional: does nothing unless GITHUB_DISPATCH_TOKEN is set (fine-grained PAT, contents:write on that one repo).
 * Never throws and never blocks a save.
 */
const REPO = process.env.GITHUB_PROFILE_REPO || "chetangadhiya5062/chetangadhiya5062";

export async function notifyProfileRepo(): Promise<void> {
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) return;
  try {
    await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event_type: "portfolio-updated" }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* best effort */
  }
}
