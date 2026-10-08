import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/projects";
import { profile, SITE_URL } from "@/content/profile";

export const revalidate = 21600;
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, url: `${SITE_URL}/projects/${p.slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <main id="main" className="mx-auto max-w-[900px] px-4 pb-32 pt-28 sm:px-6">
      <Link href="/#projects" className="label hover:text-lime">← All projects</Link>

      <p className="label mt-12 text-lime">{p.kicker}</p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">{p.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">{p.summary}</p>

      <section className="mt-16" aria-labelledby="problem">
        <h2 id="problem" className="label">Problem</h2>
        <p className="mt-4 font-display text-xl leading-snug text-ink md:text-2xl">{p.problem}</p>
      </section>

      <section className="mt-14" aria-labelledby="approach">
        <h2 id="approach" className="label">Approach</h2>
        <ol className="mt-5 space-y-5">
          {p.approach.map((a, n) => (
            <li key={a} className="flex gap-5 border-t border-line pt-5">
              <span className="font-mono text-sm text-lime">{String(n + 1).padStart(2, "0")}</span>
              <span className="leading-relaxed text-muted">{a}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14" aria-labelledby="stack">
        <h2 id="stack" className="label">Stack</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <li key={s} className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-muted">{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="proof">
        <h2 id="proof" className="label">Proof</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {p.proof.map((x) => (
            <li key={x.href}>
              <a href={x.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-md bg-lime px-5 font-mono text-xs font-medium uppercase tracking-wider text-base">
                {x.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <nav className="mt-24 flex items-center justify-between border-t border-line pt-8" aria-label="Next project">
        <a href={`mailto:${profile.email}`} className="label hover:text-lime">Discuss this project</a>
        <Link href={`/projects/${next.slug}`} className="font-display text-lg hover:text-lime">
          Next: {next.title.split(" — ")[0]} →
        </Link>
      </nav>
    </main>
  );
}
