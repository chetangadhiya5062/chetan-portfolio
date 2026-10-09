export type ParsedPost = {
  platform: "linkedin" | "x";
  url: string;
  externalId: string;
  embedUrl: string | null;
};

export type EnrichedPost = ParsedPost & {
  text: string | null;
  author: string | null;
  postedAt: string | null;
};

const X_HOSTS = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com", "mobile.twitter.com"]);
const LI_HOSTS = new Set(["linkedin.com", "www.linkedin.com", "in.linkedin.com"]);

/** Detect platform from a pasted URL and derive the id / embed URL. Returns null for anything else. */
export function parsePostUrl(raw: string): ParsedPost | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.toLowerCase();

  if (X_HOSTS.has(host)) {
    const m = /^\/([^/]+)\/status(?:es)?\/(\d+)/.exec(u.pathname);
    if (!m) return null;
    return { platform: "x", url: `https://x.com/${m[1]}/status/${m[2]}`, externalId: m[2], embedUrl: null };
  }

  if (LI_HOSTS.has(host)) {
    // /feed/update/urn:li:activity:123/  |  urn:li:share:123  |  urn:li:ugcPost:123
    const urn = /urn:li:(activity|share|ugcPost):(\d+)/.exec(decodeURIComponent(u.pathname));
    // /posts/<slug>-activity-123-xxxx
    const slug = /\/posts\/.*?-(activity|share|ugcPost)-(\d+)(?:-|$)/.exec(u.pathname);
    const hit = urn ?? slug;
    if (!hit) return null;
    const [, kind, id] = hit;
    return {
      platform: "linkedin",
      url: `${u.origin}${u.pathname}`,
      externalId: `${kind}:${id}`,
      embedUrl: `https://www.linkedin.com/embed/feed/update/urn:li:${kind}:${id}`,
    };
  }
  return null;
}

/** LinkedIn post ids are time-ordered: the creation time (ms) is the id shifted right by 22 bits. */
export function linkedinDate(externalId: string): string | null {
  try {
    const id = BigInt(externalId.split(":")[1]);
    const ms = Number(id >> BigInt(22));
    const d = new Date(ms);
    return ms > Date.UTC(2010, 0, 1) && ms < Date.now() + 86400000 ? d.toISOString() : null;
  } catch {
    return null;
  }
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", mdash: "—", ndash: "–", hellip: "…", nbsp: " " };
const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);

/** Free oEmbed (no API key). Fails soft: the post is still saved without text. */
async function fetchXOembed(url: string): Promise<{ text: string | null; author: string | null; postedAt: string | null }> {
  try {
    const res = await fetch(`https://publish.twitter.com/oembed?omit_script=1&dnt=1&url=${encodeURIComponent(url)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; chetan-portfolio/2.0)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { text: null, author: null, postedAt: null };
    const j = (await res.json()) as { html?: string; author_name?: string };
    const html = j.html ?? "";
    const p = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(html)?.[1] ?? "";
    const text = decode(p.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim() || null;
    const dateText = [...html.matchAll(/<a[^>]*>([^<]+)<\/a>\s*<\/blockquote>/gi)].pop()?.[1];
    const parsed = dateText ? new Date(`${decode(dateText)} UTC`) : null;
    return {
      text,
      author: j.author_name ?? null,
      postedAt: parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : null,
    };
  } catch {
    return { text: null, author: null, postedAt: null };
  }
}

export async function enrichPost(p: ParsedPost): Promise<EnrichedPost> {
  if (p.platform === "x") return { ...p, ...(await fetchXOembed(p.url)) };
  return { ...p, text: null, author: null, postedAt: linkedinDate(p.externalId) };
}
