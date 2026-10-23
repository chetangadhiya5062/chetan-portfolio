# agent-v1: the portfolio as a running model

Branch `agent-v1`, cut from `master` (`cac9dd8`). `v3-elite` stays as it is, untouched.

## The idea

A recruiter should leave the site thinking: this person knows the whole stack, from embeddings to deployment. So the site does not just describe embeddings, retrieval and agents. It runs them, in front of the visitor, using his own work as the data.

The page is one inference pass, and the sections are the stages of a real GenAI pipeline:

| No. | Stage | Section | What the visitor sees |
|---|---|---|---|
| 00 | Boot | Intro | A neural net on canvas: nodes light up layer by layer, a signal pulse runs forward, then the net collapses into the hero |
| 01 | Decode | Hero | The name and the role are produced by next-token prediction. Each token shows its top-k candidates with probability bars, picks the argmax, and leaves a small `p=0.97` chip |
| 02 | Embed | About + latent map | A bio with linked concept terms, plus a 2-D projection of the real embedding space of everything he knows. Click a dot to jump to that concept |
| 03 | Retrieve | Ask my work (RAG console) | Type a question, see the top-k retrieved chunks with their hybrid scores (BM25 + cosine), then the grounded answer streams in with citations |
| 04 | Reason | Experience as agent traces | Each role is shown as a trace: `plan → tool → observation → output`, revealed step by step on scroll |
| 05 | Act | Projects | Case studies with an attention rail. Hovering a card runs a short execution trace (tokens, latency, tools) |
| 06 | Serve | System design | NeuroFlow's layered platform drawn as an interactive diagram: LLM gateway, RAG runtime, memory, knowledge graph, agent runtime, tool/MCP gateway, observability. Each node is a linked concept |
| 07 | Monitor | Live activity | GitHub, LeetCode, Medium and posts heatmap (kept from v2), styled as training telemetry |
| 08 | Output | Writing & posts | Posts written in `/admin`, plus Medium, LinkedIn and X |
| 09 | Eval | Proof | Achievements and certificates as an eval table, each row linked to its file |
| 10 | Deploy | Contact | A terminal prompt plus hire CTAs |

## The signature interaction: latent links

This is the "hover a word, related words light up" idea, done with real embeddings.

- About 60 concepts (RAG, embeddings, vector DBs, LangGraph, MCP, knowledge graphs, Kafka, Docker, RL, evaluation…) each get a one-line definition.
- At build time, `scripts/embed-concepts.mjs` embeds each definition with **all-MiniLM-L6-v2** (384-dim, mean pooled, L2-normalised) and writes `src/content/generated/latent.json`. That file holds each concept's top neighbours with their **real cosine similarity** and 2-D PCA coordinates. No similarity score on the page is made up.
- In the copy, terms are wrapped in `<Term id="rag">`. They get a dotted underline in the concept's cluster colour.
- Hover, focus or tap a term, and every related term anywhere on the page lights up. Lines are drawn from the source term to each related term in the viewport, with a `cos 0.71` chip on each one. Related terms that are off screen are listed in a small floating panel ("4 more below ↓") that scrolls to them on click.
- The latent map in section 02 shows the same space. Hovering a term in the text pulses its dot on the map.
- Keyboard and touch work too: tap to pin, Esc to clear. With reduced motion turned on, there are no line animations, only highlights.

## Other details that sell the feel

- **Token streaming and logprobs**: headings render as streamed tokens on first view. Hovering a heading token shows alternative tokens and their probabilities.
- **Temperature dial** in the nav: it changes how "creative" the prediction animations are (the candidates spread out), and it stores nothing. It's a toy that shows he gets sampling.
- **Cursor as attention**: a soft glow follows the pointer, and nearby concept terms brighten in proportion to distance, like an attention weight. Fine pointers only.
- **Command palette** (⌘K) kept, with search done over the same retrieval index.
- **No new runtime dependencies.** Canvas 2D, SVG and CSS only, so Lighthouse stays high. The intro plays once per session, can be skipped (click, Esc or scroll), never blocks the `<h1>` in the HTML, and is skipped completely with reduced motion.

## Admin: what stays, what's new

Kept from v2: password login (HMAC cookie, rate limit), resume upload with version history, `/resume` always serving the latest, status line and open-to-work toggle, adding LinkedIn/X post URLs, and the GitHub profile repo refresh.

New:

1. **Compose and cross-post.** Write once in `/admin`, then tick targets: **Site**, **LinkedIn**, **X**. The post is saved on the site and published to each ticked platform through its official API. The result for each platform (link or error) is stored and shown. Published LinkedIn/X posts also show in the site's Writing section automatically.
   - LinkedIn: a one-click "Connect LinkedIn" OAuth flow in `/admin` (scopes `openid profile w_member_social`). The token is stored server-side in Supabase. LinkedIn tokens last 60 days, so `/admin` shows when it will expire and lets you reconnect.
   - X: API v2 `POST /2/tweets`, signed with OAuth 1.0a using your app keys from env vars.
   - GitHub: every post and resume change pings your profile repo, so its README feed refreshes.
2. **Resume sync.** Upload once and:
   - `/resume` serves the new file. LinkedIn Featured and the GitHub profile README both link to `/resume`, so they are current immediately.
   - The GitHub profile README is refreshed (existing dispatch).
   - Optional: update your GitHub bio/headline through the API.
   - Optional tick-box: announce it ("Updated my résumé → link") on LinkedIn and X.
3. **Integrations panel.** Shows which platforms are connected and what's missing.

**Limits, stated plainly:** LinkedIn's API does not let any app edit your profile's experience or skills sections, or upload a résumé to your profile. That is why the `/resume` link in Featured is the sync mechanism. Medium stopped issuing API tokens, so Medium stays read-only (RSS).

Database: `supabase/migrations/0003_agent_v1.sql`, additive only, with tables `site_posts` (public read) and `integrations` (no public access). Safe on the shared database.

## Git and authorship

- All the work is on `agent-v1`. Nothing goes to `master`.
- No tool name, co-author line or generator credit anywhere in code, docs or commits.
- `commit-and-push.bat` at the repo root. Double-click it, type a message (or press Enter for the default), and it switches to `agent-v1` if needed, commits with your own git name and email, and pushes `agent-v1` to GitHub.

## Build order

1. Embeddings pipeline and concept data
2. Design tokens, fonts, layout shell, intro and decode hero
3. Term / latent-link system and latent map
4. Sections: RAG console, agent traces, projects, system design, eval, contact
5. Admin: compose and cross-post, LinkedIn OAuth, X signing, resume sync, migration
6. Lint, build, a pass at phone width, then copy to your folder with the commit script

## New environment variables (all optional; each feature hides itself without them)

| Name | For |
|---|---|
| `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` | LinkedIn connect and posting |
| `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_SECRET` | Posting to X |
| `GITHUB_USER_TOKEN` | Optional GitHub bio update (fine-grained, "profile" write) |
| existing `GITHUB_DISPATCH_TOKEN` | Profile README refresh |
