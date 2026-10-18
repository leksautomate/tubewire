// Thin server-side client over the Anthropic Messages API. Server-only —
// reads ANTHROPIC_API_KEY via the settings store (admin-configured) with
// an env var fallback for local dev.

import { getSetting } from "@/lib/settings";

const MODEL = "claude-sonnet-5-5";

export async function askClaude(prompt: string): Promise<string> {
  const apiKey = await getSetting("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it in /admin, or in .env.local for local dev."
    );
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content.find((block) => block.type === "text")?.text ?? "";
}
