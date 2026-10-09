import { XMLParser } from "fast-xml-parser";
import { profile } from "@/content/profile";
import { cacheOpts } from "./types";
import type { MediumData, MediumPost } from "./types";

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  category?: string | string[];
  "content:encoded"?: string;
};

const asArray = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

export async function fetchMedium(fresh = false): Promise<MediumData> {
  const res = await fetch(`https://medium.com/feed/${profile.handles.medium}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; chetan-portfolio/2.0)" },
    ...cacheOpts(fresh),
  });
  if (!res.ok) throw new Error(`Medium RSS ${res.status}`);

  const parsed = new XMLParser({ ignoreAttributes: true, processEntities: true }).parse(await res.text());
  const items = asArray<RssItem>(parsed?.rss?.channel?.item);

  const posts: MediumPost[] = items
    .filter((i) => i.title && i.link && i.pubDate)
    .map((i) => {
      const html = i["content:encoded"] ?? "";
      const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      const img = /<img[^>]+src="([^"]+)"/i.exec(html)?.[1] ?? null;
      return {
        title: String(i.title),
        url: String(i.link).split("?")[0],
        date: new Date(String(i.pubDate)).toISOString(),
        thumbnail: img,
        readingMinutes: Math.max(1, Math.round(words / 200)),
        tags: asArray(i.category).map(String).slice(0, 4),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return { posts, fetchedAt: new Date().toISOString() };
}
