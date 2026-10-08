export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  approach: string[];
  stack: string[];
  /** skill names (from skills.ts) lit up on hover */
  skills: string[];
  proof: { label: string; href: string }[];
  /** GitHub "owner/name" for live metadata */
  repo: string;
};

export const projects: Project[] = [
  {
    slug: "openenv",
    title: "OpenEnv — Data-Cleaning RL Agent",
    kicker: "Reinforcement learning · LLM agents",
    summary:
      "A custom RL environment where a Llama 3 agent autonomously cleans tabular data.",
    problem:
      "Data cleaning is repetitive and rule-heavy, yet hard to automate because 'clean' depends on the table. It needs an agent that can act, get feedback, and know when it is done.",
    approach: [
      "Custom RL environment with shaped rewards: +2 for missing-value reduction, +3 for deduplication, +5 for completion, plus anti-loop penalties.",
      "Pydantic schemas for actions and observations; structured-JSON LLM pipeline with fallbacks when the model returns malformed output.",
      "FastAPI REST and WebSocket server; multi-stage Docker build deployed on HuggingFace Spaces.",
    ],
    stack: ["Python", "Llama 3", "Reinforcement Learning", "Pydantic", "FastAPI", "WebSockets", "Docker"],
    skills: ["Reinforcement Learning", "LLMs", "Pydantic", "FastAPI", "WebSockets", "Llama 3", "Docker"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/open-env-nuclei" }],
    repo: "chetangadhiya5062/open-env-nuclei",
  },
  {
    slug: "aethermail",
    title: "AetherMail — Autonomous AI Email Agent",
    kicker: "Agents · RAG · Streaming data",
    summary:
      "A stateful LangGraph agent that reads, reasons over and acts on email, backed by a Kafka → Spark pipeline.",
    problem:
      "Inboxes are unstructured, high-volume and private. An email agent needs memory, tools and a data pipeline that scales, without leaking content.",
    approach: [
      "Stateful LangGraph workflow on Gemini 2.5 Flash with 6 tools.",
      "RAG with Ollama embeddings (768-dim) stored in Qdrant.",
      "Kafka → Spark → HDFS / PostgreSQL / Qdrant ingestion pipeline with encrypted storage.",
    ],
    stack: ["LangGraph", "Gemini", "Qdrant", "Ollama", "Kafka", "Spark", "PostgreSQL"],
    skills: ["AI Agents", "LangGraph", "Gemini", "RAG", "Vector DBs (Qdrant)", "Kafka", "Spark", "PostgreSQL"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/autonomous_mail" }],
    repo: "chetangadhiya5062/autonomous_mail",
  },
  {
    slug: "neuroflow-ai",
    title: "NeuroFlow AI — AI Operating Platform",
    kicker: "Platform engineering · HNNOIX",
    summary:
      "A domain-agnostic AI Operating Platform for autonomous agents, RAG, workflows and knowledge systems.",
    problem:
      "Teams re-build the same LLM plumbing for every AI product. A platform needs swappable providers, clear boundaries and observability from day one.",
    approach: [
      "Modular monolith in six layers following Clean Architecture and SOLID: core ports → infrastructure adapters → plugins → platform runtime → application services → API.",
      "Runtime layer includes LLM Gateway, RAG Runtime, AI Memory Layer, Knowledge Base, Knowledge Graph, Agent Runtime, Workflow Engine and Prompt Runtime.",
      "Interface-first: port contracts are defined before adapters; dependencies are constructor-injected.",
    ],
    stack: ["Python", "FastAPI", "Clean Architecture", "Docker", "CI"],
    skills: ["LLMs", "RAG", "AI Agents", "FastAPI", "Docker"],
    proof: [{ label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/NeuroFlow-AI" }],
    repo: "chetangadhiya5062/NeuroFlow-AI",
  },
  {
    slug: "truth-ai",
    title: "Truth AI — Fact-Verification System",
    kicker: "Multi-agent · GenAI Exchange Hackathon",
    summary:
      "CrewAI multi-agent fact-checking with web research, structured verdicts and citations (team 'AI Gyani').",
    problem:
      "Misinformation spreads faster than manual fact-checking. Verdicts need sources and a confidence the reader can judge.",
    approach: [
      "Agents split the job: claim extraction, web research (SerperDev), verdict synthesis.",
      "Pydantic-validated structured output with confidence scoring and citations.",
      "Conditional processing cut inference overhead by 15%.",
    ],
    stack: ["CrewAI", "Gemini", "SerperDev", "Pydantic", "FastAPI"],
    skills: ["Multi-Agent Systems", "CrewAI", "Gemini", "Pydantic", "FastAPI", "Prompt Engineering"],
    proof: [
      { label: "Source on GitHub", href: "https://github.com/chetangadhiya5062/misinformation_ai" },
      { label: "Hackathon build", href: "https://github.com/chetangadhiya5062/GenAI_Truth-AI" },
    ],
    repo: "chetangadhiya5062/misinformation_ai",
  },
];
