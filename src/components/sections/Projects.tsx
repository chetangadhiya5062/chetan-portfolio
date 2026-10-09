import Link from "next/link";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { GITHUB_USER, FEATURED_REPOS, HIDDEN_PATTERNS, HIDDEN_REPOS } from "@/config/github";
import type { GithubData, RepoInfo } from "@/lib/sources/types";
import { timeAgo } from "@/lib/activity";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import AttentionGraph from "@/components/ui/AttentionGraph";

const used = new Set(projects.flatMap((p) => p.skills));
const rail = skillGroups.flatMap((g) => g.skills).filter((s) => used.has(s));

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

  const items = projects.map((p, i) => {
    const repo = meta.get(p.repo.toLowerCase());
    return {
      id: p.slug,
      skills: p.skills,
      node: (
        <Reveal as="article" className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-lime/60 focus-within:border-lime/60 md:p-10">
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
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">{p.summary}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">{s}</li>
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
      ),
    };
  });

  return (
    <section id="projects" aria-labelledby="proj-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="04"
          layer="Attention"
          title={<span id="proj-h">Four systems. Each one attends to a different problem.</span>}
          lede="Hover a project to see which skills it pulls weight from."
        />
        <AttentionGraph items={items} rail={rail} railLabel="Attends to" />

        {more.length > 0 && (
          <div className="mt-24 md:mt-32">
            <Reveal className="mb-8 flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold md:text-3xl">More work</h3>
              <a href={`https://github.com/${GITHUB_USER}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="label hover:text-lime">
                All repositories ↗
              </a>
            </Reveal>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {more.map((r, i) => (
                <Reveal as="li" key={r.fullName} delay={(i % 3) * 70} className="bg-surface">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:bg-line/50"
                  >
                    <div>
                      <p className="font-display text-lg font-medium text-ink">{r.name}</p>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {r.description || "Public repository."}
                      </p>
                    </div>
                    <p className="flex flex-wrap gap-x-3 font-mono text-[11px] text-muted">
                      {r.language && <span className="text-cyan">{r.language}</span>}
                      {r.stars > 0 && <span>★ {r.stars}</span>}
                      <span>pushed {timeAgo(r.pushedAt)}</span>
                    </p>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
