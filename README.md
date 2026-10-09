# Chetan Gadhiya — Portfolio v2

**Live:** https://chetangadhiya.vercel.app

This is not a resume website. It is a **production-grade engineering profile** for an AI / GenAI engineer, built around one idea: **a neural network's forward pass**. Scrolling is data flowing through the model, from *Input* to *Inference*.

> Proof over claims. Every achievement links to a certificate, a repository or a photo. Every number is either from the resume or pulled live.

---

## The concept: Forward Pass

| Section | Layer | What it is |
|---|---|---|
| Hero | **Input** | The name assembled from a WebGL particle field that reacts to the cursor; headline tokens stream in like LLM output |
| About | **Embedding** | Bio, key numbers as "vectors", the skill stack as layers |
| Experience | **Hidden layers** | Each role is a layer; hover to see the skills it activated |
| Projects | **Attention** | Four case studies; hover to draw attention lines to the skills they use |
| Live activity | **Training loop** | Unified heatmap (GitHub + LeetCode + Medium + posts), monthly curve, live feed |
| Writing & posts | **Output logits** | Medium articles (auto) mixed with LinkedIn / X posts (from `/admin`) |
| Achievements | **Evaluation** | Benchmark-style tables with proof links |
| Contact | **Inference** | A terminal prompt that opens a pre-filled email |

Also: `⌘K / Ctrl+K` command palette, smooth scroll, layer-depth rail, reduced-motion toggle, optional "Ask my portfolio" AI chat.

## Self-updating

| Source | How it updates |
|---|---|
| GitHub | GraphQL (contribution calendar, repos, commits). Featured and hidden repos are configured in `src/config/github.ts` |
| LeetCode | Public GraphQL (solved, streak, contest rating, calendar) |
| Medium | RSS |
| LinkedIn / X posts | Added by pasting a URL in `/admin` (no scraping, no paid API) |
| Resume | Upload a PDF in `/admin`; `/resume` always redirects to the latest |

- Pages are ISR (`revalidate` 6 h). A daily Vercel cron (`/api/sync/all`) refreshes every source into Supabase (`source_cache` = last-good copy, `activity_logs` = history). If a source is down the site serves the last good copy and never crashes.
- Every `/admin` save calls `revalidatePath('/')`, so the live site updates within seconds.

### Resume workflow

1. Put **`https://chetangadhiya.vercel.app/resume`** in LinkedIn → Featured, once.
2. When the resume changes: `/admin` → Resume → upload. The portfolio button, the footer date and the LinkedIn link all serve the new file.

### Admin (`/admin`)

Private, `noindex`. A single password (`ADMIN_PASSWORD`) sets an httpOnly, SameSite=Strict, HMAC-signed 7-day cookie (`ADMIN_SESSION_SECRET`). Login is rate limited. All writes are server actions that re-check the cookie and use the Supabase **service-role** key server-side only. From there you can: add / pin / hide / reorder / delete LinkedIn and X posts, upload and switch resumes, and edit the hero "Currently:" line and the "Open to work" toggle.

## Stack

Next.js 16 (App Router, React 19, Turbopack) · TypeScript · Tailwind 4 · Supabase · Vercel (Analytics, Speed Insights, Cron) · Lenis · raw WebGL (no three.js). Client JS is kept deliberately small: charts are server-rendered SVG, reveals are CSS, the particle field is lazy.

Measured on a local production build (mobile Lighthouse): **Performance 92 · Accessibility 100 · Best Practices 96 · SEO 100**.

## Project layout

```
src/
  app/                 page.tsx, projects/[slug], resume (302), admin, api/sync/all, api/chat, sitemap, robots, OG image
  components/sections/ Hero, About, Experience, Projects, Activity, Writing, Evaluation, Contact, Footer
  components/ui/       Reveal, AttentionGraph, CommandPalette, LayerRail, SmoothScroll, Chat…
  content/             all hand-written content (profile, experience, projects, skills, achievements)
  config/github.ts     featured + hidden repo lists
  lib/sources/         github.ts, leetcode.ts, medium.ts (+ cache fallback in index.ts)
supabase/migrations/   0002_v2.sql
docs/                  PORTFOLIO_V2_PLAN.md (spec) · DECISIONS.md (every judgement call)
```

To change copy, edit `src/content/*`. Nothing hand-written lives inside components.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```

The site builds and renders with **no** env vars (live panels show empty states); add them to light up each feature.

### Environment variables

| Name | Needed for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public reads (posts, resume, cache) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin writes and the cron sync (server only) |
| `GITHUB_TOKEN` | GitHub GraphQL |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | `/admin` (secret: 16+ random characters) |
| `CRON_SECRET` | Protects `/api/sync/all` (Vercel sends it automatically) |
| `RESUME_URL` *(optional)* | Fallback resume link |
| `GEMINI_API_KEY` *(optional)* | Enables the AI chat; unset = feature hidden. Must be present at build time |
| `NEXT_PUBLIC_SITE_URL` *(optional)* | Canonical / OG base URL |

### Database

Run `supabase/migrations/0002_v2.sql` once in Supabase → SQL Editor. It is idempotent and creates `social_posts`, `resume_versions`, `site_settings`, `source_cache`, upgrades `activity_logs`, enables row-level security (public read, writes only via the service role) and creates the public `resume` storage bucket.

## Deploy

Branch `v2` → push → Vercel preview URL → review → merge to `master` → production. Add the same env vars in Vercel (Production + Preview).

## Why every decision is written down

`docs/DECISIONS.md` logs each judgement call (what was cut, what was measured, what was deferred) so the reasoning survives the code.
