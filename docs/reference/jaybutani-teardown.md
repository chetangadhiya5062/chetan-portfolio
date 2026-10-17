# jaybutani.com teardown

Reference site for the "elite level" portfolio upgrade. Read on 16 Oct 2026.

**How this was gathered:** this environment's network policy blocks jaybutani.com, so a real browser could not load it. Everything below comes from the page's server-rendered content (fetched through a web reader) plus Jay's own post on how he built the site. Items marked **(verified)** come from the page or that post. Items marked **(inferred)** are educated guesses and still need a check in a real browser (DevTools, Network and Computed tabs) before anything is copied.

**Status on 17 Oct 2026:** still not verified in a browser (the owner declined the browser visit). Everything marked inferred stays inferred; v3 does not depend on those items.

---

## 1. What kind of site this is

- **Type:** a personal brand site for a solo founder or indie developer, sometimes called a "one-person studio" site. It is half portfolio and half sales page. Every section pushes toward one action: book a call or send a brief.
- **Concept:** Jay frames it as a **"ledger"**, a public record of everything he has built. Each item has a number, a status and a link. In his words: *"jaybutani.com is a ledger first and a brand second."* **(verified)**
- **Style or genre names you can search for:**
  - **Editorial / magazine-style portfolio**: big serif-style headlines with italic accent words, long-form copy, and a document feel.
  - **Index, catalog or archival design**: numbered sections (001, 002, 003, then 004.1 and so on), status tags and a changelog. This comes from Swiss and technical-document design.
  - **"Dark luxury" or "quiet luxury" theme**: near-black ink, bone (off-white) text and one gold accent. Jay calls the shipped version **"Champagne Master."** **(verified)**
  - **Build in public / proof-driven**: hard numbers, a world record, live statuses and named client businesses.
- **Who it is for:** founders who might hire him. That differs from Chetan's site, which is aimed at recruiters for AI/ML roles. The *style* transfers well, but the *conversion goal* should change (hire me or interview me, not "two founder slots").

## 2. Tech stack

| Thing | Value | Source |
|---|---|---|
| Framework | **Next.js 15** | Jay's post **(verified)** |
| Fonts loading | `next/font` (the `next-size-adjust` meta tag is present) | page meta **(verified)** |
| Hosting | Docker container on his own VPS behind a reverse proxy, not Vercel | Jay's post **(verified)** |
| CMS | None. Posts are typed data in the repo, and a build guard blocks unfilled placeholders | Jay's post **(verified)** |
| Design tool | Claude Design: a canvas taken through ten versions | Jay's post **(verified)** |
| Code | Mostly written with Claude Code | Jay's post **(verified)** |
| Images | WebP + JPG under `/og/`, `/work/`, `/photos/` | page **(verified)** |
| SEO | Canonical, OG and Twitter `summary_large_image` (`/og/home.jpg`, 1200×630), robots index/follow, structured data, sitemap | page and post **(verified)** |
| Styling library | Unknown. Tailwind is likely given the stack, but unconfirmed | **(inferred)** |

Chetan's portfolio already runs on Next.js, so no stack change is needed to match this.

## 3. Visual system

### Colors
- **Ink (background):** `#0A0908`, a warm near-black that is not pure #000 **(verified, theme-color)**
- **Bone (text):** a warm off-white, roughly `#EDE6D8`–`#F2EDE4` **(inferred hex; "bone type" verified)**
- **Gold (single accent):** a champagne gold, roughly `#C9A96A`–`#D4B47C` **(inferred hex; "one gold" verified)**
- Muted text and hairlines are probably bone at 40–60% opacity **(inferred)**
- **Light mode exists** (a theme toggle in the header and mobile menu), but **the hero stays dark in both modes**. That is deliberate: "the first screen is the poster, the rest is the document." **(verified)**

### Typography (inferred, needs a browser check)
- Headlines look like a **display serif with italic emphasis**: the copy italicises single words ("*own*", "*the same way.*", "*whole*"), which is the classic editorial-serif move. Likely candidates are Instrument Serif, Fraunces, Newsreader or a similar Google font loaded via `next/font`.
- Body and UI are probably a clean grotesk sans (Inter, Geist or similar).
- Numbers, labels, statuses and the "001 —" markers are probably a **monospace** font (Geist Mono, JetBrains Mono or IBM Plex Mono), giving the ledger or technical-document feel.

### Layout patterns
- Section label pattern: `001 — Surat, India · since 2017` (number, em-dash, context).
- Sub-numbering for list items: `004.1 TempleCast`, `004.2 CrewCue` and so on.
- Status tags everywhere, from a fixed vocabulary: **Live / Shipped / In use / In build / New / Venture**.
- Stat blocks with zero-padded numbers: `05 Products`, `07 Systems`, `17 Years`, `01 Name`.
- Big two-tone headlines where one or two words are italic or gold.

## 4. Page anatomy, top to bottom (verified)

1. **Intro overlay / loader:** "Opening the ledger", "Build 001 — jaybutani.com", and a counter that looks like it ticks from 000. A preloader that plays once.
2. **Announcement bar:** "New · ShotPop is live on the App Store …" plus "Download →".
3. **Header:** logo + name, nav (Products, Systems, Writing, About), social icons (Instagram, X, LinkedIn, GitHub, Product Hunt), a Light/Dark toggle and a **Book a call** button.
4. **Mobile menu:** the nav plus "Start a project →", socials, email and the theme toggle.
5. **001 Hero:** portrait photo, label "001 — Surat, India · since 2017", kicker "The product builder,", H1 "Jay Butani", tagline with an italic end, a scarcity line "Two founder slots · Q4 2026", two CTAs (Book a call, Send a message →), a scroll cue, four stats, and role tags.
6. **002 Positioning:** a manifesto headline, then "Why one person" (the argument), "The builder" (photo at the Apple Developer Center plus a bio), and an **8-entry timeline** from 2017 to 2026.
7. **003 Products ("Own products."):** five cards (image, status tag, platform, description, store links), then the CTA "Want yours built like this? Start a project ↓".
8. **004 Systems ("Live production, every day."):** seven numbered tools with statuses, a control-room photo and a "Live signal · 1080p60 · zero lag" label in broadcast style.
9. **005 Operations ("Back-office software people use every day."):** six client and business tools with statuses.
10. **006 Process ("One person. The *whole* system."):** three steps, 01 Define, 02 Build, 03 Grow.
11. **007 Proof:** the pull quote "Nothing on this page is invented. Every build has a number, a status, and a link you can open.", a Guinness World Record block with the certificate image, a six-stat row (5 products, 5,000+ installs, $100k+ App Store revenue, 12 businesses, 7 systems, 1 record) and a list of named client businesses.
12. **Get the apps:** three download cards.
13. **009 Writing ("Notes from the ledger."):** three latest posts (category + reading time) and "All writing →".
14. **008 Start / contact ("Let's build the *whole* thing."):** a 3-field form (name, email, what are you building) plus an optional budget/timing field, a "Send the brief" button, a "Get a free teardown" lead magnet, trust bullets, availability, response time, email, and a **live IST clock**.
15. **Build ledger:** the full list of every build with statuses, "Like a changelog of a person."
16. **Footer:** "© 2026 Jay Butani · All builds numbered", email, "India → Worldwide", and "Book a call · 2 slots · Q4".

## 5. Blog (verified)

- **Index (`/blog`):** label, H1 "iOS, AI tools and building software.", a "Researched and sourced" intro, **category chips with counts** (All 13, Building 3, Founders 4, iOS 5, Broadcast 1), one featured "Latest" card, then an "All posts" list. Each card has a cover, category, date, reading time, an "Updated" tag, title, summary and "Read →". No pagination.
- **Article page:** breadcrumb "Writing / Founders", H1, subtitle, author, date, reading time **and word count**, hero image, an **"In this piece" table of contents**, a share row (X, LinkedIn, WhatsApp, Email, Copy link) at the top and bottom, an FAQ with H3 questions, a sources note, a **changelog block**, tags, an author bio card and a single "Next in the ledger" card.

## 6. Motion and interactions (mostly inferred)

- **Verified:** intro preloader overlay, theme toggle, scroll cue, live clock, in-page anchor nav.
- **Inferred, not seen:** counters animating up (000 → 001, the stats), fade or slide-up reveals per section, possibly smooth scrolling (Lenis), and a gold hover underline on links. Check these in a real browser before copying.

## 7. Content rules Jay states (verified)

- Every item has a status. Nothing is just "in progress".
- Numbers stay visible, and each one links to a source.
- Mistakes are listed before wins.
- Old pages get a changelog or are removed.
- Writing is the main growth engine: posts are sourced, dated and updated.

## 8. What transfers to Chetan's AI/ML portfolio

- The **ledger idea**: number every project and give it a status (Live / Shipped / In build) and a link or metric. This fits the existing `projects.ts` well.
- **Dark ink + bone + one accent** palette with the hero kept dark in light mode.
- **Editorial serif headlines with italic accent words** + mono labels.
- **Proof section** with hard numbers (hackathon wins, ISRO cert, SIH, IEEE conference, LeetCode count).
- A **process or "how I work"** section, adapted for engineering (Research → Build → Evaluate fits AI/ML).
- **Writing with TOC, reading time, changelog and sources**: a strong signal for AI/GenAI roles.
- Change the CTA from "book a call / founder slots" to **"Hire me / Download résumé / Email"**.
- Add a small **preloader** and a **live local-time clock** as polish.

## Open items to verify in a real browser

Exact font families and weights, the exact bone and gold hex values, Tailwind or other styling, the animation library (Framer Motion, GSAP or CSS), scroll behaviour and breakpoints.
