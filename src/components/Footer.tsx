"use client";

import { FaLinkedin, FaGithub, FaMedium } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-24 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Left Side */}
        <div className="text-gray-400 text-sm text-center md:text-left">
          <p>© {new Date().getFullYear()} Chetan Gadhiya. All Rights Reserved.</p>
          <p className="text-gray-500 mt-1">
            Designed & Built By Chetan Gadhiya
          </p>
        </div>

        {/* Right Side Social Icons */}
        <div className="flex gap-6 text-gray-400 text-lg">
          <a
            href="hhttps://www.linkedin.com/in/chetan-gadhiya-4923a6284"
            target="_blank"
            className="hover:text-green-400 transition"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://github.com/chetangadhiya5062"
            target="_blank"
            className="hover:text-green-400 transition"
          >
            <FaGithub />
          </a>

          <a
            href="https://medium.com/@ChetanGadhiy017"
            target="_blank"
            className="hover:text-green-400 transition"
          >
            <FaMedium />
          </a>
        </div>

      </div>
    </footer>
  );
}