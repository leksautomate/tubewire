import { NextRequest, NextResponse } from "next/server";
import { searchVideos, getVideos, getChannels, YtVideo, YtChannel } from "@/lib/youtube";
import { parseIsoDuration } from "@/lib/iso-duration";

export type OutlierResult = {
  id: string;
  title: string;
  durationLabel: string;
  channelName: string;
  views: number;
  publishedAt: string;
  vph: number;
  outlierMultiplier: number;
  subscribers: number;
};

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing required query param: q" }, { status: 400 });
  }

  try {
    // One expensive search call (100 quota units), then cheap batch lookups.
    const videoIds = await searchVideos({ query, maxResults: 25, order: "viewCount" });
    const videos = await getVideos(videoIds);

    const channelIds = videos.map((v) => v.snippet.channelId);
    const channels = await getChannels(channelIds);
    const channelById = new Map<string, YtChannel>(channels.map((c) => [c.id, c]));

    const results: OutlierResult[] = videos
      .map((video: YtVideo) => {
        const channel = channelById.get(video.snippet.channelId);
        if (!channel) return null;

        const views = Number(video.statistics.viewCount ?? 0);
        const subscribers = Number(channel.statistics.subscriberCount ?? 0);
        const channelViews = Number(channel.statistics.viewCount ?? 0);
        const channelVideoCount = Number(channel.statistics.videoCount ?? 1);
        const channelAvgViews = channelViews / Math.max(channelVideoCount, 1);

        const hoursSincePublished = Math.max(
          (Date.now() - new Date(video.snippet.publishedAt).getTime()) / (1000 * 60 * 60),
          1
        );

        return {
          id: video.id,
          title: video.snippet.title,
          durationLabel: parseIsoDuration(video.contentDetails.duration).label,
          channelName: video.snippet.channelTitle,
          views,
          publishedAt: video.snippet.publishedAt,
          vph: Math.round(views / hoursSincePublished),
          outlierMultiplier: channelAvgViews > 0
            ? Math.round((views / channelAvgViews) * 100) / 100
            : 0,
          subscribers,
        };
      })
      .filter((r): r is OutlierResult => r !== null)
      .sort((a, b) => b.outlierMultiplier - a.outlierMultiplier);

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
