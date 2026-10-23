"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ActivityDay } from "@/lib/activity";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 18;
const OPACITY = [0.9, 0.3, 0.52, 0.76, 1];

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

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
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

      <div className="relative" onPointerLeave={() => { setHot(null); setTip(null); }}>
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
          </svg>
        </div>
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
