"use client";

const projects = [
  {
    title: "AI Truth Detection System",
    subtitle: "Detects fake news using NLP models",
    description:
      "A machine learning system that analyzes news articles using TF-IDF and classification models to determine credibility.",
    tech: ["Python", "Machine Learning", "NLP", "Flask"],
    impact:
      "Helps prevent misinformation spread in digital platforms.",
    github:
      "https://github.com/chetangadhiya5062/GenAI_Truth-AI",
  },
  {
    title: "Microplastic Detection & Data Management System",
    subtitle:
      "AI-based system for microplastic detection and structured environmental data management.",
    description:
      "Designed to detect microplastics and manage structured environmental datasets efficiently.",
    tech: ["Python", "Computer Vision", "Data Management"],
    impact:
      "Supports environmental monitoring and sustainability research.",
    github:
      "https://github.com/ChetanGadhiya017/Microplastic-Detection_Data-Management-System",
  },
  {
    title: "Smart Inbox & Behavioral Analytics System",
    subtitle:
      "Email prioritization using intelligent behavioral analysis.",
    description:
      "Analyzes email behavior patterns to automatically prioritize and classify messages.",
    tech: ["AI", "Analytics", "Backend", "Automation"],
    impact:
      "Improves productivity by intelligent inbox management.",
    github:
      "https://github.com/ChetanGadhiya017/Smart-Inbox_And_Behavioral-Analytics-System",
  },
  {
    title: "Cognifyz Internship Work",
    subtitle:
      "Industry internship showcasing backend and data-driven solutions.",
    description:
      "Worked on scalable backend solutions and automation workflows during internship.",
    tech: ["Backend", "Automation", "APIs"],
    impact:
      "Real-world production-level development experience.",
    github:
      "https://github.com/chetangadhiya5062/Cognifyz_Internship",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="mt-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
        Selected Work
      </h2>

      {/* 🔥 GRID: 2 cards per row */}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-[#161b22] p-6 rounded-2xl border border-gray-800 hover:border-green-500 transition-all"
          >
            <h3 className="text-xl font-bold text-green-400 mb-2">
              {project.title}
            </h3>

            <p className="text-gray-400 text-sm mb-3">
              {project.subtitle}
            </p>

            <p className="text-gray-300 text-sm mb-4">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-[#0e1621] text-gray-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Impact */}
            <p className="text-yellow-400 text-sm mb-4">
              {project.impact}
            </p>

            <a
              href={project.github}
              target="_blank"
              className="text-green-400 hover:text-green-300 transition text-sm font-medium"
            >
              View Code →
            </a>
          </div>
        ))}
      </div>

      {/* Bottom GitHub Link */}
      <div className="mt-12 text-center">
        <a
          href="https://github.com/chetangadhiya5062"
          target="_blank"
          className="text-gray-400 hover:text-green-400 transition"
        >
          View All Projects on GitHub →
        </a>
      </div>
    </section>
  );
}