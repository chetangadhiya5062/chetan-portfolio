"use client";

import { useMemo, useState } from "react";
import type { ActivityDay } from "@/lib/activity";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const TOP = 18;
const R = 2.5;

const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4);
const OPACITY = [0.7, 0.28, 0.52, 0.76, 1];

/** Rounded square as one path segment, so a whole intensity level is a single <path>. */
const cell = (x: number, y: number) =>
  `M${x + R},${y}h${CELL - 2 * R}a${R},${R} 0 0 1 ${R},${R}v${CELL - 2 * R}a${R},${R} 0 0 1 -${R},${R}h-${CELL - 2 * R}a${R},${R} 0 0 1 -${R},-${R}v-${CELL - 2 * R}a${R},${R} 0 0 1 ${R},-${R}z`;

/**
 * 365 days drawn as 5 paths (one per intensity level) instead of 365 <rect>s:
 * ~700 fewer DOM nodes to hydrate, style and lay out. Tooltips are computed from pointer position.
 */
export default function Heatmap({ from, counts }: { from: string; counts: number[][] }) {
  // compact props (date of day 0 + [total, github, leetcode, medium, posts] per day) keep the RSC payload small
  const days = useMemo<ActivityDay[]>(
    () =>
      counts.map(([total, github, leetcode, medium, posts], i) => {
        const d = new Date(from + "T00:00:00Z");
        d.setUTCDate(d.getUTCDate() + i);
        return { date: d.toISOString().slice(0, 10), total, github, leetcode, medium, posts };
      }),
    [from, counts],
  );
  const [tip, setTip] = useState<{ i: number; x: number; y: number } | null>(null);

  const { paths, width, months, start } = useMemo(() => {
    const start = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const cols = Math.ceil((days.length + start) / 7);
    const levels: string[][] = [[], [], [], [], []];
    days.forEach((d, i) => {
      const col = Math.floor((i + start) / 7);
      const row = (i + start) % 7;
      levels[level(d.total)].push(cell(col * STEP, TOP + row * STEP));
    });
    const months: { x: number; label: string }[] = [];
    let last = "";
    days.forEach((d, i) => {
      const m = d.date.slice(0, 7);
      if (m === last) return;
      last = m;
      const x = Math.floor((i + start) / 7) * STEP;
      if (!months.length || x - months[months.length - 1].x >= 3 * STEP)
        months.push({ x, label: new Date(d.date + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }) });
    });
    return { paths: levels.map((l) => l.join("")), width: cols * STEP, months, start };
  }, [days]);

  const height = TOP + 7 * STEP;
  const total = days.reduce((s, d) => s + d.total, 0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const svg = e.currentTarget.querySelector("svg");
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * width;
    const sy = ((e.clientY - r.top) / r.height) * height - TOP;
    const col = Math.floor(sx / STEP);
    const row = Math.floor(sy / STEP);
    const i = col * 7 + row - start;
    if (row < 0 || row > 6 || i < 0 || i >= days.length) return setTip(null);
    const host = e.currentTarget.getBoundingClientRect();
    setTip({ i, x: e.clientX - host.left, y: e.clientY - host.top });
  };

  const d = tip ? days[tip.i] : null;

  return (
    <div className="relative" onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      <div className="noscroll-x overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Activity heatmap for the last 365 days: ${total} events across GitHub, LeetCode, Medium and posts.`}
          className="h-auto w-full min-w-[640px]"
        >
          {months.map((m) => (
            <text key={m.x} x={m.x} y={9} className="fill-muted" fontSize={9} fontFamily="var(--font-jetbrains)">
              {m.label}
            </text>
          ))}
          {paths.map((p, l) => (
            <path key={l} d={p} className={l ? "fill-lime" : "fill-line"} fillOpacity={OPACITY[l]} />
          ))}
        </svg>
      </div>
      {d && tip && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-md border border-line bg-base px-3 py-2 font-mono text-[11px] text-ink shadow-lg"
          style={{ left: Math.min(Math.max(tip.x, 90), 9999), top: tip.y }}
        >
          <span className="text-lime">{d.total}</span> on {d.date}
          {d.total > 0 && (
            <span className="text-muted">
              {" "}· GH {d.github} · LC {d.leetcode} · MD {d.medium} · posts {d.posts}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
