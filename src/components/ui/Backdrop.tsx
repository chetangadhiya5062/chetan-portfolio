type Variant = "net" | "orbit" | "grid" | "waves";

/** deterministic pseudo-random so server and client render the same SVG */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function Net({ seed }: { seed: number }) {
  const r = rng(seed);
  const pts = Array.from({ length: 22 }, () => ({ x: r() * 1000, y: r() * 600, t: r() > 0.7 }));
  const edges: [number, number][] = [];
  pts.forEach((a, i) => pts.forEach((b, j) => {
    if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 230) edges.push([i, j]);
  }));
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="bd-float absolute inset-0 size-full">
      {edges.map(([i, j]) => (
        <line key={`${i}-${j}`} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={pts[i].t ? "var(--color-cyan)" : "var(--color-lime)"} strokeOpacity={0.11} />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.t ? 3.2 : 2.4} fill={p.t ? "var(--color-cyan)" : "var(--color-lime)"} fillOpacity={0.35} />
      ))}
    </svg>
  );
}

function Orbit() {
  return (
    <svg viewBox="0 0 800 800" className="bd-spin absolute -right-[18%] top-[6%] w-[min(70vw,760px)]">
      {[360, 290, 220, 150].map((r, i) => (
        <circle key={r} cx={400} cy={400} r={r} fill="none" stroke={i % 2 ? "var(--color-cyan)" : "var(--color-lime)"} strokeOpacity={0.2} strokeDasharray={i % 2 ? "2 9" : "1 0"} />
      ))}
      {[[400, 40, 5], [660, 600, 4], [140, 520, 4], [690, 290, 3]].map(([x, y, rr], i) => (
        <circle key={i} cx={x} cy={y} r={rr} fill="var(--color-lime)" fillOpacity={0.7} />
      ))}
    </svg>
  );
}

function Waves() {
  return (
    <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[55%] w-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} className="bd-wave" style={{ animationDelay: `${i * -1.6}s` }} fill="none" stroke={i % 2 ? "var(--color-cyan)" : "var(--color-lime)"} strokeOpacity={0.14 + i * 0.02} d={`M0 ${220 + i * 28} C 200 ${150 + i * 28}, 320 ${300 + i * 20}, 520 ${220 + i * 28} S 860 ${160 + i * 24}, 1000 ${230 + i * 28}`} />
      ))}
    </svg>
  );
}

/**
 * Decorative section background: a faint pattern, two colour glows and a ghost serif number.
 * Sits behind the content (the parent section needs `relative isolate`). Purely visual, hidden from assistive tech.
 */
export default function Backdrop({ variant = "net", n, seed = 7, flip = false }: { variant?: Variant; n?: string; seed?: number; flip?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
      <div className={`bd-glow absolute -top-24 size-[620px] rounded-full ${flip ? "-left-40" : "-right-40"}`} style={{ background: "radial-gradient(closest-side, rgba(242,176,94,.14), transparent)" }} />
      <div className={`bd-glow absolute bottom-0 size-[560px] rounded-full ${flip ? "-right-32" : "-left-32"}`} style={{ background: "radial-gradient(closest-side, rgba(95,208,184,.11), transparent)", animationDelay: "-5s" }} />
      {variant === "grid" && <div className="bd-grid absolute inset-0" />}
      {variant === "net" && <Net seed={seed} />}
      {variant === "orbit" && <Orbit />}
      {variant === "waves" && <Waves />}
      {n && <span className={`bd-num absolute top-8 font-serif ${flip ? "left-4 sm:left-10" : "right-4 sm:right-10"}`}>{n}</span>}
    </div>
  );
}
