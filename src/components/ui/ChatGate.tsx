import ChatLoader from "./ChatLoader";

/** Renders nothing unless GEMINI_API_KEY is configured, so the feature can never break a build or a deploy. */
export default function ChatGate() {
  if (!process.env.GEMINI_API_KEY) return null;
  return <ChatLoader />;
}
