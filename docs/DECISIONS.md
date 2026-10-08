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
