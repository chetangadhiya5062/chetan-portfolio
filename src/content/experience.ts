export type Role = {
  id: string;
  title: string;
  org: string;
  place?: string;
  period: string;
  bullets: string[];
  skills: string[];
  repo?: string;
};

export const experience: Role[] = [
  {
    id: "hnnoix",
    title: "Research & Innovation Intern",
    org: "HNNOIX India Pvt. Ltd. (NeuroFlow AI)",
    place: "Gurugram",
    period: "May 2026 – Jul 2026",
    repo: "https://github.com/chetangadhiya5062/NeuroFlow-AI",
    bullets: [
      "Contributed to NeuroFlow AI, a production-grade AI Operating Platform for autonomous agents, RAG, knowledge graphs, workflow orchestration and enterprise AI apps.",
      "Engineered reusable AI infrastructure: provider-agnostic LLM Gateway, RAG Runtime, AI Memory Layer, Knowledge Base, and modular runtimes for agent execution, prompt orchestration and retrieval.",
      "Applied Clean Architecture, SOLID, interface-first design, structured observability, automated testing, CI and containerized deployment.",
    ],
    skills: ["LLMs", "RAG", "AI Agents", "FastAPI", "Docker", "Python"],
  },
  {
    id: "freelance",
    title: "Freelance Generative AI Engineer",
    org: "Independent",
    period: "Dec 2024 – Jun 2025",
    bullets: [
      "Built 2 AI systems (multi-agent + RAG) for automated fact verification and knowledge-grounded QA.",
      "CrewAI multi-agent pipeline (Gemini, SerperDev, Pydantic, FastAPI): claim extraction, web research, structured verdicts, confidence scoring, citations.",
      "Cut inference overhead 15% via conditional processing and workflow optimisation.",
      "RAG pipeline on AWS Bedrock: embedding retrieval, semantic search, prompt engineering.",
    ],
    skills: ["CrewAI", "Gemini", "Pydantic", "FastAPI", "AWS Bedrock", "RAG", "Multi-Agent Systems"],
  },
  {
    id: "encode",
    title: "AI-ML Committee Member",
    org: "Encode PDEU",
    period: "Sep 2024 – Apr 2026",
    bullets: ["AI/ML projects, workshops, hackathons and peer learning."],
    skills: ["Machine Learning", "Deep Learning"],
  },
  {
    id: "cognifyz",
    title: "Python Development Intern",
    org: "Cognifyz Technologies",
    period: "Dec 2024 – Jan 2025",
    repo: "https://github.com/chetangadhiya5062/Cognifyz_Internship",
    bullets: ["Automation, data-processing and validation utilities, and scraping tools."],
    skills: ["Python", "SQL", "Git/GitHub"],
  },
];
