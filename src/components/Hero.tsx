"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold text-white"
      >
        Chetan Gadhiya
      </motion.h1>

      {/* NEW: Developer Identity Line */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-4 text-green-400 text-lg md:text-xl font-medium"
      >
        Software Developer • AI Enthusiast • Backend Architect
      </motion.p>

      {/* Refined Academic Info */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-4 text-gray-400 text-lg max-w-2xl"
      >
        B.Tech – Computer Science Engineering <br />
        CGPA: 8.1 / 10 <br />
        Focused on building intelligent systems, scalable backend architectures,
        and high-impact automation tools.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-6 mt-10"
      >
        <a
          href="https://github.com/ChetanGadhiya017"
          target="_blank"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-all"
        >
          <Github />
        </a>

        <a
          href="https://www.linkedin.com/in/chetan-gadhiya-4923a6284/"
          target="_blank"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-all"
        >
          <Linkedin />
        </a>

        <a
          href="/resume.pdf"
          target="_blank"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d] transition-all"
        >
          <FileText />
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-gray-500 text-sm animate-bounce"
      >
        ↓ Scroll to explore
      </motion.div>

    </section>
  );
}