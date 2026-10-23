"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/motion";

const LINKS = [
  { id: "about", label: "About" },
  { id: "ask", label: "Ask" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "system", label: "Platform" },
  { id: "activity", label: "Activity" },
  { id: "writing", label: "Writing" },
  { id: "evaluation", label: "Proof" },
  { id: "contact", label: "Contact" },
] as const;

const R = 18;
const C = 2 * Math.PI * R;

export default function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const ring = useRef<SVGCircleElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // scroll progress drives the ring around the logo and a hairline under the bar
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      ring.current?.setAttribute("stroke-dashoffset", String(C * (1 - p)));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setPct((prev) => (Math.round(p * 100) !== prev ? Math.round(p * 100) : prev));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  // which section is in the middle band of the viewport
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const top = () => { if (window.scrollY < 200) setActive(""); };
    window.addEventListener("scroll", top, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", top); };
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-base/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" onClick={go("top")} className="group flex shrink-0 items-center gap-3" title={`${pct}% through the page`}>
          <span className="sr-only">Chetan Gadhiya, back to top</span>
          <span aria-hidden className="relative grid size-10 place-items-center">
            <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
              <circle cx="20" cy="20" r={R} fill="none" stroke="var(--color-line)" strokeWidth="2" />
              <circle ref={ring} cx="20" cy="20" r={R} fill="none" stroke="var(--color-lime)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
            </svg>
            <span className="font-mono text-[11px] font-medium text-ink transition-colors group-hover:text-lime">CG</span>
          </span>
          <span aria-hidden className="hidden font-serif text-xl tracking-tight text-ink sm:inline">Chetan Gadhiya</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={go(l.id)}
              aria-current={active === l.id ? "true" : undefined}
              className={`relative rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${active === l.id ? "text-lime" : "text-muted hover:text-ink"}`}
            >
              {l.label}
              <span aria-hidden className={`absolute inset-x-3 -bottom-px h-px origin-left bg-lime transition-transform duration-300 ${active === l.id ? "scale-x-100" : "scale-x-0"}`} />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="label hidden h-9 items-center gap-2 rounded-md border border-line bg-surface/70 px-3 transition-colors hover:border-lime hover:text-ink sm:flex"
            aria-label="Open command palette"
          >
            <kbd className="rounded border border-line px-1.5 py-px text-[10px] text-ink">Ctrl K</kbd>
          </button>
          <a href="/resume" target="_blank" rel="noopener" className="flex h-9 items-center rounded-md bg-lime px-4 font-mono text-xs font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5">
            Resume
          </a>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md border border-line xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <span ref={bar} aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lime/70" />

      {open && (
        <nav id="mobile-nav" aria-label="Sections" className="border-t border-line bg-base/95 px-4 pb-5 pt-3 xl:hidden">
          <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {LINKS.map((l, i) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className={`flex items-baseline gap-2 rounded-md px-3 py-3 font-mono text-xs uppercase tracking-wider ${active === l.id ? "bg-line/60 text-lime" : "text-ink"}`}>
                  <span className="text-muted">{String(i + 2).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
