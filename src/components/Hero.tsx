"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold text-white"
      >
        Chetan Gadhiya
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-6 text-xl text-gray-400"
      >
        B.Tech – Computer Science Engineering <br />
        CGPA: 8.1 / 10
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-6 mt-10"
      >
        <a
          href="https://github.com/ChetanGadhiya017"
          target="_blank"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d]"
        >
          <Github />
        </a>

        <a
          href="https://www.linkedin.com/in/chetan-gadhiya-4923a6284/"
          target="_blank"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d]"
        >
          <Linkedin />
        </a>

        <a
          href="/resume.pdf"
          className="p-3 bg-[#161b22] rounded-xl hover:bg-[#21262d]"
        >
          <FileText />
        </a>
      </motion.div>
    </section>
  );
}