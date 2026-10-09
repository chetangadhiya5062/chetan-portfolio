import { profile } from "@/content/profile";
import type { MediumData } from "@/lib/sources/types";
import type { SocialPost } from "@/lib/site-data";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import LinkedInEmbed from "./LinkedInEmbed";

type Entry =
  | { kind: "medium"; date: string; title: string; url: string; thumb: string | null; meta: string; tags: string[] }
  | { kind: "post"; date: string; post: SocialPost };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function Writing({ medium, posts }: { medium: MediumData | null; posts: SocialPost[] }) {
  const entries: Entry[] = [
    ...(medium?.posts ?? []).slice(0, 6).map<Entry>((p) => ({
      kind: "medium", date: p.date, title: p.title, url: p.url, thumb: p.thumbnail, meta: `${p.readingMinutes} min read`, tags: p.tags,
    })),
    ...posts.map<Entry>((p) => ({ kind: "post", date: p.postedAt ?? p.createdAt, post: p })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section id="writing" aria-labelledby="write-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="06"
          layer="Output logits"
          title={<span id="write-h">What I write and say in public.</span>}
          lede="Articles from Medium flow in automatically. LinkedIn and X posts are added by me and appear within seconds."
        />

        {entries.length === 0 ? (
          <Reveal className="rounded-2xl border border-line bg-surface p-8 text-muted">
            <p>Nothing published here yet.</p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider">
              <a className="text-lime hover:underline" href={profile.links.medium} target="_blank" rel="noopener noreferrer">Medium ↗</a>
              <a className="text-lime hover:underline" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="text-lime hover:underline" href={profile.links.x} target="_blank" rel="noopener noreferrer">X ↗</a>
            </p>
          </Reveal>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((e, i) => (
              <Reveal as="li" key={e.kind === "medium" ? e.url : e.post.id} delay={(i % 3) * 80} className="flex">
                {e.kind === "medium" ? (
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-lime/60"
                  >
                    {e.thumb && (
                      // remote Medium CDN image; sized to avoid layout shift
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.thumb} alt="" width={640} height={320} loading="lazy" decoding="async" className="aspect-[2/1] w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="label text-lime">Medium · {fmt(e.date)}</p>
                      <h3 className="mt-3 font-display text-xl font-medium leading-snug group-hover:text-lime">{e.title}</h3>
                      <p className="mt-auto pt-5 font-mono text-[11px] text-muted">{e.meta}{e.tags.length > 0 && <> · {e.tags.slice(0, 2).join(" · ")}</>}</p>
                    </div>
                  </a>
                ) : (
                  <article className="flex w-full flex-col rounded-2xl border border-line bg-surface p-6">
                    <p className="label flex items-center justify-between">
                      <span className={e.post.platform === "x" ? "text-ink" : "text-cyan"}>
                        {e.post.platform === "x" ? "X" : "LinkedIn"}
                        {e.post.pinned && " · pinned"}
                      </span>
                      <time dateTime={e.date}>{fmt(e.date)}</time>
                    </p>
                    {e.post.text ? (
                      <blockquote className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink">{e.post.text}</blockquote>
                    ) : (
                      <p className="mt-4 text-[15px] leading-relaxed text-ink">{e.post.note || "A post on LinkedIn."}</p>
                    )}
                    {e.post.text && e.post.note && <p className="mt-3 text-sm text-muted">{e.post.note}</p>}
                    {e.post.author && <p className="mt-4 font-mono text-[11px] text-muted">— {e.post.author}</p>}
                    {e.post.platform === "linkedin" && e.post.embedUrl ? (
                      <LinkedInEmbed embedUrl={e.post.embedUrl} url={e.post.url} />
                    ) : (
                      <a href={e.post.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-5 font-mono text-xs uppercase tracking-wider text-cyan hover:underline">
                        Open on {e.post.platform === "x" ? "X" : "LinkedIn"} ↗
                      </a>
                    )}
                  </article>
                )}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
