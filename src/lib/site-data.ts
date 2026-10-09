import { getSupabase } from "@/lib/supabase";

export type SocialPost = {
  id: string;
  platform: "linkedin" | "x";
  url: string;
  embedUrl: string | null;
  text: string | null;
  author: string | null;
  note: string | null;
  postedAt: string | null;
  createdAt: string;
  pinned: boolean;
};

export type SiteStatus = { currently: string; openToWork: boolean };
export type ResumeInfo = { url: string; uploadedAt: string | null };

const DEFAULT_STATUS: SiteStatus = { currently: "", openToWork: true };

type PostRow = {
  id: string; platform: "linkedin" | "x"; url: string; embed_url: string | null; text: string | null;
  author: string | null; note: string | null; posted_at: string | null; created_at: string; pinned: boolean;
};

export const mapPost = (r: PostRow): SocialPost => ({
  id: r.id, platform: r.platform, url: r.url, embedUrl: r.embed_url, text: r.text, author: r.author,
  note: r.note, postedAt: r.posted_at, createdAt: r.created_at, pinned: r.pinned,
});

export async function getSocialPosts(): Promise<SocialPost[]> {
  try {
    const sb = getSupabase();
    if (!sb) return [];
    const { data } = await sb
      .from("social_posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("posted_at", { ascending: false, nullsFirst: false })
      .limit(30);
    return ((data ?? []) as PostRow[]).map(mapPost);
  } catch {
    return [];
  }
}

export async function getSiteStatus(): Promise<SiteStatus> {
  try {
    const sb = getSupabase();
    if (!sb) return DEFAULT_STATUS;
    const { data } = await sb.from("site_settings").select("value").eq("key", "status").maybeSingle();
    return { ...DEFAULT_STATUS, ...((data?.value as Partial<SiteStatus>) ?? {}) };
  } catch {
    return DEFAULT_STATUS;
  }
}

/** Current resume: Supabase version → RESUME_URL env → bundled /resume.pdf. */
export async function getResume(): Promise<ResumeInfo> {
  try {
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb
        .from("resume_versions")
        .select("url, uploaded_at")
        .eq("is_current", true)
        .maybeSingle();
      if (data?.url) return { url: data.url as string, uploadedAt: data.uploaded_at as string };
    }
  } catch {
    /* fall through */
  }
  return { url: process.env.RESUME_URL || "/resume.pdf", uploadedAt: null };
}
