type Variant = "net" | "orbit" | "grid" | "waves" | "circuit" | "hex" | "contour" | "dots";

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


function Circuit({ seed }: { seed: number }) {
  const r = rng(seed);
  const traces = Array.from({ length: 9 }, () => {
    let x = Math.round(r() * 20) * 50, y = Math.round(r() * 12) * 50;
    const pts = [[x, y]];
    for (let k = 0; k < 5; k++) {
      if (k % 2 === 0) x += (r() > 0.5 ? 1 : -1) * (1 + Math.floor(r() * 4)) * 50;
      else y += (r() > 0.5 ? 1 : -1) * (1 + Math.floor(r() * 3)) * 50;
      pts.push([x, y]);
    }
    return pts;
  });
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="bd-float absolute inset-0 size-full">
      {traces.map((t, i) => (
        <g key={i}>
          <polyline points={t.map((p) => p.join(",")).join(" ")} fill="none" stroke={i % 3 ? "var(--color-lime)" : "var(--color-cyan)"} strokeOpacity={0.13} strokeWidth={1.4} />
          <circle cx={t[0][0]} cy={t[0][1]} r={4} fill="none" stroke="var(--color-cyan)" strokeOpacity={0.5} />
          <circle cx={t[t.length - 1][0]} cy={t[t.length - 1][1]} r={3} fill="var(--color-lime)" fillOpacity={0.55} />
        </g>
      ))}
    </svg>
  );
}

function Hex({ seed }: { seed: number }) {
  const r = rng(seed);
  const filled = Array.from({ length: 14 }, () => [Math.floor(r() * 20), Math.floor(r() * 9)]);
  const hexes = [];
  for (let row = 0; row < 9; row++) for (let col = 0; col < 20; col++) {
    const cx = col * 52 + (row % 2 ? 26 : 0), cy = row * 45;
    const on = filled.some(([c, rr]) => c === col && rr === row);
    const pts = Array.from({ length: 6 }, (_, k) => `${cx + 29 * Math.cos((Math.PI / 3) * k + Math.PI / 6)},${cy + 29 * Math.sin((Math.PI / 3) * k + Math.PI / 6)}`).join(" ");
    hexes.push(<polygon key={`${row}-${col}`} points={pts} fill={on ? "var(--color-lime)" : "none"} fillOpacity={on ? 0.09 : 0} stroke="var(--color-line)" strokeOpacity={0.7} />);
  }
  return (
    <svg viewBox="0 0 1040 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,black,transparent)]">
      {hexes}
    </svg>
  );
}

function Contour({ seed }: { seed: number }) {
  const r = rng(seed);
  const ph = [r() * 6, r() * 6, r() * 6];
  const rings = Array.from({ length: 11 }, (_, i) => {
    const R = 40 + i * 34;
    let d = "";
    for (let k = 0; k <= 72; k++) {
      const a = (k / 72) * Math.PI * 2;
      const rr = R * (1 + 0.1 * Math.sin(a * 3 + ph[0] + i * 0.2) + 0.06 * Math.sin(a * 5 + ph[1]) + 0.04 * Math.sin(a * 2 + ph[2]));
      d += `${k ? "L" : "M"}${(500 + rr * 1.5 * Math.cos(a)).toFixed(1)},${(300 + rr * 0.85 * Math.sin(a)).toFixed(1)}`;
    }
    return d + "Z";
  });
  return (
    <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="bd-float absolute inset-0 size-full">
      {rings.map((d, i) => <path key={i} d={d} fill="none" stroke={i % 4 === 0 ? "var(--color-cyan)" : "var(--color-lime)"} strokeOpacity={0.09 + (i % 4 === 0 ? 0.08 : 0)} />)}
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
export default function Backdrop({ variant = "net", n, seed = 7, flip = false, className = "inset-0" }: { variant?: Variant; n?: string; seed?: number; flip?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className} bd-root -z-10 overflow-hidden`}>
      <div className={`bd-glow absolute -top-24 size-[620px] rounded-full ${flip ? "-left-40" : "-right-40"}`} style={{ background: "radial-gradient(closest-side, rgba(242,176,94,.14), transparent)" }} />
      <div className={`bd-glow absolute bottom-0 size-[560px] rounded-full ${flip ? "-right-32" : "-left-32"}`} style={{ background: "radial-gradient(closest-side, rgba(95,208,184,.11), transparent)", animationDelay: "-5s" }} />
      {variant === "grid" && <div className="bd-grid absolute inset-0" />}
      {variant === "net" && <Net seed={seed} />}
      {variant === "orbit" && <Orbit />}
      {variant === "waves" && <Waves />}
      {variant === "circuit" && <Circuit seed={seed} />}
      {variant === "hex" && <Hex seed={seed} />}
      {variant === "contour" && <Contour seed={seed} />}
      {variant === "dots" && <div className="bd-dots absolute inset-0" />}
      {n && <span className={`bd-num absolute top-8 font-serif ${flip ? "left-4 sm:left-10" : "right-4 sm:right-10"}`}>{n}</span>}
    </div>
  );
}
