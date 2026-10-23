"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ActivityDay } from "@/lib/activity";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 18;
const OPACITY = [0.9, 0.3, 0.52, 0.76, 1];


/** 3x5 pixel glyphs (rows top to bottom, 3 bits each) for the idle "game" messages */
const GLYPH: Record<string, string[]> = {
  A: ["010", "101", "111", "101", "101"], B: ["110", "101", "110", "101", "110"], C: ["011", "100", "100", "100", "011"],
  E: ["111", "100", "110", "100", "111"], G: ["011", "100", "101", "101", "011"], H: ["101", "101", "111", "101", "101"],
  I: ["111", "010", "010", "010", "111"], K: ["101", "101", "110", "101", "101"], M: ["101", "111", "111", "101", "101"],
  N: ["110", "101", "101", "101", "101"], O: ["010", "101", "101", "101", "010"], P: ["110", "101", "110", "100", "100"],
  R: ["110", "101", "110", "101", "101"], S: ["011", "100", "010", "001", "110"], T: ["111", "010", "010", "010", "010"],
  W: ["101", "101", "111", "111", "101"], " ": ["00", "00", "00", "00", "00"],
};
const MESSAGES = ["HIRE ME", "AI ENGINEER", "I SHIP AGENTS", "OPEN TO WORK"];

/** lit cells for a message as [col, row] in the order a snake would trace them */
function plot(msg: string, cols: number): [number, number][] {
  const glyphs = [...msg].map((ch) => GLYPH[ch] ?? GLYPH[" "]);
  const width = glyphs.reduce((a, g) => a + g[0].length + 1, -1);
  let x0 = Math.max(0, Math.floor((cols - width) / 2));
  const out: [number, number][] = [];
  for (const g of glyphs) {
    for (let c = 0; c < g[0].length; c++) {
      const down = c % 2 === 0;
      for (let k = 0; k < 5; k++) {
        const r = down ? k : 4 - k;
        if (g[r][c] === "1") out.push([x0 + c, r + 1]);
      }
    }
    x0 += g[0].length + 1;
  }
  return out;
}

type Metric = "total" | "github" | "leetcode" | "medium" | "posts";
const FILTERS: { id: Metric; label: string }[] = [
  { id: "total", label: "All" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "medium", label: "Medium" },
  { id: "posts", label: "Posts" },
];

/**
 * The activity year as a living grid: cells ripple in when it scrolls into view, you can switch the source,
 * replay the wave, and hover any day. Dates arrive as a start day plus counts to keep the page payload small.
 */
export default function Heatmap({ from, counts }: { from: string; counts: number[][] }) {
  const days = useMemo<ActivityDay[]>(
    () =>
      counts.map(([total, github, leetcode, medium, posts], i) => {
        const d = new Date(from + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + i);
        return { date: d.toISOString().slice(0, 10), total, github, leetcode, medium, posts };
      }),
    [from, counts],
  );
  const [metric, setMetric] = useState<Metric>("total");
  const [run, setRun] = useState(0); // bump to replay the wave
  const [play, setPlay] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState(0);
  const [step, setStep] = useState(0);
  const [game, setGame] = useState(false); // the idle snake game; off under reduced motion

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const reduce = document.documentElement.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = requestAnimationFrame(() => setGame(!reduce));
    return () => cancelAnimationFrame(id);
  }, []);

  const { start, cols, months, max, stats } = useMemo(() => {
    const start = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const cols = Math.ceil((days.length + start) / 7);
    const months: { x: number; label: string }[] = [];
    let last = "";
    days.forEach((d, i) => {
      const m = d.date.slice(0, 7);
      if (m === last) return;
      last = m;
      const x = Math.floor((i + start) / 7) * STEP;
      if (!months.length || x - months[months.length - 1].x >= 3 * STEP) months.push({ x, label: new Date(d.date + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }) });
    });
    const vals = days.map((d) => d[metric]);
    const max = Math.max(1, ...vals);
    let streak = 0;
    for (let i = vals.length - 1; i >= 0; i--) { if (vals[i] > 0) streak++; else if (i !== vals.length - 1) break; }
    const best = vals.indexOf(Math.max(...vals));
    return { start, cols, months, max, stats: { active: vals.filter((v) => v > 0).length, streak, best, total: vals.reduce((a, b) => a + b, 0) } };
  }, [days, metric]);

  const path = useMemo(() => plot(MESSAGES[msg], cols), [msg, cols]);
  useEffect(() => {
    if (!game || over || !play) return;
    const id = window.setInterval(() => {
      setStep((st) => {
        if (st > path.length + 34) { setMsg((m) => (m + 1) % MESSAGES.length); return 0; }
        return st + 1;
      });
    }, 55);
    return () => window.clearInterval(id);
  }, [game, over, play, path.length]);

  const level = (n: number) => (n === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((4 * n) / max))));
  const width = cols * STEP;
  const height = TOP + 7 * STEP;
  const d = hot !== null ? days[hot] : null;

  return (
    <div ref={box}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Activity source" className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={metric === f.id}
              onClick={() => { setMetric(f.id); setRun((r) => r + 1); }}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${metric === f.id ? "border-lime bg-lime/10 text-lime" : "border-line text-muted hover:text-ink"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { setPlay(true); setRun((r) => r + 1); }} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted transition-colors hover:border-lime hover:text-ink">
          ↻ replay
        </button>
      </div>

      <div className="relative" onPointerEnter={() => setOver(true)} onPointerLeave={() => { setHot(null); setTip(null); setOver(false); }}>
        <div className="noscroll-x overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Activity for the last 365 days: ${stats.total} events, ${stats.active} active days.`} className={`h-auto w-full min-w-[640px] ${play ? "hm-play" : "hm-wait"}`} key={run}>
            {months.map((m) => (
              <text key={m.x} x={m.x} y={9} className="fill-muted" fontSize={9} fontFamily="var(--font-jetbrains)">{m.label}</text>
            ))}
            {days.map((day, i) => {
              const col = Math.floor((i + start) / 7);
              const row = (i + start) % 7;
              const l = level(day[metric]);
              return (
                <rect
                  key={day.date}
                  x={col * STEP}
                  y={TOP + row * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2.5}
                  className={`hm-cell ${l ? "fill-lime" : "fill-line"} ${i === days.length - 1 ? "today" : ""} ${hot === i ? "hot" : ""}`}
                  fillOpacity={OPACITY[l]}
                  style={{ "--c": col } as React.CSSProperties}
                  onPointerEnter={(e) => {
                    const host = box.current?.getBoundingClientRect();
                    const r = (e.target as SVGRectElement).getBoundingClientRect();
                    setHot(i);
                    if (host) setTip({ x: r.left - host.left + r.width / 2, y: r.top - host.top });
                  }}
                />
              );
            })}
            {game && play && (
              <g style={{ opacity: over ? 0 : 1, transition: "opacity .45s", pointerEvents: "none" }}>
                <rect x={-6} y={TOP - 6} width={width + 12} height={7 * STEP + 8} rx={8} fill="var(--color-surface)" fillOpacity={0.92} />
                {path.slice(0, Math.min(step, path.length)).map(([c, r], i) => {
                  const shown = Math.min(step, path.length);
                  const head = i === shown - 1 && step <= path.length;
                  const age = shown - 1 - i;
                  return (
                    <rect key={`${msg}-${i}`} x={c * STEP} y={TOP + r * STEP} width={CELL} height={CELL} rx={2.5} fill={head ? "var(--color-ink)" : age < 5 && step <= path.length ? "var(--color-cyan)" : "var(--color-lime)"} />
                  );
                })}
              </g>
            )}
          </svg>
        </div>
        {game && play && (
          <p className={`pointer-events-none absolute right-2 -top-6 font-mono text-[10px] text-muted transition-opacity duration-300 ${over ? "opacity-0" : "opacity-100"}`}>
            <span className="pulse-dot mr-1.5 inline-block size-1.5 rounded-full bg-lime align-middle" />hover the grid for the real data
          </p>
        )}
        {d && tip && (
          <div role="status" className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] whitespace-nowrap rounded-md border border-line bg-base px-3 py-2 font-mono text-[11px] text-ink shadow-lg" style={{ left: Math.max(tip.x, 90), top: tip.y }}>
            <span className="text-lime">{d[metric]}</span> on {d.date}
            {metric === "total" && d.total > 0 && <span className="text-muted"> · GH {d.github} · LC {d.leetcode} · MD {d.medium} · posts {d.posts}</span>}
          </div>
        )}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 sm:grid-cols-4">
        {[
          ["events", stats.total],
          ["active days", stats.active],
          ["current streak", `${stats.streak}d`],
          ["best day", days[stats.best][metric] > 0 ? `${days[stats.best][metric]} · ${days[stats.best].date.slice(5)}` : "—"],
        ].map(([k, v]) => (
          <div key={k as string}>
            <dt className="label">{k}</dt>
            <dd className="mt-1 font-serif text-3xl text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
