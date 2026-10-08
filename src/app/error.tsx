"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex min-h-[100svh] max-w-[900px] flex-col justify-center px-4 sm:px-6">
      <p className="label text-lime">500 · exploding gradient</p>
      <h1 className="mt-5 font-display text-4xl font-semibold sm:text-6xl">Something broke on my side.</h1>
      <p className="mt-6 max-w-lg text-lg text-muted">It&apos;s been logged. Try again, or head back to the start.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={reset} className="h-12 rounded-md bg-lime px-6 font-mono text-sm font-medium uppercase tracking-wider text-base">
          Try again
        </button>
        <Link href="/" className="inline-flex h-12 items-center rounded-md border border-line px-6 font-mono text-sm uppercase tracking-wider hover:border-lime">
          Home
        </Link>
      </div>
    </main>
  );
}
