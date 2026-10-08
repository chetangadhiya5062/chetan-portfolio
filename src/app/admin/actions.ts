"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigured, createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/admin-auth";
import { clientIp, hit } from "@/lib/rate-limit";
import { enrichPost, parsePostUrl } from "@/lib/social";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type FormState = { ok: boolean; message: string };
const fail = (message: string): FormState => ({ ok: false, message });
const done = (message: string): FormState => ({ ok: true, message });

function db() {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Supabase service-role env vars are not configured.");
  return sb;
}

const refresh = () => {
  revalidatePath("/");
  revalidatePath("/admin");
};

/* ---------- auth ---------- */

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!adminConfigured()) return fail("Admin is not configured (set ADMIN_PASSWORD and ADMIN_SESSION_SECRET).");
  const ip = await clientIp();
  const gate = hit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!gate.ok) return fail(`Too many attempts. Try again in ${Math.ceil(gate.retryInSec / 60)} min.`);
  if (!passwordMatches(String(fd.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return fail("Wrong password.");
  }
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

/* ---------- posts ---------- */

export async function addPost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parsePostUrl(String(fd.get("url") ?? ""));
  if (!parsed) return fail("That doesn't look like a LinkedIn post or X (Twitter) status URL.");

  const dateInput = String(fd.get("date") ?? "").trim();
  const note = String(fd.get("note") ?? "").trim() || null;
  const enriched = await enrichPost(parsed);
  const postedAt = dateInput ? new Date(`${dateInput}T12:00:00Z`).toISOString() : enriched.postedAt;

  const sb = db();
  const { data: last } = await sb.from("social_posts").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const { error } = await sb.from("social_posts").insert({
    platform: enriched.platform,
    url: enriched.url,
    external_id: enriched.externalId,
    embed_url: enriched.embedUrl,
    text: enriched.text,
    author: enriched.author,
    note,
    posted_at: postedAt,
    sort_order: (last?.[0]?.sort_order ?? 0) + 1,
  });
  if (error) return fail(error.code === "23505" ? "That post is already added." : `Could not save: ${error.message}`);
  refresh();
  const extra = enriched.platform === "x" && !enriched.text ? " (couldn't fetch the tweet text; it will show as a link card)" : "";
  return done(`Added ${enriched.platform === "x" ? "X" : "LinkedIn"} post${extra}.`);
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  await db().from("social_posts").delete().eq("id", id);
  refresh();
}

export async function togglePinned(id: string, value: boolean): Promise<void> {
  await requireAdmin();
  await db().from("social_posts").update({ pinned: value }).eq("id", id);
  refresh();
}

export async function toggleHidden(id: string, value: boolean): Promise<void> {
  await requireAdmin();
  await db().from("social_posts").update({ hidden: value }).eq("id", id);
  refresh();
}

export async function movePost(id: string, dir: -1 | 1): Promise<void> {
  await requireAdmin();
  const sb = db();
  const { data } = await sb.from("social_posts").select("id").order("pinned", { ascending: false }).order("sort_order").order("posted_at", { ascending: false });
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((rid, n) => sb.from("social_posts").update({ sort_order: n }).eq("id", rid)));
  refresh();
}

/* ---------- resume ---------- */

const MAX_PDF = 4 * 1024 * 1024; // Vercel serverless request bodies are capped at ~4.5 MB

export async function uploadResume(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a PDF first.");
  if (file.size > MAX_PDF) return fail("PDF is larger than 4 MB. Compress it and try again.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-") return fail("That file is not a valid PDF.");

  const sb = db();
  const path = `resume-${Date.now()}.pdf`;
  const up = await sb.storage.from("resume").upload(path, bytes, { contentType: "application/pdf", upsert: false, cacheControl: "3600" });
  if (up.error) return fail(`Upload failed: ${up.error.message}. Did you run the migration (creates the "resume" bucket)?`);
  const { data: pub } = sb.storage.from("resume").getPublicUrl(path);

  await sb.from("resume_versions").update({ is_current: false }).eq("is_current", true);
  const { error } = await sb.from("resume_versions").insert({ url: pub.publicUrl, path, filename: file.name, is_current: true });
  if (error) return fail(`Saved the file but not its record: ${error.message}`);
  refresh();
  return done("Resume uploaded and set as current. /resume now serves it.");
}

export async function makeResumeCurrent(id: string): Promise<void> {
  await requireAdmin();
  const sb = db();
  await sb.from("resume_versions").update({ is_current: false }).eq("is_current", true);
  await sb.from("resume_versions").update({ is_current: true }).eq("id", id);
  refresh();
}

/* ---------- status ---------- */

export async function saveStatus(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const currently = String(fd.get("currently") ?? "").trim().slice(0, 120);
  const openToWork = fd.get("openToWork") === "on";
  const { error } = await db()
    .from("site_settings")
    .upsert({ key: "status", value: { currently, openToWork }, updated_at: new Date().toISOString() });
  if (error) return fail(`Could not save: ${error.message}`);
  refresh();
  return done("Status updated.");
}
