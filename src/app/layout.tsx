import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profile, SITE_URL } from "@/content/profile";
import Providers from "@/components/ui/Providers";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const description = `${profile.name} — ${profile.headline}. ${profile.tagline}. Production-grade GenAI and agentic systems, with live proof: code, certificates and activity.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.name} — ${profile.headline}`, template: `%s · ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  keywords: [
    "AI Engineer", "Generative AI", "LLM", "RAG", "Multi-Agent Systems", "LangGraph", "CrewAI",
    "Machine Learning Engineer", "Chetan Gadhiya",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `${profile.name} Portfolio`,
    title: `${profile.name} — ${profile.headline}`,
    description,
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — ${profile.headline}`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07080b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/profile-v2.png`,
  jobTitle: profile.headline,
  description: profile.tagline,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Gandhinagar", addressRegion: "Gujarat", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Pandit Deendayal Energy University" },
  knowsAbout: ["Generative AI", "Large Language Models", "Retrieval-Augmented Generation", "Multi-Agent Systems", "Reinforcement Learning"],
  knowsLanguage: ["gu", "hi", "en"],
  sameAs: Object.values(profile.links),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${space.variable} ${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* flag JS early so no-JS visitors still see every [data-reveal] element */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
