import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { achievements, certifications } from "@/content/achievements";
import type { Chunk } from "@/lib/rag";
import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import RagConsole from "./RagConsole";

function buildChunks(): Chunk[] {
  const out: Chunk[] = [];
  profile.about.forEach((t, i) => out.push({ id: `about-${i}`, source: "About", title: i === 0 ? "How I work" : "Background", text: t }));
  for (const r of experience) {
    r.bullets.forEach((b, i) => out.push({ id: `${r.id}-${i}`, source: `Experience · ${r.org.split(" (")[0]}`, title: r.title, text: b, href: "#experience" }));
  }
  for (const p of projects) {
    out.push({ id: `${p.slug}-s`, source: "Project", title: p.title, text: `${p.summary} ${p.problem}`, href: `/projects/${p.slug}` });
    p.approach.forEach((a, i) => out.push({ id: `${p.slug}-a${i}`, source: "Project", title: p.title, text: `${a} Stack: ${p.stack.join(", ")}.`, href: `/projects/${p.slug}` }));
  }
  for (const g of skillGroups) out.push({ id: `skills-${g.id}`, source: "Skills", title: g.label, text: `${g.label}: ${g.skills.join(", ")}.`, href: "#about" });
  for (const a of achievements) out.push({ id: a.id, source: "Achievement", title: a.title, text: `${a.title}. ${a.result}`, href: "#evaluation" });
  for (const c of certifications) out.push({ id: c.id, source: "Certification", title: c.title, text: `${c.title}, ${c.issuer}.`, href: "#evaluation" });
  return out;
}

export default function Ask() {
  const chunks = buildChunks();
  return (
    <section id="ask" aria-labelledby="ask-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="03"
          layer="Retrieve · RAG on my own work"
          title={<span id="ask-h">Don&apos;t read it. <em>Query</em> it.</span>}
          lede="This runs in your browser against everything on this site. See what gets retrieved, how it is scored, and which related concepts widened the search."
        />
        <Reveal><RagConsole chunks={chunks} /></Reveal>
      </div>
    </section>
  );
}
