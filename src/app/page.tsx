import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import RecentActivity from "@/components/RecentActivity";
import FeaturedProjects from "@/components/FeaturedProjects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Global Center Container */}
      <div className="max-w-6xl mx-auto px-6">

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

      </div>

      <Footer />
    </main>
  );
}