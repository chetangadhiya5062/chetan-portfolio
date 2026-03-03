export default function Achievements() {
  const achievements = [
    {
      title: "Code4Cause 2.0 Hackathon (NSUT)",
      description: "Selected among 1200+ teams nationwide.",
      links: [
        {
          label: "View Certificate →",
          href: "/certificates/code4cause-nsut.pdf",
        },
      ],
    },
    {
      title: "Smart India Hackathon 2024",
      description: "National-level innovation challenge participation.",
      links: [
        {
          label: "View Certificate →",
          href: "/certificates/sih-2024.pdf",
        },
      ],
    },
    {
      title: "Smart India Hackathon 2025",
      description: "Qualified again — consistent national-level performance.",
      links: [
        {
          label: "View Certificate →",
          href: "/certificates/sih-2025.pdf",
        },
      ],
    },
    {
      title: "Hackout 24 (GitHub Project)",
      description:
        "Classroom Management System developed during hackathon.",
      links: [
        {
          label: "View Project →",
          href: "https://github.com/chetangadhiya5062/Fork_Classroom-Management",
        },
      ],
    },
    {
      title: "GenAI Exchange Hackathon",
      description:
        "Built Truth-AI: AI-powered fact verification system.",
      links: [
        {
          label: "View Project →",
          href: "https://github.com/chetangadhiya5062/GenAI_Truth-AI",
        },
      ],
    },
    {
      title: "Naukri Campus AINCAT",
      description: "All India Rank 27,712.",
      links: [
        {
          label: "View Certificate →",
          href: "/certificates/aincat-rank.pdf",
        },
      ],
    },
    {
      title: "IEEE AIMV 2025 — Lead Student Volunteer",
      description:
        "Managed technical operations and coordination at IEEE AIMV 2025.",
      links: [
        {
          label: "View Certificate →",
          href: "/certificates/ieee-aimv-certificate.pdf",
        },
        {
          label: "View Event Photo →",
          href: "/images/ieee-aimv-photo.jpg",
        },
      ],
    },
    {
      title: "Encode Club Participation",
      description:
        "Active technical community involvement and collaborative innovation.",
      links: [
        {
          label: "View Event Photo →",
          href: "/images/encode-club.jpg",
        },
      ],
    },
  ];

  return (
    <section className="py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
        Achievements & Participations
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((item, index) => (
          <div
            key={index}
            className="bg-[#161b22] p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              {item.title}
            </h3>

            <p className="text-gray-400 mb-4">
              {item.description}
            </p>

            <div className="space-y-2">
              {item.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-400 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}