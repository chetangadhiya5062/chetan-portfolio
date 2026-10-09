export type SkillGroup = { id: string; layer: string; label: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  { id: "aiml", layer: "L1", label: "AI / ML", skills: ["Machine Learning", "Deep Learning", "Reinforcement Learning", "NLP", "LLMs", "RAG"] },
  { id: "genai", layer: "L2", label: "GenAI & Agentic", skills: ["Multi-Agent Systems", "AI Agents", "CrewAI", "LangGraph", "Gemini", "Llama 3", "AWS Bedrock", "OpenRouter"] },
  { id: "eng", layer: "L3", label: "AI Engineering", skills: ["Prompt Engineering", "Pydantic", "FastAPI", "Vector DBs (Qdrant)", "REST", "WebSockets"] },
  { id: "data", layer: "L4", label: "Data & Distributed", skills: ["Kafka", "Spark", "PostgreSQL", "MongoDB", "MySQL"] },
  { id: "tools", layer: "L5", label: "Programming & Tools", skills: ["Python", "SQL", "Docker", "Git/GitHub"] },
  { id: "cs", layer: "L6", label: "Core CS", skills: ["DSA", "Problem solving"] },
];
