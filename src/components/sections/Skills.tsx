import { skillGroups } from "@/content/skills";
import Reveal from "@/components/ui/Reveal";

/** Skills as a layer stack, not a tag cloud. Rendered inside the About section. */
export default function Skills() {
  return (
    <div className="mt-20 md:mt-28">
      <Reveal as="h3" className="label mb-6">Parameters · the layer stack</Reveal>
      <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {skillGroups.map((g, i) => (
          <Reveal
            as="li"
            key={g.id}
            delay={i * 60}
            className="grid gap-3 p-5 md:grid-cols-[170px_1fr] md:items-baseline md:gap-8 md:p-6"
          >
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-lime">{g.layer}</span>
              <span className="font-display text-lg font-medium text-ink">{g.label}</span>
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-muted">
              {g.skills.map((s) => (
                <li key={s} className="relative pl-3 before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-line">
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
