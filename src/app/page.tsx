import { Suspense } from "react";
import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Ask from "@/components/sections/Ask";
import SystemDesign from "@/components/sections/SystemDesign";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import ActivitySection from "@/components/sections/Activity";
import Writing from "@/components/sections/Writing";
import Evaluation from "@/components/sections/Evaluation";
import Contact from "@/components/sections/Contact";
import SimilarityStream from "@/components/ui/SimilarityStream";
import PipelineBand from "@/components/ui/PipelineBand";
import Footer from "@/components/sections/Footer";
import ChatGate from "@/components/ui/ChatGate";
import { getSource } from "@/lib/sources";
import { getResume, getSiteStatus, getSitePosts, getSocialPosts } from "@/lib/site-data";
import { buildActivity } from "@/lib/activity";

// ISR: fresh at least every 6h; the cron and /admin saves also revalidate on demand.
export const revalidate = 21600;

export default async function Home() {
  const [github, leetcode, medium, posts, sitePosts, status, resume] = await Promise.all([
    getSource("github"),
    getSource("leetcode"),
    getSource("medium"),
    getSocialPosts(),
    getSitePosts(),
    getSiteStatus(),
    getResume(),
  ]);
  const activity = buildActivity(github, leetcode, medium, posts);
  const syncedAt = [github?.fetchedAt, leetcode?.fetchedAt, medium?.fetchedAt].filter(Boolean).sort().pop();

  return (
    <>
      <Nav />
      <main id="main">
        {/* Each Suspense boundary hydrates as its own small task instead of one long one (lower TBT) */}
        <Hero github={github} leetcode={leetcode} status={status} />
        <Suspense><About leetcode={leetcode} /></Suspense>
        <Suspense><Ask /></Suspense>
        <Suspense><Experience /></Suspense>
        <SimilarityStream />
        <Suspense><Projects github={github} /></Suspense>
        <Suspense><SystemDesign /></Suspense>
        <PipelineBand />
        <Suspense><ActivitySection activity={activity} github={github} leetcode={leetcode} /></Suspense>
        <Suspense><Writing medium={medium} posts={posts} sitePosts={sitePosts} /></Suspense>
        <Suspense><Evaluation /></Suspense>
        <Suspense><Contact /></Suspense>
      </main>
      <Footer resume={resume} syncedAt={syncedAt} />
      <ChatGate />
    </>
  );
}
