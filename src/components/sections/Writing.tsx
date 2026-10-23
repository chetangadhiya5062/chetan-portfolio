import { profile } from "@/content/profile";
import type { MediumData } from "@/lib/sources/types";
import type { SitePost, SocialPost } from "@/lib/site-data";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import WritingFeed, { type FeedEntry } from "./WritingFeed";

export default function Writing({ medium, posts, sitePosts = [] }: { medium: MediumData | null; posts: SocialPost[]; sitePosts?: SitePost[] }) {
  const entries: FeedEntry[] = [
    ...(medium?.posts ?? []).slice(0, 8).map<FeedEntry>((p) => ({
      id: p.url, kind: "medium", date: p.date, title: p.title, url: p.url, thumb: p.thumbnail, meta: `${p.readingMinutes} min read`, tags: p.tags.slice(0, 2),
    })),
    ...posts.map<FeedEntry>((p) => ({
      id: p.id, kind: p.platform, date: p.postedAt ?? p.createdAt, body: p.text ?? p.note ?? undefined, note: p.text ? p.note ?? undefined : undefined,
      author: p.author ?? undefined, url: p.url, embedUrl: p.embedUrl ?? undefined, pinned: p.pinned,
    })),
    ...sitePosts.map<FeedEntry>((p) => ({
      id: p.id, kind: "note", date: p.createdAt, body: p.body, pinned: p.pinned, links: p.links,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section id="writing" aria-labelledby="write-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <SectionHead
          n="08"
          layer="Output · what I publish"
          title={<span id="write-h">What I write and say <em>in public</em>.</span>}
          lede="Medium articles flow in on their own. Notes I write in my admin appear here the moment I publish, and go to LinkedIn and X from the same place."
        />
        {entries.length === 0 ? (
          <Reveal className="spot rounded-2xl border border-line bg-surface p-8 text-muted">
            <p>Nothing published here yet.</p>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider">
              <a className="text-lime hover:underline" href={profile.links.medium} target="_blank" rel="noopener noreferrer">Medium ↗</a>
              <a className="text-lime hover:underline" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a className="text-lime hover:underline" href={profile.links.x} target="_blank" rel="noopener noreferrer">X ↗</a>
            </p>
          </Reveal>
        ) : (
          <WritingFeed entries={entries} />
        )}
      </div>
    </section>
  );
}
