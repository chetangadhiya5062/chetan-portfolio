"use client";

import { useEffect, useRef, useState } from "react";
import { retrieve, type Chunk, type Hit } from "@/lib/rag";

const SUGGEST = [
  "How did he build the LLM gateway?",
  "What has he done with knowledge graphs?",
  "Which projects use Kafka?",
  "Can he deploy what he builds?",
  "Tell me about reinforcement learning work",
];

type Result = { q: string; hits: Hit[]; expanded: { label: string; sim: number; from: string }[]; answer: string };

const sentences = (t: string) => t.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [t];

function compose(hits: Hit[]): string {
  if (!hits.length) return "I couldn't find that in Chetan's work. Try asking about RAG, agents, an LLM gateway, Kafka, reinforcement learning or a specific project.";
  const parts = hits.slice(0, 3).map((h, i) => {
    const s = sentences(h.chunk.text).slice(0, i === 0 ? 2 : 1).join(" ");
    return `${s} [${i + 1}]`;
  });
  return parts.join(" ");
}

/**
 * Retrieval console over Chetan's own work. Runs in the browser: BM25 + query expansion through embedding
 * neighbours, then an extractive answer with citations. No external model is called.
 */
export default function RagConsole({ chunks }: { chunks: Chunk[] }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [shown, setShown] = useState(0);
  const timer = useRef<number | null>(null);

  const run = (query: string) => {
    const text = query.trim();
    if (!text) return;
    setQ(text);
    const { hits, expanded } = retrieve(text, chunks, 4);
    setRes({ q: text, hits, expanded, answer: compose(hits) });
    setShown(document.documentElement.classList.contains("reduce-motion") ? 9999 : 0);
  };

  useEffect(() => {
    if (!res) return;
    const words = res.answer.split(" ").length;
    timer.current = window.setInterval(() => setShown((n) => { if (n >= words) { if (timer.current) window.clearInterval(timer.current); return n; } return n + 1; }), 38);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [res]);

  const maxScore = Math.max(0.0001, ...(res?.hits.map((h) => h.score) ?? [0]));
  const words = res?.answer.split(" ") ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden>
        <span className="size-2.5 rounded-full bg-line" /><span className="size-2.5 rounded-full bg-line" /><span className="size-2.5 rounded-full bg-line" />
        <span className="label ml-3">retrieve → rank → answer · {chunks.length} chunks indexed</span>
      </div>
      <div className="p-5 md:p-7">
        <form onSubmit={(e) => { e.preventDefault(); run(q); }} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="rag-q" className="sr-only">Ask about Chetan&apos;s work</label>
          <div className="flex flex-1 items-center gap-3 rounded-md border border-line bg-base px-4 focus-within:border-lime/60">
            <span aria-hidden className="font-mono text-lime">{">"}</span>
            <input id="rag-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ask about the LLM gateway, RAG, agents, Kafka…" style={{ outline: "none" }} className="h-12 w-full bg-transparent font-mono text-sm text-ink placeholder:text-muted" />
          </div>
          <button type="submit" className="h-12 rounded-md bg-lime px-6 font-mono text-xs font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5">Retrieve</button>
        </form>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SUGGEST.map((s) => (
            <li key={s}><button type="button" onClick={() => run(s)} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-lime hover:text-ink">{s}</button></li>
          ))}
        </ul>

        {res && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]" aria-live="polite">
            <div>
              <p className="label text-lime">answer · extractive, grounded in the chunks →</p>
              <p className="mt-3 text-base leading-relaxed text-ink md:text-lg">
                {words.slice(0, shown).join(" ")}
                {shown < words.length && <span className="caret" />}
              </p>
              {res.expanded.length > 0 && (
                <div className="mt-6">
                  <p className="label">query expansion via embedding neighbours</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {res.expanded.map((e) => (
                      <li key={e.from + e.label} className="rounded-full border border-cyan/40 px-3 py-1 font-mono text-[11px] text-cyan">{e.from} → {e.label} <span className="text-muted">cos {e.sim.toFixed(2)}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ol className="space-y-3">
              {res.hits.length === 0 && <li className="font-mono text-xs text-muted">0 chunks above threshold.</li>}
              {res.hits.map((h, i) => (
                <li key={h.chunk.id} className="rounded-xl border border-line bg-base p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-muted">[{i + 1}] {h.chunk.source}</p>
                    <p className="font-mono text-xs text-lime">{h.score.toFixed(2)}</p>
                  </div>
                  <p className="mt-1 font-display text-base font-medium text-ink">{h.chunk.href ? <a href={h.chunk.href} className="hover:text-lime">{h.chunk.title}</a> : h.chunk.title}</p>
                  <div className="mt-3 flex h-1.5 overflow-hidden rounded bg-line" role="img" aria-label={`lexical ${h.lexical.toFixed(2)}, expansion ${h.expansion.toFixed(2)}`}>
                    <i style={{ width: `${(h.lexical / maxScore) * 100}%`, background: "var(--color-lime)" }} />
                    <i style={{ width: `${(h.expansion / maxScore) * 100}%`, background: "var(--color-cyan)" }} />
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-muted">
                    <span className="text-lime">bm25 {h.lexical.toFixed(2)}</span> · <span className="text-cyan">latent {h.expansion.toFixed(2)}</span>
                    {h.via.length > 0 && <> · via {h.via.map((v) => v.label).join(", ")}</>}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
