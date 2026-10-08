# Portfolio v2 — Build Plan (for Claude Code)

> This file is the single source of truth for the v2 rebuild. Read it fully before doing anything.
> Owner: Chetan Gadhiya · Repo: `chetangadhiya5062/chetan-portfolio` · Live: https://chetangadhiya.vercel.app

---

## 0. Working rules

- Work on a new branch **`v2`**. Never commit to or push `master`. Never force-push.
- Minimise interruptions: make reasonable decisions yourself and record them in `docs/DECISIONS.md`. Only stop to ask the owner for the items in **§9 (Owner actions)**.
- Never print, log, or commit secrets. `.env.local` is git-ignored — keep it that way.
- Commit in small logical steps with clear messages (e.g. `feat(activity): leetcode calendar source`).
- After every major phase: `npm run lint` and `npm run build` must pass before moving on.
- Windows checkout: if `git status` shows every file modified with no real diff, it's CRLF noise — run `git config core.autocrlf true` and add a `.gitattributes` with `* text=auto eol=lf`. Do not commit line-ending-only churn mixed with real changes.
- Keep the existing stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, framer-motion, Supabase, Vercel. Add libraries only when they earn their place.

---

## 1. Goal

Rebuild the portfolio into an award-level (Awwwards / Webby calibre), **dark-mode** site for an **AI Engineer / ML Engineer / Generative AI Engineer** — and make it **self-updating**: GitHub, LeetCode and Medium flow in automatically; LinkedIn and X posts plus the resume are updated from a private `/admin` page in seconds, no code or redeploy.

Success = a recruiter lands, understands "production-grade GenAI / agentic systems engineer" in 5 seconds, sees proof (code, certificates, live activity), and remembers the site.

---

## 2. Content (source of truth — from resume dated 21-09-2026 + LinkedIn export)

**Identity**
- Name: Chetan Gadhiya
- Headline: AI Engineer — GenAI & Agentic Systems · LLMs · RAG · Multi-Agent
- Location: Gandhinagar, Gujarat, India
- Status: Final-year B.Tech CSE, Pandit Deendayal Energy University (PDEU), Jul 2023 – May 2027, CGPA 8.71/10. Open to AI Engineer / ML Engineer / GenAI Engineer roles.
- Public email: **chetan.certi.001@gmail.com** (use `mailto:` — the current site's email button is broken because `mailto:` is missing). **Do not show the phone number.**
- Links: GitHub https://github.com/chetangadhiya5062 · LinkedIn https://www.linkedin.com/in/chetan-gadhiya-4923a6284 · LeetCode https://leetcode.com/u/chetangadhiya4939/ · Medium https://medium.com/@ChetanGadhiy017 · X https://x.com/chetan_gadhiya7
- Languages: Gujarati (native), Hindi (full professional), English (professional working)

**About (adapt; keep the voice — confident, concrete, no buzzword soup)**
> I engineer AI systems designed to run in production, not just perform well in a demo. At HNNOIX's NeuroFlow AI — a production-grade AI Operating Platform supporting autonomous agents, RAG and knowledge graphs at enterprise scale — I built core infrastructure: a provider-agnostic LLM Gateway, RAG Runtime, AI Memory Layer and modular agent-execution runtimes, following Clean Architecture and SOLID with structured observability, automated testing and containerized deployment. Before that, as a freelance GenAI engineer, I built two AI systems for automated fact verification and knowledge-grounded QA. On the side I build things I'm curious about — an RL agent that teaches itself to clean data, and an autonomous email agent on a Kafka/Spark pipeline. I'm looking for roles where I can keep building systems that hold up outside a notebook.

**Experience**
1. **Research & Innovation Intern — HNNOIX India Pvt. Ltd. (NeuroFlow AI)**, Gurugram · May 2026 – Jul 2026 · repo: https://github.com/chetangadhiya5062/NeuroFlow-AI
   - Contributed to NeuroFlow AI, a production-grade AI Operating Platform for autonomous agents, RAG, knowledge graphs, workflow orchestration and enterprise AI apps.
   - Engineered reusable AI infrastructure: provider-agnostic LLM Gateway, RAG Runtime, AI Memory Layer, Knowledge Base, modular runtimes for agent execution, prompt orchestration and retrieval.
   - Clean Architecture, SOLID, interface-first design, structured observability, automated testing, CI, containerized deployment.
2. **Freelance Generative AI Engineer — Independent** · Dec 2024 – Jun 2025
   - Built 2 AI systems (multi-agent + RAG) for automated fact verification and knowledge-grounded QA.
   - CrewAI multi-agent pipeline (Gemini, SerperDev, Pydantic, FastAPI): claim extraction, web research, structured verdicts, confidence scoring, citations.
   - **Cut inference overhead 15%** via conditional processing and workflow optimisation.
   - RAG pipeline on **AWS Bedrock**: embedding retrieval, semantic search, prompt engineering.
3. **AI-ML Committee Member — Encode PDEU** · Sep 2024 – Apr 2026 — AI/ML projects, workshops, hackathons, peer learning.
4. **Python Development Intern — Cognifyz Technologies** · Dec 2024 – Jan 2025 · repo: https://github.com/chetangadhiya5062/Cognifyz_Internship — automation, data-processing, validation utilities, scraping tools.

**Featured projects (in this order)**
1. **OpenEnv — Data-Cleaning RL Agent** · https://github.com/chetangadhiya5062/open-env-nuclei
   Custom RL environment where a Llama 3 agent autonomously cleans tabular data. Reward shaping (+2 missing-value reduction, +3 dedup, +5 completion, anti-loop penalties), Pydantic schemas, structured-JSON LLM pipeline with fallbacks, FastAPI REST/WebSocket server, multi-stage Docker on HuggingFace Spaces.
2. **AetherMail — Autonomous AI Email Agent** · https://github.com/chetangadhiya5062/autonomous_mail
   Stateful LangGraph workflow (Gemini 2.5 Flash) with 6 tools; RAG with Ollama embeddings + Qdrant; Kafka → Spark → HDFS/PostgreSQL/Qdrant pipeline, 768-dim embeddings, encrypted storage.
3. **NeuroFlow AI — AI Operating Platform** (HNNOIX) · https://github.com/chetangadhiya5062/NeuroFlow-AI
   LLM Gateway, RAG Runtime, Memory Layer, agent runtimes. (Read the repo README to describe it accurately.)
4. **Truth AI — Misinformation / Fact-Verification System** · https://github.com/chetangadhiya5062/misinformation_ai
   CrewAI multi-agent fact-checking (GenAI Exchange Hackathon, team "AI Gyani").

**More work** — auto-pulled from GitHub (see §5). Hide by default: forks, `Jay_Swaminarayan`, `chetangadhiya5062` (profile README), `*-submission`, tiny scripts (`*.py` toy repos), `youtube_video-audio_downloader_Claude`. Keep this in a config list `src/config/github.ts` so it's easy to edit. `airbnb_clone` and `Placement-Tracker` appear in "More work" (not featured).

**Skills (group visually; don't render as a boring tag cloud)**
- AI/ML: Machine Learning, Deep Learning, Reinforcement Learning, NLP, LLMs, RAG
- GenAI & Agentic: Multi-Agent Systems, AI Agents, CrewAI, LangGraph, Gemini, Llama 3, AWS Bedrock, OpenRouter
- AI Engineering: Prompt Engineering, Pydantic, FastAPI, Vector DBs (Qdrant), REST, WebSockets
- Data & Distributed: Kafka, Spark, PostgreSQL, MongoDB, MySQL
- Programming & Tools: Python, SQL, Docker, Git/GitHub
- Core CS: DSA, problem solving (LeetCode — live stats)

**Achievements & leadership** (reuse existing proof files in `public/certificates`, `public/images`, `public/achievements` — read the current `Achievements.tsx` / `Certifications.tsx` and carry every proof link over)
- IEEE AIMV 2025 (PDEU): Lead Student Volunteer — 160+ papers, 35-member team, presented two papers on behalf of authors.
- Code4Cause 2.0 (NSUT): selected among 1200+ teams.
- Smart India Hackathon: Top 25 internal rounds, 2024 & 2025.
- GenAI Exchange Hackathon; HACKOUT'24 (DA-IICT); SVNIT Hackathon 2024; Tic Tech Toe 2024; DevFest Gandhinagar'24.
- Naukri Campus AINCAT — certificate exists in `public/certificates`.

**Certifications**: Oracle Cloud Infrastructure Certified Foundations Associate (no PDF in repo yet — show without proof link, add a `TODO` in DECISIONS.md) · AWS Generative AI Developer Learning Plan · Deep Learning — NPTEL (IIT Ropar, 73%) · AI/ML for Geodata Analysis — ISRO-IIRS.

**Assets**
- New profile photo: `public/profile-v2.png` (400×400; display ≤ 320px or treat stylistically — duotone/halftone/shader — so low resolution isn't visible).
- Latest resume: `public/resume.pdf` (already replaced with the 21-09-2026 version) — used as fallback only; see §6.

---

## 3. Design direction — "Forward Pass"

Concept: the site is a **neural network's forward pass**. Scrolling = data flowing through the model. It's on-brand for an AI engineer and not a template.

| Section | Layer metaphor | Notes |
|---|---|---|
| Hero | **Input** | Name assembled from a live particle/point field (WebGL) that reacts to cursor; tokens of the headline "stream" in like LLM output with a blinking caret. One line + 2 CTAs (View work · Resume). Live status pill: "Currently: building… / last commit 3h ago" from GitHub. |
| About | **Embedding** | Short bio; key numbers as "vectors" (CGPA 8.71, 15% inference cut, 160+ papers, 1200+ teams, LeetCode solved — live). |
| Experience | **Hidden layers** | Vertical timeline; each role a layer; connections drawn between roles and the skills they used. |
| Projects | **Attention** | Featured projects as large cards; hovering a project lights up "attention lines" to the skills it uses. Each card: problem → approach → stack → proof (GitHub, demo, metrics). Case-study modal or `/projects/[slug]` page. |
| Live activity | **Training loop** | Unified heatmap (GitHub + LeetCode + Medium + manual posts), loss-curve-style monthly chart, "recent activity" feed, LeetCode stats. Updates automatically. |
| Writing & posts | **Output logits** | Medium articles (auto) + LinkedIn/X posts (from /admin) as a mixed feed. |
| Achievements & certs | **Evaluation** | Benchmark-table look; every item links to proof. |
| Contact | **Inference** | A terminal-style prompt `> ask chetan…` that opens a mailto with the typed message, plus social links. Optional "Ask my portfolio" AI chat (see §7). |

**Signature interactions (pick quality over quantity)**
- ⌘K / Ctrl+K command palette: jump to sections, open resume, copy email, toggle reduced motion.
- Smooth scroll (Lenis) with section progress shown as a thin "layer depth" indicator.
- Custom cursor only on desktop, disabled on touch.
- Subtle grain/noise overlay, glass panels used sparingly.

**Visual system**
- Dark only. Base `#07080b`, surface `#0e1117`, border `#1c2230`, text `#e8ecf3`, muted `#8b93a7`.
- Single accent with a secondary: electric lime `#c6ff3d` (primary) + cyan `#3de0ff` (data/links). No rainbow gradients.
- Type: a display grotesk (e.g. "Space Grotesk" or "Clash Display"-like via `next/font`), body "Inter", mono "JetBrains Mono" for data/labels.
- Generous whitespace, large type scale, 12-col grid, max width ~1200px.

**Non-negotiables**
- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO (mobile). WebGL must lazy-load and fall back to a static SVG/canvas on low-power devices or `prefers-reduced-motion`.
- Fully responsive (360px → 1920px). Keyboard navigable, visible focus, alt text, colour contrast AA.
- SEO: metadata, Open Graph image (generate with `next/og`), `sitemap.ts`, `robots.ts`, JSON-LD `Person` schema.
- Keep `@vercel/analytics`; add `@vercel/speed-insights`.

---

## 4. Architecture

```
src/
  app/
    page.tsx                 // composes sections (server components where possible)
    projects/[slug]/page.tsx // case studies (content from src/content/projects.ts)
    resume/route.ts          // 302 → latest resume (see §6)
    admin/…                  // private admin (see §6)
    api/sync/all/route.ts    // cron entry, protected by CRON_SECRET
    api/…                    // others as needed
    sitemap.ts, robots.ts, opengraph-image.tsx
  components/sections/…      // Hero, About, Experience, Projects, Activity, Writing, Achievements, Contact
  components/ui/…            // primitives
  content/                   // typed static content (profile.ts, experience.ts, projects.ts, achievements.ts)
  lib/sources/               // github.ts, leetcode.ts, medium.ts (one file per source, typed)
  lib/supabase*.ts
  config/github.ts           // featured + hidden repo lists
supabase/migrations/*.sql
docs/DECISIONS.md
```

- All hand-written content lives in `src/content/*` — never hard-coded inside components.
- Data fetching on the server with `fetch(..., { next: { revalidate: 21600 } })` (6h ISR) so the site stays fresh even between cron runs, and never breaks if a source is down (graceful fallbacks + cached last-good data from Supabase).

---

## 5. Automatic sources

| Source | How | Notes |
|---|---|---|
| **GitHub** | GraphQL API with existing `GITHUB_TOKEN`: `contributionsCollection` (365-day calendar), pinned repos, recent repos/commits; REST for repo metadata (stars, language, pushed_at, topics). | Featured list from `src/config/github.ts`; "More work" = all public non-hidden repos sorted by `pushed_at`. |
| **LeetCode** | Public GraphQL `https://leetcode.com/graphql`: `matchedUser { submitStatsGlobal, userCalendar(submissionCalendar, streak, totalActiveDays) }`, `userContestRanking`, `recentAcSubmissionList`. Username `chetangadhiya4939`. | Send a normal `Referer`/`User-Agent`; cache aggressively. |
| **Medium** | RSS `https://medium.com/feed/@ChetanGadhiy017` parsed with existing `fast-xml-parser`. | Title, date, link, thumbnail, reading time estimate. |
| **LinkedIn posts** | **No API exists for personal profiles — do NOT scrape.** Added via `/admin` (§6). Render with LinkedIn's official embed iframe built from the post URN in the URL (`https://www.linkedin.com/embed/feed/update/urn:li:share:<id>` or `urn:li:activity:<id>`), with a styled fallback card. | |
| **X posts** | **Free path only (no paid API).** Added via `/admin`; on save, fetch the free oEmbed endpoint `https://publish.twitter.com/oembed?url=<post>` to store text/author/date; render as a custom-styled card (not the heavy widget). | |

- Replace the existing fake `api/sync/linkedin` route (it only inserted a dummy row) — delete it.
- Consolidate `api/sync/*` into `api/sync/all` that refreshes GitHub + LeetCode + Medium into Supabase `activity_logs` (keep table, migrate if needed) and `source_cache` (last-good JSON per source).
- `vercel.json`: one daily cron → `/api/sync/all` (Vercel Hobby allows daily crons). Protect with `Authorization: Bearer ${CRON_SECRET}` (Vercel sends this automatically when `CRON_SECRET` is set).

---

## 6. Admin & resume (the "update once, everything updates" part)

**`/admin`** — private page, `noindex`.
- Auth: single password from env `ADMIN_PASSWORD`; on success set an httpOnly, signed (HMAC with `ADMIN_SESSION_SECRET`), 7-day cookie. Rate-limit login attempts. All mutations go through server actions / route handlers that verify the cookie and use the Supabase **service-role** key server-side only.
- Features:
  1. **Add post** — paste a LinkedIn or X URL (+ optional note/date) → auto-detect platform → enrich (oEmbed for X, URN parse for LinkedIn) → save to `social_posts`. List, reorder/pin, hide, delete.
  2. **Upload resume** — upload a PDF → Supabase Storage bucket `resume` (public read) as `resume-<timestamp>.pdf` → record in `resume_versions` (url, uploaded_at, is_current). Show history; one-click "make current".
  3. **Quick status** — edit the hero "Currently:" line and an "open to work" toggle (`site_settings` table).
- Every save calls `revalidatePath('/')` so the live site updates within seconds.

**`/resume`** — route handler that 302-redirects to the current resume from `resume_versions`; falls back to env `RESUME_URL` (optional, e.g. a Google Drive link) and finally `/resume.pdf`.
→ The owner will put **`https://chetangadhiya.vercel.app/resume`** in LinkedIn Featured. From then on: upload in `/admin` once → portfolio + LinkedIn link both serve the new resume. Add the "Last updated <date>" label next to the resume button.

**Supabase migrations** (`supabase/migrations/0002_v2.sql`): `social_posts`, `resume_versions`, `site_settings`, `source_cache`, storage bucket `resume`; enable RLS — public `select` on read tables, no public writes (writes only via service role). Print clear instructions for the owner to run it in the Supabase SQL editor (§9).

---

## 7. Optional: "Ask my portfolio" AI chat

Only build after everything above is done and passing. Small floating chat that answers questions about Chetan using his content (`src/content/*` + resume text) as context. Use Gemini (`GEMINI_API_KEY`, free tier) via a server route with streaming; rate-limit by IP; system prompt restricts it to portfolio topics. **If `GEMINI_API_KEY` is not set, hide the feature entirely** — never break the build.

---

## 8. Phases & acceptance checklist

1. **Setup** — branch `v2`, line-endings fix, `docs/DECISIONS.md`, `.env.example` listing every env var (no values).
2. **Content layer** — `src/content/*` filled from §2; carry over all proof links from current components.
3. **Data layer** — `lib/sources/*`, `api/sync/all`, migration SQL, cron, fallbacks. Remove fake LinkedIn sync.
4. **Design system + sections** — §3. Mobile first.
5. **Admin + resume** — §6.
6. **Polish** — SEO, OG image, a11y, reduced motion, 404 page, Lighthouse pass.
7. **Optional AI chat** — §7.
8. **Final verification** — `npm run build` clean; run locally and click through every section and link (no 404s, every `mailto:`/external link correct, every certificate opens); test `/admin` flows end-to-end; test `/resume` redirect; test with a source failing (no crash). Update `README.md` for v2 (keep the "proof over claims" spirit), including how the automation and admin work.

Then commit everything on `v2` and tell the owner exactly what to push and check (§9).

---

## 9. Owner actions (the ONLY things to ask Chetan for)

Ask for these at the point they're needed, in one message, with exact copy-paste steps:

1. **`.env.local`** in the project root with: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GITHUB_TOKEN` (copy from Vercel → Project → Settings → Environment Variables), plus new ones you generate for him: `ADMIN_PASSWORD` (he chooses), `ADMIN_SESSION_SECRET`, `CRON_SECRET` (generate random 32-byte hex and give him the values to paste). Optional: `GEMINI_API_KEY`.
2. **Run the migration SQL** in Supabase → SQL Editor (give him the file path; tell him to paste & Run).
3. **Add the new env vars to Vercel** (Production + Preview), same names/values as `.env.local`.
4. **Push**: `git push -u origin v2` → open the Vercel **preview URL** → review → if happy, merge `v2` into `master` (GitHub PR) → live site updates.
5. **LinkedIn**: set the Featured resume link to `https://chetangadhiya.vercel.app/resume`.

Everything else: decide, document in `docs/DECISIONS.md`, and keep going.
