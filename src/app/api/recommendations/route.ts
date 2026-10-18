import { NextRequest, NextResponse } from "next/server";
import { fetchOutliers, OutlierResult } from "@/lib/outliers";
import { askClaude } from "@/lib/anthropic";

function buildPrompt(niche: string, outliers: OutlierResult[]): string {
  const rows = outliers
    .slice(0, 15)
    .map(
      (o) =>
        `- "${o.title}" by ${o.channelName} — ${o.subscribers.toLocaleString()} subs, ` +
        `${o.views.toLocaleString()} views, ${o.outlierMultiplier}x outlier, ` +
        `${o.durationLabel} long, published ${o.publishedAt.slice(0, 10)}`
    )
    .join("\n");

  return `You're a YouTube content strategist. A creator is researching the "${niche}" niche.
Here are the current top outlier videos in that niche (videos far outperforming their
channel's own average, which usually signals either a trending angle or a format that
works unusually well relative to channel size):

${rows}

Based on patterns across these specific videos (titles, formats, durations, how small the
channel is relative to the view count), give the creator:
1. 3-4 concrete content angles or formats worth trying, each grounded in a specific pattern
   you see above (cite which video(s) support it).
2. One risk or caveat to watch for in this niche right now.

Be concrete and specific to this data, not generic YouTube advice. Keep it under 300 words.`;
}

export async function POST(req: NextRequest) {
  const { niche } = (await req.json()) as { niche?: string };
  if (!niche?.trim()) {
    return NextResponse.json({ error: "Missing required field: niche" }, { status: 400 });
  }

  try {
    const outliers = await fetchOutliers(niche, {}, 25);
    if (outliers.length === 0) {
      return NextResponse.json(
        { error: `No results found for "${niche}" — try a broader term.` },
        { status: 404 }
      );
    }

    const recommendation = await askClaude(buildPrompt(niche, outliers));
    return NextResponse.json({ recommendation, basedOn: outliers.slice(0, 15) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
