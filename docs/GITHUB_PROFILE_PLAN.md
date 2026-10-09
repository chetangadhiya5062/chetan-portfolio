# GitHub Profile v2 — Build Plan (for Claude Code)

> Goal: make https://github.com/chetangadhiya5062 feel like the same product as the portfolio (https://chetangadhiya.vercel.app) — the **"Forward Pass"** identity — and make it **self-updating** from the same data. Read this whole file first. Also skim `docs/PORTFOLIO_V2_PLAN.md` and `docs/DECISIONS.md` in this repo for the design system and content.

---

## 0. Working rules

- Two repos are involved:
  1. **Portfolio** — this folder (`chetan-portfolio`). Work on a new branch **`feat/public-feed`** from `master`. Open a PR; never push to `master` directly.
  2. **Profile README repo** — `chetangadhiya5062/chetangadhiya5062`. Clone it next to this folder: `D:\=Chetan\portfolio_update\github-profile`. Work on branch **`v2`**, open a PR.
- Decide things yourself and log them in `docs/GITHUB_PROFILE_DECISIONS.md` (in the portfolio repo). Only ask the owner for items in **§8**.
- Commit after every working sub-step. Never commit secrets.
- Everything on GitHub must look good in **both** GitHub dark and light themes (owner prefers dark; visitors may not). Use `<picture>` with `prefers-color-scheme` sources for every custom image.
- **No generic third-party widgets** (capsule-render, readme-typing-svg, github-readme-stats, streak-stats, skill-icons walls, snake). They are on every profile — that's the opposite of distinctive. We generate our own SVGs.

---

## 1. Current state (audited)

- Profile README uses capsule-render banner, typing SVG, shields badge walls, emoji headings — generic.
- **Wrong links:** AetherMail and Misinformation AI link to `github.com/VedeshP/...` (teammate's originals) — link to Chetan's own repos (`chetangadhiya5062/autonomous_mail`, `chetangadhiya5062/misinformation_ai`) and credit the team in the text. "Face Attendance System" links to another account (`ChetanGadhiya017/...`) — drop it or move to an "earlier work" line.
- Profile name is `ChetanGadhiya5062` (should be **Chetan Gadhiya**); bio is weak; X not linked.
- Featured repos: weak/empty descriptions and topics (`autonomous_mail`, `misinformation_ai`, `NeuroFlow-AI` description says "RRC protocol analysis", portfolio repo topics are `beautiful, completed-project, nice`).

---

## 2. Single source of truth: public feed from the portfolio

Add to the portfolio a read-only, cached JSON endpoint so GitHub (and anything else later) reads the **same** data the site shows — including LinkedIn/X posts and the "Currently:" status set in `/admin`.

- `GET /api/public/feed` → `{ generatedAt, profile:{name, headline, status, openToWork, resumeUrl}, stats:{githubContributions365, leetcodeSolved, leetcodeEasy/Medium/Hard, leetcodeStreak, mediumPosts}, heatmap:[{date, github, leetcode, medium, posts}], latest:[{type: medium|linkedin|x|github, title, url, date}], featured:[{name, repo, oneLiner, stack[]}] }`
- Reuse existing `lib/sources/*`, `lib/activity.ts`, `src/content/*`, Supabase `site_settings` / `social_posts`. Only public data — no emails, no hidden posts, no secrets.
- `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`; CORS `GET` allowed for `*`. Graceful: if a source is down, return last-good data from `source_cache`.
- Exclude from `robots` (already `/api/` disallowed). Lint + build must pass. PR → owner merges.

---

## 3. Profile README design — "Forward Pass", GitHub edition

Structure (top → bottom), each a generated SVG or tight markdown:

1. **Hero banner SVG** (`assets/hero-dark.svg`, `assets/hero-light.svg`, 1200×300): name set in the portfolio's display type, built from a dot/particle grid (static points with a subtle CSS/SMIL shimmer — SVG in `<img>` supports CSS animations, no JS), eyebrow `01 · INPUT — the forward pass begins`, headline "AI Engineer — GenAI & agentic systems built to run in production." Status pill: `● currently: <status from feed>` and `open to work` when true. Colours: base `#07080b`, lime `#c6ff3d`, cyan `#3de0ff`, muted `#8b93a7` (light variant: white base, darker lime `#4d7c0f`, cyan `#0e7490`). Fonts: SVGs can't load webfonts on GitHub — convert the display text to **paths** at generation time (e.g. `opentype.js` with Space Grotesk / JetBrains Mono TTF committed under `scripts/fonts/` with OFL licence) so it renders identically everywhere.
2. **One-paragraph about** (plain markdown, no emoji soup) + one row of minimal text links: Portfolio · Resume (`/resume`) · LinkedIn · X · Medium · LeetCode · Email (`mailto:chetan.certi.001@gmail.com`).
3. **"Hidden layers" — experience strip SVG**: HNNOIX (NeuroFlow AI) May–Jul 2026 · Freelance GenAI Dec 2024–Jun 2025 · Encode PDEU · Cognifyz — drawn as connected layer nodes.
4. **"Attention" — featured projects**: 4 project cards as individual SVGs (`assets/projects/<slug>-{dark,light}.svg`, 2×2 grid via an HTML table with no borders) each linking to the repo: OpenEnv RL agent · AetherMail · NeuroFlow AI · Truth AI. Each card: name, one-liner, 3–4 stack chips, one metric (e.g. "−15% inference overhead", "768-d embeddings", "6 agent tools", "+5/+3/+2 reward shaping").
5. **"Training loop" — live stats SVG (auto)**: unified heatmap (last 26 weeks, GitHub+LeetCode+Medium+posts — same colour scale as the site), plus 4 numbers: contributions (365d), LeetCode solved (E/M/H bar), current streak, articles. This is the signature piece — nobody else's GitHub shows a cross-platform heatmap.
6. **"Output logits" — latest (auto)**: markdown list between `<!-- FEED:START -->` / `<!-- FEED:END -->` of the 5 newest items across Medium, LinkedIn, X, GitHub (icon-free, `type · date · title`).
7. **"Parameters" — skills**: the 6-layer stack (L1 AI/ML … L6 Core CS) as one compact SVG, not a badge wall.
8. **Footer line**: `built as a forward pass · auto-updated <date> · source → chetangadhiya.vercel.app`.

Keep the whole README scannable in ~2 screen heights. Every image has meaningful `alt` text. Total committed SVG weight < 400 KB.

---

## 4. Automation (profile repo)

- `scripts/build.mjs` (Node 20, no heavy deps; `opentype.js` + `fast-xml-parser` only if needed): fetch `https://chetangadhiya.vercel.app/api/public/feed` → render hero (status pill), stats/heatmap SVGs, update FEED block in `README.md`. Fallback: if the feed fails, call GitHub GraphQL / LeetCode / Medium RSS directly; if everything fails, **keep previous files and exit 0** (never commit a broken README).
- Static SVGs (experience, projects, skills) generated by the same script from a `data/static.json` so they're easy to edit.
- `.github/workflows/update.yml`: `schedule: cron '17 */6 * * *'` (every 6h), `workflow_dispatch`, and `repository_dispatch` (type `portfolio-updated`). Commit only if files changed, as `github-actions[bot]`, message `chore: refresh profile feed`. Permissions: `contents: write`. Uses default `GITHUB_TOKEN`; optional secret `GH_PAT` only if private-contribution counts are wanted.
- Optional, nice: in the portfolio, after any `/admin` save or `sync/all`, POST a `repository_dispatch` to the profile repo (needs a fine-grained PAT with `contents: write` on that one repo, env `GITHUB_DISPATCH_TOKEN`; skip silently if unset) → GitHub profile updates within a minute of an admin change.
- Validate locally: run the script, open SVGs in a browser, preview README rendering (e.g. `gh markdown-preview` extension or GitHub's preview in the PR).

---

## 5. Repo hygiene (via `gh` CLI once the owner is logged in)

For the featured repos and the portfolio:
- Accurate **descriptions** (≤ 120 chars, outcome-first), **homepage** (portfolio case-study URL `https://chetangadhiya.vercel.app/projects/<slug>` where one exists), **topics** (6–10 relevant, e.g. `llm`, `rag`, `multi-agent`, `langgraph`, `crewai`, `reinforcement-learning`, `fastapi`, `qdrant`, `kafka`).
  - `NeuroFlow-AI`: read its README and write a description that matches what the code actually is.
  - `chetan-portfolio`: replace topics `beautiful, completed-project, nice` with real ones (`nextjs`, `portfolio`, `webgl`, `supabase`, `vercel`, …), description e.g. "Self-updating 'Forward Pass' portfolio — Next.js, WebGL, live GitHub/LeetCode/Medium activity."
- **Social preview image** (1280×640) for each featured repo in the Forward Pass style → save to `github-profile/assets/social/` and list in §8 (GitHub has no API for uploading it — the owner uploads in repo Settings).
- **Featured repo READMEs**: if a README lacks a clear header, add a consistent top block only (banner SVG + one-liner + stack + "Part of chetangadhiya.vercel.app" link). Do not rewrite technical content. Open a PR per repo rather than pushing to their default branch. Skip repos that are forks or owned by teammates.
- **Clean-up candidates** (do NOT archive automatically): produce a list in DECISIONS of toy/old repos to archive (e.g. `Hand_Cricket_Game.py`, `NumberGuessingGame.py`, `Jay_Swaminarayan`, `Text-To-Speech.py`, `TelegramPhotoesDownLoader`, `ImageEnhancer.py`, `open-env-nuclei-submission`, `youtube_video-audio_downloader_Claude`) and ask the owner once (§8) before running `gh repo archive`.
- **Profile settings** via `gh api -X PATCH user`: `name="Chetan Gadhiya"`, `bio` (≤160 chars, e.g. "AI Engineer · GenAI & agentic systems built to run in production · LLMs · RAG · multi-agent · B.Tech CSE @ PDEU"), `twitter_username=chetan_gadhiya7`, `blog=https://chetangadhiya.vercel.app`, `location`, `hireable=true`. Show the owner the exact values before applying.

---

## 6. Phases & acceptance

1. Portfolio `feat/public-feed` → endpoint + tests + PR.
2. Clone profile repo, branch `v2`, scaffold `scripts/`, `data/`, `assets/`, workflow.
3. Generate all SVGs (dark + light), new README. Check rendering on GitHub in the PR (dark and light), on mobile width, and with the feed down.
4. Repo hygiene + profile settings (after §8 confirmation).
5. Final verification: workflow runs green via `workflow_dispatch`; README updates only when data changes; all links resolve (no 404); no secrets in history. Write a short summary + what the owner must click.

---

## 7. Content reference

Use `src/content/*` in the portfolio as the source for name, headline, experience, projects, skills and links — never retype from memory. Public email: `chetan.certi.001@gmail.com`. X: `@chetan_gadhiya7`. LeetCode: `chetangadhiya4939`. Medium: `@ChetanGadhiy017`. LinkedIn: `chetan-gadhiya-4923a6284`.

---

## 8. Owner actions (the ONLY things to ask Chetan for)

1. **`gh auth login`** on his PC (GitHub.com → HTTPS → login with browser) so you can clone, push branches, open PRs and edit repo metadata. Check with `gh auth status` first — maybe it's already done.
2. **Approve profile settings** (name/bio/X) and the **archive list** — one message with the exact values and list.
3. **Merge the PRs**: portfolio `feat/public-feed` first (Vercel deploys it), then profile `v2`.
4. In the profile repo → **Actions** tab → enable workflows if prompted → run "update" once.
5. **Pinned repos** (GitHub has no API): Profile → "Customize your pins" → pin: open-env-nuclei, autonomous_mail, NeuroFlow-AI, misinformation_ai, chetan-portfolio, + one more of his choice.
6. **Social preview images**: each featured repo → Settings → Social preview → upload the file you generated (give him exact file paths).
7. Optional: create the fine-grained PAT for instant updates (§4) and add it to Vercel as `GITHUB_DISPATCH_TOKEN`.
