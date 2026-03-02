"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "genome", label: "Activity" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          if (
            scrollPosition >= element.offsetTop &&
            scrollPosition <
              element.offsetTop + element.offsetHeight
          ) {
            setActive(section.id);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0e1621]/70 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <h2 className="text-white font-bold text-lg">
          CG.
        </h2>

        <div className="flex gap-8 text-sm">

          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`transition ${
                active === section.id
                  ? "text-green-400"
                  : "text-gray-400 hover:text-green-400"
              }`}
            >
              {section.label}
            </a>
          ))}

          <a
            href="/resume.pdf"
            target="_blank"
            className="text-green-400"
          >
            Resume
          </a>

        </div>
      </div>
    </nav>
  );
}