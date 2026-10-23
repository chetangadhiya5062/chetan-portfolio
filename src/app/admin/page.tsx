import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { deletePost, deleteSitePost, logout, makeResumeCurrent, movePost, toggleHidden, togglePinned } from "./actions";
import { AddPostForm, ComposeForm, LoginForm, ResumeForm, StatusForm } from "./forms";
import { linkedinConfigured, linkedinStatus } from "@/lib/publish/linkedin";
import { xConfigured } from "@/lib/publish/x";
import { githubProfileConfigured } from "@/lib/publish/github";

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

const LI_NOTE: Record<string, string> = {
  connected: "LinkedIn connected.",
  failed: "LinkedIn connection failed. Check the client id, secret and redirect URL.",
  "bad-state": "LinkedIn sign-in could not be verified. Try again.",
  "not-configured": "Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET first.",
};

type SitePostRow = { id: string; body: string; targets: string[]; results: Record<string, { ok: boolean; url?: string; error?: string }>; hidden: boolean; created_at: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ li?: string }> }) {
  const { li } = await searchParams;
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

  const [li_status, sitePostsRes, postsRes, resumesRes, statusRes] = await Promise.all([
    linkedinStatus(),
    sb.from("site_posts").select("*").order("created_at", { ascending: false }).limit(20),
    sb.from("social_posts").select("*").order("pinned", { ascending: false }).order("sort_order").order("posted_at", { ascending: false }),
    sb.from("resume_versions").select("*").order("uploaded_at", { ascending: false }),
    sb.from("site_settings").select("value").eq("key", "status").maybeSingle(),
  ]);
  const sitePosts = (sitePostsRes.data ?? []) as SitePostRow[];
  const liReady = li_status.connected && !li_status.expired;
  const xReady = xConfigured();
  const posts = (postsRes.data ?? []) as Post[];
  const resumes = (resumesRes.data ?? []) as Resume[];
  const status = (statusRes.data?.value ?? {}) as { currently?: string; openToWork?: boolean };
  const setupError = postsRes.error?.code === "42P01" || resumesRes.error?.code === "42P01" || sitePostsRes.error?.code === "42P01";

  return (
    <Shell signedIn>
      {setupError && (
        <p className="mb-6 rounded-xl border border-[#ff8a7a]/40 p-4 font-mono text-xs text-[#ff8a7a]">
          Tables are missing. Run <code>supabase/migrations/0002_v2.sql</code> and <code>0003_agent_v1.sql</code> in the Supabase SQL editor first.
        </p>
      )}

      {li && LI_NOTE[li] && <p role="status" className="mb-6 rounded-xl border border-line p-4 font-mono text-xs text-lime">{LI_NOTE[li]}</p>}

      <div className="grid gap-6">
        <section className={card} aria-labelledby="in">
          <h2 id="in" className="mb-2 font-display text-xl">Integrations</h2>
          <p className="mb-6 text-sm text-muted">Where posts and résumé updates can go. Anything missing is just switched off.</p>
          <ul className="divide-y divide-line font-mono text-xs">
            <li className="flex flex-wrap items-center justify-between gap-3 py-3">
              <span><span className="text-ink">LinkedIn</span> · {li_status.connected ? (li_status.expired ? <span className="text-[#ff8a7a]">token expired</span> : <span className="text-lime">connected{li_status.name ? ` as ${li_status.name}` : ""}{li_status.expiresAt ? `, expires ${fmt(li_status.expiresAt)}` : ""}</span>) : "not connected"}</span>
              {linkedinConfigured() ? <a className={mini + " inline-flex items-center"} href="/api/admin/linkedin/start">{li_status.connected ? "Reconnect" : "Connect LinkedIn"}</a> : <span className="text-muted">set LINKEDIN_CLIENT_ID / SECRET</span>}
            </li>
            <li className="py-3"><span className="text-ink">X</span> · {xReady ? <span className="text-lime">keys set</span> : "set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET"}</li>
            <li className="py-3"><span className="text-ink">GitHub profile README</span> · {process.env.GITHUB_DISPATCH_TOKEN ? <span className="text-lime">auto refresh on</span> : "set GITHUB_DISPATCH_TOKEN"}</li>
            <li className="py-3"><span className="text-ink">GitHub bio</span> · {githubProfileConfigured() ? <span className="text-lime">can be updated</span> : "set GITHUB_USER_TOKEN"}</li>
          </ul>
        </section>

        <section className={card} aria-labelledby="co">
          <h2 id="co" className="mb-6 font-display text-xl">Compose</h2>
          <ComposeForm linkedin={liReady} x={xReady} />
          <ul className="mt-8 divide-y divide-line">
            {sitePosts.length === 0 && <li className="py-4 font-mono text-xs text-muted">Nothing composed yet.</li>}
            {sitePosts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-start justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="label">{fmt(p.created_at)} · {p.targets.join(", ")}{p.hidden && " · not on site"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink">{p.body}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    {Object.entries(p.results ?? {}).map(([k, r]) => (
                      <span key={k} className="mr-3">{k}: {r.ok ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-lime hover:underline">posted ↗</a> : <span className="text-[#ff8a7a]">{r.error}</span>}</span>
                    ))}
                  </p>
                </div>
                <form action={deleteSitePost.bind(null, p.id)}><button className={`${mini} hover:!border-[#ff8a7a] hover:!text-[#ff8a7a]`}>Delete</button></form>
              </li>
            ))}
          </ul>
        </section>

        <section className={card} aria-labelledby="st">
          <h2 id="st" className="mb-6 font-display text-xl">Quick status</h2>
          <StatusForm currently={status.currently ?? ""} openToWork={status.openToWork ?? true} />
        </section>

        <section className={card} aria-labelledby="po">
          <h2 id="po" className="mb-2 font-display text-xl">Add an existing post</h2>
          <p className="mb-6 text-sm text-muted">Already posted it on LinkedIn or X yourself? Paste the link and it appears on the site.</p>
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
          <ResumeForm linkedin={liReady} x={xReady} bio={githubProfileConfigured()} />
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
