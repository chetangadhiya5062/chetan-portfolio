# Portfolio v3 "Elite": how to build it yourself with Claude Code (desktop)

Written 16 Oct 2026 for Chetan. This is a guide you follow on your own PC. Claude in this project did not change your code.

**Goal:** one site that keeps everything that already works on chetangadhiya.vercel.app, adds the best ideas from jaybutani.com, and still scores **100 / 100 / 100 / 100** in Lighthouse. It is built on a separate branch, `v3-elite`, so the current site stays live until you decide to switch, and you can switch back any time.

**Facts this guide is based on** (read from the repo copy in this project):
- Your production branch is **`master`** (not `main`). Vercel deploys `master` to chetangadhiya.vercel.app. See `CLAUDE.md` and `README.md`.
- Stack: Next.js 16, React 19, Tailwind 4, Supabase, Lenis. No Framer Motion or GSAP, and that is a big part of why the score is high (`docs/DECISIONS.md`, Phase 4).
- The WebGL dot-name hero is already deferred until the first mouse move or about 6 s after load, so Lighthouse never pays for it (`docs/DECISIONS.md`, Phase 6). v3 must keep that trick.

---

## Part 1. What v3 keeps, and where it lives in the code

These are the parts you said you love. The first prompt tells Claude Code to treat them as protected: restyle around them, never rewrite or remove them.

| Feature | File |
|---|---|
| Project/experience cards drawing live connector curves to the skills rail | `src/components/ui/AttentionGraph.tsx` (used by `sections/Experience.tsx` and `sections/Projects.tsx`) |
| "chetangadhiya" made of dots that react to the mouse (WebGL) | `src/components/sections/HeroName.tsx` |
| Custom cursor | `src/components/ui/Cursor.tsx` |
| Hover effects on Shipped / Ongoing project cards | `src/components/sections/Projects.tsx` + `src/app/globals.css` |
| The opening, the photo, the fonts (Space Grotesk, Inter, JetBrains Mono) | `sections/Hero.tsx`, `public/profile-v2.png`, `src/app/layout.tsx` |
| Ctrl+K command palette, layer-depth rail, smooth scroll | `ui/CommandPalette.tsx`, `ui/LayerRail.tsx`, `ui/SmoothScroll.tsx`, loaded late by `ui/Deferred.tsx` |
| Live data (GitHub, LeetCode, Medium), heatmap, /admin, resume upload, "Ask my portfolio" chat | `src/lib/sources/*`, `sections/Activity.tsx`, `sections/Heatmap.tsx`, `src/app/admin/*`, `ui/ChatWidget.tsx` |

## Part 2. What v3 adds from Jay Butani's site

From `reference/jaybutani-teardown.md` (in this project's files), adapted for an AI/ML engineer instead of a founder selling services:

1. **The ledger idea.** Every section gets a number (001 Input, 002 Embedding …, so your "Forward Pass" layers and Jay's numbering merge into one system). Every project gets a number, a status (Live / Shipped / In build) and a proof link or metric.
2. **Editorial headlines.** Big headings with one *italic serif accent word*. Add one serif (for example Instrument Serif, italic 400 only) via `next/font`; keep your three current fonts.
3. **A Proof section** with hard numbers that each link to the certificate or source: hackathons, ISRO, SIH 2024/2025, NPTEL, IEEE, LeetCode count (already live).
4. **A "How I work" section:** 01 Research, 02 Build, 03 Evaluate.
5. **A build ledger / changelog:** every project and release in one numbered list, "like a changelog of a person".
6. **Polish:** a short intro counter on first load, a live IST clock next to contact, and an optional light/dark toggle (hero stays dark in both).
7. **Hire-focused CTAs** instead of "book a call": Hire me, Download résumé, Email.

**Where v3 beats Jay:** Lighthouse 100 vs his 92, live data instead of static numbers, the attention-graph connectors and WebGL name he does not have, and a working "Ask my portfolio" AI chat, which is the right signal for GenAI roles.

## Part 3. One-time setup (about 10 minutes)

1. **Get the reference file onto your PC.** In this project's files, open `reference/jaybutani-teardown.md` and download it. Put it in your repo at `docs/reference/jaybutani-teardown.md`. Also download this guide and put it at `docs/V3_ELITE_PLAN.md`. Claude Code on your PC reads these.
2. **Open Claude desktop, go to the Code tab**, and choose the folder `D:\=Chetan\portfolio_update\chetan-portfolio`.
3. **Make sure you are up to date.** Ask Claude Code: *"Check git status, switch to master and pull the latest from origin."* If it shows uncommitted changes, ask it to commit or stash them first.
4. **Tag the current live version** so you can always get it back. Ask: *"Create a git tag `v2-final` on master and push the tag."*
5. **Create the branch.** Ask: *"Create branch `v3-elite` from master, switch to it, and push it to origin."*
6. **Check `.env.local` exists** in the folder (Supabase keys etc.). Without it the site builds but live data is empty. Never paste these keys into the chat.
7. **Permissions:** when Claude Code asks to run `npm`, `git` or `npx` commands, choose "Always allow" for this folder so it does not stop every few minutes. Do not allow `git push --force`.

## Part 4. The build, phase by phase

Work in **Plan mode first** (the mode toggle next to the prompt box). Paste the first prompt from Part 7. Claude Code will read the repo and the two docs and write a plan. Read it, fix anything you disagree with, then switch to normal (auto-accept edits) mode and say *"Go with phase 1."*

Do one phase at a time and check the site after each one. That keeps the score at 100, because if a phase drops it you know exactly what caused it.

| Phase | What happens | You check |
|---|---|---|
| 1 | Measure the baseline Lighthouse on master, then design tokens, the serif accent font, the 001/002 section numbering | `npm run dev`, look at localhost:3000 |
| 2 | Hero upgrade: intro counter, role tags, stats row, hire CTAs. HeroName, photo and cursor untouched | Mouse over the name still makes the dots move |
| 3 | Projects become a ledger (number, status, proof link). Connectors and hover effects untouched | Hover a project: curves still draw to the skills |
| 4 | New sections: Proof, How I work, Build ledger | Every number links to a real file or page |
| 5 | Contact upgrade: IST clock, hire CTAs. Optional light/dark toggle | No flash of the wrong theme on reload |
| 6 | Mobile pass (360px to 1920px), accessibility pass, Lighthouse to 100 on everything | Scores, see Part 5 |

After each phase Claude Code should run `npm run lint` and `npm run build`, commit, and push to `v3-elite`. Every push gives you a fresh Vercel preview link (Part 6).

Useful things to say along the way:
- *"Show me a screenshot of the hero at 390px wide."* (if it has a browser tool)
- *"Open jaybutani.com and confirm the fonts, colours and animations in the teardown that are marked inferred."* The teardown could not load his site from the cloud, so this is worth doing once on your PC.
- *"That broke X, undo the last commit."* Every phase is its own commit, so undoing is safe.

## Part 5. Keeping Lighthouse at 100

**How to test properly** (otherwise you get fake lower scores):
- Test the **Vercel preview URL**, not localhost. On localhost the analytics scripts 404 and Best Practices drops to 96 (this already happened in v2, see `docs/DECISIONS.md`).
- Use a **Chrome Incognito window** with no extensions, DevTools → Lighthouse → run **Mobile** and **Desktop**, all four categories. Run it 3 times and take the middle score.
- Compare against the baseline Claude measured on master in phase 1.

**Rules Claude Code must follow** (they are in the first prompt too):
- No new animation libraries (no Framer Motion, GSAP, Three.js). CSS transitions, IntersectionObserver and the existing code only.
- Every new interactive bit (clock, counter, theme toggle) loads after the page is interactive, the way `Deferred.tsx` does it. Server-render everything else.
- **The intro counter is the biggest risk.** A full-screen preloader that hides the page delays LCP and can drop Performance into the 80s. It must be CSS-only, under about 0.8 s, never hide the `<h1>`, play once per visit, and be skipped with reduced motion. If the score drops, cut it.
- The new serif font: one weight, italic only, Latin subset, `display: swap`. Fonts are the second most common score killer.
- Images through `next/image` with width and height set, so nothing jumps (CLS 0).
- The light/dark toggle needs a tiny inline script in `<head>` so there is no flash, and both themes must pass colour contrast (Accessibility 100).
- The live clock renders only on the client, so the server HTML never mismatches.

## Part 6. Two versions, switch whenever you want

**While you build:** Vercel automatically builds every branch you push. `master` stays live at chetangadhiya.vercel.app. `v3-elite` gets its own preview link, shown in Vercel → your project → Deployments (filter by branch), and also posted on the PR if one is open. You can send that link to friends for feedback.

Before the first push, go to Vercel → Settings → Environment Variables and make sure every variable is ticked for **Preview** as well as Production, otherwise the preview has no live data. Note: the preview uses the **same Supabase database** as the live site, so v3 must not run destructive migrations. Tell Claude Code to add new tables or columns only. The daily cron (`vercel.json`) only runs on production.

**Making v3 the live site (two ways, pick one):**

- **A. Switch the production branch (best for flipping back and forth).** Vercel → Settings → Git (called "Environments → Production" in some versions) → Production Branch → change `master` to `v3-elite` → save. Then go to Deployments, open the latest `v3-elite` deployment, and choose **Promote to Production** (or push any commit) so the switch takes effect. To go back: set it to `master` again and promote the latest `master` deployment. Your domain never changes.
- **B. Merge v3 into master (best once you are sure).** Ask Claude Code to open a PR from `v3-elite` to `master`, review it on GitHub, merge. To go back later, Vercel → Deployments → pick an old master deployment → **Instant Rollback**, or ask Claude Code to restore the `v2-final` tag.

**Fastest temporary switch:** in Vercel → Deployments, any successful deployment from either branch can be promoted to production with one click, and you can promote the other one back just as fast. Use this for interviews ("show v2 today").

Start with A while you are trying things, and do B when v3 is the version you want for good.

## Part 7. The first prompt (copy everything inside the box)

```
You are working in my Next.js portfolio repo (Chetan Gadhiya, AI / ML / GenAI Engineer).
Live site: https://chetangadhiya.vercel.app, deployed by Vercel from the `master` branch.

TASK: build "v3 Elite" on the branch `v3-elite` (already created from master). It combines my
current site with the best ideas from jaybutani.com and must still score 100 in all four
Lighthouse categories (Performance, Accessibility, Best Practices, SEO) on mobile and desktop.

READ FIRST, before planning:
- CLAUDE.md, README.md, docs/PORTFOLIO_V2_PLAN.md, docs/DECISIONS.md
- docs/V3_ELITE_PLAN.md (my guide for this upgrade; Parts 1, 2 and 5 are requirements)
- docs/reference/jaybutani-teardown.md (items marked "inferred" are unverified; if you have a
  browser or web fetch, open https://jaybutani.com and confirm them, and note what you found)
- src/app/page.tsx, src/app/layout.tsx, src/app/globals.css, and every file in
  src/components/sections and src/components/ui

PROTECTED, do not rewrite, remove or degrade these. Restyle around them only, and tell me
before touching their logic:
1. AttentionGraph.tsx: projects and experience drawing connector curves to the skills rail
2. HeroName.tsx: the WebGL dot-particle name that reacts to the mouse, including its lazy
   start (first gesture or ~6 s) and its fallbacks
3. Cursor.tsx: the custom cursor
4. The hover effects on Shipped / Ongoing project cards in Projects.tsx
5. The intro, profile photo (public/profile-v2.png) and fonts (Space Grotesk, Inter, JetBrains Mono)
6. Command palette, LayerRail, Lenis smooth scroll, live GitHub/LeetCode/Medium data, heatmap,
   /admin, resume upload and the "Ask my portfolio" chat

ADD (from the teardown, adapted to a hiring audience, not a founder selling services):
- Numbered sections 001, 002 … merged with my existing "Forward Pass" layer names
- Projects as a ledger: number, status (Live / Shipped / In build), proof link or metric
- Editorial headings with one italic serif accent word (one extra font: one weight, italic,
  latin subset, display swap)
- A Proof section: hard numbers that each link to a real file in public/ or a real URL.
  Never invent a number; if something is missing, list it and ask me.
- A "How I work" section: 01 Research, 02 Build, 03 Evaluate
- A Build ledger / changelog section
- Polish: short intro counter on first load, live IST clock near contact, optional light/dark
  toggle with no flash (hero stays dark)
- CTAs: Hire me, Download résumé, Email

PERFORMANCE RULES (Lighthouse 100 is a hard requirement):
- No new animation or 3D libraries (no framer-motion, gsap, three). CSS, IntersectionObserver,
  and existing code only. Ask me before adding any dependency.
- Server components by default. Any new client-only feature loads after the page is
  interactive, like src/components/ui/Deferred.tsx does.
- The intro counter must be CSS-only, under 0.8 s, play once per visit, never hide the h1,
  and be skipped for reduced motion. If it costs score, remove it and tell me.
- next/image with explicit sizes; CLS must stay 0. Both themes must pass WCAG AA contrast.
- Supabase is shared with the live site: additive migrations only, never drop or rename.

WORKING RULES:
- Stay on `v3-elite`. Never push to master, never force-push, never print or commit secrets.
- Phases (one at a time, wait for my "go" between phases):
  1. Measure a Lighthouse baseline of the current build (npx lighthouse or the
     @lhci/cli in npx, against `npm run build && npm run start`), then design tokens,
     serif font, section numbering
  2. Hero upgrade   3. Projects ledger   4. Proof, How I work, Build ledger
  5. Contact, clock, theme toggle   6. Mobile 360-1920px, accessibility, Lighthouse to 100
- After each phase: npm run lint and npm run build must pass, run Lighthouse again and show
  me the four scores next to the baseline, commit, push to origin v3-elite, and tell me what
  to look at on localhost or the Vercel preview.
- Record judgement calls in docs/DECISIONS.md under a new "v3 Elite" heading.

START NOW: read the files above, then give me a phase-by-phase plan that lists, for each
phase, the files you will create or change, what stays untouched, and the performance risk.
Do not write code until I approve the plan.
```

## Part 8. If something goes wrong

- **Score dropped after a phase:** *"Lighthouse Performance fell from 100 to X after phase N. Find the cause from the report and fix it without removing the protected features."*
- **A protected feature broke:** *"The connector curves / dot name / cursor stopped working. Compare with master and restore it."*
- **Claude Code lost track in a long session:** start a new chat in the same folder and say *"Read docs/V3_ELITE_PLAN.md and docs/DECISIONS.md (v3 Elite section), check git log on v3-elite, and continue from the next phase."*
- **You want the old site back right now:** Vercel → Deployments → latest `master` deployment → Promote to Production.
