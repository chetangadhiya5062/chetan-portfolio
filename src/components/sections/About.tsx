import Image from "next/image";
import Backdrop from "@/components/ui/Backdrop";
import { profile } from "@/content/profile";
import type { LeetcodeData } from "@/lib/sources/types";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import Skills from "./Skills";
import LatentMap from "./LatentMap";
import Journey from "./Journey";
import Rich from "@/components/latent/Rich";

export default function About({ leetcode }: { leetcode: LeetcodeData | null }) {
  const vectors = [
    ...profile.stats,
    ...(leetcode
      ? [{ value: leetcode.solved.all, label: "LeetCode solved", note: "live · updated daily", live: true }]
      : []),
  ];

  return (
    <section id="about" aria-labelledby="about-h" className="relative isolate py-24 md:py-36">
      <Backdrop variant="orbit" n="02" seed={3} />
      <div className="relative isolate mx-auto max-w-[1200px] px-4 sm:px-6">
        <Backdrop variant="circuit" seed={41} flip className="inset-x-0 -top-10 h-[760px]" />
        <SectionHead n="02" layer="Embed · text becomes vectors" title={<span id="about-h">What I know, as a <em>map</em> you can walk.</span>} lede="Dotted words are concepts. Hover or tap one and everything related lights up across the page, scored by real cosine similarity from an embedding model." />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="space-y-6">
            <Reveal as="p" className="font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
              <Rich text={profile.about[0]} />
            </Reveal>
            {profile.about.slice(1).map((p, i) => (
              <Reveal as="p" key={i} delay={80 * (i + 1)} className="text-base leading-relaxed text-muted md:text-lg">
                <Rich text={p} />
              </Reveal>
            ))}
            <Reveal delay={320} className="flex flex-wrap gap-x-6 gap-y-2 pt-2 font-mono text-xs text-muted">
              <span>{profile.location}</span>
              <span aria-hidden>·</span>
              <span>{profile.languages.join(" · ")}</span>
            </Reveal>
          </div>

          <Reveal delay={120} className="mx-auto w-full max-w-[300px] lg:max-w-[440px] lg:mx-0 lg:justify-self-end">
            <figure className="relative">
              <div tabIndex={0} className="group relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface outline-none">
                <Image
                  src="/profile-v2.png"
                  alt="Portrait of Chetan Gadhiya"
                  width={600}
                  height={600}
                  sizes="(min-width:1024px) 440px, 300px"
                  className="size-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0 group-focus:opacity-0"
                />
                <div aria-hidden className="absolute inset-0 bg-lime opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-focus:opacity-100">
                  <Image src="/profile-v2.png" alt="" width={600} height={600} sizes="(min-width:1024px) 440px, 300px" className="duotone size-full scale-105 object-cover mix-blend-multiply" />
                  <span className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,rgba(13,12,10,.55)_0_1px,transparent_1px_4px)]" />
                </div>
                <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-1/3 h-1/3 bg-gradient-to-b from-transparent via-lime/25 to-transparent opacity-0 group-hover:animate-[scan_1.4s_ease-in-out] group-hover:opacity-100" />
              </div>
              {(["-left-2 -top-2 border-l border-t", "-right-2 -top-2 border-r border-t", "-bottom-2 -left-2 border-b border-l", "-bottom-2 -right-2 border-b border-r"] as const).map((c) => (
                <span key={c} aria-hidden className={`absolute size-4 border-lime ${c}`} />
              ))}
              <figcaption className="label mt-5 flex justify-between">
                <span>hover · x ∈ ℝ⁷⁶⁸</span>
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

        <LatentMap />

        <Journey />

        <Skills />
      </div>
    </section>
  );
}
