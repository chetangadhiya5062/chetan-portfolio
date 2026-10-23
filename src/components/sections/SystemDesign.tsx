import SectionHead from "@/components/ui/SectionHead";
import Reveal from "@/components/ui/Reveal";
import Term from "@/components/latent/Term";

const LAYERS: { n: string; name: string; nodes: [string, string][] }[] = [
  { n: "L6", name: "API", nodes: [["fastapi", "REST + WebSocket API"], ["structured-output", "Typed schemas"]] },
  { n: "L5", name: "Application services", nodes: [["workflow", "Workflow engine"], ["prompting", "Prompt runtime"], ["evaluation", "Evaluation hooks"]] },
  { n: "L4", name: "Platform runtime", nodes: [["llm-gateway", "LLM gateway"], ["rag", "RAG runtime"], ["memory", "AI memory layer"], ["knowledge-graph", "Knowledge graph"], ["agents", "Agent runtime"], ["mcp", "Tool / MCP gateway"]] },
  { n: "L3", name: "Plugins", nodes: [["tool-use", "Tool plugins"], ["chunking", "Ingestion + chunking"]] },
  { n: "L2", name: "Infrastructure adapters", nodes: [["vector-db", "Vector store"], ["postgres", "Relational store"], ["kafka", "Event stream"], ["aws-bedrock", "Model providers"]] },
  { n: "L1", name: "Core ports", nodes: [["clean-arch", "Interfaces first"], ["solid", "Dependency injection"], ["observability", "Structured observability"]] },
];

/** NeuroFlow AI's six layers as an interactive diagram: every node is a concept in the same latent space. */
export default function SystemDesign() {
  return (
    <section id="system" aria-labelledby="sys-h" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHead
          n="06"
          layer="Serve · platform design"
          title={<span id="sys-h">How an AI platform is <em>put together</em>.</span>}
          lede="The six-layer architecture behind NeuroFlow AI. Hover or tap any block to see which other concepts it sits close to."
        />
        <Reveal className="space-y-3">
          {LAYERS.map((l) => (
            <div key={l.n} className="grid gap-3 spot rounded-2xl border border-line bg-surface p-4 md:grid-cols-[170px_1fr] md:p-5">
              <p className="flex items-baseline gap-3 md:block">
                <span className="font-mono text-xs text-lime">{l.n}</span>
                <span className="block font-display text-lg font-medium text-ink md:mt-1">{l.name}</span>
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {l.nodes.map(([id, label]) => (
                  <li key={id}>
                    <Term id={id} className="node-chip"><span className="font-mono text-[13px]">{label}</span></Term>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
        <p className="label mt-5">Requests flow down through the layers. Dependencies point inward.</p>
      </div>
    </section>
  );
}
