/**
 * Self-assessed skill growth through the degree (0-100). Edit freely: the chart on the site reads only this file.
 * Years run from the start of the B.Tech to now.
 */
export const journeyYears = [2022, 2023, 2024, 2025, 2026] as const;

export const journeySeries: { id: string; label: string; color: string; values: number[] }[] = [
  { id: "cs", label: "Core CS and DSA", color: "#9b9486", values: [20, 45, 65, 78, 85] },
  { id: "ml", label: "ML and deep learning", color: "#e58fc0", values: [5, 25, 50, 68, 78] },
  { id: "genai", label: "GenAI, RAG, embeddings", color: "#5fd0b8", values: [0, 5, 35, 72, 90] },
  { id: "agents", label: "Agents and AI platforms", color: "#f2b05e", values: [0, 0, 20, 62, 92] },
];

export const journeyMilestones: Record<number, string> = {
  2022: "Started B.Tech CSE at PDEU",
  2023: "Core CS, DSA and first ML / deep learning courses",
  2024: "Smart India Hackathon, HACKOUT'24, Encode PDEU, first RAG builds",
  2025: "Agents in production work, IEEE AIMV lead volunteer, SIH 2025, Cognifyz",
  2026: "NeuroFlow AI: gateway, RAG runtime and agent platform design",
};
