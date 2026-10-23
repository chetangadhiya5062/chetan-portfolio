"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; hue: 0 | 1 };

/**
 * A slow field of drifting nodes behind the hero. Close nodes connect, and the pointer acts as a query:
 * nodes near it link to it and glow, a small picture of attention. Paused off-screen; a still frame for reduced motion.
 */
export default function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const root = document.documentElement;
    const reduce = () => root.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const AMBER = "242,176,94", TEAL = "95,208,184";
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true;
    let pts: P[] = [];
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(26, (w * h) / 22000)));
      pts = Array.from({ length: n }, (_, i) => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, hue: (i % 3 === 0 ? 1 : 0) as 0 | 1,
      }));
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (move) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${a.hue ? TEAL : AMBER},${(1 - d / 130) * 0.16})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (dm < 190) {
          ctx.strokeStyle = `rgba(${AMBER},${(1 - dm / 190) * 0.55})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(${a.hue ? TEAL : AMBER},${dm < 190 ? 0.95 : 0.4})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, dm < 190 ? 2.6 : 1.7, 0, 7); ctx.fill();
      }
    };

    const loop = () => {
      raf = 0;
      if (!visible || reduce()) return;
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible && !reduce()) raf = requestAnimationFrame(loop); };

    resize();
    draw(false);
    kick();
    const onResize = () => { resize(); draw(false); };
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -999; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(c);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />;
}
