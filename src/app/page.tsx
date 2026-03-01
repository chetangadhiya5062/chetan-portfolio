import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ActivityHeatmap from "@/components/ActivityHeatmap";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <ActivityHeatmap />
    </main>
  );
}