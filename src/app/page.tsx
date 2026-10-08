import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import ActivitySection from "@/components/sections/Activity";
import Writing from "@/components/sections/Writing";
import Evaluation from "@/components/sections/Evaluation";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { getSource } from "@/lib/sources";
import { getResume, getSiteStatus, getSocialPosts } from "@/lib/site-data";
import { buildActivity } from "@/lib/activity";

// ISR: fresh at least every 6h; the cron and /admin saves also revalidate on demand.
export const revalidate = 21600;

export default async function Home() {
  const [github, leetcode, medium, posts, status, resume] = await Promise.all([
    getSource("github"),
    getSource("leetcode"),
    getSource("medium"),
    getSocialPosts(),
    getSiteStatus(),
    getResume(),
  ]);
  const activity = buildActivity(github, leetcode, medium, posts);
  const syncedAt = [github?.fetchedAt, leetcode?.fetchedAt, medium?.fetchedAt].filter(Boolean).sort().pop();

  return (
    <>
      <Nav />
      <main id="main">
        <Hero github={github} status={status} />
        <About leetcode={leetcode} />
        <Experience />
        <Projects github={github} />
        <ActivitySection activity={activity} github={github} leetcode={leetcode} />
        <Writing medium={medium} posts={posts} />
        <Evaluation />
        <Contact />
      </main>
      <Footer resume={resume} syncedAt={syncedAt} />
    </>
  );
}
