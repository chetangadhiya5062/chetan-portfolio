"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["What has Chetan built?", "Is he open to work?", "What's his strongest skill area?"];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) field.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [msgs]);

  useEffect(() => () => abort.current?.abort(), []);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    abort.current = new AbortController();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-7) }),
        signal: abort.current.signal,
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error || "Something went wrong.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error("No answer came back.");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: `${(e as Error).message} You can also email ${profile.email}.` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[55] sm:bottom-6 sm:right-6">
      {open && (
        <section
          role="dialog"
          aria-label={`Ask about ${profile.name}`}
          className="mb-3 flex h-[min(520px,70svh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]"
        >
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="label text-lime">Ask my portfolio</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="font-mono text-xs text-muted hover:text-ink">esc ✕</button>
          </header>
          <div ref={log} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.length === 0 && (
              <div>
                <p className="text-muted">Answers come only from Chetan&apos;s own content. Try:</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-left font-mono text-[11px] text-ink hover:border-lime">{s}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {msgs.map((m, i) => (
              <p key={i} className={m.role === "user" ? "ml-8 rounded-xl bg-line px-3 py-2 text-ink" : "mr-4 whitespace-pre-line leading-relaxed text-muted"}>
                {m.content || (busy && i === msgs.length - 1 ? "…" : "")}
              </p>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-line p-3">
            <label htmlFor="chat-q" className="sr-only">Your question</label>
            <input
              id="chat-q"
              ref={field}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder="Ask anything about Chetan…"
              style={{ outline: "none" }}
              className="h-10 min-w-0 flex-1 rounded-md border border-line bg-base px-3 font-mono text-xs text-ink placeholder:text-muted focus:border-lime"
            />
            <button disabled={busy || !input.trim()} className="h-10 rounded-md bg-lime px-4 font-mono text-xs font-medium uppercase tracking-wider text-base disabled:opacity-40">Ask</button>
          </form>
        </section>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="ml-auto flex h-12 items-center gap-2 rounded-full border border-lime/50 bg-surface/90 px-5 font-mono text-xs uppercase tracking-wider text-lime shadow-lg backdrop-blur transition-colors hover:bg-lime hover:text-base"
      >
        <span aria-hidden className="pulse-dot size-2 rounded-full bg-current" />
        Ask AI
      </button>
    </div>
  );
}
