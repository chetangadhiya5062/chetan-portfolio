"use client";

import { scrollToId } from "@/lib/motion";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/50 bg-base/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          aria-label="Chetan Gadhiya — back to top"
          className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-md border border-line bg-surface font-mono text-xs text-lime transition-colors group-hover:border-lime">
            CG
          </span>
          <span className="hidden sm:inline">Chetan Gadhiya</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => window.dispatchEvent(new Event("open-palette"))}
            className="label flex h-9 items-center gap-2 rounded-md border border-line bg-surface/70 px-3 backdrop-blur transition-colors hover:border-lime hover:text-ink"
            aria-label="Open command palette"
          >
            <span className="hidden sm:inline">Jump to</span>
            <kbd className="rounded border border-line px-1.5 py-px text-[10px] text-ink">
              <span className="hidden sm:inline">Ctrl </span>K
            </kbd>
          </button>
          <a
            href="/resume"
            target="_blank"
            rel="noopener"
            className="flex h-9 items-center rounded-md bg-lime px-4 font-mono text-xs font-medium uppercase tracking-wider text-base transition-transform hover:-translate-y-0.5"
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
