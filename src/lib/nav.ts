export const sections = [
  { id: "top", n: "01", label: "Decode", name: "Home" },
  { id: "about", n: "02", label: "Embed", name: "About & concept map" },
  { id: "ask", n: "03", label: "Retrieve", name: "Ask my work" },
  { id: "experience", n: "04", label: "Reason", name: "Experience" },
  { id: "projects", n: "05", label: "Act", name: "Projects" },
  { id: "system", n: "06", label: "Serve", name: "Platform design" },
  { id: "activity", n: "07", label: "Monitor", name: "Live activity" },
  { id: "writing", n: "08", label: "Output", name: "Writing & posts" },
  { id: "evaluation", n: "09", label: "Eval", name: "Achievements & certifications" },
  { id: "contact", n: "10", label: "Deploy", name: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
