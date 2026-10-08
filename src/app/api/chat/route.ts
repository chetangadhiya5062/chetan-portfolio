import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/chat-context";
import { hit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function clean(input: unknown): Msg[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 8) return null;
  const out: Msg[] = [];
  for (const m of input) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, 600);
    if (!content) return null;
    out.push({ role: m.role, content });
  }
  return out[out.length - 1].role === "user" ? out : null;
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "Chat is not enabled." }, { status: 404 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const gate = hit(`chat:${ip}`, 12, 60_000);
  if (!gate.ok) {
    return NextResponse.json({ error: "Too many questions. Try again in a minute." }, { status: 429, headers: { "Retry-After": String(gate.retryInSec) } });
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const messages = clean(body.messages);
  if (!messages) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } },
      }),
      signal: AbortSignal.timeout(25_000),
    },
  ).catch(() => null);

  if (!upstream || !upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "The assistant is unavailable right now. Please email me instead." }, { status: 502 });
  }

  // Re-stream Gemini's SSE as plain text chunks.
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buf += dec.decode(chunk, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const ev of events) {
          const data = ev.split("\n").find((l) => l.startsWith("data:"))?.slice(5).trim();
          if (!data) continue;
          try {
            const parts = JSON.parse(data)?.candidates?.[0]?.content?.parts as { text?: string }[] | undefined;
            const text = parts?.map((p) => p.text ?? "").join("");
            if (text) controller.enqueue(enc.encode(text));
          } catch {
            /* ignore malformed event */
          }
        }
      },
    }),
  );

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
