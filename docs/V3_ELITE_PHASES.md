# v3 Elite: phase-by-phase plan

Branch `v3-elite`. The working plan for docs/V3_ELITE_PLAN.md, written 17 Oct 2026 and approved by the owner the same day. Progress and judgement calls are logged in docs/DECISIONS.md under "v3 Elite".

## Owner answers (17 Oct 2026, plan approved)

1. **Project card hover effects** (the four featured cards and the "More work" grid) are protected and must be in v3 too.
2. **Statuses:** OpenEnv is **Live** at https://huggingface.co/spaces/chetangadhiya017/data-cleaning-env; AetherMail, NeuroFlow AI and Truth AI are **Shipped**.
3. **Proof gaps:** link the résumé for now. Still open, to fix before v3 is finalised (the owner will send the documents): 15% inference cut, CGPA 8.71, IEEE AIMV certificate, Oracle OCI PDF, AWS Generative AI learning plan; confirm "Top 25" in the SIH PDFs and "1200+ teams" in the Code4Cause certificate.
4. **Accent:** keep lime + cyan.
5. **CLAUDE.md:** commit the pending edit.
6. **Commits:** no Claude co-author or "generated with" lines, ever. Commits are authored by the owner only.

Defaults I picked (all recorded in `docs/DECISIONS.md` under "v3 Elite"): serif = **Instrument Serif**, italic 400 only, latin, `display: swap`, `preload: false` (it is only used below the fold). No new npm dependencies and no Supabase migrations are needed in any phase. Lighthouse runs through `npx lighthouse` (nothing goes into package.json). I will not open a PR to `master` until you ask.

## Section map (001 numbering merged with Forward Pass)

Target after phase 4. Until the new sections exist, the live numbering is sequential (001–008); `src/lib/nav.ts` is the single source, so inserting a section renumbers every heading, the palette and the rail at once.

| No. | Layer | Section | Status |
|---|---|---|---|
| 001 | Input | Hero | upgraded (phase 2) |
| 002 | Embedding | About + skills | heading only |
| 003 | Hidden layers | Experience | heading only |
| 004 | Attention | Projects ledger (004.1, 004.2 …) | phase 3 |
| 005 | Optimizer | How I work: 01 Research, 02 Build, 03 Evaluate | new (phase 4) |
| 006 | Training loop | Live activity + heatmap | heading only |
| 007 | Output logits | Writing & posts | heading only |
| 008 | Validation | Proof: hard numbers, each one linked | new (phase 4) |
| 009 | Evaluation | Achievements & certifications table | heading only |
| 010 | Checkpoints | Build ledger / changelog | new (phase 4) |
| 011 | Inference | Contact + IST clock | phase 5 |

`src/lib/nav.ts` drives the command palette and the layer rail, so they pick up the new sections through data alone, with no change to their logic.

## Protected (applies to every phase)

Not edited at all: `HeroName.tsx`, `AttentionGraph.tsx`, `Cursor.tsx`, `CommandPalette.tsx`, `LayerRail.tsx`, `SmoothScroll.tsx`, `Deferred.tsx`, `ChatGate/ChatLoader/ChatWidget.tsx`, `Heatmap.tsx`, `src/lib/sources/*`, `src/app/admin/*`, `src/app/api/*`, resume upload and `/resume`, `public/profile-v2.png`, the three current fonts.

They will still pick up colour tokens (for example the cursor ring and connector curves follow the active theme), because they use CSS variables, not their own logic. If any phase turns out to need a logic change in one of them, I will stop and ask first.

---

## Phase 1: baseline, tokens, serif, numbering

**Measure first.** `npm run build && npm run start`, then `npx lighthouse` mobile and desktop, all four categories, 3 runs each, median kept. I will also run it against the live `chetangadhiya.vercel.app` as a second reference, because on localhost the Vercel Analytics scripts 404 and pull Best Practices to 96 (DECISIONS, v2 phase 6). Reports stay out of git; the score table goes in DECISIONS.

**Change**
- `src/app/layout.tsx`: add Instrument Serif via `next/font` (`--font-serif`). Render `<Analytics/>` and `<SpeedInsights/>` only when running on Vercel, so local Lighthouse is honest and production is unchanged.
- `src/app/globals.css`: move colours into CSS variables (same values, no visual change) so a light theme can override them in phase 5. Add `--font-serif` and one heading-accent style (`h2 em` = italic serif).
- `src/components/ui/SectionHead.tsx`: label becomes `001 — Embedding · context`; the title takes one `<em>` accent word.
- `src/lib/nav.ts`: numbers become 001–011 (new entries are added when their sections land).
- Section headings and numbers only in `About`, `Experience`, `Projects`, `Activity`, `Writing`, `Evaluation`, `Contact`, plus the hero label.
- Docs: move `docs/reference/V3_ELITE_PLAN.md` to `docs/V3_ELITE_PLAN.md` (the path your prompt uses), commit the teardown, add this plan, add the "v3 Elite" heading to DECISIONS, and commit the CLAUDE.md edit.

**Stays untouched:** every protected file, all layouts and spacing.
**Performance risk: low.** The serif is about 20 KB, fetched only when a heading needs it. The token refactor has no runtime cost. One font swap below the fold cannot cause CLS above it.

## Phase 2: hero upgrade

**Change**
- `src/components/sections/Hero.tsx`: label `001 — Gandhinagar, India`, role tags (AI Engineer · GenAI · Agentic systems · RAG), a stats row with real numbers only (4 featured projects, 4 roles, plus LeetCode solved and GitHub contributions from the live data the page already fetches), and three CTAs: **Hire me** (mailto with a "Hiring" subject), **Download résumé** (`/resume`), **Email**. The token stream, status pill, open-to-work pill and scroll cue stay.
- New `src/components/ui/IntroCounter.tsx`: a server component made only of markup, plus CSS. It is a small "Opening the ledger · 000→100" strip that counts with a CSS `@property` integer animation in 0.7 s. It is pointer-events-none and positioned so it never covers the `<h1>`.
- `src/app/layout.tsx`: a few bytes of inline `<head>` script that add `intro-seen` from `sessionStorage`, so the counter plays once per visit. Reduced motion hides it in CSS.

**Stays untouched:** `HeroName.tsx` (same `lines` prop, same lazy start and fallbacks), `Cursor.tsx`, the photo in About.
**Performance risk: medium.** The hero is the LCP area. The counter is small text, so it can never be the LCP element, and it animates only opacity and transform. The extra hero rows are server-rendered, so CLS stays 0. I will check the fold at 360×640 and run Lighthouse with and without the counter. If it costs any score, I remove it and tell you.

## Phase 3: projects ledger

**Change**
- `src/content/projects.ts`: additive fields `status` (Live / Shipped / In build), `year`, optional `metric` and `demo` URL.
- `src/components/sections/Projects.tsx`: each card gets a ledger strip, `004.1 · Shipped · 2025 · metric/proof ↗`. The big decorative numeral shows `004.1`. All hover and focus classes (`group`, `hover:border-lime/60`, `hover:text-lime`, `focus-within`) stay exactly as they are. "More work" rows get `004.5…` numbers but no status, because a status guessed from GitHub push dates would be invented.
- `src/app/projects/[slug]/page.tsx`: status and metric in the case-study header.

**Stays untouched:** `AttentionGraph.tsx` (same `items`, `rail` and `railLabel` props, so the curves draw as before) and the card hover effects.
**Performance risk: low.** Server-rendered text only.

## Phase 4: Proof, How I work, Build ledger

**Change**
- New content files: `src/content/proof.ts`, `src/content/process.ts`, `src/content/ledger.ts`.
- New server components: `src/components/sections/Proof.tsx`, `Process.tsx`, `BuildLedger.tsx`.
- **Proof:** the pull line "Nothing on this page is invented", then a row of numbers where every number links to its file in `public/` or a real URL. LeetCode and GitHub counts are live. The gaps from question 3 are left out until you supply them.
- **How I work:** 01 Research, 02 Build, 03 Evaluate, each with one concrete example from my own projects (the OpenEnv reward shaping, the NeuroFlow ports-and-adapters design, the Truth AI confidence scoring).
- **Build ledger:** one numbered, dated list of every project, role, hackathon and site release (v1 Mar 2026, v2 Oct 2026, v3), each with a status and a link. "Like a changelog of a person."
- `src/app/page.tsx` and `src/lib/nav.ts`: slot the sections in.

**Stays untouched:** Evaluation's table and certificates, Activity, Writing, all protected files.
**Performance risk: low to medium.** It is all below the fold, but it adds DOM. I will keep the page under Lighthouse's ~1,400-element warning and use `content-visibility: auto` on the new sections only, never on the attention-graph sections, because it would affect their measuring.

## Phase 5: contact, IST clock, theme toggle

**Change**
- `src/components/sections/Contact.tsx`: editorial heading, the three hire CTAs, and the availability line from the existing "Open to work" setting. I will not add a response-time promise unless you give me one.
- New `src/components/ui/IstClock.tsx`: client-only, mounted after idle like `Deferred.tsx`. It server-renders a fixed-width placeholder so nothing shifts (CLS 0), then shows `HH:MM IST` via `Intl` with `Asia/Kolkata`.
- New `src/components/ui/ThemeToggle.tsx` in `Nav.tsx`, which is already a client component.
- `src/app/layout.tsx`: a tiny inline `<head>` script that sets `data-theme` from `localStorage` before first paint (no flash). `colorScheme` and `themeColor` cover both themes.
- `src/app/globals.css`: light tokens (bone background, ink text). Lime on bone fails contrast, so in light mode the accent becomes a dark olive and cyan a deep teal, and I will check every text/background pair against 4.5:1 with a script. The hero is pinned to the dark tokens in both modes, so the WebGL colours never need to change.
- `src/components/sections/Footer.tsx`: "© 2026 · All builds numbered".
- Optional, needs your OK because it touches the palette: a "Toggle theme" command added to the command palette's list.

**Stays untouched:** the Prompt terminal form, the chat, `/admin` (it inherits tokens; I will check it in both themes).
**Performance risk: medium.** The theme script blocks rendering but is around 200 bytes. The main risk is Accessibility 100 in light mode, which the contrast script covers.

## Phase 6: 360–1920 px, accessibility, Lighthouse to 100

- Check every section at 360, 390, 768, 1024, 1280, 1440 and 1920 px, in both themes, plus keyboard-only and reduced-motion passes. I will use the built-in browser pane for screenshots if you allow it; otherwise I will tell you exactly what to look at.
- Lighthouse mobile and desktop, 3 runs, on the home page and one case study.
- Likely levers if mobile Performance is short of 100 (v2 last measured 92 on localhost, with a simulated LCP of about 3.3 s): trim the fonts preloaded above the fold, move the grain overlay off a full-screen fixed layer, split Nav's client code, and mount the command palette after idle. That last one changes how the palette loads (not what it does), so I will ask before doing it.
- **Honest risk:** mobile Performance 100 under Lighthouse's simulated slow-4G is the hardest target here. If it can only be reached by cutting a protected feature, I will stop and show you the trade-off with numbers instead of cutting it.

## After every phase

`npm run lint` and `npm run build` pass, Lighthouse runs again (four scores next to the baseline), I commit and `git push -u origin v3-elite` (never `master`, never force), and I tell you what to look at on localhost or the Vercel preview.

Vercel previews may sit behind Vercel's login (Deployment Protection), so scripted Lighthouse runs against the preview can fail. The run in your Incognito window is the final word, as Part 5 of your guide says.

## Teardown items still unverified

The browser visit to jaybutani.com was declined, so these stay **inferred**: exact font families and weights, the bone and gold hex values, Tailwind or not, the animation library (Framer Motion, GSAP or CSS), the counter-up behaviour, scroll smoothing and breakpoints. None of the plan depends on them, because v3 keeps your own palette and fonts and I chose the serif myself. If you want them confirmed, I can read his HTML and CSS with a web fetch instead of the browser.
