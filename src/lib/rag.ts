import { concepts } from "@/content/concepts";
import { related } from "@/lib/latent";

export type Chunk = { id: string; source: string; title: string; text: string; href?: string };

export type Hit = {
  chunk: Chunk;
  score: number;
  lexical: number;
  expansion: number;
  via: { label: string; sim: number }[];
};

const STOP = new Set("a an and are as at be by did do does for from has have how i in is it its of on or that the this to was what when where which who with he his him chetan about tell me can you your use used using built build".split(" "));

export const tokenize = (s: string): string[] =>
  s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ").split(/\s+/).map((w) => w.replace(/^[-.]+|[-.]+$/g, "")).filter((w) => w.length > 1 && !STOP.has(w)).map((w) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w));

/** Concepts whose label (or id) is mentioned in the query. */
export function queryConcepts(q: string) {
  const lq = q.toLowerCase();
  const toks = new Set(tokenize(q));
  return concepts.filter((c) => {
    const label = c.label.toLowerCase();
    return lq.includes(label) || lq.includes(c.id.replace(/-/g, " ")) || tokenize(c.label).some((t) => t.length > 3 && toks.has(t));
  });
}

/**
 * Hybrid retrieval: BM25 over the chunks, plus query expansion through the real embedding neighbours of any
 * concept mentioned in the query (each expansion term is weighted by its cosine similarity).
 */
export function retrieve(q: string, chunks: Chunk[], k = 4): { hits: Hit[]; expanded: { label: string; sim: number; from: string }[] } {
  const docs = chunks.map((c) => tokenize(`${c.title} ${c.text}`));
  const N = docs.length;
  const avg = docs.reduce((s, d) => s + d.length, 0) / N;
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);

  const bm25 = (terms: string[], d: string[]) => {
    let s = 0;
    for (const t of terms) {
      const f = d.filter((x) => x === t).length;
      if (!f) continue;
      const n = df.get(t) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      s += (idf * f * 2.4) / (f + 1.4 * (0.25 + (0.75 * d.length) / avg));
    }
    return s;
  };

  const qTerms = tokenize(q);
  const qCons = queryConcepts(q);
  const have = new Set(qCons.map((c) => c.id));
  const expanded: { label: string; sim: number; from: string; terms: string[] }[] = [];
  for (const c of qCons.slice(0, 3)) {
    for (const [id, sim] of related(c.id, 0.42, 4)) {
      if (have.has(id)) continue;
      const lab = concepts.find((x) => x.id === id)?.label ?? id;
      expanded.push({ label: lab, sim, from: c.label, terms: tokenize(lab) });
    }
  }

  const hits = chunks.map<Hit>((chunk, i) => {
    const lexical = bm25(qTerms, docs[i]);
    let expansion = 0;
    const via: Hit["via"] = [];
    for (const e of expanded) {
      const part = bm25(e.terms, docs[i]) * e.sim * 0.6;
      if (part > 0.05) { expansion += part; via.push({ label: e.label, sim: e.sim }); }
    }
    return { chunk, lexical, expansion, score: lexical + expansion, via };
  });

  return {
    hits: hits.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, k),
    expanded: expanded.map(({ label, sim, from }) => ({ label, sim, from })),
  };
}
