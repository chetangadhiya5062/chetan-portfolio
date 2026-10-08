export type Proof = { label: string; href: string };
export type Achievement = {
  id: string;
  title: string;
  event: string;
  result: string;
  proof: Proof[];
};

export const achievements: Achievement[] = [
  {
    id: "ieee-aimv",
    title: "IEEE AIMV 2025 — Lead Student Volunteer",
    event: "PDEU",
    result: "160+ papers, 35-member team; presented two papers on behalf of authors.",
    proof: [{ label: "Event photo", href: "/images/ieee-aimv-conference-event.jpg" }],
  },
  {
    id: "code4cause",
    title: "Code4Cause 2.0 Hackathon",
    event: "NSUT",
    result: "Selected among 1200+ teams nationwide.",
    proof: [{ label: "Certificate", href: "/certificates/code4cause-nsut-hackathon-certificate.pdf" }],
  },
  {
    id: "sih-2024",
    title: "Smart India Hackathon 2024",
    event: "Internal rounds",
    result: "Top 25 in internal rounds.",
    proof: [{ label: "Certificate", href: "/certificates/sih-2024-problem-solution.pdf" }],
  },
  {
    id: "sih-2025",
    title: "Smart India Hackathon 2025",
    event: "Internal rounds",
    result: "Top 25 again — consistent national-level performance.",
    proof: [{ label: "Certificate", href: "/certificates/sih-2025-problem-solution.pdf" }],
  },
  {
    id: "genai-exchange",
    title: "GenAI Exchange Hackathon",
    event: "Team AI Gyani",
    result: "Built Truth-AI, an AI-powered fact-verification system.",
    proof: [{ label: "Project", href: "https://github.com/chetangadhiya5062/GenAI_Truth-AI" }],
  },
  {
    id: "hackout",
    title: "HACKOUT'24",
    event: "DA-IICT",
    result: "Built a Classroom Management System during the hackathon.",
    proof: [
      { label: "Project", href: "https://github.com/chetangadhiya5062/Fork_Classroom-Management" },
      { label: "Event photo", href: "/images/hackout-2024-event-team.jpg" },
      { label: "Proof", href: "/achievements/hackout-classroom-management-proof.jpg" },
    ],
  },
  {
    id: "aincat",
    title: "Naukri Campus AINCAT",
    event: "National test",
    result: "All India Rank 27,712.",
    proof: [{ label: "Certificate", href: "/certificates/naukri-aincat-rank-certificate.pdf" }],
  },
  {
    id: "encode",
    title: "Encode Club (PDEU)",
    event: "AI-ML committee",
    result: "Active technical community involvement and collaborative innovation.",
    proof: [{ label: "Team photo", href: "/images/encode-club-ai-ml-team.jpg" }],
  },
  {
    id: "more-hacks",
    title: "SVNIT Hackathon 2024 · Tic Tech Toe 2024 · DevFest Gandhinagar'24",
    event: "Participation",
    result: "Hackathon and community-event participation.",
    proof: [],
  },
];

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  detail?: string;
  proof?: string;
};

export const certifications: Certification[] = [
  // TODO(owner): add proof PDF for Oracle OCI (see docs/DECISIONS.md)
  { id: "oci", title: "Oracle Cloud Infrastructure Certified Foundations Associate", issuer: "Oracle" },
  { id: "aws-genai", title: "AWS Generative AI Developer Learning Plan", issuer: "AWS" },
  { id: "nptel", title: "Deep Learning", issuer: "NPTEL · IIT Ropar", detail: "73%", proof: "/certificates/nptel-deep-learning.pdf" },
  { id: "isro", title: "AI/ML for Geodata Analysis", issuer: "ISRO-IIRS", proof: "/certificates/isro-ai-ml.pdf" },
];
