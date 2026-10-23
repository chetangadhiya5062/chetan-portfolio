/** A slow band of stack keywords between sections. Reduced motion: becomes a still, scrollable strip. */
export default function TickerBand({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 items-center gap-8 pr-8 ${hidden ? "marquee-dupe" : ""}`}>
      {words.map((w, i) => (
        <li key={w} className="flex items-center gap-8 font-serif text-3xl text-ink/80 md:text-5xl">
          <span className={i % 3 === 1 ? "italic text-lime" : i % 3 === 2 ? "text-cyan" : ""}>{w}</span>
          <span aria-hidden className="text-line">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div aria-label="Stack keywords" role="group" className={`marquee my-4 border-y border-line/70 bg-surface/40 py-5 backdrop-blur-sm ${reverse ? "rev" : ""}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
