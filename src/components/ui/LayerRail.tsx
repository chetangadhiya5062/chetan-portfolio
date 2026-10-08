"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { sections } from "@/lib/nav";
import { scrollToId } from "@/lib/motion";

/** Right-edge "layer depth" indicator: thin progress line + a dot per layer. */
export default function LayerRail() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("top");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <nav aria-label="Page sections" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col items-end gap-3.5">
        <span aria-hidden className="absolute right-[5px] top-1 h-[calc(100%-8px)] w-px bg-line" />
        <span
          aria-hidden
          className="absolute right-[5px] top-1 w-px origin-top bg-lime"
          style={{ height: "calc(100% - 8px)", transform: `scaleY(${progress})` }}
        />
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollToId(s.id)}
              aria-label={`${s.n} ${s.label}`}
              aria-current={on ? "true" : undefined}
              className="group relative flex items-center gap-3"
            >
              <span
                className={`label whitespace-nowrap transition-all duration-300 ${
                  "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                }`}
              >
                {s.n} {s.label}
              </span>
              <span
                className={`relative z-10 block size-[11px] rounded-full border transition-all duration-300 ${
                  on ? "scale-110 border-lime bg-lime" : "border-muted bg-base group-hover:border-lime"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
