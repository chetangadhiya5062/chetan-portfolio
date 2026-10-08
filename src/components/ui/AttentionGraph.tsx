"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type GraphItem = { id: string; skills: string[]; node: ReactNode };

type Line = { key: string; d: string };

/**
 * Left: items (roles / projects). Right (lg+): a rail of skills.
 * Hovering or focusing an item lights up the skills it used and draws curves to them.
 * Below lg the rail is hidden; items carry their own chips, so nothing is lost.
 */
export default function AttentionGraph({
  items,
  rail,
  railLabel,
}: {
  items: GraphItem[];
  rail: string[];
  railLabel: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);

  const measure = useCallback(() => {
    const root = box.current;
    if (!root || !active || window.innerWidth < 1024) return setLines([]);
    const item = root.querySelector<HTMLElement>(`[data-item="${CSS.escape(active)}"]`);
    if (!item) return setLines([]);
    const rb = root.getBoundingClientRect();
    const ib = item.getBoundingClientRect();
    const x1 = ib.right - rb.left;
    const y1 = ib.top + Math.min(ib.height / 2, 120) - rb.top;
    const skills = items.find((i) => i.id === active)?.skills ?? [];
    const next: Line[] = [];
    for (const s of skills) {
      const pill = root.querySelector<HTMLElement>(`[data-skill="${CSS.escape(s)}"]`);
      if (!pill) continue;
      const pb = pill.getBoundingClientRect();
      const x2 = pb.left - rb.left;
      const y2 = pb.top + pb.height / 2 - rb.top;
      const mx = x1 + (x2 - x1) * 0.55;
      next.push({ key: `${active}-${s}`, d: `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}` });
    }
    setLines(next);
  }, [active, items]);

  useEffect(() => {
    // measuring needs the DOM; deferring a frame lets layout settle after hover
    const id = requestAnimationFrame(measure);
    if (!active) return () => cancelAnimationFrame(id);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [active, measure]);

  const activeSkills = new Set(items.find((i) => i.id === active)?.skills ?? []);

  return (
    <div ref={box} className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_230px] lg:gap-x-28" onMouseLeave={() => setActive(null)}>
      <div className="flex flex-col gap-6 md:gap-8">
        {items.map((it) => (
          <div
            key={it.id}
            data-item={it.id}
            tabIndex={0}
            onMouseEnter={() => setActive(it.id)}
            onFocus={() => setActive(it.id)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((a) => (a === it.id ? null : it.id))}
            className="rounded-2xl outline-offset-4"
          >
            {it.node}
          </div>
        ))}
      </div>

      <aside aria-label={railLabel} className="hidden lg:block">
        <div className="sticky top-24">
          <p className="label mb-4">{railLabel}</p>
          <ul className="flex flex-wrap gap-2">
            {rail.map((s) => {
              const on = activeSkills.has(s);
              return (
                <li
                  key={s}
                  data-skill={s}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-all duration-300 ${
                    on
                      ? "border-cyan bg-cyan/10 text-cyan"
                      : active
                        ? "border-line text-muted/40"
                        : "border-line text-muted"
                  }`}
                >
                  {s}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block">
        {lines.map((l) => (
          <path key={l.key} d={l.d} pathLength={1} fill="none" stroke="var(--color-cyan)" strokeWidth={1.2} strokeOpacity={0.75} className="attn-line" />
        ))}
      </svg>
    </div>
  );
}
