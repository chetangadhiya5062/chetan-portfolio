"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * A phone that kept a tab open across a deploy asks for JS chunks that no longer exist. That is not a real failure:
 * one hard reload fetches the new page. Guarded by sessionStorage so a genuine, repeating error cannot loop.
 */
function isStaleChunk(error: Error) {
  const m = `${error?.name} ${error?.message}`;
  return /ChunkLoadError|Loading chunk|Loading CSS chunk|dynamically imported module|Failed to fetch dynamically|importing a module script failed/i.test(m);
}

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    if (!isStaleChunk(error)) return;
    try {
      if (sessionStorage.getItem("chunk-reload") === "1") return;
      sessionStorage.setItem("chunk-reload", "1");
    } catch {
      return;
    }
    window.location.reload();
  }, [error]);

  return (
    <main id="main" className="mx-auto flex min-h-[100svh] max-w-[900px] flex-col justify-center px-4 sm:px-6">
      <p className="label text-lime">500 · exploding gradient</p>
      <h1 className="mt-5 font-display text-4xl font-semibold sm:text-6xl">Something broke on my side.</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">It&apos;s been logged. Try again, or head back to the start.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={() => (isStaleChunk(error) ? window.location.reload() : reset())} className="h-12 rounded-md bg-lime px-6 font-mono text-sm font-medium uppercase tracking-wider text-base">
          Try again
        </button>
        <Link href="/" className="inline-flex h-12 items-center rounded-md border border-line px-6 font-mono text-sm uppercase tracking-wider hover:border-lime">
          Home
        </Link>
      </div>
    </main>
  );
}
