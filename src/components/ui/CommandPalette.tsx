"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { sections } from "@/lib/nav";
import { scrollToId, setReducedMotion } from "@/lib/motion";

type Cmd = { id: string; label: string; hint: string; run: () => void };

/** ⌘K / Ctrl+K palette. Also opened by the `open-palette` window event (nav button). */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [toast, setToast] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setIdx(0);
    returnTo.current?.focus?.();
  }, []);

  const say = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 2200);
  }, []);

  const cmds = useMemo<Cmd[]>(
    () => [
      ...sections.map<Cmd>((s) => ({
        id: s.id, label: `Go to ${s.name}`, hint: `${s.n} · ${s.label}`, run: () => scrollToId(s.id),
      })),
      { id: "resume", label: "Open resume", hint: "PDF · latest", run: () => window.open("/resume", "_blank", "noopener") },
      {
        id: "email", label: "Copy email address", hint: profile.email,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            say("Email copied");
          } catch {
            say(profile.email);
          }
        },
      },
      { id: "github", label: "Open GitHub", hint: "chetangadhiya5062", run: () => window.open(profile.links.github, "_blank", "noopener") },
      { id: "linkedin", label: "Open LinkedIn", hint: "in/chetan-gadhiya", run: () => window.open(profile.links.linkedin, "_blank", "noopener") },
      { id: "leetcode", label: "Open LeetCode", hint: profile.handles.leetcode, run: () => window.open(profile.links.leetcode, "_blank", "noopener") },
      { id: "medium", label: "Open Medium", hint: profile.handles.medium, run: () => window.open(profile.links.medium, "_blank", "noopener") },
      {
        id: "motion", label: "Toggle reduced motion", hint: "Turns animation on / off",
        run: () => {
          const next = !document.documentElement.classList.contains("reduce-motion");
          setReducedMotion(next);
          say(next ? "Reduced motion on" : "Reduced motion off");
        },
      },
    ],
    [say],
  );

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? cmds.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(t)) : cmds;
  }, [q, cmds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        returnTo.current = document.activeElement as HTMLElement | null;
        setOpen((o) => !o);
      }
    };
    const onOpen = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    window.__lenis?.stop();
    return () => window.__lenis?.start();
  }, [open]);

  const exec = (c: Cmd | undefined) => {
    if (!c) return;
    setOpen(false);
    setQ("");
    setIdx(0);
    // let the dialog unmount so scroll lock is released first
    window.setTimeout(() => c.run(), 30);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); exec(results[idx]); }
    else if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Tab") { e.preventDefault(); input.current?.focus(); } // simple focus trap
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-lime transition-opacity ${toast ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        {toast}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-base/70 px-4 pt-[14vh] backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span aria-hidden className="font-mono text-lime">{">"}</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                onKeyDown={onInputKey}
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-list"
                aria-activedescendant={results[idx] ? `cmd-${results[idx].id}` : undefined}
                aria-label="Type a command"
                placeholder="Jump to…  resume, projects, copy email"
                style={{ outline: "none" }}
                className="h-14 w-full bg-transparent font-mono text-sm text-ink placeholder:text-muted"
              />
              <kbd className="label rounded border border-line px-1.5 py-0.5">esc</kbd>
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center font-mono text-xs text-muted">No match</li>}
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === idx}
                  onMouseMove={() => setIdx(i)}
                  onClick={() => exec(c)}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm ${i === idx ? "bg-line text-ink" : "text-muted"}`}
                >
                  <span>{c.label}</span>
                  <span className="label truncate">{c.hint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
