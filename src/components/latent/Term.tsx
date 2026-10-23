"use client";

import { useLatent } from "./LatentProvider";
import { clusterColor, getConcept } from "@/lib/latent";

/** A concept mention. Hover, focus or tap it and every related term on the page lights up. */
export default function Term({ id, children, className = "term" }: { id: string; children?: React.ReactNode; className?: string }) {
  const { activate, deactivate, toggle } = useLatent();
  const c = getConcept(id);
  if (!c) return <>{children}</>;
  return (
    <button
      type="button"
      className={className}
      data-term={id}
      style={{ "--tc": clusterColor(id) } as React.CSSProperties}
      aria-label={`${children ?? c.label}: show related concepts`}
      onPointerEnter={(e) => e.pointerType === "mouse" && activate(id, e.currentTarget)}
      onPointerLeave={(e) => e.pointerType === "mouse" && deactivate(id)}
      onFocus={(e) => activate(id, e.currentTarget)}
      onBlur={() => deactivate(id)}
      onClick={(e) => toggle(id, e.currentTarget)}
    >
      {children ?? c.label}
    </button>
  );
}
