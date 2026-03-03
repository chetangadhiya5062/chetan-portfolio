"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 relative">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center">

        {/* LEFT SIDE */}
        <div className="text-center md:text-left">

          {/* BIG NAME */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
            Chetan Gadhiya
          </h1>

          {/* STRONG 3-POINT IDENTITY */}
          <p className="text-green-400 text-lg md:text-xl mb-6">
            AI & Machine Learning • NLP Enthusiast • Software Engineer
          </p>

          {/* MAIN QUOTE */}
          <div className="border-l-4 border-green-400 pl-4 mb-10 max-w-xl mx-auto md:mx-0">
            <p className="text-gray-400 italic text-lg">
              “Designing intelligent systems that scale seamlessly
              and transform complex ideas into real-world solutions.”
            </p>
          </div>

        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center md:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />

            <img
              src="/profile.jpg"
              alt="Chetan Gadhiya"
              className="relative w-80 h-80 md:w-96 md:h-96 object-cover rounded-full border-4 border-gray-800 shadow-xl"
            />
          </motion.div>
        </div>

      </div>

      {/* SCROLL DOWN INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-bounce">
        ↓ Scroll to explore
      </div>
    </section>
  );
}