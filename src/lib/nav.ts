export const sections = [
  { id: "top", n: "01", label: "Input", name: "Home" },
  { id: "about", n: "02", label: "Embedding", name: "About" },
  { id: "experience", n: "03", label: "Hidden layers", name: "Experience" },
  { id: "projects", n: "04", label: "Attention", name: "Projects" },
  { id: "activity", n: "05", label: "Training loop", name: "Live activity" },
  { id: "writing", n: "06", label: "Output logits", name: "Writing & posts" },
  { id: "evaluation", n: "07", label: "Evaluation", name: "Achievements & certifications" },
  { id: "contact", n: "08", label: "Inference", name: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
