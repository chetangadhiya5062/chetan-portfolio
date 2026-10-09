import { achievements, certifications } from "@/content/achievements";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";

const linkCls = "font-mono text-xs uppercase tracking-wider text-cyan hover:underline";

export default function Evaluation() {
  return (
    <section id="evaluation" aria-labelledby="eval-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="07"
          layer="Evaluation"
          title={<span id="eval-h">Benchmarks, with receipts.</span>}
          lede="Every row with a proof link opens the actual certificate, repository or photo."
        />

        <Reveal className="overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Achievements and leadership</caption>
            <thead className="hidden border-b border-line md:table-header-group">
              <tr className="label">
                <th scope="col" className="px-7 py-4 font-normal">Event</th>
                <th scope="col" className="px-4 py-4 font-normal">Result</th>
                <th scope="col" className="px-7 py-4 font-normal">Proof</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((a) => (
                <tr key={a.id} className="block border-b border-line p-5 last:border-b-0 hover:bg-line/30 md:table-row md:p-0">
                  <th scope="row" className="block text-left align-top font-normal md:table-cell md:px-7 md:py-5 md:w-[34%]">
                    <span className="block font-display text-lg font-medium text-ink">{a.title}</span>
                    <span className="label mt-1 block">{a.event}</span>
                  </th>
                  <td className="mt-2 block text-[15px] leading-relaxed text-muted md:mt-0 md:table-cell md:px-4 md:py-5">{a.result}</td>
                  <td className="mt-3 block md:mt-0 md:table-cell md:px-7 md:py-5 md:w-[24%]">
                    {a.proof.length === 0 ? (
                      <span className="font-mono text-xs text-muted/60">—</span>
                    ) : (
                      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:flex-col">
                        {a.proof.map((p) => (
                          <li key={p.href}>
                            <a href={p.href} target="_blank" rel="noopener noreferrer" className={linkCls}>{p.label} ↗</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal as="h3" className="mb-6 mt-20 font-display text-2xl font-semibold md:text-3xl">Certifications</Reveal>
        <Reveal className="overflow-hidden rounded-2xl border border-line bg-surface">
          <ul className="divide-y divide-line">
            {certifications.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 p-5 hover:bg-line/30 md:px-7 md:py-5">
                <div>
                  <p className="font-display text-lg font-medium text-ink">{c.title}</p>
                  <p className="label mt-1">{c.issuer}{c.detail && ` · ${c.detail}`}</p>
                </div>
                {c.proof ? (
                  <a href={c.proof} target="_blank" rel="noopener noreferrer" className={linkCls}>Certificate ↗</a>
                ) : (
                  <span className="font-mono text-xs text-muted/70">credential on request</span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
