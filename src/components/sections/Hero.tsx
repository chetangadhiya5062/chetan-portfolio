import { profile } from "@/content/profile";
import type { GithubData } from "@/lib/sources/types";
import type { SiteStatus } from "@/lib/site-data";
import { timeAgo } from "@/lib/activity";
import Term from "@/components/latent/Term";

type Cand = [string, number];
type Tok = { t: string; c: Cand[]; term?: string };

/**
 * Staged next-token decoding: each token shows its candidate distribution as it is "sampled", then keeps
 * a probability chip. The distributions are illustrative (this is a visualisation, not a live model).
 */
const NAME: Tok[] = [
  { t: "Chet", c: [["Chet", 0.94], ["Chat", 0.03], ["Che", 0.02], ["Chen", 0.01]] },
  { t: "an", c: [["an", 0.97], ["en", 0.02], ["ana", 0.01]] },
  { t: " Gadh", c: [["Gadh", 0.88], ["Gand", 0.05], ["Gad", 0.04], ["Gat", 0.03]] },
  { t: "iya", c: [["iya", 0.99], ["ia", 0.01]] },
];

const ROLE: Tok[] = [
  { t: "AI", c: [["AI", 0.82], ["ML", 0.1], ["Software", 0.05], ["Data", 0.03]] },
  { t: "Engineer", c: [["Engineer", 0.91], ["Researcher", 0.05], ["Developer", 0.04]] },
  { t: "—", c: [["—", 0.64], [".", 0.2], [",", 0.12], [":", 0.04]] },
  { t: "agentic", term: "agents", c: [["agentic", 0.58], ["GenAI", 0.21], ["LLM", 0.13], ["backend", 0.08]] },
  { t: "systems,", c: [["systems,", 0.77], ["workflows,", 0.12], ["apps,", 0.07], ["tools,", 0.04]] },
  { t: "RAG", term: "rag", c: [["RAG", 0.66], ["retrieval", 0.18], ["search", 0.1], ["pipelines", 0.06]] },
  { t: "& LLMs", term: "llm", c: [["& LLMs", 0.52], ["and LLMs", 0.21], ["& agents", 0.15], ["& APIs", 0.12]] },
  { t: "built", c: [["built", 0.71], ["engineered", 0.14], ["shipped", 0.09], ["made", 0.06]] },
  { t: "for", c: [["for", 0.93], ["to", 0.05], ["in", 0.02]] },
  { t: "production.", term: "production", c: [["production.", 0.86], ["scale.", 0.08], ["real use.", 0.04], ["demos.", 0.02]] },
];

function Token({ tok, i, chip = false }: { tok: Tok; i: number; chip?: boolean }) {
  const top = tok.c[0][1];
  const inner = tok.term ? <Term id={tok.term}>{tok.t}</Term> : tok.t;
  return (
    <span className="dec-tok" style={{ "--i": i } as React.CSSProperties} tabIndex={0}>
      {inner}
      <span className="dec-cands dec-sample" aria-hidden>
        <Rows cands={tok.c} />
      </span>
      {chip && <span className="dec-p" aria-hidden>p={top.toFixed(2)}</span>}
    </span>
  );
}

function Rows({ cands }: { cands: Cand[] }) {
  return (
    <>
      {cands.map(([w, p], k) => (
        <span key={w} className={`dec-row block ${k === 0 ? "top" : ""}`}>
          <span className="flex justify-between gap-4"><span>{w}</span><span>{p.toFixed(2)}</span></span>
          <span className="dec-bar"><i style={{ width: `${p * 100}%` }} /></span>
        </span>
      ))}
    </>
  );
}

export default function Hero({ github, status }: { github: GithubData | null; status: SiteStatus }) {
  const last = github?.recentCommits[0];
  const currently = status.currently.trim() || "building agentic systems";

  return (
    <section id="top" aria-label="Introduction" className="relative flex min-h-[100svh] flex-col justify-center pb-20 pt-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <p className="label mb-5 flex items-center gap-3">
          <span className="text-lime">01</span>
          <span aria-hidden className="h-px w-10 bg-line" />
          <span>Decode · predicting the next token</span>
        </p>

        <div className="dec">
          <h1 className="font-display text-[clamp(2.5rem,10.5vw,8.5rem)] font-semibold leading-[0.95] tracking-tight text-ink">
            <span className="sr-only">{profile.name}</span>
            <span aria-hidden>
              {NAME.map((t, i) => <Token key={i} tok={t} i={i} chip />)}
            </span>
          </h1>

          <p className="mt-9 max-w-3xl font-display text-[clamp(1.25rem,3vw,2.1rem)] font-medium leading-snug text-ink">
            <span className="sr-only">{`${profile.headline} — ${profile.tagline}`}</span>
            {ROLE.map((t, i) => (
              <span key={i}>
                <Token tok={t} i={i + NAME.length} />{" "}
              </span>
            ))}
          </p>
        </div>

        <p className="mt-6 font-mono text-[11px] text-muted/80">
          Decoding is a staged visualisation. Hover a token to see its candidates · hover a dotted word to see what it connects to.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#projects" className="group inline-flex h-12 items-center gap-2 rounded-md bg-lime px-6 font-mono text-sm font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5">
            View work <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a href="#ask" className="inline-flex h-12 items-center rounded-md border border-line bg-surface/60 px-6 font-mono text-sm uppercase tracking-wider text-ink backdrop-blur transition-colors hover:border-lime">
            Ask my work
          </a>
          <a href="/resume" target="_blank" rel="noopener" className="inline-flex h-12 items-center rounded-md border border-line px-6 font-mono text-sm uppercase tracking-wider text-muted transition-colors hover:border-lime hover:text-ink">
            Resume
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="inline-flex max-w-full items-center gap-3 rounded-full border border-line bg-surface/70 px-4 py-2 font-mono text-xs text-muted backdrop-blur">
            <span aria-hidden className="pulse-dot size-2 shrink-0 rounded-full bg-lime" />
            <span className="truncate">
              <span className="text-ink">Currently:</span> {currently}
              {last && <> · last commit <time dateTime={last.date}>{timeAgo(last.date)}</time></>}
            </span>
          </p>
          {status.openToWork && (
            <p className="inline-flex items-center gap-2 rounded-full border border-lime/40 px-4 py-2 font-mono text-xs text-lime">
              Open to work · {profile.openTo.replace(" roles", "")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
