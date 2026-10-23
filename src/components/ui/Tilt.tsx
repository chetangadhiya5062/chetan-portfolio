"use client";

import { useRef } from "react";

type Mode = "tilt" | "soft" | "cred";

/**
 * Hover effects for the proof cards. `tilt`: the card leans toward the pointer in 3-D with a moving glare and its
 * contents lift off the surface. `soft`: a gentler lean plus a pointer-following border light. `cred`: the card rises,
 * a spotlight follows the pointer and the badge spins up. Disabled on touch and with reduced motion.
 */
export default function Tilt({ mode = "tilt", className = "", children }: { mode?: Mode; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const ok = () => window.matchMedia("(hover: hover)").matches && !document.documentElement.classList.contains("reduce-motion") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !ok()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    const max = mode === "tilt" ? 11 : mode === "soft" ? 5 : 0;
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`fx fx-${mode} ${className}`}>
      <span aria-hidden className="fx-glare" />
      {children}
    </div>
  );
}
