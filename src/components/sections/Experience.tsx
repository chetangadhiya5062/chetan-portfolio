import { experience } from "@/content/experience";
import Backdrop from "@/components/ui/Backdrop";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Rich from "@/components/latent/Rich";

type Kind = "plan" | "tool" | "observe" | "output";
const KIND_COLOR: Record<Kind, string> = {
  plan: "text-cyan", tool: "text-[#ff8a65]", observe: "text-[#8fa8ff]", output: "text-lime",
};

/** Each role is drawn as an agent run: plan, tool calls, observations, final output. */
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="exp-h" className="relative isolate py-24 md:py-36">
      <Backdrop variant="net" n="04" seed={11} />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="04"
          layer="Reason · agent traces"
          title={<span id="exp-h">Every role, as a run that <em>finished</em>.</span>}
          lede="Plan, act, observe, deliver. Concepts in each trace link to the rest of the page."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {experience.map((r, i) => {
            const steps = r.bullets.map((b, k) => {
              const kind = r.bullets.length === 1 ? "output" : k === 0 ? "plan" : k === r.bullets.length - 1 ? "output" : k % 2 ? "tool" : "observe";
              return { b, kind: kind as Kind };
            });
            return (
              <Reveal as="article" key={r.id} delay={i * 60} className="spot rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-lime/50 md:p-8">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
                  <div>
                    <p className="label text-lime">run #{String(experience.length - i).padStart(2, "0")} · {r.period}</p>
                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">{r.title}</h3>
                    <p className="mt-1 text-[15px] text-muted">{r.org}{r.place && ` · ${r.place}`}</p>
                  </div>
                  <span className="rounded-full border border-lime/40 px-3 py-1 font-mono text-[11px] text-lime">status: done</span>
                </header>
                <ol className="mt-5 space-y-4">
                  {steps.map((s, k) => (
                    <li key={k} className="trace-step grid grid-cols-[4.2rem_1fr] gap-3 text-[15px] leading-relaxed" style={{ "--k": k } as React.CSSProperties}>
                      <span className={`pt-0.5 font-mono text-[11px] uppercase tracking-wider ${KIND_COLOR[s.kind]}`}>{s.kind}</span>
                      <span className="text-muted"><Rich text={s.b} /></span>
                    </li>
                  ))}
                </ol>
                {r.repo && (
                  <a href={r.repo} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan hover:underline">
                    View the work <span aria-hidden>↗</span>
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
