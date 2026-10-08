import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * Best-effort in-memory limiter (per server instance). On serverless it resets on cold starts,
 * which is acceptable here: the password is also compared in constant time and a delay is added on failure.
 */
export function hit(key: string, limit: number, windowMs: number): { ok: boolean; retryInSec: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 500) for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    return { ok: true, retryInSec: 0 };
  }
  b.count += 1;
  return { ok: b.count <= limit, retryInSec: Math.ceil((b.resetAt - now) / 1000) };
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}
