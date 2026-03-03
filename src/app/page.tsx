import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import FeaturedProjects from "@/components/FeaturedProjects";
import TechnicalSkills from "@/components/TechnicalSkills";
import Achievements from "@/components/Achievements";
import Certifications from "@/components/Certifications";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import RecentActivity from "@/components/RecentActivity";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">

        <section id="hero">
          <Hero />
        </section>

        <section id="experience">
          <Experience />
        </section>

        <section id="projects">
          <FeaturedProjects />
        </section>

        <section id="skills">
          <TechnicalSkills />
        </section>

        <section id="achievements">
          <Achievements />
        </section>

        <section id="certifications">
          <Certifications />
        </section>

        <section id="activity">
          <ActivityHeatmap />
          <RecentActivity />
        </section>

        <section id="contact">
          <Contact />
        </section>

      </div>

      <Footer />
    </main>
  );
}