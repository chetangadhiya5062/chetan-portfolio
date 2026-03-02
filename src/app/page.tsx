import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import RecentActivity from "@/components/RecentActivity";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section id="hero">
        <Hero />
      </section>

      <section id="genome">
        <ActivityHeatmap />
      </section>

      <section>
        <RecentActivity />
      </section>

      <section id="projects">
        <FeaturedProjects />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}