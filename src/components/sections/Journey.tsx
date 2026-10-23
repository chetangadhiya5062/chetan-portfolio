"use client";

import { useEffect, useRef, useState } from "react";
import { journeyMilestones, journeySeries, journeyYears } from "@/content/journey";
import Reveal from "@/components/ui/Reveal";

const W = 900, H = 380, L = 44, R = 24, T = 24, B = 40;
const x = (i: number) => L + (i / (journeyYears.length - 1)) * (W - L - R);
const y = (v: number) => T + (1 - v / 100) * (H - T - B);

/** Smooth line through the points (Catmull-Rom to Bezier) */
function smooth(vals: number[]) {
  const pts = vals.map((v, i) => [x(i), y(v)] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/** Four years of growth as a chart: lines draw in on scroll, hover or tap a year to read each skill level and what happened. */
export default function Journey() {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [yr, setYr] = useState(journeyYears.length - 1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const year = journeyYears[yr];
  return (
    <div className="mt-20 md:mt-28">
      <Reveal as="h3" className="label mb-3">Learning curve · {journeyYears[0]} to {journeyYears[journeyYears.length - 1]} · self-assessed</Reveal>
      <Reveal as="p" className="mb-6 max-w-2xl font-serif text-3xl leading-tight text-ink md:text-4xl">Four years, one direction: from <em className="text-lime">fundamentals</em> to systems that run themselves.</Reveal>
      <Reveal className="spot rounded-2xl border border-line bg-surface/80 p-4 md:p-7">
        <div ref={box} className="grid gap-6 lg:grid-cols-[1fr_270px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Skill growth from ${journeyYears[0]} to ${journeyYears[journeyYears.length - 1]}: ${journeySeries.map((s) => `${s.label} ${s.values[0]} to ${s.values[s.values.length - 1]}`).join("; ")}.`}
            className="h-auto w-full touch-pan-y"
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = ((e.clientX - r.left) / r.width) * W;
              setYr(Math.max(0, Math.min(journeyYears.length - 1, Math.round(((px - L) / (W - L - R)) * (journeyYears.length - 1)))));
            }}
          >
            <defs>
              {journeySeries.map((s) => (
                <linearGradient key={s.id} id={`jg-${s.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={s.color} stopOpacity={0.22} />
                  <stop offset="1" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeDasharray="2 6" />
                <text x={L - 10} y={y(v) + 4} textAnchor="end" fontSize={10} fill="var(--color-muted)" fontFamily="var(--font-jetbrains), monospace">{v}</text>
              </g>
            ))}
            {journeySeries.map((s, k) => {
              const d = smooth(s.values);
              return (
                <g key={s.id}>
                  <path d={`${d} L${x(s.values.length - 1)},${y(0)} L${x(0)},${y(0)} Z`} fill={`url(#jg-${s.id})`} opacity={on ? 1 : 0} style={{ transition: `opacity 1s ${0.4 + k * 0.15}s` }} />
                  <path d={d} pathLength={1} fill="none" stroke={s.color} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={on ? 0 : 1} style={{ transition: `stroke-dashoffset 1.6s ${k * 0.18}s cubic-bezier(.22,1,.36,1)` }} />
                  {s.values.map((v, i) => (
                    <circle key={i} cx={x(i)} cy={y(v)} r={i === yr ? 6 : 3.5} fill={i === yr ? s.color : "var(--color-base)"} stroke={s.color} strokeWidth={2} style={{ transition: "r .2s" }} opacity={on ? 1 : 0} />
                  ))}
                </g>
              );
            })}
            <line x1={x(yr)} x2={x(yr)} y1={T} y2={H - B} stroke="var(--color-lime)" strokeOpacity={0.5} strokeDasharray="3 4" />
            {journeyYears.map((yy, i) => (
              <text key={yy} x={x(i)} y={H - 12} textAnchor="middle" fontSize={12} fontFamily="var(--font-jetbrains), monospace" fill={i === yr ? "var(--color-lime)" : "var(--color-muted)"} style={{ cursor: "pointer" }} onClick={() => setYr(i)}>{yy}</text>
            ))}
          </svg>

          <div aria-live="polite">
            <p className="font-serif text-5xl text-lime">{year}</p>
            <p className="mt-2 text-sm leading-snug text-ink">{journeyMilestones[year]}</p>
            <ul className="mt-5 space-y-3">
              {journeySeries.map((s) => (
                <li key={s.id}>
                  <div className="flex items-baseline justify-between font-mono text-[11px]">
                    <span className="flex items-center gap-2 text-muted"><span aria-hidden className="size-2 rounded-full" style={{ background: s.color }} />{s.label}</span>
                    <span className="text-ink">{s.values[yr]}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${s.values[yr]}%`, background: s.color }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ol className="mt-4 flex flex-wrap gap-2 lg:hidden" aria-label="Pick a year">
          {journeyYears.map((yy, i) => (
            <li key={yy}><button type="button" aria-pressed={i === yr} onClick={() => setYr(i)} className={`rounded-full border px-3 py-1 font-mono text-[11px] ${i === yr ? "border-lime text-lime" : "border-line text-muted"}`}>{yy}</button></li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
