import { profile } from "@/content/profile";
import { timeAgo, type Activity as ActivityData, type Platform } from "@/lib/activity";
import type { GithubData, LeetcodeData } from "@/lib/sources/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4);
const OPACITY = [0, 0.28, 0.52, 0.76, 1];

const PLATFORM: Record<Platform, { label: string; cls: string }> = {
  github: { label: "GitHub", cls: "text-lime border-lime/40" },
  leetcode: { label: "LeetCode", cls: "text-cyan border-cyan/40" },
  medium: { label: "Medium", cls: "text-ink border-ink/30" },
  linkedin: { label: "LinkedIn", cls: "text-muted border-line" },
  x: { label: "X", cls: "text-muted border-line" },
};

function Heatmap({ days }: { days: ActivityData["days"] }) {
  const start = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cols = Math.ceil((days.length + start) / 7);
  const width = cols * STEP;
  const months: { x: number; label: string }[] = [];
  let last = "";
  days.forEach((d, i) => {
    const m = d.date.slice(0, 7);
    const col = Math.floor((i + start) / 7);
    if (m !== last && (i === 0 ? col <= 1 : true)) {
      last = m;
      if (!months.length || col - Math.floor(months[months.length - 1].x / STEP) >= 3)
        months.push({ x: col * STEP, label: new Date(d.date + "T00:00:00Z").toLocaleString("en", { month: "short", timeZone: "UTC" }) });
    }
  });

  return (
    <div className="noscroll-x overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${7 * STEP + 18}`}
        role="img"
        aria-label={`Activity heatmap for the last 365 days: ${days.reduce((s, d) => s + d.total, 0)} contributions across GitHub, LeetCode, Medium and posts.`}
        className="h-auto min-w-[640px] w-full"
      >
        {months.map((m) => (
          <text key={m.x} x={m.x} y={9} className="fill-muted" fontSize={9} fontFamily="var(--font-jetbrains)">
            {m.label}
          </text>
        ))}
        {days.map((d, i) => {
          const col = Math.floor((i + start) / 7);
          const row = (i + start) % 7;
          const lv = level(d.total);
          return (
            <rect
              key={d.date}
              x={col * STEP}
              y={18 + row * STEP}
              width={CELL}
              height={CELL}
              rx={2.5}
              className={lv ? "fill-lime" : "fill-line"}
              fillOpacity={lv ? OPACITY[lv] : 0.7}
            >
              <title>
                {`${d.total} on ${d.date}${d.total ? ` — GitHub ${d.github}, LeetCode ${d.leetcode}, Medium ${d.medium}, posts ${d.posts}` : ""}`}
              </title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}

/** Monthly activity drawn as a smooth, loss-curve-style line. */
function Curve({ months }: { months: ActivityData["months"] }) {
  const W = 600, H = 190, PX = 14, PT = 20, PB = 28;
  const max = Math.max(1, ...months.map((m) => m.total));
  const pts = months.map((m, i) => ({
    x: PX + (i * (W - PX * 2)) / (months.length - 1),
    y: PT + (1 - m.total / max) * (H - PT - PB),
    ...m,
  }));
  const path = pts.reduce((d, p, i, a) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const p0 = a[i - 2] ?? a[i - 1], p1 = a[i - 1], p3 = a[i + 1] ?? p;
    const c1x = p1.x + (p.x - p0.x) / 6, c1y = p1.y + (p.y - p0.y) / 6;
    const c2x = p.x - (p3.x - p1.x) / 6, c2y = p.y - (p3.y - p1.y) / 6;
    return `${d} C${c1x},${c1y} ${c2x},${c2y} ${p.x},${p.y}`;
  }, "");
  const area = `${path} L${pts[pts.length - 1].x},${H - PB} L${pts[0].x},${H - PB} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Monthly activity, peak ${max} in ${pts.find((p) => p.total === max)?.label}`} className="h-auto w-full">
      <defs>
        <linearGradient id="curve-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-lime)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--color-lime)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={PX} x2={W - PX} y1={PT + t * (H - PT - PB)} y2={PT + t * (H - PT - PB)} stroke="var(--color-line)" strokeDasharray="2 5" />
      ))}
      <path d={area} fill="url(#curve-fill)" />
      <path d={path} fill="none" stroke="var(--color-lime)" strokeWidth={2} strokeLinecap="round" className="draw" style={{ "--len": 1400 } as React.CSSProperties} pathLength={1400} />
      {pts.map((p) => (
        <g key={p.month}>
          <circle cx={p.x} cy={p.y} r={3} fill="var(--color-base)" stroke="var(--color-lime)" strokeWidth={1.5}>
            <title>{`${p.label}: ${p.total}`}</title>
          </circle>
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize={9} fontFamily="var(--font-jetbrains)" className="fill-muted">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Share({ totals }: { totals: ActivityData["totals"] }) {
  const parts = [
    { k: "GitHub", v: totals.github, c: "bg-lime" },
    { k: "LeetCode", v: totals.leetcode, c: "bg-cyan" },
    { k: "Medium", v: totals.medium, c: "bg-ink" },
    { k: "Posts", v: totals.posts, c: "bg-muted" },
  ];
  const sum = Math.max(1, parts.reduce((s, p) => s + p.v, 0));
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-line" role="img" aria-label={parts.map((p) => `${p.k} ${p.v}`).join(", ")}>
        {parts.map((p) => p.v > 0 && <span key={p.k} className={p.c} style={{ width: `${(p.v / sum) * 100}%` }} />)}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
        {parts.map((p) => (
          <li key={p.k} className="flex items-center gap-2">
            <span aria-hidden className={`size-2 rounded-full ${p.c}`} />
            {p.k} <span className="text-ink">{p.v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ActivitySection({
  activity,
  github,
  leetcode,
}: {
  activity: ActivityData;
  github: GithubData | null;
  leetcode: LeetcodeData | null;
}) {
  const noData = !github && !leetcode;
  const lc = leetcode;
  const tiles = [
    { label: "contributions · 365d", value: github ? github.totalContributions : "—", sub: "GitHub" },
    { label: "problems solved", value: lc ? lc.solved.all : "—", sub: lc ? `${lc.solved.easy}E · ${lc.solved.medium}M · ${lc.solved.hard}H` : "LeetCode" },
    { label: "day streak", value: lc ? lc.streak : "—", sub: lc ? `${lc.totalActiveDays} active days` : "LeetCode" },
    { label: "contest rating", value: lc?.contest ? lc.contest.rating : "—", sub: lc?.contest ? `${lc.contest.attended} contests` : "LeetCode" },
  ];

  return (
    <section id="activity" aria-labelledby="act-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="05"
          layer="Training loop"
          title={<span id="act-h">It never stops training.</span>}
          lede="GitHub, LeetCode, Medium and posts, merged into one live signal. Refreshed automatically every day."
        />

        {noData && (
          <p className="mb-8 rounded-xl border border-line bg-surface p-5 font-mono text-xs text-muted">
            Live sources are unreachable right now. This panel reconnects on its own — the rest of the site is unaffected.
          </p>
        )}

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 60} className="bg-surface p-5 md:p-7">
              <dt className="label">{t.label}</dt>
              <dd className="mt-3 font-display text-4xl font-semibold tabular-nums text-ink md:text-5xl">{t.value}</dd>
              <dd className="mt-2 font-mono text-[11px] text-muted">{t.sub}</dd>
            </Reveal>
          ))}
        </dl>

        <Reveal className="mt-6 rounded-2xl border border-line bg-surface p-5 md:p-8">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-xl font-medium">Unified heatmap</h3>
            <p className="label">{activity.totals.all} events · 365 days</p>
          </div>
          <Heatmap days={activity.days} />
          <div className="mt-5 flex items-center justify-end gap-2 font-mono text-[10px] text-muted" aria-hidden>
            less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`size-3 rounded-[3px] ${l ? "bg-lime" : "bg-line"}`} style={{ opacity: l ? OPACITY[l] : 0.7 }} />
            ))}
            more
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="rounded-2xl border border-line bg-surface p-5 md:p-8">
            <h3 className="font-display text-xl font-medium">Activity / month</h3>
            <p className="label mt-1">loss curve, but upward</p>
            <div className="mt-6"><Curve months={activity.months} /></div>
            <div className="mt-6 border-t border-line pt-6"><Share totals={activity.totals} /></div>
          </Reveal>

          <Reveal delay={80} className="rounded-2xl border border-line bg-surface p-5 md:p-8">
            <h3 className="font-display text-xl font-medium">Recent activity</h3>
            {activity.feed.length === 0 ? (
              <p className="mt-6 text-sm text-muted">Nothing to show yet.</p>
            ) : (
              <ul className="mt-5 divide-y divide-line">
                {activity.feed.slice(0, 7).map((f) => (
                  <li key={`${f.platform}-${f.url}-${f.date}`}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 py-3.5">
                      <span className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${PLATFORM[f.platform].cls}`}>
                        {PLATFORM[f.platform].label}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink group-hover:text-lime">{f.title}</span>
                        <span className="mt-0.5 block font-mono text-[11px] text-muted">
                          {f.meta && <>{f.meta} · </>}
                          <time dateTime={f.date}>{timeAgo(f.date)}</time>
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="label mt-4 inline-block hover:text-lime">
              Full history on GitHub ↗
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
