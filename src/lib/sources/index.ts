import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { fetchGithub } from "./github";
import { fetchLeetcode } from "./leetcode";
import { fetchMedium } from "./medium";
import type { SourceKey, SourceMap } from "./types";

export * from "./types";

const fetchers: { [K in SourceKey]: (fresh?: boolean) => Promise<SourceMap[K]> } = {
  github: fetchGithub,
  leetcode: fetchLeetcode,
  medium: fetchMedium,
};

async function readCache<K extends SourceKey>(key: K): Promise<SourceMap[K] | null> {
  try {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.from("source_cache").select("payload").eq("source", key).maybeSingle();
    return (data?.payload as SourceMap[K]) ?? null;
  } catch {
    return null;
  }
}

/**
 * Live data first (ISR-cached 6h by fetch), last-good copy from Supabase when the source is down,
 * and null when neither exists. Never throws, so a dead source can't break a page.
 */
export async function getSource<K extends SourceKey>(key: K): Promise<SourceMap[K] | null> {
  try {
    return await fetchers[key]();
  } catch (err) {
    console.warn(`[sources] ${key} live fetch failed, using cache:`, (err as Error).message);
    return readCache(key);
  }
}

export type SyncResult = Record<SourceKey, { ok: boolean; error?: string }>;

type LogRow = {
  external_id: string;
  platform: string;
  activity_date: string;
  intensity: number;
  title: string | null;
  url: string | null;
  type: string;
  description: string | null;
};

/** Refresh every source into source_cache (last-good JSON) and activity_logs (history archive). */
export async function syncAll(): Promise<SyncResult> {
  const admin = getSupabaseAdmin();
  const result = { github: { ok: false }, leetcode: { ok: false }, medium: { ok: false } } as SyncResult;

  await Promise.all(
    (Object.keys(fetchers) as SourceKey[]).map(async (key) => {
      try {
        const data = await fetchers[key](true); // bypass the data cache
        if (admin) {
          const { error } = await admin
            .from("source_cache")
            .upsert({ source: key, payload: data, fetched_at: new Date().toISOString() });
          if (error) throw new Error(`source_cache: ${error.message}`);
          const rows = toLogRows(key, data as never);
          for (let i = 0; i < rows.length; i += 500) {
            const { error: e2 } = await admin
              .from("activity_logs")
              .upsert(rows.slice(i, i + 500), { onConflict: "external_id" });
            if (e2) throw new Error(`activity_logs: ${e2.message}`);
          }
        }
        result[key] = { ok: true };
      } catch (err) {
        result[key] = { ok: false, error: (err as Error).message };
      }
    }),
  );
  return result;
}

function toLogRows<K extends SourceKey>(key: K, data: SourceMap[K]): LogRow[] {
  if (key === "github") {
    const d = data as SourceMap["github"];
    const days = d.calendar
      .filter((x) => x.count > 0)
      .map<LogRow>((x) => ({
        external_id: `gh-day:${x.date}`, platform: "github", activity_date: x.date, intensity: x.count,
        title: `${x.count} contribution${x.count > 1 ? "s" : ""}`, url: null, type: "day", description: null,
      }));
    const commits = d.recentCommits.map<LogRow>((c) => ({
      external_id: `gh-commit:${c.url}`, platform: "github", activity_date: c.date.slice(0, 10), intensity: 1,
      title: c.message, url: c.url, type: "commit", description: c.repo,
    }));
    return [...days, ...commits];
  }
  if (key === "leetcode") {
    const d = data as SourceMap["leetcode"];
    const days = d.calendar.map<LogRow>((x) => ({
      external_id: `lc-day:${x.date}`, platform: "leetcode", activity_date: x.date, intensity: x.count,
      title: `${x.count} submission${x.count > 1 ? "s" : ""}`, url: null, type: "day", description: null,
    }));
    const solved = d.recent.map<LogRow>((r) => ({
      external_id: `lc-ac:${r.slug}:${r.date}`, platform: "leetcode", activity_date: r.date.slice(0, 10), intensity: 1,
      title: r.title, url: `https://leetcode.com/problems/${r.slug}/`, type: "solved", description: "Accepted",
    }));
    return [...days, ...solved];
  }
  const d = data as SourceMap["medium"];
  return d.posts.map<LogRow>((p) => ({
    external_id: `md:${p.url}`, platform: "medium", activity_date: p.date.slice(0, 10), intensity: 1,
    title: p.title, url: p.url, type: "article", description: null,
  }));
}
