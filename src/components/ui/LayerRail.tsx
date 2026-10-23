"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { sections } from "@/lib/nav";
import { scrollToId } from "@/lib/motion";

const RAIL = 300; // px
const N = sections.length;

/**
 * Right-edge "layer depth" indicator. A glowing token travels the rail continuously as you scroll (it sits between two
 * layers while you are between sections), ticks swell as it passes, and the current layer is always named.
 */
export default function LayerRail() {
  const pathname = usePathname();
  const [f, setF] = useState(0); // fractional section index
  const [pct, setPct] = useState(0);
  const els = useRef<HTMLElement[]>([]);

  useEffect(() => {
    els.current = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    let raf = 0;
    const calc = () => {
      raf = 0;
      const list = els.current;
      if (!list.length) return;
      const probe = window.scrollY + window.innerHeight * 0.4;
      let i = 0;
      for (let k = 0; k < list.length; k++) if (list[k].offsetTop <= probe) i = k;
      const a = list[i].offsetTop;
      const b = list[i + 1] ? list[i + 1].offsetTop : a + list[i].offsetHeight;
      setF(Math.min(N - 1, i + Math.min(1, Math.max(0, (probe - a) / Math.max(1, b - a)))));
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.round(Math.min(1, window.scrollY / h) * 100) : 0);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(calc); };
    calc();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, [pathname]);

  if (pathname !== "/") return null;
  const cur = Math.round(f);
  const ty = (f / (N - 1)) * RAIL;

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative" style={{ height: RAIL, width: 150 }}>
        <span aria-hidden className="absolute right-[6px] top-0 w-px bg-line" style={{ height: RAIL }} />
        <span aria-hidden className="absolute right-[6px] top-0 w-px bg-gradient-to-b from-cyan to-lime" style={{ height: ty }} />
        <span aria-hidden className="absolute right-0 grid size-[13px] place-items-center" style={{ top: ty - 6.5, transition: "top .12s linear" }}>
          <span className="absolute size-6 animate-ping rounded-full bg-lime/30" />
          <span className="relative size-[13px] rounded-full bg-lime shadow-[0_0_14px_3px_rgba(242,176,94,.65)]" />
        </span>
        {sections.map((s, i) => {
          const dist = Math.abs(f - i);
          const near = Math.max(0, 1 - dist / 1.2);
          const on = cur === i;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToId(s.id)}
              aria-label={`${s.n} ${s.label}`}
              aria-current={on ? "true" : undefined}
              className="group absolute right-0 flex -translate-y-1/2 items-center gap-3"
              style={{ top: (i / (N - 1)) * RAIL }}
            >
              <span className={`whitespace-nowrap font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${on ? "translate-x-0 text-lime opacity-100" : "translate-x-2 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"}`}>
                {s.n} {s.label}
              </span>
              <span
                className="relative z-10 block rounded-full border bg-base transition-colors group-hover:border-lime"
                style={{ width: 7 + near * 5, height: 7 + near * 5, marginRight: 6 - (3.5 + near * 2.5) + 0.5, borderColor: dist < 0.5 ? "var(--color-lime)" : f > i ? "var(--color-cyan)" : "var(--color-muted)", background: f > i ? "var(--color-cyan)" : "var(--color-base)" }}
              />
            </button>
          );
        })}
        <p className="absolute -bottom-8 right-0 font-mono text-[10px] tracking-wider text-muted tabular-nums">{String(pct).padStart(2, "0")}%</p>
      </div>
    </nav>
  );
}
