"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

/** Terminal-style prompt: Enter opens a mailto with what was typed. */
export default function Prompt() {
  const [msg, setMsg] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = msg.trim();
    const subject = "Hello Chetan — from your portfolio";
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={send} className="overflow-hidden rounded-2xl border border-line bg-surface focus-within:border-lime/60">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3" aria-hidden>
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="label ml-3">inference — chetan.ai</span>
      </div>
      <div className="p-5 md:p-7">
        <p className="font-mono text-xs text-muted">
          <span className="text-cyan">model</span> ready · type a message, press Enter, your mail app opens addressed to me.
        </p>
        <label htmlFor="ask" className="sr-only">Your message to Chetan</label>
        <div className="mt-5 flex items-start gap-3 font-mono text-base md:text-lg">
          <span aria-hidden className="pt-0.5 text-lime">{">"}</span>
          <textarea
            id="ask"
            rows={2}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="ask chetan…"
            style={{ outline: "none" }}
            className="min-h-[3.2rem] w-full resize-none bg-transparent leading-relaxed text-ink placeholder:text-muted"
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="label">Enter ↵ send · Shift+Enter new line</p>
          <button type="submit" className="h-11 rounded-md bg-lime px-6 font-mono text-xs font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5">
            Run inference
          </button>
        </div>
      </div>
    </form>
  );
}
