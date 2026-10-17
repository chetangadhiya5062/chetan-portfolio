// Single source of the section ledger: numbers (001, 002 …) + Forward Pass layer names.
// The command palette, the layer rail and every section heading read from here,
// so inserting a section renumbers the whole page in one place.
export const sections = [
  { id: "top", n: "001", label: "Input", name: "Home" },
  { id: "about", n: "002", label: "Embedding", name: "About" },
  { id: "experience", n: "003", label: "Hidden layers", name: "Experience" },
  { id: "projects", n: "004", label: "Attention", name: "Projects" },
  { id: "activity", n: "005", label: "Training loop", name: "Live activity" },
  { id: "writing", n: "006", label: "Output logits", name: "Writing & posts" },
  { id: "evaluation", n: "007", label: "Evaluation", name: "Achievements & certifications" },
  { id: "contact", n: "008", label: "Inference", name: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionOf = (id: SectionId) => sections.find((s) => s.id === id)!;
