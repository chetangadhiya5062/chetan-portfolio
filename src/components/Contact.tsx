"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, BookOpen } from "lucide-react";

export default function Contact() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-28 mb-28 flex justify-center px-4"
    >
      <div className="w-full max-w-3xl bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-2xl p-10 text-center shadow-lg relative overflow-hidden">

        {/* Subtle Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-blue-500/10 pointer-events-none" />

        <h2 className="text-4xl font-bold text-white mb-4 relative z-10">
           Let’s Build Something Great 
        </h2>

        <p className="text-gray-400 mb-10 relative z-10">
          Open to collaborations, internships, research opportunities,
          and impactful software projects.
        </p>

        <div className="flex justify-center gap-6 flex-wrap relative z-10">

          <ContactButton
            href="https://github.com/chetangadhiya5062"
            icon={<Github size={18} />}
            label="GitHub"
          />


          <ContactButton
            href="https://www.linkedin.com/in/chetan-gadhiya-4923a6284"
            icon={<Linkedin size={18} />}
            label="LinkedIn"
          />

          <ContactButton
            href="chetan.certi.001@gmail.com"
            icon={<Mail size={18} />}
            label="Email"
          />
          
          <ContactButton
            href="https://medium.com/@ChetanGadhiy017"
            icon={<BookOpen size={18} />}
            label="Medium"
          />


        </div>
      </div>
    </motion.section>
  );
}

function ContactButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-green-500 transition-all duration-300"
    >
      {icon}
      {label}
    </motion.a>
  );
}