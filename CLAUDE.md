# CLAUDE.md

This repo is Chetan Gadhiya's portfolio (Next.js 16 + Tailwind 4 + Supabase, deployed on Vercel from `master`). v2 is live.

- Design system, content and past decisions: `docs/PORTFOLIO_V2_PLAN.md`, `docs/DECISIONS.md`.
- Current task: v3 Elite on branch `v3-elite`. Guide `docs/V3_ELITE_PLAN.md`, approved plan `docs/V3_ELITE_PHASES.md`, log in `docs/DECISIONS.md` ("v3 Elite"). One phase at a time; wait for the owner's "go" between phases.
- Commits and PRs carry no Claude co-author trailer or "generated with" line. The owner is the only author.
- Work on a feature branch from `master` and open a PR. Never push to `master` directly; never force-push.
- Never print or commit secrets. `.env.local` stays git-ignored.
- Record judgement calls in the relevant DECISIONS file instead of asking. Only ask the owner for items listed under "Owner actions" in the active plan.
- Before each commit of finished work: `npm run lint` and `npm run build` must pass. Commit after every working sub-step.
- Commands: `npm run dev` · `npm run build` · `npm run lint`
