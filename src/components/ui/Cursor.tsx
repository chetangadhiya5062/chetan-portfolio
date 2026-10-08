"use client";

import { useEffect, useRef } from "react";

/** Custom cursor: fine pointers only (never touch), hidden for reduced motion. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || document.documentElement.classList.contains("reduce-motion")) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, grow = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      grow = !!t?.closest("a, button, [role=button], input, [data-cursor]");
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${grow ? 1.9 : 1})`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[70] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="absolute -left-4 -top-4 size-8 rounded-full border border-lime/70 transition-[scale] duration-300" />
      <div ref={dot} className="absolute -left-[3px] -top-[3px] size-1.5 rounded-full bg-lime" />
    </div>
  );
}
