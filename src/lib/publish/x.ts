import crypto from "node:crypto";

export type PublishResult = { ok: true; url: string } | { ok: false; error: string };

const enc = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

export const xConfigured = () =>
  !!(process.env.X_API_KEY && process.env.X_API_SECRET && process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_SECRET);

/** OAuth 1.0a (user context) signed POST to the X API v2. The JSON body is not part of the signature. */
export async function postToX(text: string): Promise<PublishResult> {
  if (!xConfigured()) return { ok: false, error: "X keys are not set (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET)." };
  if (text.length > 280) return { ok: false, error: `Too long for X (${text.length}/280). Shorten it or untick X.` };

  const url = "https://api.x.com/2/tweets";
  const oauth: Record<string, string> = {
    oauth_consumer_key: process.env.X_API_KEY!,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: process.env.X_ACCESS_TOKEN!,
    oauth_version: "1.0",
  };
  const base = ["POST", enc(url), enc(Object.keys(oauth).sort().map((k) => `${enc(k)}=${enc(oauth[k])}`).join("&"))].join("&");
  const key = `${enc(process.env.X_API_SECRET!)}&${enc(process.env.X_ACCESS_SECRET!)}`;
  oauth.oauth_signature = crypto.createHmac("sha1", key).update(base).digest("base64");
  const header = "OAuth " + Object.keys(oauth).sort().map((k) => `${enc(k)}="${enc(oauth[k])}"`).join(", ");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: header, "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(15000),
    });
    const j = (await res.json().catch(() => ({}))) as { data?: { id?: string }; detail?: string; title?: string };
    if (!res.ok || !j.data?.id) return { ok: false, error: `X said ${res.status}: ${j.detail || j.title || "request failed"}` };
    return { ok: true, url: `https://x.com/i/status/${j.data.id}` };
  } catch (e) {
    return { ok: false, error: `X request failed: ${(e as Error).message}` };
  }
}
