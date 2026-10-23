import crypto from "node:crypto";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { PublishResult } from "./x";

const SCOPE = "openid profile w_member_social";

export const linkedinConfigured = () => !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);

export const linkedinRedirectUri = (origin: string) => `${process.env.NEXT_PUBLIC_SITE_URL || origin}/api/admin/linkedin/callback`;

export function linkedinAuthUrl(origin: string, state: string): string {
  const q = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
    redirect_uri: linkedinRedirectUri(origin),
    state,
    scope: SCOPE,
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${q}`;
}

export const newState = () => crypto.randomBytes(16).toString("hex");

type Stored = { accessToken: string; personUrn: string; name?: string };

/** Exchange the OAuth code, look up who we are, and store the token (service role only). */
export async function connectLinkedIn(code: string, origin: string): Promise<{ ok: boolean; message: string }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, message: "Supabase is not configured." };
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET ?? "",
      redirect_uri: linkedinRedirectUri(origin),
    }),
    signal: AbortSignal.timeout(15000),
  });
  const t = (await tokenRes.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!tokenRes.ok || !t.access_token) return { ok: false, message: t.error_description || "LinkedIn refused the code." };

  const me = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${t.access_token}` }, signal: AbortSignal.timeout(15000) });
  const u = (await me.json().catch(() => ({}))) as { sub?: string; name?: string };
  if (!me.ok || !u.sub) return { ok: false, message: "Connected, but could not read your LinkedIn profile id." };

  const data: Stored = { accessToken: t.access_token, personUrn: `urn:li:person:${u.sub}`, name: u.name };
  const expiresAt = new Date(Date.now() + (t.expires_in ?? 5184000) * 1000).toISOString();
  const { error } = await sb.from("integrations").upsert({ provider: "linkedin", data, expires_at: expiresAt, updated_at: new Date().toISOString() });
  if (error) return { ok: false, message: `Could not store the token: ${error.message}. Did you run migration 0003?` };
  return { ok: true, message: `Connected as ${u.name ?? "your account"}.` };
}

export async function linkedinStatus(): Promise<{ connected: boolean; name?: string; expiresAt?: string; expired?: boolean }> {
  const sb = getSupabaseAdmin();
  if (!sb) return { connected: false };
  const { data } = await sb.from("integrations").select("data, expires_at").eq("provider", "linkedin").maybeSingle();
  if (!data) return { connected: false };
  const exp = data.expires_at as string | null;
  return { connected: true, name: (data.data as Stored).name, expiresAt: exp ?? undefined, expired: !!exp && new Date(exp) < new Date() };
}

export async function postToLinkedIn(text: string): Promise<PublishResult> {
  const sb = getSupabaseAdmin();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const { data } = await sb.from("integrations").select("data, expires_at").eq("provider", "linkedin").maybeSingle();
  if (!data) return { ok: false, error: "LinkedIn is not connected. Use “Connect LinkedIn” in Integrations." };
  if (data.expires_at && new Date(data.expires_at as string) < new Date()) return { ok: false, error: "LinkedIn token expired (they last 60 days). Reconnect in Integrations." };
  const s = data.data as Stored;
  try {
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: { Authorization: `Bearer ${s.accessToken}`, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
      body: JSON.stringify({
        author: s.personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text }, shareMediaCategory: "NONE" } },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
      signal: AbortSignal.timeout(15000),
    });
    const j = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    const id = j.id ?? res.headers.get("x-restli-id");
    if (!res.ok || !id) return { ok: false, error: `LinkedIn said ${res.status}: ${j.message ?? "request failed"}` };
    return { ok: true, url: `https://www.linkedin.com/feed/update/${id}/` };
  } catch (e) {
    return { ok: false, error: `LinkedIn request failed: ${(e as Error).message}` };
  }
}
