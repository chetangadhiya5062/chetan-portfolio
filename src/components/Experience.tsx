export default function Experience() {
  return (
    <section className="py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
        Experience
      </h2>

      <div className="bg-[#161b22] p-10 rounded-2xl border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-3">
          Python Developer Intern — Cognifyz Technologies
        </h3>

        <p className="text-gray-400 mb-4">December 2024</p>

        <ul className="text-gray-500 space-y-2 list-disc list-inside">
          <li>Built automation and data-processing scripts</li>
          <li>Developed validation systems and utilities</li>
          <li>Implemented word-frequency and scraping tools</li>
        </ul>

        <a
          href="https://github.com/chetangadhiya5062/Cognifyz_Internship"
          target="_blank"
          className="inline-block mt-6 text-green-400 hover:underline"
        >
          View Internship Work →
        </a>
      </div>
    </section>
  );
}