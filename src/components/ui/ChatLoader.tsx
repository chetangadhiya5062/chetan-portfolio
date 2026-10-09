"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

/** The chat bundle is fetched only after the page is idle, never during load. */
export default function ChatLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(go, { timeout: 6000 }) : window.setTimeout(go, 4000);
    return () => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, []);
  return ready ? <ChatWidget /> : null;
}
