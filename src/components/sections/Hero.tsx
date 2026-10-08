import { profile } from "@/content/profile";
import type { GithubData } from "@/lib/sources/types";
import type { SiteStatus } from "@/lib/site-data";
import { timeAgo } from "@/lib/activity";
import HeroName from "./HeroName";

const TOKENS = ["AI", "Engineer", "—", "GenAI", "&", "agentic", "systems", "built", "to", "run", "in", "production."];
const LINES = ["CHETAN", "GADHIYA"];

export default function Hero({ github, status }: { github: GithubData | null; status: SiteStatus }) {
  const last = github?.recentCommits[0];
  const currently = status.currently.trim() || "building agentic systems";

  return (
    <section id="top" aria-label="Introduction" className="relative flex min-h-[100svh] flex-col justify-center pb-16 pt-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <p className="label mb-4 flex items-center gap-3">
          <span className="text-lime">01</span>
          <span aria-hidden className="h-px w-10 bg-line" />
          <span>Input · the forward pass begins</span>
        </p>

        <HeroName lines={LINES} />

        <p className="caret mt-6 max-w-3xl font-display text-[clamp(1.25rem,3vw,2.1rem)] font-medium leading-snug text-ink" aria-label={`${profile.headline} — ${profile.tagline}`}>
          {TOKENS.map((t, i) => (
            <span key={i} className="tok" style={{ "--i": i } as React.CSSProperties} aria-hidden>
              {t}{" "}
            </span>
          ))}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex h-12 items-center gap-2 rounded-md bg-lime px-6 font-mono text-sm font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5"
          >
            View work
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="/resume"
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center rounded-md border border-line bg-surface/60 px-6 font-mono text-sm uppercase tracking-wider text-ink backdrop-blur transition-colors hover:border-lime"
          >
            Resume
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="inline-flex max-w-full items-center gap-3 rounded-full border border-line bg-surface/70 px-4 py-2 font-mono text-xs text-muted backdrop-blur">
            <span aria-hidden className="pulse-dot size-2 shrink-0 rounded-full bg-lime" />
            <span className="truncate">
              <span className="text-ink">Currently:</span> {currently}
              {last && (
                <>
                  {" "}
                  · last commit <time dateTime={last.date}>{timeAgo(last.date)}</time>
                </>
              )}
            </span>
          </p>
          {status.openToWork && (
            <p className="inline-flex items-center gap-2 rounded-full border border-lime/40 px-4 py-2 font-mono text-xs text-lime">
              Open to work · {profile.openTo.replace(" roles", "")}
            </p>
          )}
        </div>
      </div>

      <a href="#about" aria-label="Scroll to About" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex [@media(max-height:760px)]:!hidden">
        <span className="label">scroll</span>
        <span aria-hidden className="scroll-hint block h-8 w-px bg-lime" />
      </a>
    </section>
  );
}
