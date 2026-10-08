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
