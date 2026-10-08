"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { onMotionChange, prefersReducedMotion } from "@/lib/motion";

/** Lenis smooth scroll. Off entirely for reduced-motion users and re-checks when they toggle it. */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    let raf = 0;

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, anchors: false });
      window.__lenis = lenis;
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
      window.__lenis = undefined;
    };

    if (!prefersReducedMotion()) start();
    const off = onMotionChange((reduced) => (reduced ? stop() : start()));
    return () => {
      off();
      stop();
    };
  }, []);

  return null;
}
