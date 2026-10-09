# CLAUDE.md

This repo is Chetan Gadhiya's portfolio (Next.js 16 + Tailwind 4 + Supabase, deployed on Vercel).

- The v2 rebuild spec is in `docs/PORTFOLIO_V2_PLAN.md` — follow it exactly; it overrides older notes in README.md.
- Work only on branch `v2`. Never commit to or push `master`; never force-push.
- Never print or commit secrets. `.env.local` stays git-ignored.
- Record every judgement call in `docs/DECISIONS.md` instead of asking. Only ask the owner for items in §9 of the plan.
- Before each commit of a finished phase: `npm run lint` and `npm run build` must pass.
- Commands: `npm run dev` · `npm run build` · `npm run lint`
