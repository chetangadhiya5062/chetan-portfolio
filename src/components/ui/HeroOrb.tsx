"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Llama 3", "LangGraph", "RAG", "MCP", "Qdrant", "Agents", "FastAPI", "Kafka", "Gemini", "Embeddings", "CrewAI", "Docker"];
const N = 190;

/**
 * An embedding "orb": points on a sphere slowly rotate, near points link, tool names ride the surface.
 * The pointer tilts it. Paused off-screen; a single still frame for reduced motion.
 */
export default function HeroOrb() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const root = document.documentElement;
    const reduce = () => root.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * 2.399963;
      return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, t: i % 4 === 0, word: i % 16 === 3 ? WORDS[(i / 16) | 0] : "" };
    });
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, rotY = 0.6, rotX = 0.35, tx = 0.35, ty = 0;
    const resize = () => {
      const r = c.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.4, cx = w / 2, cy = h / 2;
      const cyw = Math.cos(rotY), syw = Math.sin(rotY), cxw = Math.cos(rotX), sxw = Math.sin(rotX);
      const P = pts.map((p) => {
        const x1 = p.x * cyw + p.z * syw, z1 = -p.x * syw + p.z * cyw;
        const y2 = p.y * cxw - z1 * sxw, z2 = p.y * sxw + z1 * cxw;
        const s = 1 / (1.6 - z2 * 0.5);
        return { sx: cx + x1 * R * s * 1.3, sy: cy + y2 * R * s * 1.3, z: z2, t: p.t, word: p.word, s };
      });
      // ring + glow
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      g.addColorStop(0, "rgba(242,176,94,0.10)");
      g.addColorStop(0.6, "rgba(95,208,184,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(242,237,227,0.07)";
      for (const k of [1.18, 1.45]) { ctx.beginPath(); ctx.ellipse(cx, cy, R * k, R * k * 0.34, -0.35, 0, 7); ctx.stroke(); }
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j];
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
          if (d < R * 0.36) {
            const al = (1 - d / (R * 0.36)) * 0.3 * ((a.z + b.z + 2) / 4);
            ctx.strokeStyle = a.t ? `rgba(95,208,184,${al})` : `rgba(242,176,94,${al})`;
            ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
          }
        }
      }
      for (const p of [...P].sort((a, b) => a.z - b.z)) {
        const al = 0.25 + ((p.z + 1) / 2) * 0.75;
        ctx.fillStyle = p.t ? `rgba(95,208,184,${al})` : `rgba(242,176,94,${al})`;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, (p.word ? 3.6 : 2.1) * p.s * 1.4, 0, 7); ctx.fill();
        if (p.word && p.z > -0.15) {
          ctx.font = '500 12px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = `rgba(242,237,227,${0.35 + ((p.z + 1) / 2) * 0.65})`;
          ctx.fillText(p.word, p.sx + 9, p.sy + 4);
        }
      }
    };
    const loop = () => {
      raf = 0;
      if (!visible || reduce()) return;
      rotY += 0.0032;
      rotX += (tx - rotX) * 0.04;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible && !reduce()) raf = requestAnimationFrame(loop); };
    resize(); draw(); kick();
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      tx = 0.35 + ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 0.7;
      ty = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5);
      rotY += ty * 0.002;
    };
    const onResize = () => { resize(); draw(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(c);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none size-full" />;
}
