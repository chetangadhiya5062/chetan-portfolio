"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const sections = [
  { id: "hero", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "certifications", label: "Certifications" },
  { id: "activity", label: "Activity" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      // 🔥 If user is at bottom of page → activate last section
      if (scrollPosition + windowHeight >= fullHeight - 5) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      let currentSection = sections[0].id;

      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const sectionTop = element.offsetTop - 120;
          if (scrollPosition >= sectionTop) {
            currentSection = section.id;
          }
        }
      }

      setActive(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0e1621]/70 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.replaceState(null, "", "#hero");
          }}
          className="text-white font-bold text-lg cursor-pointer"
        >
          CG.
        </Link>

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