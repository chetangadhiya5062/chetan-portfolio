"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clusterColor, getConcept, related } from "@/lib/latent";
import { clusters } from "@/content/concepts";

type Ctx = {
  active: string | null;
  activate: (id: string, el: HTMLElement) => void;
  deactivate: (id: string) => void;
  toggle: (id: string, el: HTMLElement) => void;
  clear: () => void;
};

const LatentCtx = createContext<Ctx>({ active: null, activate() {}, deactivate() {}, toggle() {}, clear() {} });
export const useLatent = () => useContext(LatentCtx);

type Link = { id: string; score: number; x: number; y: number; w: number; h: number; vis: boolean; el: HTMLElement };
type Geo = { sx: number; sy: number; sw: number; sh: number; links: Link[] };

const MIN_SCORE = 0.34;

/**
 * Holds the one active concept. When it changes it finds every <Term> and [data-concept] element on the page
 * that is a real embedding neighbour, tags it, and draws lines + cosine chips from the source to each.
 */
export default function LatentProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const srcEl = useRef<HTMLElement | null>(null);
  const hideTimer = useRef<number | null>(null);

  const activate = useCallback((id: string, el: HTMLElement) => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    srcEl.current = el;
    setActive(id);
  }, []);
  const clear = useCallback(() => {
    setPinned(false);
    setActive(null);
  }, []);
  const deactivate = useCallback((id: string) => {
    if (pinned) return;
    hideTimer.current = window.setTimeout(() => setActive((a) => (a === id ? null : a)), 120);
  }, [pinned]);
  const toggle = useCallback((id: string, el: HTMLElement) => {
    srcEl.current = el;
    if (active === id && pinned) {
      clear();
    } else {
      setActive(id);
      setPinned(true);
    }
  }, [active, pinned, clear]);

  // measure + tag the DOM whenever the active concept changes or the viewport moves
  useEffect(() => {
    const root = document.documentElement;
    const tagged: HTMLElement[] = [];
    if (!active || !srcEl.current) {
      root.classList.remove("latent-on");
      return;
    }
    const near = related(active, MIN_SCORE, 8);
    const nearIds = new Map(near);
    root.classList.add("latent-on");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-term],[data-concept]"));
    for (const el of els) {
      const cid = el.dataset.term ?? el.dataset.concept ?? "";
      if (cid === active) {
        el.classList.add("is-src");
        tagged.push(el);
      } else if (nearIds.has(cid)) {
        el.classList.add("is-rel");
        el.style.setProperty("--rel", String(nearIds.get(cid)));
        tagged.push(el);
      }
    }

    let raf = 0;
    const measure = () => {
      raf = 0;
      const s = srcEl.current;
      if (!s || !s.isConnected) return;
      const sb = s.getBoundingClientRect();
      const best = new Map<string, Link>();
      for (const el of tagged) {
        const cid = el.dataset.term ?? el.dataset.concept ?? "";
        const score = nearIds.get(cid);
        if (score === undefined) continue;
        const b = el.getBoundingClientRect();
        const vis = b.bottom > 56 && b.top < window.innerHeight && b.right > 0 && b.left < window.innerWidth;
        const dist = Math.abs(b.top - sb.top);
        const prev = best.get(cid);
        const prevDist = prev ? Math.abs(prev.y - sb.top) : Infinity;
        // prefer a visible instance, then the nearest one
        if (!prev || (vis && !prev.vis) || (vis === prev.vis && dist < prevDist)) {
          best.set(cid, { id: cid, score, x: b.left, y: b.top, w: b.width, h: b.height, vis, el });
        }
      }
      setGeo({ sx: sb.left, sy: sb.top, sw: sb.width, sh: sb.height, links: [...best.values()].sort((a, b) => b.score - a.score) });
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      for (const el of tagged) {
        el.classList.remove("is-src", "is-rel");
        el.style.removeProperty("--rel");
      }
      root.classList.remove("latent-on");
      setGeo(null);
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && clear();
    const onDown = (e: PointerEvent) => {
      if (pinned && !(e.target as HTMLElement).closest?.("[data-term],[data-concept],.latent-panel")) clear();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [pinned, clear]);

  const value = useMemo(() => ({ active, activate, deactivate, toggle, clear }), [active, activate, deactivate, toggle, clear]);
  const c = active ? getConcept(active) : undefined;

  return (
    <LatentCtx.Provider value={value}>
      {children}
      {active && c && geo && <Overlay concept={c} geo={geo} onClear={clear} pinned={pinned} />}
    </LatentCtx.Provider>
  );
}

function Overlay({ concept, geo, onClear, pinned }: { concept: NonNullable<ReturnType<typeof getConcept>>; geo: Geo; onClear: () => void; pinned: boolean }) {
  const color = clusterColor(concept.id);
  const sx = geo.sx + geo.sw / 2;
  const sy = geo.sy + geo.sh / 2;
  const visible = geo.links.filter((l) => l.vis);
  const hidden = geo.links.filter((l) => !l.vis);
  const W = typeof window === "undefined" ? 1200 : window.innerWidth;
  const cardLeft = Math.min(Math.max(12, geo.sx), W - 300);
  const above = geo.sy > 150;

  return (
    <>
      <svg aria-hidden className="pointer-events-none fixed inset-0 z-[55] size-full overflow-visible">
        {visible.map((l) => {
          const tx = l.x + l.w / 2;
          const ty = l.y + l.h / 2;
          const mx = (sx + tx) / 2;
          const bend = Math.min(80, Math.abs(ty - sy) * 0.25 + 30);
          const d = `M${sx},${sy} Q${mx},${Math.min(sy, ty) - bend} ${tx},${ty}`;
          const lx = mx;
          const ly = (sy + ty) / 2 - bend / 2 - 4;
          return (
            <g key={l.id}>
              <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={1 + l.score * 1.6} strokeOpacity={0.35 + l.score * 0.6} className="attn-line" />
              <circle cx={tx} cy={ty} r={3} fill={color} />
              <g transform={`translate(${lx},${ly})`}>
                <rect x={-27} y={-10} width={54} height={20} rx={10} fill="var(--color-base)" stroke={color} strokeOpacity={0.8} />
                <text textAnchor="middle" y={4} fontSize={11} fontFamily="var(--font-jetbrains), monospace" fill={color}>{l.score.toFixed(2)}</text>
              </g>
            </g>
          );
        })}
        <circle cx={sx} cy={sy} r={4} fill={color} />
      </svg>

      <div
        role="status"
        className={`latent-panel ${pinned ? "pointer-events-auto" : "pointer-events-none"} fixed z-[56] w-[min(290px,calc(100vw-24px))] rounded-xl border border-line bg-surface/95 p-3.5 shadow-2xl backdrop-blur`}
        style={{ left: cardLeft, top: above ? Math.max(64, geo.sy - 10) : geo.sy + geo.sh + 10, transform: above ? "translateY(-100%)" : undefined, borderColor: color }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-base font-semibold text-ink">{concept.label}</p>
          <span className="label shrink-0" style={{ color }}>{clusters[concept.cluster].label}</span>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-muted">{concept.def}.</p>
        {hidden.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {hidden.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => l.el.scrollIntoView({ behavior: "smooth", block: "center" })}
                  className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-ink hover:border-lime"
                >
                  {getConcept(l.id)?.label} <span style={{ color: clusterColor(l.id) }}>{l.score.toFixed(2)}</span> {l.el.getBoundingClientRect().top > 0 ? "↓" : "↑"}
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="label mt-3 flex items-center justify-between">
          <span>cosine · {geo.links.length} linked on this page</span>
          {pinned && <button type="button" onClick={onClear} className="text-lime hover:underline">close</button>}
        </p>
      </div>
    </>
  );
}
