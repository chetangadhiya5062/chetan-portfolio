import { profile } from "@/content/profile";
import type { ResumeInfo } from "@/lib/site-data";

export default function Footer({ resume, syncedAt }: { resume: ResumeInfo; syncedAt?: string }) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-10 font-mono text-xs text-muted sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {profile.name} · Built as a forward pass</p>
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <a href="/resume" target="_blank" rel="noopener" className="hover:text-lime">
            Resume{resume.uploadedAt ? ` · updated ${fmt(resume.uploadedAt)}` : ""}
          </a>
          {syncedAt && <span>Live data synced {fmt(syncedAt)}</span>}
        </p>
      </div>
    </footer>
  );
}
