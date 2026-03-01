import { getAllRepos } from "@/lib/github";

export default async function Projects() {
  const repos = await getAllRepos();

  const featured = repos.filter((r) =>
    r.topics.includes("featured")
  );

  const production = repos.filter((r) =>
    r.topics.includes("production")
  );

  const ongoing = repos.filter((r) =>
    r.topics.includes("ongoing")
  );

  const learning = repos.filter((r) =>
    r.topics.includes("learning")
  );

  const experimental = repos.filter((r) =>
    r.topics.includes("experimental")
  );

  function RepoCard({ repo }: any) {
    return (
      <a
        href={repo.html_url}
        target="_blank"
        className="bg-[#161b22] p-6 rounded-xl hover:bg-[#21262d] transition"
      >
        <h4 className="text-lg font-semibold text-white">
          {repo.name}
        </h4>

        <p className="text-gray-400 mt-2 text-sm">
          {repo.description || "No description provided."}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {repo.topics.map((topic: string) => (
            <span
              key={topic}
              className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      </a>
    );
  }

  function Section({ title, data }: any) {
    if (!data.length) return null;

    return (
      <div className="mb-16">
        <h3 className="text-2xl text-blue-400 mb-6">
          {title}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {data.map((repo: any) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-white mb-12">
        Projects
      </h2>

      <Section title="⭐ Featured" data={featured} />
      <Section title="🚀 Production Systems" data={production} />
      <Section title="🔄 Ongoing Work" data={ongoing} />
      <Section title="📚 Learning Projects" data={learning} />
      <Section title="🧪 Experimental" data={experimental} />
    </section>
  );
}