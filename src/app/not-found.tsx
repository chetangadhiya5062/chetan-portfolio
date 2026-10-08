import Link from "next/link";

export const metadata = { title: "404 — signal lost", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[100svh] max-w-[900px] flex-col justify-center px-4 sm:px-6">
      <p className="label text-lime">404 · vanishing gradient</p>
      <h1 className="mt-5 font-display text-[clamp(2.6rem,9vw,6rem)] font-semibold leading-[0.98] tracking-tight">
        This activation <br />
        went to zero.
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        The page you asked for doesn&apos;t exist. The rest of the network is fine.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-md bg-lime px-6 font-mono text-sm font-medium uppercase tracking-wider text-base">
          Back to input →
        </Link>
        <Link href="/#projects" className="inline-flex h-12 items-center rounded-md border border-line px-6 font-mono text-sm uppercase tracking-wider hover:border-lime">
          See projects
        </Link>
      </div>
    </main>
  );
}
