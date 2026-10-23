"use client";

import { useEffect, useRef, useState } from "react";

const LAYERS = [5, 9, 11, 9, 5];
const INPUTS = ["who", "builds", "RAG", "agents", "?"];
const OUTPUTS: [string, number][] = [["Chetan", 0.94], ["Gadhiya", 0.88], ["AI", 0.82], ["agentic", 0.58], ["RAG", 0.66]];
const DURATION = 2600;

type N = { x: number; y: number; l: number; i: number; thr: number; charge: number; fire: number; val: number };
type E = { a: number; b: number; w: number; cx: number; cy: number; start: number; arrive: number };

/**
 * First-visit boot: a spiking network. Neurons sit at irregular positions, wiring is random (skip links, sideways links,
 * the odd feedback link) and activity does not march layer by layer: input neurons fire at random moments, spikes travel
 * along curved fibres with random delays, and a neuron fires once enough charge has arrived. The schedule is simulated once
 * up front, so the output layer is always reached before the end. Plays once per session; any key / click / scroll skips it.
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

    let w = 0, h = 0, dpr = 1, raf = 0, done = false, ex = 1;
    const start = performance.now();
    let nodes: N[] = [];
    let edges: E[] = [];
    const r = Math.random;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ex = w < 640 ? 0.8 : 1;
      const padL = Math.min(w * 0.14, 170), padR = Math.min(w * 0.17, 210);
      const top = h * 0.17, bottom = h * 0.83, span = (w - padL - padR) / (LAYERS.length - 1);
      nodes = [];
      LAYERS.forEach((count, l) => {
        const io = l === 0 || l === LAYERS.length - 1;
        for (let i = 0; i < count; i++) {
          nodes.push({
            x: padL + span * l + (io ? 0 : (r() - 0.5) * span * 0.7),
            y: top + ((bottom - top) * (i + (io ? 0.5 : 0.15 + r() * 0.7))) / count,
            l, i, thr: 0.35 + r() * 0.55, charge: 0, fire: -1, val: 0,
          });
        }
      });
      const byLayer = LAYERS.map((_, l) => nodes.map((n, k) => [n, k] as const).filter(([n]) => n.l === l).map(([, k]) => k));
      edges = [];
      const link = (a: number, b: number) => {
        if (a === b || edges.some((e) => e.a === a && e.b === b)) return;
        const A = nodes[a], B = nodes[b];
        const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1;
        const off = (r() - 0.5) * len * 0.35;
        edges.push({ a, b, w: 0.3 + r() * 0.45, cx: mx - (dy / len) * off, cy: my + (dx / len) * off, start: 0, arrive: 0 });
      };
      nodes.forEach((n, k) => {
        const next = byLayer[n.l + 1], skip = byLayer[n.l + 2], same = byLayer[n.l], back = byLayer[n.l - 1];
        if (next) for (let q = 0; q < 2 + ((r() * 3) | 0); q++) link(k, next[(r() * next.length) | 0]);
        if (skip && r() < 0.3) link(k, skip[(r() * skip.length) | 0]);
        if (n.l > 0 && n.l < LAYERS.length - 1 && r() < 0.18) link(k, same[(r() * same.length) | 0]);
        if (back && n.l > 1 && r() < 0.07) link(k, back[(r() * back.length) | 0]);
      });
      // every neuron past the input gets at least one incoming fibre, so nothing is stranded
      nodes.forEach((n, k) => {
        if (n.l === 0 || edges.some((e) => e.b === k)) return;
        const prev = byLayer[n.l - 1];
        link(prev[(r() * prev.length) | 0], k);
      });

      // simulate the spike schedule (ms)
      const q: { t: number; edge: number }[] = [];
      const fire = (k: number, t: number) => {
        const n = nodes[k];
        if (n.fire >= 0) return;
        n.fire = t;
        n.val = n.l === LAYERS.length - 1 ? OUTPUTS[n.i][1] : 0.08 + r() * 0.9;
        edges.forEach((e, ei) => {
          if (e.a !== k) return;
          e.start = t;
          e.arrive = t + 90 + r() * 200 + Math.hypot(nodes[e.b].x - n.x, nodes[e.b].y - n.y) * 0.25;
          q.push({ t: e.arrive, edge: ei });
        });
      };
      nodes.forEach((n, k) => { if (n.l === 0) fire(k, r() * 420); });
      while (q.length) {
        q.sort((a, b) => a.t - b.t);
        const { t, edge } = q.shift()!;
        const e = edges[edge], B = nodes[e.b];
        B.charge += e.w;
        if (B.fire < 0 && B.charge >= B.thr) fire(e.b, t + 20 + r() * 60);
      }
      // rescale so the last output lands at ~88% of the run; force any straggler to fire
      let maxT = 1;
      nodes.forEach((n) => { if (n.fire >= 0) maxT = Math.max(maxT, n.fire); });
      const k = (DURATION * 0.86) / maxT;
      nodes.forEach((n) => {
        if (n.fire < 0) { n.fire = DURATION * (0.6 + r() * 0.25); n.val = n.l === LAYERS.length - 1 ? OUTPUTS[n.i][1] : r(); }
        else n.fire *= k;
        if (n.l === LAYERS.length - 1) n.fire = Math.min(DURATION * 0.9, n.fire);
      });
      edges.forEach((e) => { e.start = nodes[e.a].fire; e.arrive = Math.max(e.start + 60, nodes[e.b].fire - 10); });
    };
    build();
    window.addEventListener("resize", build);

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

    const mono = (px: number) => `${Math.round(px * ex)}px "JetBrains Mono", ui-monospace, monospace`;
    const frame = (now: number) => {
      const ms = Math.min(now - start, DURATION);
      const t = ms / DURATION;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = "rgba(242,237,227,0.035)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 48) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 48) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // fibres + spikes in flight
      for (const e of edges) {
        const A = nodes[e.a], B = nodes[e.b];
        const p = (ms - e.start) / (e.arrive - e.start);
        const warm = p >= 1 ? Math.max(0.12, 1 - (ms - e.arrive) / 900) : 0;
        const col = e.w > 0.55 ? "242,176,94" : "95,208,184";
        ctx.strokeStyle = `rgba(${col},${0.05 + warm * 0.3 * e.w * 1.6})`;
        ctx.lineWidth = 0.6 + warm * e.w * 1.8;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(e.cx, e.cy, B.x, B.y); ctx.stroke();
        if (p > 0 && p < 1) {
          for (let k = 0; k < 4; k++) {
            const pp = Math.max(0, p - k * 0.05), u = 1 - pp;
            const px = u * u * A.x + 2 * u * pp * e.cx + pp * pp * B.x, py = u * u * A.y + 2 * u * pp * e.cy + pp * pp * B.y;
            ctx.fillStyle = `rgba(${col},${1 - k * 0.24})`;
            ctx.beginPath(); ctx.arc(px, py, (2.6 - k * 0.4) * ex, 0, 7); ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        const since = ms - n.fire;
        const on = since >= 0;
        const glow = on ? Math.max(0, 1 - since / 700) : 0;
        const charged = !on ? Math.min(1, edges.filter((e) => e.b === nodes.indexOf(n) && ms > e.arrive).length * 0.25) : 0;
        const out = n.l === LAYERS.length - 1;
        const rad = (out ? 6.5 : 4 + n.thr * 2) * ex + glow * 3;
        if (glow > 0) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad + 22);
          g.addColorStop(0, `rgba(242,176,94,${glow * 0.45})`);
          g.addColorStop(1, "rgba(242,176,94,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, rad + 22, 0, 7); ctx.fill();
        }
        ctx.fillStyle = on ? `rgba(242,176,94,${0.6 + glow * 0.4})` : `rgba(155,148,134,${0.3 + charged * 0.4})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, rad, 0, 7); ctx.fill();
        ctx.strokeStyle = on ? "rgba(242,237,227,0.55)" : "rgba(155,148,134,0.25)";
        ctx.lineWidth = 1; ctx.stroke();

        const settled = since > 260;
        if (on && !out && n.l > 0) {
          ctx.font = mono(10.5);
          ctx.textAlign = "center";
          ctx.fillStyle = settled ? "rgba(242,237,227,0.7)" : "rgba(95,208,184,0.95)";
          const v = settled ? n.val : Math.abs(Math.sin(now * 0.02 + n.x)) * 0.99;
          ctx.globalAlpha = settled ? Math.max(0.35, 1 - (since - 260) / 1500) : 1;
          ctx.fillText(v.toFixed(2), n.x, n.y - rad - 7);
          ctx.globalAlpha = 1;
        }
        if (n.l === 0) {
          ctx.textAlign = "right";
          ctx.font = mono(13);
          ctx.fillStyle = on ? "rgba(242,237,227,0.95)" : "rgba(155,148,134,0.6)";
          ctx.fillText(INPUTS[n.i], n.x - rad - 10, n.y + 4);
        }
        if (out) {
          ctx.textAlign = "left";
          ctx.font = mono(15);
          if (on) {
            ctx.fillStyle = settled ? "rgba(242,176,94,1)" : "rgba(242,237,227,0.55)";
            ctx.fillText(settled ? OUTPUTS[n.i][0] : "···", n.x + rad + 12, n.y + 1);
            ctx.font = mono(11);
            ctx.fillStyle = "rgba(95,208,184,1)";
            ctx.fillText(`p=${(settled ? n.val : Math.abs(Math.sin(now * 0.02 + n.y)) * 0.99).toFixed(2)}`, n.x + rad + 12, n.y + 16 * ex);
          }
        }
      }

      ctx.font = mono(10);
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(242,176,94,0.85)";
      ctx.fillText("INPUT", nodes[0].x, h * 0.17 - 26);
      ctx.fillStyle = t > 0.8 ? "rgba(242,176,94,0.9)" : "rgba(155,148,134,0.5)";
      ctx.fillText("OUTPUT", nodes[nodes.length - 1].x, h * 0.17 - 26);
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
      window.removeEventListener("resize", build);
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
        <span className="text-lime">forward pass</span> · spikes propagating · click or press any key to skip
      </p>
    </div>
  );
}
