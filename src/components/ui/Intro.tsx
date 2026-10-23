"use client";

import { useEffect, useRef, useState } from "react";

const LAYERS = [4, 7, 8, 7, 4];
const DURATION = 2600;

/**
 * First-visit boot: a small feed-forward network on a canvas. Nodes light up layer by layer as a
 * signal pulse crosses it, then the overlay fades away. Plays once per session, any key / click / scroll skips it.
 * The page underneath is already in the HTML, so the h1 is never hidden from crawlers or screen readers.
 */
export default function Intro() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = root.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try { seen = sessionStorage.getItem("intro-seen") === "1"; } catch { /* ignore */ }
    if (reduce || seen) {
      root.classList.add("intro-seen"); // CSS hides the overlay
      return;
    }
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) { root.classList.add("intro-seen"); return; }

    let w = 0, h = 0, dpr = 1, raf = 0, done = false;
    const start = performance.now();
    type N = { x: number; y: number; l: number };
    let nodes: N[] = [];

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padX = Math.min(w * 0.12, 140), top = h * 0.2, bottom = h * 0.78;
      nodes = [];
      LAYERS.forEach((count, l) => {
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: padX + ((w - padX * 2) * l) / (LAYERS.length - 1),
            y: top + ((bottom - top) * (i + 0.5)) / count,
            l,
          });
        }
      });
    };
    layout();
    window.addEventListener("resize", layout);

    const finish = () => {
      if (done) return;
      done = true;
      // only sessionStorage here: toggling the html class now would change running decode animations' delays
      try { sessionStorage.setItem("intro-seen", "1"); } catch { /* ignore */ }
      setLeaving(true);
      window.setTimeout(() => setGone(true), 650);
    };
    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    const frame = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      ctx.clearRect(0, 0, w, h);
      // wavefront position in layer units; each layer glows as the front passes
      const front = t * (LAYERS.length + 0.6) - 0.3;

      ctx.lineWidth = 1;
      for (let a = 0; a < nodes.length; a++) {
        for (let b = 0; b < nodes.length; b++) {
          const A = nodes[a], B = nodes[b];
          if (B.l !== A.l + 1) continue;
          const lit = Math.max(0, Math.min(1, front - A.l));
          ctx.strokeStyle = `rgba(95,208,184,${0.04 + lit * 0.2 * (1 - Math.max(0, front - A.l - 1.2))})`;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        const d = front - n.l;
        const glow = d < 0 ? 0 : Math.max(0, 1 - d / 1.4);
        const r = 3 + glow * 4;
        if (glow > 0) {
          ctx.fillStyle = `rgba(242,176,94,${glow * 0.18})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 10, 0, 7); ctx.fill();
        }
        ctx.fillStyle = glow > 0 ? `rgba(242,176,94,${0.45 + glow * 0.55})` : "rgba(155,148,134,0.45)";
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
      }
      if (t < 1) raf = requestAnimationFrame(frame);
      else finish();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", layout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, []);

  if (gone) return null;
  return (
    <div className={`intro ${leaving ? "intro-out" : ""}`} aria-hidden>
      <canvas ref={canvas} className="absolute inset-0 size-full" />
      <p className="label absolute inset-x-0 bottom-[10%] text-center">
        <span className="text-lime">forward pass</span> · loading weights · click or press any key to skip
      </p>
    </div>
  );
}
