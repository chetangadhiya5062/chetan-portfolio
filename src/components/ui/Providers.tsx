"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { applyReducedMotion, prefersReducedMotion } from "@/lib/motion";
import Deferred from "./Deferred";
import CommandPalette from "./CommandPalette";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    applyReducedMotion(prefersReducedMotion());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      try {
        if (localStorage.getItem("reduce-motion") !== null) return; // an explicit choice wins
      } catch {
        /* ignore */
      }
      applyReducedMotion(mq.matches);
    };
    mq.addEventListener("change", onChange);

    // One observer reveals every [data-reveal] element (server components just set the attribute).
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    // re-runs per route so client-side navigation back to the home page still reveals its content
    document.querySelectorAll("[data-reveal], .draw").forEach((el) => io.observe(el));

    return () => {
      mq.removeEventListener("change", onChange);
      io.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <Deferred />
      <CommandPalette />
      {children}
    </>
  );
}
