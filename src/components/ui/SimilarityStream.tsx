import { concepts } from "@/content/concepts";
import { clusterColor, getConcept, latentNodes } from "@/lib/latent";

type Pair = { a: string; b: string; s: number };

/** Real nearest-neighbour pairs from the embedding index, as two slow opposing streams of chips. */
export default function SimilarityStream() {
  const seen = new Set<string>();
  const pairs: Pair[] = [];
  for (const n of latentNodes) {
    const [b, s] = n.near[0] ?? [];
    if (!b) continue;
    const key = [n.id, b].sort().join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ a: n.id, b, s });
  }
  pairs.sort((x, y) => y.s - x.s);
  const top = pairs.slice(0, Math.min(24, pairs.length));
  const rows = [top.filter((_, i) => i % 2 === 0), top.filter((_, i) => i % 2 === 1)];
  const chip = (p: Pair, k: string, hidden: boolean) => (
    <li key={k} aria-hidden={hidden || undefined} className={`flex shrink-0 items-center gap-3 rounded-full border border-line bg-surface/70 py-2 pl-4 pr-3 font-mono text-[12px] text-ink backdrop-blur ${hidden ? "marquee-dupe" : ""}`}>
      <span className="flex items-center gap-1.5"><span aria-hidden className="size-1.5 rounded-full" style={{ background: clusterColor(p.a) }} />{getConcept(p.a)?.label}</span>
      <span aria-hidden className="relative h-px w-10 bg-line"><span className="absolute inset-y-0 left-0 bg-lime" style={{ width: `${p.s * 100}%`, height: 1 }} /></span>
      <span className="flex items-center gap-1.5"><span aria-hidden className="size-1.5 rounded-full" style={{ background: clusterColor(p.b) }} />{getConcept(p.b)?.label}</span>
      <span className="rounded-full bg-base px-2 py-0.5 text-[11px] font-semibold text-lime">cos {p.s.toFixed(2)}</span>
    </li>
  );
  return (
    <div role="group" aria-label={`Closest concept pairs in the embedding index (${concepts.length} concepts)`} className="my-6 space-y-3 py-4">
      <p className="label mx-auto max-w-[1200px] px-4 sm:px-6">nearest neighbours · real cosine scores from the embedding index</p>
      {rows.map((row, ri) => (
        <div key={ri} className={`marquee ${ri ? "rev" : ""}`}>
          <div className="marquee-track" style={{ "--dur": `${row.length * 9}s` } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 gap-3 pr-3">
                {row.map((p) => chip(p, `${copy}-${p.a}-${p.b}`, copy === 1))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
