import { profile } from "@/content/profile";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Prompt from "./Prompt";

const socials = [
  { label: "GitHub", href: profile.links.github, handle: "chetangadhiya5062" },
  { label: "LinkedIn", href: profile.links.linkedin, handle: "chetan-gadhiya" },
  { label: "LeetCode", href: profile.links.leetcode, handle: profile.handles.leetcode },
  { label: "Medium", href: profile.links.medium, handle: profile.handles.medium },
  { label: "X", href: profile.links.x, handle: "@chetan_gadhiya7" },
  { label: "Email", href: `mailto:${profile.email}`, handle: profile.email },
];

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="08"
          layer="Inference"
          title={<span id="contact-h">Ask a question. Get a real answer.</span>}
          lede={`I'm open to ${profile.openTo}. Reach out and I'll reply personally.`}
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal><Prompt /></Reveal>
          <Reveal delay={100}>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {socials.map((s) => {
                const external = !s.href.startsWith("mailto:");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-line/40 md:px-6"
                    >
                      <span className="font-display text-lg text-ink group-hover:text-lime">{s.label}</span>
                      <span className="flex min-w-0 items-center gap-3 font-mono text-xs text-muted">
                        <span className="truncate">{s.handle}</span>
                        <span aria-hidden className="transition-transform group-hover:translate-x-1 group-hover:text-lime">{external ? "↗" : "→"}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
