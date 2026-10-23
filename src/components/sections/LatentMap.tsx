"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLatent } from "@/components/latent/LatentProvider";
import { concepts, clusters, type Cluster } from "@/content/concepts";
import Backdrop from "@/components/ui/Backdrop";
import { latentDim, latentModel, latentNodes } from "@/lib/latent";

const W = 1000, H = 620, PAD = 60;
const pos = new Map(latentNodes.map((n) => [n.id, n]));

/** flagship = what carries the weight in my projects, foundation = the base everything stands on, the rest supports */
const TIER1 = new Set(["llm", "rag", "agents", "multi-agent", "langgraph", "mcp", "llm-gateway", "embeddings", "memory", "fastapi", "knowledge-graph", "vector-db", "llama", "gemini"]);
const TIER3 = new Set(["python", "docker", "postgres", "dsa", "clean-arch", "solid", "typescript", "nextjs", "ci", "ml", "deep-learning", "hackathons", "geodata", "production"]);
const tierOf = (id: string) => (TIER1.has(id) ? 1 : TIER3.has(id) ? 3 : 2);
const DEPTH = { 1: 16, 2: 9, 3: 4 } as const;

const STAGES = [
  { t: "Everything I have worked with", d: "Every concept placed by meaning. Nearby dots are close in embedding space, so related ideas sit together before any grouping." },
  { t: "Grouped by domain", d: "Models, retrieval, agents, platform, data and craft pull into their own clusters." },
  { t: "What carries the weight", d: "The flagship layer: models, RAG, agents, MCP and the gateway that serves them. This is where most of my projects live." },
  { t: "The base underneath", d: "Python, Docker, Postgres, clean architecture and DSA. The foundation every flagship system stands on." },
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// cluster centres on a fixed 3 x 2 layout (viewBox coordinates) so groups never overlap or leave the frame
const CENTRES: Record<Cluster, { x: number; y: number }> = {
  model: { x: 190, y: 190 }, retrieval: { x: 500, y: 190 }, agent: { x: 810, y: 190 },
  platform: { x: 190, y: 440 }, data: { x: 500, y: 440 }, craft: { x: 810, y: 440 },
};
const spiral = (() => {
  const idx = new Map<Cluster, number>();
  const m = new Map<string, { dx: number; dy: number }>();
  for (const c of concepts) {
    const i = idx.get(c.cluster) ?? 0;
    idx.set(c.cluster, i + 1);
    const r = 32 * Math.sqrt(i + 0.6), a = i * 2.399963;
    m.set(c.id, { dx: Math.cos(a) * r, dy: Math.sin(a) * r * 0.8 });
  }
  return m;
})();

/**
 * 2-D PCA projection of the real 384-d embedding space, driven by scroll: scatter -> clusters -> flagship layer -> base layer.
 * Hover a dot for related concepts; the pointer parallaxes the layers; +/- and drag to zoom and pan.
 */
export default function LatentMap() {
  const { activate, deactivate, toggle, active } = useLatent();
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [p, setP] = useState(0);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.85;
        setP(clamp(-r.top / Math.max(1, total)) );
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  // ctrl/cmd + wheel zooms the map (plain wheel keeps scrolling the page, which drives the stages)
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setView((v) => ({ ...v, k: Math.min(2.6, Math.max(0.8, v.k * (e.deltaY < 0 ? 1.1 : 0.9))) }));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const stage = p < 0.28 ? 0 : p < 0.55 ? 1 : p < 0.8 ? 2 : 3;
  const c = seg(p, 0.2, 0.34), f1 = seg(p, 0.5, 0.62), f3 = seg(p, 0.75, 0.87);

  const nodes = useMemo(() => concepts.flatMap((cn) => {
    const n = pos.get(cn.id);
    if (!n) return [];
    return [{ cn, tier: tierOf(cn.id), bx: PAD + n.x * (W - PAD * 2), by: PAD + n.y * (H - PAD * 2) }];
  }), []);

  const jump = useCallback((i: number) => {
    const el = wrap.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight * 0.85;
    const target = [0.04, 0.4, 0.68, 0.95][i];
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + total * target, behavior: "smooth" });
  }, []);

  const zoom = (d: number) => setView((v) => ({ ...v, k: Math.min(2.6, Math.max(0.8, v.k * d)) }));

  return (
    <div ref={wrap} className="relative mt-20 md:mt-28 h-[340vh]">
      <div className="sticky top-20 isolate h-[calc(100svh-6rem)] min-h-[520px]">
        <Backdrop variant="net" seed={53} flip className="-inset-x-8 -inset-y-6" />
        <p className="label mb-4">Latent space · {concepts.length} concepts · {latentModel} · {latentDim}-d → 2-d (PCA)</p>
        <div className="grid h-[calc(100%-2rem)] gap-4 lg:grid-cols-[300px_1fr]">
          <div className="order-2 flex flex-col justify-between gap-4 lg:order-1">
            <div>
              <p className="font-mono text-[11px] text-lime">step {stage + 1} / 4</p>
              <h3 className="mt-2 font-serif text-3xl leading-tight text-ink md:text-4xl">{STAGES[stage].t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{STAGES[stage].d}</p>
              <ol className="mt-5 flex gap-2" aria-label="Map stages">
                {STAGES.map((s, i) => (
                  <li key={s.t}>
                    <button type="button" onClick={() => jump(i)} aria-label={`Show: ${s.t}`} aria-current={i === stage ? "step" : undefined}
                      className={`h-1.5 rounded-full transition-all ${i === stage ? "w-10 bg-lime" : "w-5 bg-line hover:bg-muted"}`} />
                  </li>
                ))}
              </ol>
            </div>
            <ul className="hidden flex-wrap content-start gap-1.5 lg:flex" aria-hidden>
              {(stage === 0 ? [] : stage === 1 ? (Object.keys(clusters) as Cluster[]).map((k) => ({ id: k, label: `${clusters[k].label} · ${concepts.filter((x) => x.cluster === k).length}`, color: clusters[k].color })) : concepts.filter((x) => tierOf(x.id) === (stage === 2 ? 1 : 3)).map((x) => ({ id: x.id, label: x.label, color: clusters[x.cluster].color }))).map((x) => (
                <li key={x.id} className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] text-ink" style={{ borderColor: x.color }}>{x.label}</li>
              ))}
            </ul>
            <p className="hidden items-center gap-2 font-mono text-[11px] text-muted lg:flex">
              <span aria-hidden className="inline-block animate-bounce text-lime">↓</span> keep scrolling and the map regroups
            </p>
          </div>

          <div
            className="spot relative order-1 overflow-hidden rounded-2xl border border-line bg-surface/80 lg:order-2"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              if (drag.current) setView((v) => ({ ...v, x: drag.current!.vx + (e.clientX - drag.current!.x) * (W / r.width), y: drag.current!.vy + (e.clientY - drag.current!.y) * (H / r.height) }));
              else setPar({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
            }}
            onPointerLeave={() => { setPar({ x: 0, y: 0 }); drag.current = null; }}
          >
            <svg ref={svg} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Map of concepts. Nearby points have similar meaning." className="latent-map block size-full"
              onPointerDown={(e) => { if ((e.target as Element).closest(".map-dot")) return; drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y }; }}
              onPointerUp={() => { drag.current = null; }}>
              <g transform={`translate(${W / 2 + view.x} ${H / 2 + view.y}) scale(${view.k}) translate(${-W / 2} ${-H / 2})`}>
                {[0.25, 0.5, 0.75].map((t) => (
                  <g key={t} stroke="var(--color-line)" strokeDasharray="2 6" opacity={1 - c * 0.7}>
                    <line x1={PAD + t * (W - PAD * 2)} x2={PAD + t * (W - PAD * 2)} y1={10} y2={H - 10} />
                    <line x1={10} x2={W - 10} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} />
                  </g>
                ))}
                {(Object.keys(clusters) as Cluster[]).map((k) => {
                  const { x, y } = CENTRES[k];
                  return (
                    <g key={k} opacity={c * (1 - f1 * 0.6)} style={{ pointerEvents: "none" }}>
                      <circle cx={x} cy={y} r={118} fill={clusters[k].color} fillOpacity={0.07} stroke={clusters[k].color} strokeOpacity={0.35} strokeDasharray="3 6" />
                      <text x={x} y={y - 126} textAnchor="middle" fontSize={12} letterSpacing={2} fill={clusters[k].color} fontFamily="var(--font-jetbrains), monospace">{clusters[k].label.toUpperCase()}</text>
                    </g>
                  );
                })}
                {nodes.map(({ cn, tier, bx, by }) => {
                  const sp = spiral.get(cn.id)!;
                  const cx0 = CENTRES[cn.cluster].x + sp.dx, cy0 = CENTRES[cn.cluster].y + sp.dy;
                  const d = DEPTH[tier as 1 | 2 | 3];
                  const x = bx + (cx0 - bx) * c + par.x * d * 2, y = by + (cy0 - by) * c + par.y * d * 2;
                  const emph = tier === 1 ? f1 * (1 - f3 * 0.6) : tier === 3 ? f3 : 0;
                  const dim = tier === 1 ? f3 * 0.45 : tier === 2 ? Math.max(f1, f3) * 0.72 : f1 * (1 - f3) * 0.72;
                  const alpha = 1 - dim;
                  const r = 4.5 + 5 * emph;
                  const color = clusters[cn.cluster].color;
                  const right = x < W - 170;
                  const showLabel = alpha > 0.5 && (c > 0.4 || tier === 1);
                  return (
                    <g
                      key={cn.id}
                      data-concept={cn.id}
                      style={{ "--tc": color, "--lo": showLabel ? alpha : 0 } as React.CSSProperties}
                      opacity={alpha}
                      className="map-dot cursor-pointer"
                      tabIndex={0}
                      role="button"
                      aria-label={`${cn.label}: show related concepts`}
                      aria-pressed={active === cn.id}
                      onPointerEnter={(e) => e.pointerType === "mouse" && activate(cn.id, e.currentTarget as unknown as HTMLElement)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && deactivate(cn.id)}
                      onFocus={(e) => activate(cn.id, e.currentTarget as unknown as HTMLElement)}
                      onBlur={() => deactivate(cn.id)}
                      onClick={(e) => toggle(cn.id, e.currentTarget as unknown as HTMLElement)}
                    >
                      <circle cx={x} cy={y} r={16} fill="transparent" />
                      {emph > 0.2 && <circle cx={x} cy={y} r={r + 6} fill={color} fillOpacity={0.14 * emph} />}
                      <circle className="dot" cx={x} cy={y} r={r} fill={color} />
                      <text x={right ? x + r + 6 : x - r - 6} y={y + 4} textAnchor={right ? "start" : "end"} fontSize={12 + 3 * emph} fill="var(--color-ink)" fontFamily="var(--font-jetbrains), monospace">
                        {cn.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            <div className="absolute right-3 top-3 flex flex-col gap-1.5">
              {([["+", 1.2, "Zoom in"], ["−", 1 / 1.2, "Zoom out"]] as const).map(([l, d, a]) => (
                <button key={a} type="button" aria-label={a} onClick={() => zoom(d)} className="grid size-8 place-items-center rounded-md border border-line bg-base/80 font-mono text-sm text-ink backdrop-blur hover:border-lime">{l}</button>
              ))}
              <button type="button" aria-label="Reset view" onClick={() => setView({ k: 1, x: 0, y: 0 })} className="grid size-8 place-items-center rounded-md border border-line bg-base/80 font-mono text-[11px] text-muted backdrop-blur hover:border-lime hover:text-ink">⟲</button>
            </div>
            <p className="pointer-events-none absolute bottom-3 left-4 hidden font-mono text-[10px] text-muted sm:block">scroll = regroup · drag = pan · ± = zoom · hover a dot = neighbours</p>
            <ul className="pointer-events-none absolute bottom-3 right-4 hidden gap-x-4 font-mono text-[10px] text-muted md:flex">
              {(Object.keys(clusters) as Cluster[]).map((k) => (
                <li key={k} className="flex items-center gap-1.5"><span aria-hidden className="size-1.5 rounded-full" style={{ background: clusters[k].color }} />{clusters[k].label}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
