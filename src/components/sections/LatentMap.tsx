"use client";

import { useLatent } from "@/components/latent/LatentProvider";
import { concepts, clusters, type Cluster } from "@/content/concepts";
import { latentDim, latentModel, latentNodes } from "@/lib/latent";
import Reveal from "@/components/ui/Reveal";

const W = 1000, H = 560, PAD = 46;
const pos = new Map(latentNodes.map((n) => [n.id, n]));

/** 2-D PCA projection of the real 384-d embedding space. Same concepts as the underlined words in the copy. */
export default function LatentMap() {
  const { activate, deactivate, toggle, active } = useLatent();

  return (
    <div className="mt-20 md:mt-28">
      <Reveal as="h3" className="label mb-6">Latent space · {concepts.length} concepts · {latentModel} · {latentDim}-d → 2-d (PCA)</Reveal>
      <Reveal className="overflow-hidden rounded-2xl border border-line bg-surface p-3 md:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Map of concepts. Nearby points have similar meaning." className="latent-map h-auto w-full">
          {[0.25, 0.5, 0.75].map((t) => (
            <g key={t} stroke="var(--color-line)" strokeDasharray="2 6">
              <line x1={PAD + t * (W - PAD * 2)} x2={PAD + t * (W - PAD * 2)} y1={PAD / 2} y2={H - PAD / 2} />
              <line x1={PAD / 2} x2={W - PAD / 2} y1={PAD + t * (H - PAD * 2)} y2={PAD + t * (H - PAD * 2)} />
            </g>
          ))}
          {concepts.map((c) => {
            const n = pos.get(c.id);
            if (!n) return null;
            const x = PAD + n.x * (W - PAD * 2);
            const y = PAD + n.y * (H - PAD * 2);
            const color = clusters[c.cluster].color;
            const right = x < W - 170;
            return (
              <g
                key={c.id}
                data-concept={c.id}
                style={{ "--tc": color } as React.CSSProperties}
                className="map-dot cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${c.label}: show related concepts`}
                aria-pressed={active === c.id}
                onPointerEnter={(e) => e.pointerType === "mouse" && activate(c.id, e.currentTarget as unknown as HTMLElement)}
                onPointerLeave={(e) => e.pointerType === "mouse" && deactivate(c.id)}
                onFocus={(e) => activate(c.id, e.currentTarget as unknown as HTMLElement)}
                onBlur={() => deactivate(c.id)}
                onClick={(e) => toggle(c.id, e.currentTarget as unknown as HTMLElement)}
              >
                <circle cx={x} cy={y} r={14} fill="transparent" />
                <circle className="dot" cx={x} cy={y} r={5} fill={color} />
                <text x={right ? x + 11 : x - 11} y={y + 4} textAnchor={right ? "start" : "end"} fontSize={13} fill="var(--color-ink)" fontFamily="var(--font-jetbrains), monospace">
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 px-1 font-mono text-[11px] text-muted">
          {(Object.keys(clusters) as Cluster[]).map((k) => (
            <li key={k} className="flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-full" style={{ background: clusters[k].color }} />
              {clusters[k].label}
            </li>
          ))}
          <li className="ml-auto hidden sm:block">closer = more similar · hover a dot</li>
        </ul>
      </Reveal>
    </div>
  );
}
