import Link from "next/link";
import { projects } from "@/content/projects";
import { GITHUB_USER, FEATURED_REPOS, HIDDEN_PATTERNS, HIDDEN_REPOS } from "@/config/github";
import type { GithubData, RepoInfo } from "@/lib/sources/types";
import { timeAgo } from "@/lib/activity";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Rich from "@/components/latent/Rich";

/** "More work": every public, non-fork, non-hidden, non-featured repo, newest push first. */
export function moreWork(github: GithubData | null): RepoInfo[] {
  if (!github) return [];
  const hidden = new Set(HIDDEN_REPOS.map((r) => r.toLowerCase()));
  const featured = new Set(FEATURED_REPOS.map((r) => r.toLowerCase()));
  return github.repos
    .filter(
      (r) =>
        !r.isFork &&
        !hidden.has(r.name.toLowerCase()) &&
        !featured.has(r.fullName.toLowerCase()) &&
        !HIDDEN_PATTERNS.some((p) => p.test(r.name)),
    )
    .slice(0, 9);
}

export default function Projects({ github }: { github: GithubData | null }) {
  const meta = new Map(github?.repos.map((r) => [r.fullName.toLowerCase(), r]));
  const more = moreWork(github);

  const cards = projects.map((p, i) => {
    const repo = meta.get(p.repo.toLowerCase());
    return (
        <Reveal as="article" key={p.slug} className="group relative overflow-hidden spot rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-lime/60 focus-within:border-lime/60 md:p-10">
          <span aria-hidden className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] font-bold leading-none text-line/60 md:text-[12rem]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="relative">
            <p className="label text-lime">{p.kicker}</p>
            <h3 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-tight md:text-4xl">
              <Link href={`/projects/${p.slug}`} className="outline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-lime">
                {p.title}
              </Link>
            </h3>
            <p className="relative z-10 mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg"><Rich text={p.summary} /></p>

            <p className="label mt-6">attends to</p>
            <ul className="relative z-10 mt-2 flex flex-wrap gap-2">
              {p.skills.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"><Rich text={s} all /></li>
              ))}
            </ul>

            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-wider">
              <Link href={`/projects/${p.slug}`} className="text-lime hover:underline">Case study →</Link>
              {p.proof.map((x) => (
                <a key={x.href} href={x.href} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">
                  {x.label} ↗
                </a>
              ))}
              {repo && (
                <span className="normal-case tracking-normal text-muted">
                  {repo.stars > 0 && <>★ {repo.stars} · </>}
                  {repo.language && <>{repo.language} · </>}
                  pushed {timeAgo(repo.pushedAt)}
                </span>
              )}
            </div>
          </div>
        </Reveal>
    );
  });

  return (
    <section id="projects" aria-labelledby="proj-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="05"
          layer="Act · attention"
          title={<span id="proj-h">Four systems. Each one <em>attends</em> to a different problem.</span>}
          lede="Dotted skills are live links into the same concept space as the rest of the page."
        />
        <div className="grid gap-6 lg:grid-cols-2">{cards}</div>

        {more.length > 0 && (
          <div className="mt-24 md:mt-32">
            <Reveal className="mb-8 flex items-end justify-between gap-4">
              <h3 className="font-serif text-3xl md:text-4xl">More <em className="text-lime">work</em>, still moving</h3>
              <a href={`https://github.com/${GITHUB_USER}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="label hover:text-lime">
                All repositories ↗
              </a>
            </Reveal>
            <div className="space-y-4">
              {[more.filter((_, i) => i % 2 === 0), more.filter((_, i) => i % 2 === 1)].map((row, ri) => {
                // repeat short rows so the loop never shows a gap
                const base = row.length >= 4 ? row : [...row, ...row, ...row].slice(0, Math.max(4, row.length));
                return (
                  <div key={ri} className={`marquee ${ri ? "rev" : ""}`}>
                    <div className="marquee-track" style={{ "--dur": `${base.length * 14}s` } as React.CSSProperties}>
                      {[0, 1].map((copy) =>
                        base.map((r) => (
                          <a
                            key={`${copy}-${r.fullName}`}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-hidden={copy ? true : undefined}
                            tabIndex={copy ? -1 : undefined}
                            className={`spot flex h-[170px] w-[300px] shrink-0 flex-col justify-between rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-lime/60 ${copy ? "marquee-dupe" : ""}`}
                          >
                            <div className="relative z-10">
                              <p className="font-display text-base font-medium text-ink">{r.name}</p>
                              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">{r.description || "Public repository."}</p>
                            </div>
                            <p className="relative z-10 flex items-center gap-3 font-mono text-[11px] text-muted">
                              {r.language && <span className="flex items-center gap-1.5 text-cyan"><span aria-hidden className="size-1.5 rounded-full bg-cyan" />{r.language}</span>}
                              {r.stars > 0 && <span>★ {r.stars}</span>}
                              <span className="ml-auto">{timeAgo(r.pushedAt)}</span>
                            </p>
                          </a>
                        )),
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
