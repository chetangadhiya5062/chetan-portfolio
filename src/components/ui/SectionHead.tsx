import { sectionOf, type SectionId } from "@/lib/nav";
import Reveal from "./Reveal";

/**
 * Ledger-style section head: `004 — Attention · context`, then an editorial h2.
 * Put exactly one accent word in the title inside <em> (rendered as italic serif).
 */
export default function SectionHead({
  section,
  context,
  title,
  lede,
}: {
  section: SectionId;
  context?: string;
  title: React.ReactNode;
  lede?: string;
}) {
  const { n, label } = sectionOf(section);
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="label flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-lime">{n}</span>
        <span aria-hidden className="h-px w-10 bg-line" />
        <span>{label}</span>
        {context && (
          <>
            <span aria-hidden>·</span>
            <span>{context}</span>
          </>
        )}
      </p>
      <h2 className="editorial mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-ink">
        {title}
      </h2>
      {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{lede}</p>}
    </Reveal>
  );
}
