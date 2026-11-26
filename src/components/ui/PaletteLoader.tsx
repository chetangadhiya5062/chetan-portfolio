"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * The command palette (~7 KB of code plus its command list) is fetched the first time it is wanted:
 * Ctrl/Cmd+K or the nav button. The triggering event is replayed once the palette has mounted.
 */
export default function PaletteLoader() {
  const [Palette, setPalette] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (Palette) return;
    let loading = false;
    const load = () => {
      if (loading) return;
      loading = true;
      import("./CommandPalette").then((m) => {
        setPalette(() => m.default);
        // two frames: the palette registers its listeners in an effect after it mounts
        requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event("open-palette"))));
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        load();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", load);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", load);
    };
  }, [Palette]);

  return Palette ? <Palette /> : null;
}
