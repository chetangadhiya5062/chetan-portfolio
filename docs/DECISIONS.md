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
