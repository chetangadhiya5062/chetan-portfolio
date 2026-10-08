import Image from "next/image";
import { profile } from "@/content/profile";
import type { LeetcodeData } from "@/lib/sources/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import Skills from "./Skills";

export default function About({ leetcode }: { leetcode: LeetcodeData | null }) {
  const vectors = [
    ...profile.stats,
    ...(leetcode
      ? [{ value: leetcode.solved.all, label: "LeetCode solved", note: "live · updated daily", live: true }]
      : []),
  ];

  return (
    <section id="about" aria-labelledby="about-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead n="02" layer="Embedding" title={<span id="about-h">Compressed into a few honest numbers.</span>} />

        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div className="space-y-6">
            <Reveal as="p" className="font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
              {profile.about[0]}
            </Reveal>
            {profile.about.slice(1).map((p, i) => (
              <Reveal as="p" key={i} delay={80 * (i + 1)} className="text-base leading-relaxed text-muted md:text-lg">
                {p}
              </Reveal>
            ))}
            <Reveal delay={320} className="flex flex-wrap gap-x-6 gap-y-2 pt-2 font-mono text-xs text-muted">
              <span>{profile.location}</span>
              <span aria-hidden>·</span>
              <span>{profile.languages.join(" · ")}</span>
            </Reveal>
          </div>

          <Reveal delay={120} className="mx-auto w-full max-w-[288px] lg:mx-0 lg:justify-self-end">
            <figure className="relative">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-lime">
                <Image
                  src="/profile-v2.png"
                  alt="Portrait of Chetan Gadhiya"
                  width={400}
                  height={400}
                  sizes="288px"
                  className="duotone size-full object-cover mix-blend-multiply"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,rgba(7,8,11,.55)_0_1px,transparent_1px_4px)]"
                />
              </div>
              {(["-left-2 -top-2 border-l border-t", "-right-2 -top-2 border-r border-t", "-bottom-2 -left-2 border-b border-l", "-bottom-2 -right-2 border-b border-r"] as const).map((c) => (
                <span key={c} aria-hidden className={`absolute size-4 border-lime ${c}`} />
              ))}
              <figcaption className="label mt-5 flex justify-between">
                <span>x ∈ ℝ⁷⁶⁸</span>
                <span>{profile.location.split(",")[0]}</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <ul className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-28 lg:grid-cols-5">
          {vectors.map((v, i) => (
            <Reveal as="li" key={v.label} delay={i * 70} className="bg-surface p-5 md:p-7">
              <p className="label flex items-center gap-2">
                {"live" in v && v.live && <span aria-hidden className="pulse-dot size-1.5 rounded-full bg-lime" />}
                v[{i}]
              </p>
              <p className="mt-4 font-display text-4xl font-semibold text-lime md:text-5xl">
                <CountUp
                  value={v.value}
                  decimals={"decimals" in v ? v.decimals : 0}
                  suffix={"suffix" in v ? v.suffix : ""}
                />
              </p>
              <p className="mt-3 text-sm text-ink">{v.label}</p>
              <p className="mt-1 text-xs text-muted">{v.note}</p>
            </Reveal>
          ))}
        </ul>

        <Skills />
      </div>
    </section>
  );
}
