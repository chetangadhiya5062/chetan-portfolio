"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const LayerRail = dynamic(() => import("./LayerRail"), { ssr: false });

/**
 * Nice-to-have enhancements (smooth scroll, custom cursor, layer rail) mount after the page is
 * interactive, so they never compete with first paint or hydration.
 */
export default function Deferred() {
  const [ready, setReady] = useState(false);
  const [env, setEnv] = useState({ fine: false, wide: false });

  useEffect(() => {
    const go = () => {
      // touch / small screens never need smooth-scroll, the custom cursor or the layer rail
      setEnv({
        fine: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
        wide: window.matchMedia("(min-width: 1280px)").matches,
      });
      setReady(true);
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(go, { timeout: 2500 }) : window.setTimeout(go, 1500);
    window.addEventListener("pointerdown", go, { once: true, passive: true });
    window.addEventListener("keydown", go, { once: true });
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      window.removeEventListener("pointerdown", go);
      window.removeEventListener("keydown", go);
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      {env.fine && <SmoothScroll />}
      {env.fine && <Cursor />}
      {env.wide && <LayerRail />}
    </>
  );
}
