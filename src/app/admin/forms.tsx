"use client";

import { useActionState } from "react";
import { addPost, composePost, login, saveStatus, uploadResume, type FormState } from "./actions";

const initial: FormState = { ok: false, message: "" };

const input =
  "h-11 w-full rounded-md border border-line bg-base px-3 font-mono text-sm text-ink placeholder:text-muted focus:border-lime";
const button =
  "h-11 rounded-md bg-lime px-5 font-mono text-xs font-medium uppercase tracking-wider text-base disabled:opacity-50";

function Msg({ s }: { s: FormState }) {
  if (!s.message) return null;
  return (
    <p role="status" className={`font-mono text-xs ${s.ok ? "text-lime" : "text-[#ff8a7a]"}`}>
      {s.message}
    </p>
  );
}

export function LoginForm() {
  const [s, action, pending] = useActionState(login, initial);
  return (
    <form action={action} className="space-y-4">
      <label className="label block" htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className={input} />
      <button className={button} disabled={pending}>{pending ? "Checking…" : "Sign in"}</button>
      <Msg s={s} />
    </form>
  );
}

export function AddPostForm() {
  const [s, action, pending] = useActionState(addPost, initial);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label mb-2 block" htmlFor="url">LinkedIn or X post URL</label>
        <input id="url" name="url" type="url" required placeholder="https://www.linkedin.com/posts/…  or  https://x.com/…/status/…" className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
        <div>
          <label className="label mb-2 block" htmlFor="note">Note (optional)</label>
          <input id="note" name="note" maxLength={200} placeholder="Shown under the post" className={input} />
        </div>
        <div>
          <label className="label mb-2 block" htmlFor="date">Date (optional)</label>
          <input id="date" name="date" type="date" className={input} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button className={button} disabled={pending}>{pending ? "Fetching…" : "Add post"}</button>
        <Msg s={s} />
      </div>
    </form>
  );
}

const check = "flex items-center gap-2 font-mono text-xs text-ink";

export function ComposeForm({ linkedin, x }: { linkedin: boolean; x: boolean }) {
  const [s, action, pending] = useActionState(composePost, initial);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label mb-2 block" htmlFor="body">Write once, publish everywhere</label>
        <textarea id="body" name="body" rows={5} maxLength={3000} required placeholder="What did you build or learn?" className="w-full rounded-md border border-line bg-base p-3 font-mono text-sm text-ink placeholder:text-muted focus:border-lime" />
        <p className="label mt-1">X allows 280 characters. LinkedIn allows 3000.</p>
      </div>
      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="label mb-2">Publish to</legend>
        <label className={check}><input type="checkbox" name="t_site" defaultChecked className="size-4 accent-[#c6ff3d]" /> This site</label>
        <label className={check}><input type="checkbox" name="t_linkedin" disabled={!linkedin} className="size-4 accent-[#c6ff3d]" /> LinkedIn{!linkedin && " (not connected)"}</label>
        <label className={check}><input type="checkbox" name="t_x" disabled={!x} className="size-4 accent-[#c6ff3d]" /> X{!x && " (keys not set)"}</label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-4">
        <button className={button} disabled={pending}>{pending ? "Publishing…" : "Publish"}</button>
        <Msg s={s} />
      </div>
    </form>
  );
}

export function ResumeForm({ linkedin, x, bio }: { linkedin: boolean; x: boolean; bio: boolean }) {
  const [s, action, pending] = useActionState(uploadResume, initial);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label mb-2 block" htmlFor="file">PDF (max 4 MB)</label>
        <input id="file" name="file" type="file" accept="application/pdf" required className={`${input} pt-2.5 file:mr-4 file:rounded file:border-0 file:bg-line file:px-3 file:py-1 file:font-mono file:text-xs file:text-ink`} />
      </div>
      <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
        <legend className="label mb-2">After uploading (optional)</legend>
        <label className={check}><input type="checkbox" name="ann_linkedin" disabled={!linkedin} className="size-4 accent-[#c6ff3d]" /> Announce on LinkedIn</label>
        <label className={check}><input type="checkbox" name="ann_x" disabled={!x} className="size-4 accent-[#c6ff3d]" /> Announce on X</label>
        <label className={check}><input type="checkbox" name="sync_bio" disabled={!bio} className="size-4 accent-[#c6ff3d]" /> Update GitHub bio</label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-4">
        <button className={button} disabled={pending}>{pending ? "Uploading…" : "Upload & make current"}</button>
        <Msg s={s} />
      </div>
    </form>
  );
}

export function StatusForm({ currently, openToWork }: { currently: string; openToWork: boolean }) {
  const [s, action, pending] = useActionState(saveStatus, initial);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label mb-2 block" htmlFor="currently">Hero “Currently:” line</label>
        <input id="currently" name="currently" defaultValue={currently} maxLength={120} placeholder="building agentic systems" className={input} />
      </div>
      <label className="flex items-center gap-3 font-mono text-sm text-ink">
        <input type="checkbox" name="openToWork" defaultChecked={openToWork} className="size-4 accent-[#c6ff3d]" />
        Show “Open to work”
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button className={button} disabled={pending}>{pending ? "Saving…" : "Save status"}</button>
        <Msg s={s} />
      </div>
    </form>
  );
}
