const STEPS = ["Ingest", "Chunk", "Embed", "Retrieve", "Rerank", "Generate", "Evaluate", "Deploy"];

/** A request travelling the RAG pipeline: a packet runs the line and each stage lights as it passes. */
export default function PipelineBand() {
  return (
    <div role="img" aria-label={`Pipeline: ${STEPS.join(", then ")}`} className="mx-auto my-6 max-w-[1200px] px-4 sm:px-6">
      <div className="noscroll-x overflow-x-auto">
        <div className="relative min-w-[760px] rounded-2xl border border-line bg-surface/60 px-8 py-9 backdrop-blur-sm">
          <span aria-hidden className="absolute inset-x-12 top-1/2 h-px -translate-y-[10px] bg-line" />
          <span aria-hidden className="pipe-packet absolute left-12 top-1/2 size-2.5 -translate-y-[14px] rounded-full bg-lime shadow-[0_0_14px_4px_rgba(242,176,94,.6)]" />
          <ol className="relative flex justify-between">
            {STEPS.map((s, i) => (
              <li key={s} className="pipe-node flex flex-col items-center gap-3" style={{ "--i": i } as React.CSSProperties}>
                <span className="pipe-dot grid size-5 place-items-center rounded-full border border-line bg-base" />
                <span className="pipe-label font-mono text-[11px] uppercase tracking-wider text-muted">{String(i + 1).padStart(2, "0")} {s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
