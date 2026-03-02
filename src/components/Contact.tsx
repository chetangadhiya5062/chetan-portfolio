"use client";

export default function Contact() {
  return (
    <section className="mt-24 mb-20 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">
        📬 Get In Touch
      </h2>

      <p className="text-gray-400 mb-8">
        Open to collaborations, internships, research opportunities,
        and impactful software projects.
      </p>

      <div className="flex justify-center gap-8 flex-wrap text-gray-400">

        <a
          href="mailto:yourmail@gmail.com"
          className="hover:text-green-400 transition"
        >
          Email
        </a>

        <a
          href="https://linkedin.com/in/yourprofile"
          target="_blank"
          className="hover:text-green-400 transition"
        >
          LinkedIn
        </a>

        <a
          href="https://medium.com/@yourprofile"
          target="_blank"
          className="hover:text-green-400 transition"
        >
          Medium
        </a>

        <a
          href="https://github.com/chetangadhiya5062"
          target="_blank"
          className="hover:text-green-400 transition"
        >
          GitHub
        </a>

      </div>
    </section>
  );
}