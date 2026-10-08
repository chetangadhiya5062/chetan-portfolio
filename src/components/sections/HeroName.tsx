"use client";

import { useEffect, useRef, useState } from "react";
import { onMotionChange, prefersReducedMotion } from "@/lib/motion";

const VERT = `
attribute vec2 a_pos;
attribute vec3 a_col;
uniform vec2 u_res;
uniform float u_size;
varying vec3 v_col;
void main() {
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = u_size;
  v_col = a_col;
}`;

const FRAG = `
precision mediump float;
varying vec3 v_col;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.15, d);
  gl_FragColor = vec4(v_col * a, a);
}`;

function lowPower() {
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return !!n.connection?.saveData || (n.hardwareConcurrency ?? 8) <= 2 || (n.deviceMemory ?? 8) <= 2;
}

/**
 * The name, assembled from a particle field that reacts to the cursor.
 * The <h1> always exists (SEO, screen readers, no-JS, reduced motion, low-power, no WebGL):
 * it is only made transparent once the canvas is actually drawing.
 */
export default function HeroName({ lines }: { lines: string[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    return onMotionChange(setReduced);
  }, []);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv || reduced || lowPower()) return;

    const gl = cv.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power", premultipliedAlpha: true });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aCol = gl.getAttribLocation(prog, "a_col");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uSize = gl.getUniformLocation(prog, "u_size");
    const posBuf = gl.createBuffer();
    const colBuf = gl.createBuffer();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let W = 0, H = 0, dpr = 1, count = 0;
    let hx = new Float32Array(0), hy = new Float32Array(0);
    let px = new Float32Array(0), py = new Float32Array(0);
    let vx = new Float32Array(0), vy = new Float32Array(0);
    let pos = new Float32Array(0);
    let raf = 0, visible = true, running = false;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cv.width = W * dpr;
      cv.height = H * dpr;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uSize, Math.max(2.2, 2.6 * dpr * (W < 520 ? 0.8 : 1)));

      // rasterise the name off-screen and sample it
      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const c = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(document.body).getPropertyValue("--font-space").trim() || "sans-serif";
      let size = Math.min(H / (lines.length * 0.98), 280);
      const fontOf = (s: number) => `700 ${s}px ${family}, ui-sans-serif, system-ui, sans-serif`;
      c.font = fontOf(size);
      const widest = Math.max(...lines.map((l) => c.measureText(l).width));
      if (widest > W * 0.98) size *= (W * 0.98) / widest;
      c.font = fontOf(size);
      c.fillStyle = "#fff";
      c.textBaseline = "alphabetic";
      const lh = size * 0.96;
      const top = (H - lh * lines.length) / 2 + size * 0.82;
      lines.forEach((l, i) => c.fillText(l, 0, top + i * lh));

      const data = c.getImageData(0, 0, W, H).data;
      let gap = Math.max(4, Math.round(W / 190));
      let pts: number[] = [];
      for (let attempt = 0; attempt < 4; attempt++) {
        pts = [];
        for (let y = 0; y < H; y += gap)
          for (let x = 0; x < W; x += gap)
            if (data[(y * W + x) * 4 + 3] > 140) pts.push(x, y);
        if (pts.length / 2 <= 7000) break;
        gap += 1;
      }
      count = pts.length / 2;
      hx = new Float32Array(count); hy = new Float32Array(count);
      px = new Float32Array(count); py = new Float32Array(count);
      vx = new Float32Array(count); vy = new Float32Array(count);
      pos = new Float32Array(count * 2);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        hx[i] = pts[i * 2] + gap / 2;
        hy[i] = pts[i * 2 + 1] + gap / 2;
        // data streams in from the right edge, like a forward pass
        px[i] = W + Math.random() * W * 0.6;
        py[i] = Math.random() * H;
        const cyan = Math.random() < 0.12;
        col[i * 3] = cyan ? 0.24 : 0.776;
        col[i * 3 + 1] = cyan ? 0.878 : 1;
        col[i * 3 + 2] = cyan ? 1 : 0.239;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
      gl.bufferData(gl.ARRAY_BUFFER, col, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aCol);
      gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos.byteLength, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const R = Math.min(120, Math.max(70, W * 0.09));
      const R2 = R * R;
      for (let i = 0; i < count; i++) {
        let ax = (hx[i] - px[i]) * 0.045;
        let ay = (hy[i] - py[i]) * 0.045;
        const dx = px[i] - mouse.x;
        const dy = py[i] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const f = (1 - d2 / R2) * 5.2;
          const d = Math.sqrt(d2) || 1;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }
        vx[i] = (vx[i] + ax) * 0.82;
        vy[i] = (vy[i] + ay) * 0.82;
        px[i] += vx[i];
        py[i] += vy[i];
        pos[i * 2] = px[i];
        pos[i * 2 + 1] = py[i];
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
      gl.drawArrays(gl.POINTS, 0, count);
    };

    const start = () => {
      if (!running && visible && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const onVis = () => (document.hidden ? stop() : start());

    let resizeT = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => { build(); }, 150);
    });
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });

    const setup = () => {
      build();
      setLive(true);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", onVis);
      ro.observe(host);
      io.observe(host);
      start();
    };
    // wait for the display font so the sampled glyphs are the real ones
    let cancelled = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => !cancelled && setup());

    return () => {
      cancelled = true;
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeT);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      setLive(false);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [lines, reduced]);

  return (
    <div ref={wrap} className="relative h-[30svh] min-h-[190px] w-full sm:h-[38svh] lg:h-[46svh]">
      <h1
        className={`absolute inset-0 flex flex-col justify-center font-display text-[clamp(3.2rem,15.5vw,13rem)] font-bold uppercase leading-[0.92] tracking-tight text-ink transition-opacity duration-700 ${
          live ? "opacity-0" : "opacity-100"
        }`}
      >
        {lines.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
        <span className="sr-only"> — AI Engineer</span>
      </h1>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
    </div>
  );
}
