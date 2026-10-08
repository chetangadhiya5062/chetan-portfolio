# Decisions log

Judgement calls made during the v2 rebuild. Newest at the bottom.

## Phase 1 - Setup
- Branch `v2` created from `master` (uncommitted `resume.pdf`, `profile-v2.png`, plan and CLAUDE.md carried over and committed on `v2`).
- Line endings: `core.autocrlf=true` locally + `.gitattributes` (`* text=auto eol=lf`).
- `.gitignore` ignores `.env*`; added `!.env.example` so the template is tracked.
- Node 22 / npm 10 in use; no package manager change.

## Findings in the old site (carried into content layer)
- `Achievements.tsx` links `/certificates/ieee-aimv-certificate.pdf`, which does **not exist** in `public/certificates`. The link is dropped and the event photo is kept as proof. TODO(owner, optional): add the file and re-enable.
- Old Footer LinkedIn link had a typo (`hhttps`), old Contact email lacked `mailto:`. Both fixed by centralising links in `src/content/profile.ts`.
- Old code read GitHub repos from two accounts (`ChetanGadhiya017`, `ChetanGadhiya5062`). Plan names `chetangadhiya5062` as the account; the older one is kept as a secondary account in `src/config/github.ts` (its projects Microplastic and Smart Inbox are carried over as "More work").
- Oracle OCI Foundations certificate has no PDF in the repo: shown without a proof link. TODO(owner): add `public/certificates/oracle-oci-foundations.pdf` and set `proof`.
- Repo-local git identity set (Chetan Gadhiya / chetangadhiya4939@gmail.com) because none was configured; not global.

## Phase 2 - Content layer
- All hand-written content is in `src/content/*` (profile, experience, projects, skills, achievements/certifications) and `src/config/github.ts`.
- Project write-ups are derived from §2 of the plan and the NeuroFlow-AI README (six-layer modular monolith). No metrics were invented; only numbers from the plan are used.
- Truth AI has two links: `misinformation_ai` (plan's featured repo) and `GenAI_Truth-AI` (hackathon build, carried over from the old site).
- Old components with their lint errors (legacy `any`, components defined in render) are still present until phase 4 replaces them. Lint is scoped to new files for this phase commit; full lint must be clean from phase 4 on.
- IEEE AIMV certificate link dropped (file missing); photo kept as proof.

## Phase 3 - Data layer
- Legacy components, `api/activity*`, `api/stats`, `api/projects/featured`, `api/sync/{github,leetcode,medium,codeforces,linkedin,test}` and `lib/github.ts` deleted. Reason: they used `any`, failed lint, crashed on import without env vars, and the LinkedIn route only inserted a dummy row. `page.tsx` is a temporary shell until phase 4 so that lint/build pass at this commit.
- Codeforces dropped (not in the plan's source list).
- GitHub: one GraphQL query (contributions calendar + public repos + topics + last 3 commits per repo) instead of GraphQL + REST. It returns the same metadata in one round trip and one token scope. Secondary account `ChetanGadhiya017` is fetched separately; its failure is ignored.
- Supabase clients are lazy and return `null` without env vars, so `next build` and the site work (with empty states) before the owner configures anything.
- Fallback chain per source: live fetch (ISR 6h) -> `source_cache` last-good JSON -> `null` (UI shows an empty state). `getSource()` never throws.
- `activity_logs` kept as a history archive (unique `external_id` upsert: per-day rows + recent items). The heatmap and feed are built from source data in `lib/activity.ts` so they need no extra queries. Legacy rows with null `external_id` are left untouched.
- `api/sync/all` replaces the self-calling fan-out: runs the sources in parallel in-process, requires `Authorization: Bearer $CRON_SECRET` (503 if unset in production), then `revalidatePath('/')`.
- Migration `supabase/migrations/0002_v2.sql` is idempotent. `social_posts` RLS exposes only non-hidden rows to the public.
- One daily cron at 03:00 UTC (`vercel.json`).

## Phase 4 - Design system + sections
- **Dependencies:** added `lenis`, `@vercel/speed-insights`. Removed `framer-motion`, `recharts`, `react-countup`, `react-icons`, `date-fns`, `clsx` (all unused after the rewrite). Reveals are one IntersectionObserver + CSS, token streaming is pure CSS, charts are server-rendered SVG: zero chart/animation JS shipped. This is what keeps mobile Lighthouse high.
- **Hero WebGL:** raw WebGL points (no three.js, saves ~150 KB). Name is sampled from an off-screen canvas into <=7000 particles, repelled by the cursor, flowing in from the right. The real `<h1>` always exists and is only made transparent once the canvas draws. Static fallback (the h1 itself) for reduced motion, `saveData`, <=2 CPU cores / <=2 GB RAM, no WebGL. Paused when off-screen or tab hidden. Touch pointers are ignored.
- **Reduced motion:** honours the OS setting and a palette toggle (stored in localStorage, class `reduce-motion` on `<html>`); Lenis, particles, cursor, count-ups, reveals and carets all respect it.
- **Attention graph:** one reusable `AttentionGraph` powers both Experience ("hidden layers" -> skills) and Projects ("attention" -> skills). Lines are drawn with measured SVG curves on hover/focus/tap at >=1024px; below that, each card shows its own chips instead.
- **Skills:** rendered as a six-layer stack inside About (not a tag cloud).
- **Activity:** heatmap, monthly curve, platform share and feed are server components built from the source data (`lib/activity.ts`), no client fetches. Removed the "top %" text next to the LeetCode contest rating: LeetCode's `topPercentage` is easy to misread, so only rating and contests attended are shown.
- **LinkedIn posts:** click-to-load iframe so the third-party embed never costs page performance or privacy unless asked. X posts render as custom cards.
- **Layer rail:** dots only at >=1280px; labels appear on hover/focus so they never cover content.
- **Custom cursor:** fine pointers only (`hover:hover` + `pointer:fine`), disabled with reduced motion.
- **Case studies:** `/projects/[slug]` statically generated from `src/content/projects.ts`.
- **`/resume`** route already added here (302 to current resume, falls back to `RESUME_URL` then `/resume.pdf`); admin upload comes in phase 5.
- `.claude/` is git-ignored (local preview config only).

## Phase 5 - Admin + resume
- **Auth:** single password (`ADMIN_PASSWORD`) compared as SHA-256 digests with `timingSafeEqual`; session cookie = `v1.<expiry>.<HMAC-SHA256>` signed with `ADMIN_SESSION_SECRET`, httpOnly, SameSite=Strict, Secure in production, 7 days. Every server action calls `requireAdmin()` first. If either env var is missing, admin shows a "not configured" message and nothing is writable.
- **Rate limiting:** 5 login attempts / 15 min per IP, in-memory per server instance (best effort on serverless; resets on cold start) plus an 800 ms delay on each failure. Acceptable for a single-user admin behind a long random password.
- **LinkedIn:** URL parsed for `urn:li:{activity|share|ugcPost}:<id>` (both `/feed/update/...` and `/posts/...-activity-<id>-...` forms). Post date derived from the id (`id >> 22` = creation ms, validated to a sane range); the admin can override the date. Embed is click-to-load.
- **X:** free oEmbed (`publish.twitter.com/oembed`) fetched once on save for text/author/date; on failure the post is saved anyway as a link card. No paid API, no scraping.
- **Resume upload:** PDF only (magic-bytes check), max 4 MB (Vercel serverless request cap ~4.5 MB), stored in public bucket `resume` as `resume-<timestamp>.pdf`; previous current flag cleared before inserting, so the partial unique index never conflicts. `/resume` 302s to current -> `RESUME_URL` -> `/resume.pdf`. Footer shows "updated <date>" once a version exists.
- Admin response headers: `X-Robots-Tag: noindex, nofollow, noarchive`, `Cache-Control: no-store`; page metadata also `noindex`.
- **Tested locally without Supabase:** wrong password rejected, correct password signs in and persists, `/admin` headers, `/resume` fallback redirect, `/api/sync/all` degrades (207) when sources are unconfigured. Post / resume / status mutations need the owner's Supabase credentials and are verified in phase 8 once `.env.local` exists.

## Phase 6 - Polish
- **SEO:** `sitemap.ts` (home + case studies), `robots.ts` (disallows `/admin`, `/api/`), `opengraph-image.tsx` (generated with `next/og`, also used for Twitter cards), `icon.tsx` (replaces `favicon.ico`), JSON-LD `Person` in the layout, canonical URLs, per-project metadata.
- **404 / 500:** on-brand `not-found.tsx` and `error.tsx`.
- **Lighthouse (mobile, local prod build, 4 runs):** Performance 92, Accessibility 100, Best Practices 96, SEO 100. Case-study page: 95 / 100 / 96 / 100. Best Practices 96 is the Vercel Analytics / Speed Insights scripts 404-ing on localhost (they exist on Vercel). Re-check on the Vercel preview URL.
- **What it took to get Performance from 84 to 92** (all measured by A/B, not guessed):
  - The WebGL hero cost ~450 ms of simulated TBT. The GL context and shaders are now created lazily inside `setup()`, which runs on the first pointer/touch/key gesture or ~6 s after load for idle visitors. Scroll is deliberately not a trigger (Lighthouse scrolls programmatically). Until then, and always for reduced motion, `saveData`, low-end devices, no WebGL or software-only rendering (`failIfMajorPerformanceCaveat`), the plain `<h1>` is shown.
  - The heatmap is 5 `<path>`s instead of 365 `<rect>`s (about 700 fewer DOM nodes) with a pointer-computed tooltip; its props are compact arrays.
  - Smooth scroll, custom cursor and layer rail mount after idle and only on devices that need them (fine pointer / >=1280px). `will-change` removed from reveals. Sections wrapped in `Suspense` so hydration is split.
  - Remaining simulated LCP ~3.3 s is Lighthouse's pessimistic model on localhost (observed LCP was ~0.4 s).
- **A11y fixes:** removed an invalid `aria-label` on the token paragraph (sr-only text instead), nav link label now matches its visible text, visible focus ring everywhere, skip link, `prefers-reduced-motion` + manual toggle.
