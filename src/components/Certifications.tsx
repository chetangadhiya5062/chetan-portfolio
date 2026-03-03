export default function Certifications() {
  const certifications = [
    {
      title: "AI-ML for Geodata Analysis — ISRO",
      file: "/certificates/isro-ai-ml.pdf",
      description:
        "Specialized training in AI & ML applications for geospatial data analysis under ISRO-IIRS.",
    },
    {
      title: "Deep Learning — NPTEL IIT Ropar",
      file: "/certificates/nptel-deep-learning.pdf",
      description:
        "Completed Deep Learning certification from NPTEL IIT Ropar with a consolidated score of 73%.",
    },
  ];

  return (
    <section className="py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
        Certifications
      </h2>

      <div className="max-w-5xl mx-auto px-6 space-y-12">
        {certifications.map((cert, index) => (
          <div key={index}>
            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-6">
              {cert.title}
            </h3>

            {/* Code Block Style Card */}
            <div className="bg-[#0d1117] rounded-2xl border border-gray-800 p-6 hover:border-green-500 transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm font-mono">
                  {"</> Code"}
                </span>

                {/* Copy icon style placeholder */}
                <span className="text-gray-500 text-sm">
                  ⧉
                </span>
              </div>

              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-green-400 hover:underline break-all"
              >
                {cert.file}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}