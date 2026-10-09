import Reveal from "./Reveal";

export default function SectionHead({
  n,
  layer,
  title,
  lede,
}: {
  n: string;
  layer: string;
  title: React.ReactNode;
  lede?: string;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="label flex items-center gap-3">
        <span className="text-lime">{n}</span>
        <span aria-hidden className="h-px w-10 bg-line" />
        <span>{layer}</span>
      </p>
      <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-tight text-ink">
        {title}
      </h2>
      {lede && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{lede}</p>}
    </Reveal>
  );
}
