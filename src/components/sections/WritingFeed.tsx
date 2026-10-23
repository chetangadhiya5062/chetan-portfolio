"use client";

import { useState } from "react";
import LinkedInEmbed from "./LinkedInEmbed";

export type FeedEntry = {
  id: string;
  kind: "medium" | "linkedin" | "x" | "note";
  date: string;
  title?: string;
  body?: string;
  note?: string;
  author?: string;
  url?: string;
  embedUrl?: string;
  thumb?: string | null;
  meta?: string;
  tags?: string[];
  pinned?: boolean;
  links?: { platform: "linkedin" | "x"; url: string }[];
};

const LABEL = { medium: "Medium", linkedin: "LinkedIn", x: "X", note: "Notes" } as const;
const TINT = { medium: "text-lime", linkedin: "text-cyan", x: "text-ink", note: "text-lime" } as const;
const fmt = (iso: string) => new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function Card({ e, big = false }: { e: FeedEntry; big?: boolean }) {
  const head = (
    <p className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
      <span className={TINT[e.kind]}>{LABEL[e.kind]}{e.pinned && " · pinned"}</span>
      <time dateTime={e.date} className="text-muted">{fmt(e.date)}</time>
    </p>
  );

  if (e.kind === "medium") {
    return (
      <a href={e.url} target="_blank" rel="noopener noreferrer" className={`spot group flex h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-lime/60 ${big ? "flex-col md:flex-row" : "flex-col"}`}>
        {e.thumb && (
          // remote Medium CDN image; fixed ratio avoids layout shift
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.thumb} alt="" width={640} height={320} loading="lazy" decoding="async" className={`object-cover opacity-80 transition-opacity group-hover:opacity-100 ${big ? "aspect-[2/1] w-full md:aspect-auto md:w-1/2" : "aspect-[2/1] w-full"}`} />
        )}
        <div className="relative flex flex-1 flex-col p-6 md:p-7">
          {head}
          <h3 className={`relative z-10 mt-4 font-serif leading-tight group-hover:text-lime ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}>{e.title}</h3>
          <p className="relative z-10 mt-auto pt-6 font-mono text-[11px] text-muted">{e.meta}{e.tags && e.tags.length > 0 && <> · {e.tags.join(" · ")}</>}</p>
        </div>
      </a>
    );
  }

  return (
    <article className="spot flex h-full flex-col rounded-2xl border border-line bg-surface p-6 md:p-7">
      {head}
      <p className={`relative z-10 mt-4 whitespace-pre-line leading-relaxed text-ink ${big ? "font-serif text-2xl md:text-3xl" : "text-[15px]"}`}>
        {e.body || (e.kind === "linkedin" ? "A post on LinkedIn." : "A post on X.")}
      </p>
      {e.note && <p className="relative z-10 mt-3 text-sm text-muted">{e.note}</p>}
      {e.author && <p className="relative z-10 mt-4 font-mono text-[11px] text-muted">— {e.author}</p>}
      <div className="relative z-10 mt-auto">
        {e.kind === "linkedin" && e.embedUrl && e.url ? (
          <LinkedInEmbed embedUrl={e.embedUrl} url={e.url} />
        ) : e.kind !== "note" && e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="inline-block pt-5 font-mono text-xs uppercase tracking-wider text-cyan hover:underline">Open on {LABEL[e.kind]} ↗</a>
        ) : e.links && e.links.length > 0 ? (
          <p className="flex flex-wrap gap-x-4 pt-5 font-mono text-xs uppercase tracking-wider">
            {e.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">Also on {LABEL[l.platform]} ↗</a>)}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function WritingFeed({ entries }: { entries: FeedEntry[] }) {
  const kinds = (["medium", "linkedin", "x", "note"] as const).filter((k) => entries.some((e) => e.kind === k));
  const [tab, setTab] = useState<"all" | FeedEntry["kind"]>("all");
  const shown = tab === "all" ? entries : entries.filter((e) => e.kind === tab);
  const [first, ...rest] = shown;

  return (
    <div>
      {kinds.length > 1 && (
        <div role="tablist" aria-label="Filter by source" className="mb-8 flex flex-wrap gap-2">
          {(["all", ...kinds] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${tab === k ? "border-lime bg-lime/10 text-lime" : "border-line text-muted hover:text-ink"}`}
            >
              {k === "all" ? `All ${entries.length}` : `${LABEL[k]} ${entries.filter((e) => e.kind === k).length}`}
            </button>
          ))}
        </div>
      )}
      <div key={tab} className="feed-in space-y-5">
        {first && <Card e={first} big />}
        {rest.length > 0 && (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((e) => <li key={e.id} className="flex">{<div className="w-full"><Card e={e} /></div>}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
