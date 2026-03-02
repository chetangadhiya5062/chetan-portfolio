"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string;
  tech_stack: string[];
  real_world_use: string;
  github_url: string;
  live_url?: string;
};

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects/featured")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-bold text-white mb-10">
        🏆 Featured Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#161b22] p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-all"
          >
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              {project.title}
            </h3>

            <p className="text-gray-400 mb-4">
              {project.short_description}
            </p>

            <p className="text-sm text-gray-500 mb-4">
              {project.detailed_description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1 text-xs bg-gray-800 rounded-md text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-sm text-yellow-400 mb-4">
              💡 {project.real_world_use}
            </p>

            <div className="flex gap-4">
              <a
                href={project.github_url}
                target="_blank"
                className="text-sm text-green-400 hover:underline"
              >
                View Code →
              </a>

              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://github.com/chetangadhiya5062"
          target="_blank"
          className="text-gray-400 hover:text-green-400 transition-all"
        >
          View All Projects on GitHub →
        </a>
      </div>
    </section>
  );
}