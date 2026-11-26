/**
 * Self-assessed skill growth through the degree (0-100). Edit freely: the chart on the site reads only this file.
 * The B.Tech runs Jul 2023 to May 2027: 2023 is the first year, 2027 the final year (concluding May 2027).
 * Values for 2027 are a target, not a measurement.
 */
export const journeyYears = [2023, 2024, 2025, 2026, 2027] as const;

export const journeySeries: { id: string; label: string; color: string; values: number[] }[] = [
  { id: "cs", label: "Core CS and DSA", color: "#9b9486", values: [45, 65, 78, 85, 88] },
  { id: "ml", label: "ML and deep learning", color: "#e58fc0", values: [25, 50, 68, 78, 82] },
  { id: "genai", label: "GenAI, RAG, embeddings", color: "#5fd0b8", values: [5, 35, 72, 90, 92] },
  { id: "agents", label: "Agents and AI platforms", color: "#f2b05e", values: [0, 20, 62, 92, 94] },
];

export const journeyMilestones: Record<number, string> = {
  2023: "Started B.Tech CSE at PDEU (first year): core CS, DSA, first ML courses",
  2024: "Smart India Hackathon, HACKOUT'24, Encode PDEU, deep learning, first RAG builds",
  2025: "Agents in production work, IEEE AIMV lead volunteer, SIH 2025, Cognifyz",
  2026: "NeuroFlow AI platform work; Freight Exception Copilot, VulnRefine and an ICCMSE paper",
  2027: "Final year, concluding May 2027 (2027 values are a target)",
};
