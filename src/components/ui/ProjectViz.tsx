import type { Viz } from "@/content/projects";

type Tone = "lime" | "cyan" | "ink" | "muted";
const BAR: Record<Tone, string> = { lime: "bg-lime", cyan: "bg-cyan", ink: "bg-ink", muted: "bg-muted/50" };
const TEXT: Record<Tone, string> = { lime: "text-lime", cyan: "text-cyan", ink: "text-ink", muted: "text-muted" };
const BORDER: Record<Tone, string> = { lime: "border-lime/60", cyan: "border-cyan/60", ink: "border-ink/40", muted: "border-line" };

function Frame({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  return (
    <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <figcaption>
        <p className="label text-lime">{title}</p>
        {caption && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{caption}</p>}
      </figcaption>
      <div className="mt-6">{children}</div>
    </figure>
  );
}

function Flow({ v }: { v: Extract<Viz, { kind: "flow" }> }) {
  return (
    <Frame title={v.title} caption={v.caption}>
      <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch lg:gap-0">
        {v.nodes.map((n, i) => {
          const t = n.tone ?? "ink";
          return (
            <li key={n.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
              <div className={`flex-1 rounded-xl border ${BORDER[t]} bg-base/60 p-3.5 lg:h-full`}>
                <p className={`font-mono text-[11px] uppercase tracking-wider ${TEXT[t]}`}>{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 font-display text-base font-medium leading-snug text-ink">{n.label}</p>
                {n.sub && <p className="mt-1 text-xs leading-snug text-muted">{n.sub}</p>}
                {n.branches && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {n.branches.map((b) => <li key={b} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">{b}</li>)}
                  </ul>
                )}
              </div>
              {i < v.nodes.length - 1 && (
                <span aria-hidden className="grid place-items-center py-0.5 font-mono text-lime lg:px-2 lg:py-0">
                  <span className="lg:hidden">↓</span><span className="hidden lg:inline">→</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {v.loop && (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed border-cyan/50 px-3 py-2 text-xs leading-relaxed text-muted">
          <span aria-hidden className="font-mono text-cyan">↺</span><span>{v.loop}</span>
        </p>
      )}
    </Frame>
  );
}

function Bars({ v }: { v: Extract<Viz, { kind: "bars" }> }) {
  const min = v.min ?? 0;
  const pct = (x: number) => Math.max(2, Math.min(100, ((x - min) / (v.max - min)) * 100));
  const fmt = (x: number) => (v.format === "dec" ? x.toFixed(3).replace(/0$/, "") : String(x));
  return (
    <Frame title={v.title} caption={v.caption}>
      <div className="space-y-6">
        {v.rows.map((r) => (
          <div key={r.label} role="group" aria-label={r.label}>
            <p className="font-display text-sm font-medium text-ink">{r.label}</p>
            <ul className="mt-2 space-y-2">
              {r.items.map((it, k) => {
                const t = it.tone ?? (k === r.items.length - 1 ? "lime" : "muted");
                return (
                  <li key={it.name} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[9rem_1fr_auto]">
                    <span className="truncate font-mono text-[11px] text-muted" title={it.name}>{it.name}</span>
                    <span className="h-2.5 overflow-hidden rounded-full bg-line"><span className={`block h-full rounded-full ${BAR[t]}`} style={{ width: `${pct(it.value)}%` }} /></span>
                    <span className={`w-14 text-right font-mono text-xs ${TEXT[t === "muted" ? "ink" : t]}`}>{it.shown ?? fmt(it.value)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      {min > 0 && <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-muted">axis starts at {min}: the differences are small, so they are zoomed</p>}
    </Frame>
  );
}

function Split({ v }: { v: Extract<Viz, { kind: "split" }> }) {
  const total = v.parts.reduce((a, p) => a + p.value, 0);
  return (
    <Frame title={v.title} caption={v.caption}>
      <div className="flex h-12 gap-1 overflow-hidden rounded-xl" role="img" aria-label={v.parts.map((p) => `${p.label} ${p.value}`).join(", ")}>
        {v.parts.map((p) => (
          <div key={p.label} className={`grid place-items-center font-mono text-[11px] font-medium text-base ${BAR[p.tone ?? "lime"]}`} style={{ width: `${(p.value / total) * 100}%` }}>{Math.round((p.value / total) * 100)}%</div>
        ))}
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {v.parts.map((p) => (
          <li key={p.label} className="flex gap-3">
            <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${BAR[p.tone ?? "lime"]}`} />
            <span><span className="block font-display text-sm text-ink">{p.label}: {p.value.toLocaleString("en")}</span><span className="block text-xs leading-snug text-muted">{p.sub}</span></span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Ledger({ v }: { v: Extract<Viz, { kind: "ledger" }> }) {
  return (
    <Frame title={v.title} caption={v.caption}>
      <ul className="divide-y divide-line">
        {v.rows.map((r) => (
          <li key={r.label} className="flex items-baseline gap-4 py-3">
            <span className={`w-12 shrink-0 font-display text-xl font-semibold ${TEXT[r.tone ?? "lime"]}`}>{r.value}</span>
            <span className="text-sm leading-snug text-ink">{r.label}{r.note && <span className="block text-xs text-muted">{r.note}</span>}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Server-rendered diagrams (no client JS): pipelines, before/after bars, data splits, reward ledgers. */
export default function ProjectViz({ viz }: { viz: Viz[] }) {
  return (
    <div className="space-y-5">
      {viz.map((v) => v.kind === "flow" ? <Flow key={v.title} v={v} /> : v.kind === "bars" ? <Bars key={v.title} v={v} /> : v.kind === "split" ? <Split key={v.title} v={v} /> : <Ledger key={v.title} v={v} />)}
    </div>
  );
}
