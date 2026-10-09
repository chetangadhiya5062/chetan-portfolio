"use client";

import { useState } from "react";

/** Click-to-load: the third-party iframe never loads unless the visitor asks for it (keeps the page fast and private). */
export default function LinkedInEmbed({ embedUrl, url }: { embedUrl: string; url: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <iframe
        src={embedUrl}
        title="LinkedIn post"
        loading="lazy"
        className="mt-4 h-[420px] w-full rounded-lg border border-line bg-white"
        allowFullScreen
      />
    );
  }
  return (
    <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider">
      <button onClick={() => setOn(true)} className="text-lime hover:underline">Load post</button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline">Open on LinkedIn ↗</a>
    </div>
  );
}
