export const profile = {
  name: "Chetan Gadhiya",
  headline: "AI Engineer",
  tagline: "GenAI & Agentic Systems · LLMs · RAG · Multi-Agent",
  location: "Gandhinagar, Gujarat, India",
  status:
    "Final-year B.Tech CSE at Pandit Deendayal Energy University · CGPA 8.71/10",
  openTo: "AI Engineer / ML Engineer / GenAI Engineer roles",
  email: "chetan.certi.001@gmail.com",
  languages: [
    "Gujarati (native)",
    "Hindi (full professional)",
    "English (professional working)",
  ],
  about: [
    "I engineer AI systems designed to run in production, not just perform well in a demo.",
    "At HNNOIX's NeuroFlow AI — a production-grade AI Operating Platform supporting autonomous agents, RAG and knowledge graphs at enterprise scale — I built core infrastructure: a provider-agnostic LLM Gateway, RAG Runtime, AI Memory Layer and modular agent-execution runtimes, following Clean Architecture and SOLID with structured observability, automated testing and containerized deployment.",
    "Before that, as a freelance GenAI engineer, I built two AI systems for automated fact verification and knowledge-grounded QA. On the side I build things I'm curious about — an RL agent that teaches itself to clean data, and an autonomous email agent on a Kafka/Spark pipeline.",
    "I'm looking for roles where I can keep building systems that hold up outside a notebook.",
  ],
  links: {
    github: "https://github.com/chetangadhiya5062",
    linkedin: "https://www.linkedin.com/in/chetan-gadhiya-4923a6284",
    leetcode: "https://leetcode.com/u/chetangadhiya4939/",
    medium: "https://medium.com/@ChetanGadhiy017",
    x: "https://x.com/chetan_gadhiya7",
  },
  handles: {
    github: "chetangadhiya5062",
    leetcode: "chetangadhiya4939",
    medium: "@ChetanGadhiy017",
  },
  /** Static numbers for the "Embedding" section. Live ones (LeetCode) are merged in at runtime. */
  stats: [
    { value: 8.71, decimals: 2, label: "CGPA / 10", note: "B.Tech CSE, PDEU" },
    { value: 15, suffix: "%", label: "inference overhead cut", note: "multi-agent fact verification" },
    { value: 160, suffix: "+", label: "papers handled", note: "IEEE AIMV 2025, 35-member team" },
    { value: 1200, suffix: "+", label: "teams outranked", note: "Code4Cause 2.0, NSUT" },
  ],
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chetangadhiya.vercel.app";
