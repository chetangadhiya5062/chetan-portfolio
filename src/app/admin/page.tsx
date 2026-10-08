import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { deletePost, logout, makeResumeCurrent, movePost, toggleHidden, togglePinned } from "./actions";
import { AddPostForm, LoginForm, ResumeForm, StatusForm } from "./forms";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

type Post = {
  id: string; platform: "linkedin" | "x"; url: string; text: string | null; note: string | null;
  pinned: boolean; hidden: boolean; posted_at: string | null;
};
type Resume = { id: string; url: string; filename: string | null; uploaded_at: string; is_current: boolean };

const card = "rounded-2xl border border-line bg-surface p-5 md:p-8";
const mini =
  "h-8 rounded border border-line px-2.5 font-mono text-[11px] uppercase tracking-wider text-muted hover:border-lime hover:text-ink";
const fmt = (iso: string) => new Date(iso).toLocaleString("en", { dateStyle: "medium", timeStyle: "short" });

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <Shell>
        <div className={card}>
          <h2 className="font-display text-xl">Admin is not configured</h2>
          <p className="mt-3 text-sm text-muted">
            Set <code className="text-lime">ADMIN_PASSWORD</code> and <code className="text-lime">ADMIN_SESSION_SECRET</code> (16+ chars) in the environment, then reload.
          </p>
        </div>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <div className={`${card} max-w-md`}>
          <h2 className="mb-6 font-display text-xl">Sign in</h2>
          <LoginForm />
        </div>
      </Shell>
    );
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return (
      <Shell signedIn>
        <div className={card}>
          <p className="text-sm text-muted">Supabase env vars are missing (<code className="text-lime">SUPABASE_SERVICE_ROLE_KEY</code>, <code className="text-lime">NEXT_PUBLIC_SUPABASE_URL</code>).</p>
        </div>
      </Shell>
    );
  }

  const [postsRes, resumesRes, statusRes] = await Promise.all([
    sb.from("social_posts").select("*").order("pinned", { ascending: false }).order("sort_order").order("posted_at", { ascending: false }),
    sb.from("resume_versions").select("*").order("uploaded_at", { ascending: false }),
    sb.from("site_settings").select("value").eq("key", "status").maybeSingle(),
  ]);
  const posts = (postsRes.data ?? []) as Post[];
  const resumes = (resumesRes.data ?? []) as Resume[];
  const status = (statusRes.data?.value ?? {}) as { currently?: string; openToWork?: boolean };
  const setupError = postsRes.error?.code === "42P01" || resumesRes.error?.code === "42P01";

  return (
    <Shell signedIn>
      {setupError && (
        <p className="mb-6 rounded-xl border border-[#ff8a7a]/40 p-4 font-mono text-xs text-[#ff8a7a]">
          Tables are missing. Run <code>supabase/migrations/0002_v2.sql</code> in the Supabase SQL editor first.
        </p>
      )}

      <div className="grid gap-6">
        <section className={card} aria-labelledby="st">
          <h2 id="st" className="mb-6 font-display text-xl">Quick status</h2>
          <StatusForm currently={status.currently ?? ""} openToWork={status.openToWork ?? true} />
        </section>

        <section className={card} aria-labelledby="po">
          <h2 id="po" className="mb-6 font-display text-xl">Posts</h2>
          <AddPostForm />
          <ul className="mt-8 divide-y divide-line">
            {posts.length === 0 && <li className="py-4 font-mono text-xs text-muted">No posts yet.</li>}
            {posts.map((p, i) => (
              <li key={p.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="label">
                    <span className={p.platform === "x" ? "text-ink" : "text-cyan"}>{p.platform === "x" ? "X" : "LinkedIn"}</span>
                    {p.posted_at && <> · {fmt(p.posted_at)}</>}
                    {p.pinned && <> · <span className="text-lime">pinned</span></>}
                    {p.hidden && <> · hidden</>}
                  </p>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-sm text-ink hover:text-lime">
                    {p.text?.slice(0, 120) || p.note || p.url}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={movePost.bind(null, p.id, -1)}><button className={mini} disabled={i === 0} aria-label="Move up">↑</button></form>
                  <form action={movePost.bind(null, p.id, 1)}><button className={mini} disabled={i === posts.length - 1} aria-label="Move down">↓</button></form>
                  <form action={togglePinned.bind(null, p.id, !p.pinned)}><button className={mini}>{p.pinned ? "Unpin" : "Pin"}</button></form>
                  <form action={toggleHidden.bind(null, p.id, !p.hidden)}><button className={mini}>{p.hidden ? "Show" : "Hide"}</button></form>
                  <form action={deletePost.bind(null, p.id)}><button className={`${mini} hover:!border-[#ff8a7a] hover:!text-[#ff8a7a]`}>Delete</button></form>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-labelledby="re">
          <h2 id="re" className="mb-2 font-display text-xl">Resume</h2>
          <p className="mb-6 text-sm text-muted">
            LinkedIn Featured should point to <code className="text-lime">/resume</code>. Upload here and every link updates.
          </p>
          <ResumeForm />
          <ul className="mt-8 divide-y divide-line">
            {resumes.length === 0 && <li className="py-4 font-mono text-xs text-muted">No uploads yet. The bundled /resume.pdf is served.</li>}
            {resumes.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="block truncate text-sm text-ink hover:text-lime">
                    {r.filename || r.url}
                  </a>
                  <p className="label mt-1">{fmt(r.uploaded_at)}{r.is_current && <> · <span className="text-lime">current</span></>}</p>
                </div>
                {!r.is_current && (
                  <form action={makeResumeCurrent.bind(null, r.id)}><button className={mini}>Make current</button></form>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children, signedIn }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <main id="main" className="mx-auto max-w-[860px] px-4 pb-24 pt-14 sm:px-6">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <p className="label text-lime">private</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Admin</h1>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs">
          <Link href="/" className="text-muted hover:text-lime">View site ↗</Link>
          {signedIn && (
            <form action={logout}><button className="text-muted hover:text-lime">Sign out</button></form>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}
