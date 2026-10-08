import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const TTL_SECONDS = 7 * 24 * 60 * 60;

const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";
const sign = (payload: string) => crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
const digest = (s: string) => crypto.createHash("sha256").update(s).digest();

/** Admin needs both a password and a session secret of reasonable length. */
export function adminConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD && secret().length >= 16;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // compare fixed-length digests so length and content don't leak through timing
  return crypto.timingSafeEqual(digest(input), digest(expected));
}

export async function createSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `v1.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf(".");
  if (i < 0) return false;
  const payload = raw.slice(0, i);
  const given = Buffer.from(raw.slice(i + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
  const [version, exp] = payload.split(".");
  return version === "v1" && Number(exp) > Date.now() / 1000;
}

/** Every mutation calls this first. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
