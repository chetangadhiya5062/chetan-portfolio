import { experience } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import AttentionGraph from "@/components/ui/AttentionGraph";

const usedSkills = new Set(experience.flatMap((r) => r.skills));
const rail = skillGroups.flatMap((g) => g.skills).filter((s) => usedSkills.has(s));

export default function Experience() {
  const items = experience.map((r, i) => ({
    id: r.id,
    skills: r.skills,
    node: (
      <Reveal as="article" delay={60} className="group relative rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-lime/60 focus-within:border-lime/60 md:p-9">
        <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <p className="label text-lime">
              H{experience.length - i} · {r.period}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">{r.title}</h3>
            <p className="mt-1 text-base text-muted">
              {r.org}
              {r.place && <span> · {r.place}</span>}
            </p>
          </div>
        </header>
        <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-muted">
          {r.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-lime" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-2 lg:hidden">
          {r.skills.map((s) => (
            <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">{s}</li>
          ))}
        </ul>
        {r.repo && (
          <a
            href={r.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan hover:underline"
          >
            View the work <span aria-hidden>↗</span>
          </a>
        )}
      </Reveal>
    ),
  }));

  return (
    <section id="experience" aria-labelledby="exp-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="03"
          layer="Hidden layers"
          title={<span id="exp-h">Each role is a layer. Each one shipped.</span>}
          lede="Hover a layer to see which skills it activated."
        />
        <AttentionGraph items={items} rail={rail} railLabel="Skills activated" />
      </div>
    </section>
  );
}
