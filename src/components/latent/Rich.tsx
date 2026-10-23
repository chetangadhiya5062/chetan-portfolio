import { Fragment } from "react";
import Term from "./Term";

/** Phrases that map to a concept. Longest first so "multi-agent systems" wins over "agent". */
const ALIASES: [string, string][] = [
  ["retrieval-augmented generation", "rag"], ["RAG", "rag"],
  ["reinforcement learning", "rl"], ["RL", "rl"],
  ["reward shaping", "reward-shaping"], ["reward functions", "reward-shaping"], ["reward function", "reward-shaping"],
  ["multi-agent systems", "multi-agent"], ["multi-agent", "multi-agent"],
  ["knowledge graphs", "knowledge-graph"], ["knowledge graph", "knowledge-graph"],
  ["vector databases", "vector-db"], ["vector database", "vector-db"], ["Vector DBs", "vector-db"],
  ["semantic search", "semantic-search"], ["semantic retrieval", "semantic-search"],
  ["embedding-based retrieval", "embeddings"], ["embeddings", "embeddings"], ["embedding", "embeddings"],
  ["LLM Gateway", "llm-gateway"], ["LLM gateway", "llm-gateway"],
  ["AI Memory Layer", "memory"], ["AI memory", "memory"],
  ["Clean Architecture", "clean-arch"], ["SOLID", "solid"],
  ["structured observability", "observability"], ["observability", "observability"],
  ["prompt engineering", "prompting"], ["Prompt Engineering", "prompting"], ["prompt orchestration", "prompting"],
  ["structured JSON", "structured-output"], ["structured output", "structured-output"], ["structured outputs", "structured-output"],
  ["workflow orchestration", "workflow"], ["Workflow Engine", "workflow"],
  ["autonomous agents", "agents"], ["AI agents", "agents"], ["AI Agents", "agents"], ["agentic", "agents"], ["agent", "agents"], ["agents", "agents"],
  ["tool invocation", "tool-use"], ["tool calling", "tool-use"],
  ["LangGraph", "langgraph"], ["CrewAI", "crewai"], ["Gemini", "gemini"], ["Llama 3", "llama"],
  ["AWS Bedrock", "aws-bedrock"], ["Qdrant", "qdrant"], ["Kafka", "kafka"], ["Spark", "spark"], ["PostgreSQL", "postgres"],
  ["Docker", "docker"], ["FastAPI", "fastapi"], ["Pydantic", "pydantic"], ["WebSockets", "websockets"], ["WebSocket", "websockets"],
  ["HuggingFace Spaces", "huggingface"], ["HuggingFace", "huggingface"],
  ["LLMs", "llm"], ["LLM", "llm"], ["language model", "llm"], ["Deep Learning", "deep-learning"], ["Machine Learning", "ml"],
  ["fact verification", "fact-check"], ["fact-checking", "fact-check"], ["fact-verification", "fact-check"],
  ["citations", "citations"], ["encrypted", "encryption"], ["evaluation", "evaluation"],
  ["CI", "ci"], ["Python", "python"], ["TypeScript", "typescript"], ["Next.js", "nextjs"], ["Hackathon", "hackathons"], ["hackathons", "hackathons"],
  ["production", "production"], ["MCP", "mcp"], ["chunking", "chunking"], ["tokens", "tokens"], ["NLP", "nlp"],
].sort((a, b) => b[0].length - a[0].length) as [string, string][];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = new RegExp(`(?<![\\w-])(${ALIASES.map(([a]) => esc(a)).join("|")})(?![\\w-])`, "g");
const MAP = new Map(ALIASES);

/**
 * Auto-links concept mentions in a string. Each concept is linked once per Rich block
 * so paragraphs stay readable. Use `all` to link every mention.
 */
export default function Rich({ text, all = false }: { text: string; all?: boolean }) {
  const seen = new Set<string>();
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(RE)) {
    const id = MAP.get(m[1]);
    if (!id || (!all && seen.has(id))) continue;
    seen.add(id);
    out.push(<Fragment key={m.index}>{text.slice(last, m.index)}</Fragment>);
    out.push(<Term key={`t${m.index}`} id={id}>{m[1]}</Term>);
    last = (m.index ?? 0) + m[1].length;
  }
  out.push(<Fragment key="end">{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
