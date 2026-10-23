"use client";

import { useEffect, useRef, useState } from "react";

const LAYERS = [5, 8, 9, 8, 5];
const LABELS = ["input", "hidden 1", "hidden 2", "hidden 3", "output"];
const INPUTS = ["who", "builds", "RAG", "agents", "?"];
const OUTPUTS: [string, number][] = [["Chetan", 0.94], ["Gadhiya", 0.88], ["AI", 0.82], ["agentic", 0.58], ["RAG", 0.66]];
const DURATION = 2600;

/**
 * First-visit boot: a feed-forward network on a canvas. Every node carries an activation value that is computed as the
 * wavefront reaches it (the digits scramble, then settle). The output layer settles on the tokens the hero then decodes.
 * Plays once per session; any key / click / scroll skips it. The page underneath is already in the HTML.
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
    type N = { x: number; y: number; l: number; i: number; v: number; seed: number };
    let nodes: N[] = [];
    let ex = 0;
    // fixed final activations (deterministic) so the settled numbers are stable
    const finalVal = (l: number, i: number) => (l === LAYERS.length - 1 ? OUTPUTS[i][1] : ((Math.sin(l * 12.9898 + i * 78.233) * 43758.5453) % 1 + 1) % 1);

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const padL = Math.min(w * 0.14, 170), padR = Math.min(w * 0.17, 210);
      const top = h * 0.2, bottom = h * 0.8;
      ex = w < 640 ? 0.8 : 1;
      nodes = [];
      LAYERS.forEach((count, l) => {
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: padL + ((w - padL - padR) * l) / (LAYERS.length - 1),
            y: top + ((bottom - top) * (i + 0.5)) / count,
            l, i, v: finalVal(l, i), seed: l * 31 + i * 7,
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
      const front = t * (LAYERS.length + 0.5) - 0.25;
      const mono = `${Math.round(11 * ex)}px "JetBrains Mono", ui-monospace, monospace`;

      // faint scan grid
      ctx.strokeStyle = "rgba(242,237,227,0.035)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 48) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 48) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // weighted edges + travelling pulses
      for (let a = 0; a < nodes.length; a++) {
        for (let b = 0; b < nodes.length; b++) {
          const A = nodes[a], B = nodes[b];
          if (B.l !== A.l + 1) continue;
          const wgt = Math.abs(Math.sin(a * 1.7 + b * 0.9));
          const lit = Math.max(0, Math.min(1, front - A.l));
          const fade = 1 - Math.max(0, front - A.l - 1.4) * 0.5;
          const col = wgt > 0.55 ? "242,176,94" : "95,208,184";
          ctx.strokeStyle = `rgba(${col},${0.03 + lit * wgt * 0.32 * fade})`;
          ctx.lineWidth = 0.6 + lit * wgt * 1.2;
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
          if (lit > 0 && lit < 1 && wgt > 0.6) {
            const px = A.x + (B.x - A.x) * lit, py = A.y + (B.y - A.y) * lit;
            ctx.fillStyle = `rgba(${col},0.95)`;
            ctx.beginPath(); ctx.arc(px, py, 2, 0, 7); ctx.fill();
          }
        }
      }

      // nodes with live activation numbers
      for (const n of nodes) {
        const d = front - n.l;
        const glow = d < 0 ? 0 : Math.max(0, 1 - d / 1.6);
        const settled = d > 0.55;
        const show = d < 0 ? null : settled ? n.v : (Math.abs(Math.sin(now * 0.02 + n.seed)) * 0.99);
        const out = n.l === LAYERS.length - 1;
        const r = (out ? 6.5 : 5) * ex + glow * 3;
        if (glow > 0) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 18);
          g.addColorStop(0, `rgba(242,176,94,${glow * 0.35})`);
          g.addColorStop(1, "rgba(242,176,94,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, r + 18, 0, 7); ctx.fill();
        }
        ctx.fillStyle = d >= 0 ? `rgba(242,176,94,${0.55 + glow * 0.45})` : "rgba(155,148,134,0.4)";
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 7); ctx.fill();
        ctx.strokeStyle = d >= 0 ? "rgba(242,237,227,0.5)" : "rgba(155,148,134,0.25)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = mono;
        if (show !== null && !out) {
          ctx.fillStyle = settled ? "rgba(242,237,227,0.78)" : "rgba(95,208,184,0.95)";
          ctx.textAlign = "center";
          ctx.fillText(show.toFixed(2), n.x, n.y - r - 7);
        }
        if (n.l === 0) {
          ctx.textAlign = "right";
          ctx.fillStyle = d >= 0 ? "rgba(242,237,227,0.9)" : "rgba(155,148,134,0.6)";
          ctx.font = `${Math.round(13 * ex)}px "JetBrains Mono", ui-monospace, monospace`;
          ctx.fillText(INPUTS[n.i], n.x - r - 10, n.y + 4);
        }
        if (out) {
          ctx.textAlign = "left";
          ctx.font = `${Math.round(15 * ex)}px "JetBrains Mono", ui-monospace, monospace`;
          if (show !== null) {
            ctx.fillStyle = settled ? "rgba(242,176,94,1)" : "rgba(242,237,227,0.55)";
            ctx.fillText(settled ? OUTPUTS[n.i][0] : "···", n.x + r + 12, n.y + 1);
            ctx.font = mono;
            ctx.fillStyle = settled ? "rgba(95,208,184,1)" : "rgba(95,208,184,0.7)";
            ctx.fillText(`p=${show.toFixed(2)}`, n.x + r + 12, n.y + 16 * ex);
          }
        }
      }

      // layer captions + progress
      ctx.font = `${Math.round(10 * ex)}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textAlign = "center";
      LAYERS.forEach((_, l) => {
        const x = nodes.find((n) => n.l === l)!.x;
        ctx.fillStyle = front >= l ? "rgba(242,176,94,0.9)" : "rgba(155,148,134,0.5)";
        ctx.fillText(LABELS[l].toUpperCase(), x, h * 0.2 - 28);
      });
      ctx.fillStyle = "rgba(242,237,227,0.1)";
      ctx.fillRect(w * 0.2, h * 0.9, w * 0.6, 2);
      ctx.fillStyle = "rgba(242,176,94,0.95)";
      ctx.fillRect(w * 0.2, h * 0.9, w * 0.6 * t, 2);

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
      <p className="label absolute inset-x-0 bottom-[6%] text-center">
        <span className="text-lime">forward pass</span> · computing activations · click or press any key to skip
      </p>
    </div>
  );
}
