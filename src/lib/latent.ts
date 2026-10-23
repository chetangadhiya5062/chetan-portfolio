import raw from "@/content/generated/latent.json";
import { concepts, clusters, type Concept } from "@/content/concepts";

export type LatentNode = { id: string; x: number; y: number; near: [string, number][] };

export const latentNodes = raw.nodes as LatentNode[];
export const latentModel = raw.model as string;
export const latentDim = raw.dim as number;

const nodeById = new Map(latentNodes.map((n) => [n.id, n]));
const conceptById = new Map(concepts.map((c) => [c.id, c]));

export const getConcept = (id: string): Concept | undefined => conceptById.get(id);
export const getNode = (id: string): LatentNode | undefined => nodeById.get(id);
export const clusterColor = (id: string): string => clusters[conceptById.get(id)?.cluster ?? "craft"].color;

/** Cosine similarity between two concepts when it is among the stored neighbours (top 8), else null. */
export function similarity(a: string, b: string): number | null {
  return nodeById.get(a)?.near.find(([id]) => id === b)?.[1] ?? null;
}

/** Neighbours above a similarity floor. */
export function related(id: string, min = 0.4, max = 6): [string, number][] {
  return (nodeById.get(id)?.near ?? []).filter(([, s]) => s >= min).slice(0, max);
}
