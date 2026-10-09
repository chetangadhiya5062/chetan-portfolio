# GitHub profile decisions

Judgement calls for `docs/GITHUB_PROFILE_PLAN.md`. Newest at the bottom.

## Environment
- `gh` (GitHub CLI) is **not installed** on the owner's PC (not just logged out). All code work uses plain `git` (push already authenticated via the owner's git credentials). Anything that needs `gh` (PRs, repo metadata, archive, profile settings) is batched into one owner message.
- Branches: portfolio `feat/public-feed` (from `master`, v2 already merged); profile repo `v2`.

## Phase 1 - public feed (portfolio)
- `GET /api/public/feed` is built by a pure function (`composeFeed`) from the same data the site renders: `getSource` (live, then `source_cache`), `site_settings` status and `social_posts` (RLS already hides hidden posts). Only public data: no email, no resume path (stable `/resume` URL), no tokens.
- `latest` merges Medium, LinkedIn, X and GitHub commits, newest first, max 12; titles are whitespace-normalised and capped at 140 chars.
- Public commits skip forks and hidden repos (new `HIDDEN_REPOS` entry `ChetanGadhiya017`, the secondary account's profile README repo). This also cleaned the site's own "Recent activity" feed.
- Headers: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`, `Access-Control-Allow-Origin: *`, `OPTIONS` -> 204. Errors return 503 with `no-store` so a bad response is never cached. `/api/` is already disallowed in robots.
- Optional instant refresh: `notifyProfileRepo()` sends `repository_dispatch` (`portfolio-updated`) after every admin save and cron sync, only when `GITHUB_DISPATCH_TOKEN` is set; never throws or blocks.
- Tests: no test framework in the repo, so `npm run test:feed` (`scripts/test-feed.mjs`) is an integration test against a running server (12 checks: shape, headers, CORS, 365 gap-free days, ordering, featured, no sensitive text). All pass on a production build with real data.
