export default function TechnicalSkills() {
  return (
    <section className="py-24">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
        Technical Skills
      </h2>

      <div className="grid md:grid-cols-2 gap-10">

        <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Languages</h3>
          <p className="text-gray-400">Python, JavaScript, SQL</p>
        </div>

        <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Backend</h3>
          <p className="text-gray-400">Node.js, Express, Flask, FastAPI</p>
        </div>

        <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Frontend</h3>
          <p className="text-gray-400">React.js, HTML, CSS</p>
        </div>

        <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Cloud & Tools</h3>
          <p className="text-gray-400">AWS, Git, JWT, OAuth 2.0</p>
        </div>

        <div className="bg-[#161b22] p-8 rounded-2xl border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Problem Solving</h3>
          <p className="text-gray-400">
            Data Structures & Algorithms, LeetCode Practice,
            Competitive Problem Solving, Interview Preparation
          </p>
        </div>

      </div>
    </section>
  );
}