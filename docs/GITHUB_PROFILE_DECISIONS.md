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

## Phase 2-3 - profile repo (`chetangadhiya5062/chetangadhiya5062`, branch `v2`)
- **Own generator, zero third-party widgets.** `scripts/build.mjs` + `scripts/lib/*` render every graphic as SVG. Text is converted to glyph outlines (Space Grotesk / JetBrains Mono, SIL OFL, committed under `scripts/fonts/` with licences) because GitHub renders SVG `<img>` without webfonts. Glyphs are defined once per file and reused with `<use>`; outlines are stored at quarter font-unit resolution with relative `h/v/l/q/c` commands. Result: 16 SVGs, 395 KB total (budget 400 KB).
- **Dark and light:** every graphic exists as `*-dark.svg` and `*-light.svg`, switched with `<picture>` + `prefers-color-scheme` (an SVG's own media query follows the OS, not GitHub's theme setting, so it cannot be used). Light palette: white base, lime `#4d7c0f`, cyan `#0e7490`. Checked in both themes in a README preview at GitHub's 888 px content width.
- **Hero:** the name is a mask of the real glyph outlines filled with a dot pattern (lime) plus a slow cyan shimmer layer, over a faint five-layer network with one highlighted "forward pass" path. Status pill and "open to work" come from the feed. CSS animation only (works in `<img>`), disabled under `prefers-reduced-motion`.
- **Stats:** unified 26-week heatmap uses the portfolio's exact colour scale (levels at 0/1-2/3-5/6-9/10+) and a class-based rect style to keep the file small; four numbers + LeetCode E/M/H bar.
- **Experience** is ordered chronologically (H1 = earliest). **Projects** each show one metric from the portfolio content: `+5 / +3 / +2` reward shaping, `768-d` embeddings (6 agent tools), `6 layers` (from the NeuroFlow README), `-15%` inference overhead.
- **Feed block:** newest 5 items, GitHub commits capped at 2 so articles and posts stay visible; tags are plain `type · date · title` (no icons).
- **Data flow:** `FEED_URL` (default the portfolio's `/api/public/feed`) -> if down, direct GitHub GraphQL + LeetCode + Medium RSS -> if everything fails, nothing is written and the script exits 0. Verified: feed down (direct sources used), fully offline (files byte-identical, exit 0), and idempotent re-runs ("no changes"). The footer carries only the date, so a commit happens only when data changes.
- **Workflow:** `.github/workflows/update.yml` (every 6 h at :17, `workflow_dispatch`, `repository_dispatch: portfolio-updated`), `contents: write`, commits only if README/assets changed, as `github-actions[bot]`. Optional `GH_PAT` secret is read but not required.
- `.gitattributes` pins LF in the profile repo so Windows checkouts never create line-ending churn in generated files.
- AetherMail and Truth AI now link to Chetan's own repos (`autonomous_mail`, `misinformation_ai`); the README credits teammates in a footnote. The "Face Attendance System" link to another account and the SpeechToText / AWS Bedrock Q&A cards were dropped from the featured grid (not in the plan's four).

## Phase 4 - repo hygiene (prepared, awaiting owner)
- `gh` is not installed on the owner's PC, so nothing could be applied yet. `data/hygiene.json` + `scripts/hygiene.mjs` hold the exact values and apply them with `gh`; **dry-run by default**, `--apply` to change, `--archive` additionally to archive.
- **`autonomous_mail` and `misinformation_ai` are forks** (GitHub flags them `fork: true`). Per the plan, forks get no README PRs; description, homepage and topics are still set (allowed on your own forks).
- **README header PRs skipped for the featured repos:** `open-env-nuclei` and `NeuroFlow-AI` already start with a clear title and summary (OpenEnv's README was clearly rewritten recently), so a banner would add noise and risk conflicting with the owner's own edits. `chetan-portfolio` has the v2 README.
- `NeuroFlow-AI`'s current description ("LLM-powered framework for intelligent RRC protocol analysis") does not match the code; replaced with one based on its README (six-layer modular monolith, LLM gateway, RAG runtime, agents, memory, workflows).
- **Social previews** (1280x640 PNG, 106-124 KB each) generated by `scripts/social.mjs` (headless Chrome rasterises the SVG): `assets/social/{open-env-nuclei,autonomous_mail,NeuroFlow-AI,misinformation_ai,chetan-portfolio}.png`. GitHub has no upload API, so the owner uploads them in each repo's Settings.
- **Content mismatch to resolve (owner):** the portfolio's About text says "an RL agent that teaches itself to clean data", but `open-env-nuclei`'s README says "Nothing here is trained - the LLM agent is prompting only". The profile and project cards say "environment" / "agent cleans" and avoid claiming training. Suggest changing the portfolio's wording to "an RL environment for data-cleaning agents" so recruiters who open the repo see the same story. Not changed without approval (owner-written copy).
- **Archive candidates (not archived):** `Hand_Cricket_Game.py`, `NumberGuessingGame.py`, `Jay_Swaminarayan`, `Text-To-Speech.py`, `TelegramPhotoesDownLoader`, `ImageEnhancer.py`, `open-env-nuclei-submission`, `youtube_video-audio_downloader_Claude` (all exist; checked).
