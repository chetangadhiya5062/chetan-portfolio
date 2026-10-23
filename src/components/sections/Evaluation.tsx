import { achievements, certifications } from "@/content/achievements";
import Backdrop from "@/components/ui/Backdrop";
import SectionHead from "@/components/ui/SectionHead";
import Tilt from "@/components/ui/Tilt";
import Reveal from "@/components/ui/Reveal";

const link = "font-mono text-[11px] uppercase tracking-wider text-cyan hover:underline";

export default function Evaluation() {
  const scored = achievements.filter((a) => a.metric);
  const rest = achievements.filter((a) => !a.metric);

  return (
    <section id="evaluation" aria-labelledby="eval-h" className="relative isolate py-24 md:py-36">
      <Backdrop variant="waves" n="09" seed={29} />
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <SectionHead
          n="09"
          layer="Eval · proof"
          title={<span id="eval-h">Numbers that open to a <em>receipt</em>.</span>}
          lede="Every figure links to the certificate, photo or repository behind it. Where there is no file yet, there is no figure."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {scored.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 70} className={i < 2 ? "lg:col-span-3" : "lg:col-span-2"}>
             <Tilt mode="tilt" className="spot flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-6">
              <div className="fx-pop relative z-10">
                <p className="font-serif text-[clamp(3rem,6vw,4.6rem)] leading-none text-lime">{a.metric!.value}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-muted">{a.metric!.caption}</p>
              </div>
              <div className="fx-pop relative z-10 mt-8">
                <h3 className="font-display text-lg font-medium leading-snug text-ink">{a.title}</h3>
                <p className="mt-1 text-sm text-muted">{a.event}</p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {a.proof.map((p) => (
                    <li key={p.href}><a href={p.href} target="_blank" rel="noopener noreferrer" className={link}>{p.label} ↗</a></li>
                  ))}
                </ul>
              </div>
             </Tilt>
            </Reveal>
          ))}
        </ul>

        <Reveal as="h3" className="mb-5 mt-20 font-serif text-3xl md:text-4xl">Built and <em className="text-lime">shipped</em> under pressure</Reveal>
        <ul className="grid gap-4 md:grid-cols-2">
          {rest.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 60}>
             <Tilt mode="soft" className="spot h-full rounded-2xl border border-line bg-surface p-6">
              <div className="fx-pop relative z-10 flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-display text-lg font-medium text-ink">{a.title}</h4>
                <span className="label">{a.event}</span>
              </div>
              <p className="relative z-10 mt-2 text-[15px] leading-relaxed text-muted">{a.result}</p>
              {a.proof.length > 0 && (
                <ul className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {a.proof.map((p) => (
                    <li key={p.href}><a href={p.href} target="_blank" rel="noopener noreferrer" className={link}>{p.label} ↗</a></li>
                  ))}
                </ul>
              )}
             </Tilt>
            </Reveal>
          ))}
        </ul>

        <Reveal as="h3" className="mb-5 mt-20 font-serif text-3xl md:text-4xl">Credentials</Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 60}>
             <Tilt mode="cred" className="spot flex h-full flex-col justify-between rounded-2xl border border-line bg-surface p-5">
              <div className="relative z-10">
                <span aria-hidden className="fx-badge grid size-8 place-items-center rounded-full border border-cyan/50 text-cyan">✓</span>
                <p className="mt-4 font-display text-base font-medium leading-snug text-ink">{c.title}</p>
                <p className="label mt-2">{c.issuer}{c.detail && ` · ${c.detail}`}</p>
              </div>
              <p className="relative z-10 mt-5">
                {c.proof ? <a href={c.proof} target="_blank" rel="noopener noreferrer" className={link}>Certificate ↗</a> : <span className="font-mono text-[11px] text-muted/70">credential on request</span>}
              </p>
             </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
